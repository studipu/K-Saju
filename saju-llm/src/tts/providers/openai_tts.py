"""
OpenAI TTS 서비스 구현
"""

import os
import time
from typing import Dict, Any, List, Optional
from .base_tts import BaseTTS

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

class OpenAITTS(BaseTTS):
    """OpenAI TTS 서비스"""

    SUPPORTED_VOICES = {
        "alloy": {"gender": "neutral", "quality": "standard"},
        "echo": {"gender": "male", "quality": "standard"},
        "fable": {"gender": "female", "quality": "standard"},
        "onyx": {"gender": "male", "quality": "standard"},
        "nova": {"gender": "female", "quality": "standard"},
        "shimmer": {"gender": "female", "quality": "standard"}
    }

    VOICE_MODELS = ["tts-1", "tts-1-hd"]

    def __init__(self,
                 api_key: str = None,
                 model: str = "tts-1",
                 voice: str = "alloy",
                 **kwargs):
        """
        OpenAI TTS 초기화

        Args:
            api_key: OpenAI API 키
            model: TTS 모델 ("tts-1" 또는 "tts-1-hd")
            voice: 기본 음성
            **kwargs: 추가 설정
        """
        super().__init__(api_key, **kwargs)

        if not OpenAI:
            raise ImportError("openai package is required. Please install: pip install openai")

        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OpenAI API key is required")

        self.client = OpenAI(api_key=self.api_key)
        self.model = model if model in self.VOICE_MODELS else "tts-1"
        self.default_voice = voice if voice in self.SUPPORTED_VOICES else "alloy"

        print(f"OpenAI TTS initialized with model: {self.model}, voice: {self.default_voice}")

    def synthesize(self,
                  text: str,
                  voice: str = None,
                  language: str = "ko",
                  output_format: str = "mp3",
                  speed: float = 1.0,
                  **kwargs) -> Dict[str, Any]:
        """
        텍스트를 음성으로 변환

        Args:
            text: 변환할 텍스트
            voice: 사용할 음성
            language: 언어 (OpenAI TTS는 자동 감지)
            output_format: 출력 형식 (mp3, opus, aac, flac)
            speed: 재생 속도 (0.25 ~ 4.0)
            **kwargs: 추가 옵션

        Returns:
            TTS 결과 딕셔너리
        """
        start_time = time.time()

        try:
            # 텍스트 유효성 검사
            if not self.validate_text(text):
                return {
                    "success": False,
                    "error": "Invalid text: empty or too long (max 4000 characters)",
                    "processing_time": time.time() - start_time
                }

            # 설정 검증
            selected_voice = voice or self.default_voice
            if selected_voice not in self.SUPPORTED_VOICES:
                selected_voice = self.default_voice

            # 속도 제한
            speed = max(0.25, min(4.0, speed))

            # 지원하는 형식 확인
            supported_formats = ["mp3", "opus", "aac", "flac"]
            if output_format not in supported_formats:
                output_format = "mp3"

            print(f"🔊 TTS 생성 중: '{text[:50]}{'...' if len(text) > 50 else ''}'")
            print(f"   음성: {selected_voice}, 모델: {self.model}, 속도: {speed}x")

            # OpenAI TTS API 호출
            response = self.client.audio.speech.create(
                model=self.model,
                voice=selected_voice,
                input=text,
                response_format=output_format,
                speed=speed
            )

            # 오디오 데이터 읽기
            audio_data = response.content

            # 결과 반환
            result = {
                "success": True,
                "audio_data": audio_data,
                "text": text,
                "voice": selected_voice,
                "model": self.model,
                "language": language,
                "output_format": output_format,
                "speed": speed,
                "audio_size": len(audio_data),
                "processing_time": time.time() - start_time
            }

            print(f"✅ TTS 완료: {len(audio_data):,} bytes, {result['processing_time']:.2f}초")
            return result

        except Exception as e:
            error_msg = f"OpenAI TTS failed: {str(e)}"
            print(f"❌ {error_msg}")
            return {
                "success": False,
                "error": error_msg,
                "text": text,
                "voice": voice,
                "processing_time": time.time() - start_time
            }

    def get_available_voices(self, language: str = None) -> List[Dict[str, Any]]:
        """
        사용 가능한 음성 목록 반환

        Args:
            language: 언어 코드 (OpenAI는 다국어 지원)

        Returns:
            음성 정보 리스트
        """
        voices = []
        for voice_id, info in self.SUPPORTED_VOICES.items():
            voice_info = {
                "id": voice_id,
                "name": voice_id.title(),
                "gender": info["gender"],
                "quality": info["quality"],
                "languages": ["ko", "en", "zh", "ja", "es", "fr", "de", "it"],  # OpenAI는 다국어 지원
                "description": f"{info['gender'].title()} voice with {info['quality']} quality"
            }
            voices.append(voice_info)

        return voices

    def save_audio(self, audio_data: bytes, file_path: str) -> bool:
        """
        오디오 데이터를 파일로 저장

        Args:
            audio_data: 오디오 바이트 데이터
            file_path: 저장할 파일 경로

        Returns:
            저장 성공 여부
        """
        try:
            with open(file_path, 'wb') as f:
                f.write(audio_data)
            print(f"💾 오디오 저장 완료: {file_path}")
            return True
        except Exception as e:
            print(f"❌ 오디오 저장 실패: {e}")
            return False

    def get_models(self) -> List[str]:
        """사용 가능한 TTS 모델 목록 반환"""
        return self.VOICE_MODELS.copy()

    def estimate_cost(self, text: str, model: str = None) -> Dict[str, Any]:
        """
        TTS 비용 추정

        Args:
            text: 변환할 텍스트
            model: 사용할 모델

        Returns:
            비용 정보
        """
        char_count = len(text)
        selected_model = model or self.model

        # OpenAI TTS 가격 (2024년 기준)
        if selected_model == "tts-1":
            price_per_1k_chars = 0.015  # $0.015 per 1K characters
        elif selected_model == "tts-1-hd":
            price_per_1k_chars = 0.030  # $0.030 per 1K characters
        else:
            price_per_1k_chars = 0.015

        estimated_cost = (char_count / 1000) * price_per_1k_chars

        return {
            "character_count": char_count,
            "model": selected_model,
            "estimated_cost_usd": round(estimated_cost, 4),
            "price_per_1k_chars": price_per_1k_chars
        }

    def get_service_info(self) -> Dict[str, Any]:
        """서비스 정보 반환"""
        return {
            "provider": "OpenAI",
            "service": "Text-to-Speech",
            "model": self.model,
            "default_voice": self.default_voice,
            "supported_voices": list(self.SUPPORTED_VOICES.keys()),
            "supported_formats": ["mp3", "opus", "aac", "flac"],
            "max_text_length": 4000,
            "speed_range": "0.25x - 4.0x",
            "languages": "Multi-language support (auto-detect)"
        }