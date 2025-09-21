"""
TTS 관리자 클래스
다양한 TTS 서비스를 통합 관리
"""

import os
from typing import Dict, Any, List, Optional
from .providers.base_tts import BaseTTS
from .providers.openai_tts import OpenAITTS

class TTSManager:
    """TTS 서비스 통합 관리자"""

    def __init__(self,
                 provider: str = "openai",
                 api_key: str = None,
                 **kwargs):
        """
        TTS 관리자 초기화

        Args:
            provider: TTS 서비스 제공자 ("openai")
            api_key: API 키
            **kwargs: 제공자별 추가 설정
        """
        self.provider = provider.lower()
        self.api_key = api_key
        self.config = kwargs
        self.tts_service: Optional[BaseTTS] = None

        # TTS 서비스 초기화
        self._initialize_service()

    def _initialize_service(self):
        """TTS 서비스 초기화"""
        try:
            if self.provider == "openai":
                self.tts_service = OpenAITTS(
                    api_key=self.api_key,
                    **self.config
                )
            else:
                raise ValueError(f"Unsupported TTS provider: {self.provider}")

        except Exception as e:
            print(f"❌ TTS 서비스 초기화 실패: {e}")
            self.tts_service = None

    def synthesize_text(self,
                       text: str,
                       voice: str = None,
                       language: str = "ko",
                       output_file: str = None,
                       **kwargs) -> Dict[str, Any]:
        """
        텍스트를 음성으로 변환

        Args:
            text: 변환할 텍스트
            voice: 사용할 음성
            language: 언어 코드
            output_file: 저장할 파일 경로 (None이면 저장 안함)
            **kwargs: 추가 옵션

        Returns:
            TTS 결과 딕셔너리
        """
        if not self.tts_service:
            return {
                "success": False,
                "error": "TTS service not initialized",
                "text": text
            }

        try:
            # 음성 합성
            result = self.tts_service.synthesize(
                text=text,
                voice=voice,
                language=language,
                **kwargs
            )

            if not result["success"]:
                return result

            # 파일 저장 (요청된 경우)
            if output_file and result.get("audio_data"):
                save_success = self.tts_service.save_audio(
                    result["audio_data"],
                    output_file
                )
                result["saved_to_file"] = save_success
                result["output_file"] = output_file if save_success else None

            return result

        except Exception as e:
            return {
                "success": False,
                "error": f"TTS synthesis failed: {str(e)}",
                "text": text,
                "provider": self.provider
            }

    def get_available_voices(self, language: str = None) -> List[Dict[str, Any]]:
        """
        사용 가능한 음성 목록 반환

        Args:
            language: 언어 코드

        Returns:
            음성 정보 리스트
        """
        if not self.tts_service:
            return []

        return self.tts_service.get_available_voices(language)

    def get_service_info(self) -> Dict[str, Any]:
        """현재 TTS 서비스 정보 반환"""
        if not self.tts_service:
            return {"provider": self.provider, "status": "not_initialized"}

        info = self.tts_service.get_service_info()
        info["status"] = "initialized"
        return info

    def estimate_cost(self, text: str) -> Dict[str, Any]:
        """
        TTS 비용 추정

        Args:
            text: 변환할 텍스트

        Returns:
            비용 정보
        """
        if not self.tts_service:
            return {"error": "TTS service not initialized"}

        # OpenAI TTS인 경우 비용 추정 제공
        if hasattr(self.tts_service, 'estimate_cost'):
            return self.tts_service.estimate_cost(text)

        return {"provider": self.provider, "cost_estimation": "not_available"}

    def validate_text(self, text: str) -> Dict[str, Any]:
        """
        텍스트 유효성 검사

        Args:
            text: 검사할 텍스트

        Returns:
            유효성 검사 결과
        """
        if not text or not text.strip():
            return {
                "valid": False,
                "error": "Empty text",
                "suggestions": ["텍스트를 입력해주세요"]
            }

        text_length = len(text)

        # 길이 제한 확인
        max_length = 4000  # OpenAI TTS 기본 제한
        if text_length > max_length:
            return {
                "valid": False,
                "error": f"Text too long ({text_length} > {max_length} characters)",
                "suggestions": [
                    f"텍스트를 {max_length}자 이하로 줄여주세요",
                    "여러 개의 짧은 문장으로 나누어 처리하세요"
                ]
            }

        # 추천사항
        suggestions = []
        if text_length > 1000:
            suggestions.append("긴 텍스트는 처리 시간이 오래 걸릴 수 있습니다")

        return {
            "valid": True,
            "text_length": text_length,
            "max_length": max_length,
            "suggestions": suggestions
        }

    def change_provider(self, provider: str, api_key: str = None, **kwargs):
        """
        TTS 제공자 변경

        Args:
            provider: 새로운 제공자
            api_key: 새로운 API 키
            **kwargs: 추가 설정
        """
        self.provider = provider.lower()
        if api_key:
            self.api_key = api_key
        self.config.update(kwargs)

        print(f"🔄 TTS 제공자 변경: {provider}")
        self._initialize_service()

    def get_supported_providers(self) -> List[str]:
        """지원하는 TTS 제공자 목록 반환"""
        return ["openai"]

    def get_stats(self) -> Dict[str, Any]:
        """TTS 관리자 상태 정보 반환"""
        return {
            "provider": self.provider,
            "service_initialized": self.tts_service is not None,
            "supported_providers": self.get_supported_providers(),
            "api_key_configured": bool(self.api_key),
            "service_info": self.get_service_info() if self.tts_service else None
        }