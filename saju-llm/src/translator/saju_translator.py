"""
사주풀이 LLM 번역기
GPT-4o-mini를 활용한 사주 전문 번역 시스템
"""
import os
import time
from typing import Dict, List, Any, Optional
from dotenv import load_dotenv

try:
    import openai
    from openai import OpenAI
except ImportError:
    print("Warning: openai package not found. Please install: pip install openai")
    openai = None
    OpenAI = None

from ..utils.saju_terms import SajuTermDatabase
from ..utils.audio_recorder import AudioRecorder
from ..prompts.translation_prompts import TranslationPrompts

# 환경 변수 로드
load_dotenv()

class SajuTranslator:
    """사주풀이 전문 번역기"""

    def __init__(self,
                 model: str = None,
                 temperature: float = None,
                 max_tokens: int = None,
                 api_key: str = None,
                 enable_context: bool = True):
        """
        사주 번역기 초기화

        Args:
            model: OpenAI 모델명 (기본: gpt-4o-mini)
            temperature: 응답 일관성 제어 (기본: 0.3)
            max_tokens: 최대 토큰 수 (기본: 1500)
            api_key: OpenAI API 키
            enable_context: 세션 컨텍스트 관리 활성화 (기본: True)
        """
        # 설정 로드
        self.model = model or os.getenv('DEFAULT_MODEL', 'gpt-4o-mini')
        self.temperature = temperature or float(os.getenv('DEFAULT_TEMPERATURE', 0.3))
        self.max_tokens = max_tokens or int(os.getenv('DEFAULT_MAX_TOKENS', 1500))

        # API 키 설정
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key or self.api_key == "your_openai_api_key_here":
            raise ValueError("OpenAI API key is required. Please set OPENAI_API_KEY environment variable.")

        # OpenAI 클라이언트 초기화
        if not OpenAI:
            raise ImportError("openai package is required. Please install: pip install openai")

        self.client = OpenAI(api_key=self.api_key)

        # 사주 용어 데이터베이스 초기화
        self.term_db = SajuTermDatabase()

        # 프롬프트 관리자 초기화
        self.prompts = TranslationPrompts()

        # 음성 녹음기 초기화 (필요시)
        self.audio_recorder = None

        # 세션 관리 초기화
        self.enable_context = enable_context
        self.conversation_history = []
        self.max_history_length = 10
        self.max_context_tokens = 2000  # 컨텍스트에 사용할 최대 토큰 수

        print(f"SajuTranslator initialized with model: {self.model}, context: {self.enable_context}")

    def translate(self,
                  input_text: str,
                  target_language: str = "en",
                  context: str = "",
                  include_terms: bool = True,
                  use_session_context: bool = None) -> Dict[str, Any]:
        """
        사주풀이 텍스트 양방향 번역

        Args:
            input_text: 번역할 텍스트 (한국어 또는 외국어)
            target_language: 목표 언어 ("en", "zh", "ja", "es" 등)
            context: 추가 컨텍스트 정보
            include_terms: 용어 정보 포함 여부
            use_session_context: 세션 컨텍스트 사용 여부 (None이면 클래스 설정 따름)

        Returns:
            번역 결과 딕셔너리
        """
        start_time = time.time()

        try:
            # 세션 컨텍스트 사용 여부 결정
            should_use_context = use_session_context if use_session_context is not None else self.enable_context

            # 입력 언어 감지
            is_korean = self._detect_korean(input_text)

            # 번역 방향 결정
            if is_korean:
                # 한국어 → 목표 언어
                source_lang = "ko"
                actual_target = target_language
                korean_text = input_text
                print(f"🔄 Translation direction: Korean → {actual_target}")
            else:
                # 외국어 → 한국어
                source_lang = target_language
                actual_target = "ko"
                korean_text = ""  # 한국어가 아니므로 용어 추출 불가
                print(f"🔄 Translation direction: {source_lang} → Korean")

            # 세션 컨텍스트 준비
            session_context = ""
            if should_use_context and self.conversation_history:
                session_context = self._build_session_context(actual_target)

            # 사주 용어 추출 (한국어인 경우만)
            extracted_terms = []
            relevant_terms = {}
            if is_korean and include_terms:
                extracted_terms = self.term_db.extract_terms_from_text(input_text)
                for term in extracted_terms:
                    term_info = self.term_db.get_term(term)
                    if term_info:
                        relevant_terms[term] = term_info

            # 시스템 프롬프트 생성
            system_prompt = self.prompts.get_system_prompt(actual_target, is_korean)

            # 전체 컨텍스트 결합
            combined_context = ""
            if session_context:
                combined_context += f"이전 대화:\n{session_context}\n\n"
            if context:
                combined_context += f"추가 정보:\n{context}"

            # 사용자 프롬프트 생성
            user_prompt = self.prompts.create_translation_prompt(
                input_text=input_text,
                source_language=source_lang,
                target_language=actual_target,
                saju_terms=relevant_terms,
                context=combined_context.strip()
            )

            # OpenAI API 호출
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=self.max_tokens,
                temperature=self.temperature
            )

            # 번역 결과 추출
            translation = response.choices[0].message.content.strip()

            # 세션 히스토리에 대화 추가
            if should_use_context:
                self._add_to_history(input_text, translation, source_lang, actual_target)

            # 결과 반환
            result = {
                "success": True,
                "original_text": input_text,
                "translated_text": translation,
                "source_language": source_lang,
                "target_language": actual_target,
                "is_korean_input": is_korean,
                "extracted_terms": extracted_terms,
                "relevant_terms": relevant_terms,
                "processing_time": time.time() - start_time,
                "model_used": self.model,
                "session_context_used": should_use_context,
                "conversation_turn": len(self.conversation_history) if should_use_context else 0,
                "token_usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                }
            }

            return result

        except Exception as e:
            error_msg = f"Translation failed: {str(e)}"
            print(f"⚠️  {error_msg}")
            return {
                "success": False,
                "error": error_msg,
                "original_text": input_text,
                "target_language": target_language,
                "processing_time": time.time() - start_time
            }

    def translate_batch(self,
                       korean_texts: List[str],
                       target_language: str = "en",
                       include_terms: bool = True) -> Dict[str, Any]:
        """
        다중 텍스트 배치 번역

        Args:
            korean_texts: 번역할 한국어 텍스트 목록
            target_language: 목표 언어 ("en", "zh", "ja", "es" 등)
            include_terms: 용어 정보 포함 여부

        Returns:
            배치 번역 결과 딕셔너리
        """
        start_time = time.time()

        try:
            # 모든 텍스트에서 사주 용어 추출
            all_extracted_terms = []
            for text in korean_texts:
                terms = self.term_db.extract_terms_from_text(text)
                all_extracted_terms.extend(terms)

            # 중복 제거 및 용어 정보 수집
            unique_terms = list(set(all_extracted_terms))
            relevant_terms = {}
            if include_terms:
                for term in unique_terms:
                    term_info = self.term_db.get_term(term)
                    if term_info:
                        relevant_terms[term] = term_info

            # 시스템 프롬프트 생성
            system_prompt = self.prompts.get_system_prompt(target_language)

            # 배치 번역 프롬프트 생성
            user_prompt = self.prompts.create_batch_translation_prompt(
                korean_texts=korean_texts,
                target_language=target_language,
                saju_terms=relevant_terms
            )

            # OpenAI API 호출
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=self.max_tokens,
                temperature=self.temperature
            )

            # 번역 결과 추출 및 파싱
            translation_text = response.choices[0].message.content.strip()
            translations = self._parse_batch_translations(translation_text, len(korean_texts))

            # 결과 반환
            result = {
                "success": True,
                "original_texts": korean_texts,
                "translations": translations,
                "target_language": target_language,
                "extracted_terms": unique_terms,
                "relevant_terms": relevant_terms,
                "processing_time": time.time() - start_time,
                "model_used": self.model,
                "token_usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                }
            }

            return result

        except Exception as e:
            error_msg = f"Batch translation failed: {str(e)}"
            print(f"⚠️  {error_msg}")
            return {
                "success": False,
                "error": error_msg,
                "original_texts": korean_texts,
                "target_language": target_language,
                "processing_time": time.time() - start_time
            }

    def _parse_batch_translations(self, translation_text: str, expected_count: int) -> List[str]:
        """배치 번역 결과 파싱"""
        lines = translation_text.split('\n')
        translations = []

        for line in lines:
            line = line.strip()
            # 번호가 있는 라인 찾기 (1., 2., 등)
            if line and (line[0].isdigit() or line.startswith(('1.', '2.', '3.', '4.', '5.'))):
                # 번호 부분 제거
                if '.' in line:
                    translation = line.split('.', 1)[1].strip()
                    if translation:
                        translations.append(translation)

        # 기대하는 개수와 다르면 전체 텍스트를 하나의 번역으로 처리
        if len(translations) != expected_count:
            return [translation_text]

        return translations

    def translate_from_audio(self,
                           target_language: str = "en",
                           max_duration: int = 10,
                           include_terms: bool = True) -> Dict[str, Any]:
        """
        음성 입력을 통한 사주풀이 번역

        Args:
            target_language: 목표 언어 ("en", "zh", "ja", "es" 등)
            max_duration: 최대 녹음 시간 (초)
            include_terms: 용어 정보 포함 여부

        Returns:
            번역 결과 딕셔너리 (STT 정보 포함)
        """
        start_time = time.time()

        try:
            # 음성 녹음기 초기화
            if not self.audio_recorder:
                self.audio_recorder = AudioRecorder(api_key=self.api_key)

            # 음성 녹음 및 STT 처리
            stt_result = self.audio_recorder.record_and_transcribe(
                duration=max_duration,
                language="ko"
            )

            if not stt_result["success"]:
                return {
                    "success": False,
                    "error": f"STT failed: {stt_result['error']}",
                    "processing_time": time.time() - start_time
                }

            korean_text = stt_result["text"].strip()
            if not korean_text:
                return {
                    "success": False,
                    "error": "No speech detected",
                    "processing_time": time.time() - start_time
                }

            print(f"🎯 인식된 텍스트: '{korean_text}'")

            # 번역 수행
            translation_result = self.translate(
                input_text=korean_text,
                target_language=target_language,
                include_terms=include_terms
            )

            # STT 정보를 번역 결과에 추가
            if translation_result["success"]:
                translation_result.update({
                    "stt_info": {
                        "detected_text": korean_text,
                        "audio_duration": stt_result.get("duration"),
                        "detected_language": stt_result.get("language"),
                        "confidence": stt_result.get("confidence")
                    },
                    "input_method": "voice"
                })

            return translation_result

        except Exception as e:
            error_msg = f"Voice translation failed: {str(e)}"
            print(f"⚠️  {error_msg}")
            return {
                "success": False,
                "error": error_msg,
                "processing_time": time.time() - start_time
            }

    def translate_from_audio_file(self,
                                 audio_file_path: str,
                                 target_language: str = "en",
                                 include_terms: bool = True,
                                 source_language: str = "ko") -> Dict[str, Any]:
        """
        웹에서 업로드된 음성 파일을 통한 사주풀이 번역

        Args:
            audio_file_path: 업로드된 음성 파일 경로
            target_language: 목표 언어 ("en", "zh", "ja", "es" 등)
            include_terms: 용어 정보 포함 여부
            source_language: 소스 언어 ("ko", "en" 등)

        Returns:
            번역 결과 딕셔너리 (STT 정보 포함)
        """
        start_time = time.time()

        try:
            # 음성 녹음기 초기화 (STT용)
            if not self.audio_recorder:
                self.audio_recorder = AudioRecorder(api_key=self.api_key)

            print(f"🎯 STT processing - Source language: {source_language}")

            # 음성 파일 STT 처리
            stt_result = self.audio_recorder.transcribe_audio(
                audio_file_path=audio_file_path,
                language=source_language
            )

            if not stt_result["success"]:
                return {
                    "success": False,
                    "error": f"STT failed: {stt_result['error']}",
                    "processing_time": time.time() - start_time
                }

            recognized_text = stt_result["text"].strip()
            if not recognized_text:
                return {
                    "success": False,
                    "error": "No speech detected in audio file",
                    "processing_time": time.time() - start_time
                }

            print(f"🎯 인식된 텍스트: '{recognized_text}'")

            # 번역 수행
            translation_result = self.translate(
                input_text=recognized_text,
                target_language=target_language,
                include_terms=include_terms
            )

            # STT 정보를 번역 결과에 추가
            if translation_result["success"]:
                translation_result.update({
                    "stt_info": {
                        "detected_text": recognized_text,
                        "audio_duration": stt_result.get("duration"),
                        "detected_language": stt_result.get("language"),
                        "confidence": stt_result.get("confidence")
                    },
                    "input_method": "voice_upload"
                })

            return translation_result

        except Exception as e:
            error_msg = f"Audio file translation failed: {str(e)}"
            print(f"⚠️  {error_msg}")
            return {
                "success": False,
                "error": error_msg,
                "processing_time": time.time() - start_time
            }

    def get_available_models(self) -> List[str]:
        """사용 가능한 OpenAI 모델 목록 반환"""
        return [
            "gpt-4o-mini",
            "gpt-4o",
            "gpt-4-turbo",
            "gpt-4",
            "gpt-3.5-turbo"
        ]

    def set_model(self, model: str) -> bool:
        """모델 변경"""
        if model in self.get_available_models():
            self.model = model
            print(f"Model changed to: {model}")
            return True
        else:
            print(f"Model {model} is not available. Available models: {self.get_available_models()}")
            return False

    def get_term_info(self, korean_term: str) -> Dict[str, Any]:
        """특정 사주 용어 정보 조회"""
        return self.term_db.get_term(korean_term)

    def search_terms(self, keyword: str) -> List[str]:
        """키워드로 사주 용어 검색"""
        matching_terms = []
        for term, info in self.term_db.get_all_terms().items():
            if (keyword in term or
                keyword.lower() in info.get("english", "").lower() or
                keyword in info.get("chinese", "") or
                keyword in info.get("meaning", "")):
                matching_terms.append(term)
        return matching_terms

    def get_translation_stats(self) -> Dict[str, Any]:
        """번역기 상태 정보 반환"""
        return {
            "model": self.model,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
            "api_key_configured": bool(self.api_key and self.api_key != "your_openai_api_key_here"),
            "total_terms": len(self.term_db.get_all_terms()),
            "available_languages": ["en", "zh"],
            "context_enabled": self.enable_context,
            "conversation_turns": len(self.conversation_history),
            "max_history_length": self.max_history_length,
            "max_context_tokens": self.max_context_tokens
        }

    def _detect_korean(self, text: str) -> bool:
        """텍스트가 한국어인지 감지"""
        korean_chars = 0
        total_chars = 0

        for char in text:
            if char.strip():  # 공백 제외
                total_chars += 1
                # 한글 문자 범위 체크
                if ('\u3131' <= char <= '\u3163' or  # 한글 자모
                    '\uac00' <= char <= '\ud7a3'):   # 한글 완성형
                    korean_chars += 1

        # 전체 문자의 30% 이상이 한글이면 한국어로 판단
        return total_chars > 0 and (korean_chars / total_chars) >= 0.3

    def _build_session_context(self, target_language: str) -> str:
        """세션 컨텍스트 구축 (토큰 제한 고려)"""
        if not self.conversation_history:
            return ""

        # 최근 대화부터 역순으로 컨텍스트 구축
        context_parts = []
        estimated_tokens = 0

        for entry in reversed(self.conversation_history):
            # 대략적인 토큰 수 계산 (1토큰 ≈ 4글자)
            entry_tokens = len(entry) // 4

            if estimated_tokens + entry_tokens > self.max_context_tokens:
                break

            context_parts.insert(0, entry)
            estimated_tokens += entry_tokens

        return "\n".join(context_parts)

    def _add_to_history(self, input_text: str, translation: str, source_lang: str, target_lang: str):
        """대화 히스토리에 추가"""
        # 언어 이름 매핑
        lang_names = {"ko": "한국어", "en": "영어", "zh": "중국어"}
        source_name = lang_names.get(source_lang, source_lang)
        target_name = lang_names.get(target_lang, target_lang)

        # 히스토리 엔트리 생성
        history_entry = f"[{source_name}→{target_name}] 원문: {input_text} → 번역: {translation}"

        # 히스토리에 추가
        self.conversation_history.append(history_entry)

        # 길이 제한 적용
        if len(self.conversation_history) > self.max_history_length:
            self.conversation_history = self.conversation_history[-self.max_history_length:]

    def clear_conversation_history(self):
        """대화 히스토리 초기화"""
        self.conversation_history.clear()
        print("💭 대화 히스토리가 초기화되었습니다.")

    def get_conversation_history(self) -> List[str]:
        """현재 대화 히스토리 반환"""
        return self.conversation_history.copy()

    def set_context_settings(self, max_history_length: int = None, max_context_tokens: int = None):
        """컨텍스트 설정 변경"""
        if max_history_length is not None:
            self.max_history_length = max_history_length
        if max_context_tokens is not None:
            self.max_context_tokens = max_context_tokens

        print(f"📊 컨텍스트 설정 변경: 최대 히스토리 {self.max_history_length}개, 최대 토큰 {self.max_context_tokens}개")