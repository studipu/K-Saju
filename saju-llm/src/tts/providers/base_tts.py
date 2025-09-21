"""
TTS 서비스 기본 인터페이스
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
import io

class BaseTTS(ABC):
    """TTS 서비스 기본 클래스"""

    def __init__(self, api_key: str = None, **kwargs):
        """
        TTS 서비스 초기화

        Args:
            api_key: API 키
            **kwargs: 추가 설정
        """
        self.api_key = api_key
        self.config = kwargs

    @abstractmethod
    def synthesize(self,
                  text: str,
                  voice: str = None,
                  language: str = "ko",
                  **kwargs) -> Dict[str, Any]:
        """
        텍스트를 음성으로 변환

        Args:
            text: 변환할 텍스트
            voice: 사용할 음성 (None이면 기본값)
            language: 언어 코드
            **kwargs: 추가 옵션

        Returns:
            음성 변환 결과 딕셔너리
        """
        pass

    @abstractmethod
    def get_available_voices(self, language: str = None) -> List[Dict[str, Any]]:
        """
        사용 가능한 음성 목록 반환

        Args:
            language: 언어 코드 (None이면 모든 언어)

        Returns:
            음성 정보 리스트
        """
        pass

    @abstractmethod
    def save_audio(self, audio_data: bytes, file_path: str) -> bool:
        """
        오디오 데이터를 파일로 저장

        Args:
            audio_data: 오디오 바이트 데이터
            file_path: 저장할 파일 경로

        Returns:
            저장 성공 여부
        """
        pass

    def get_supported_languages(self) -> List[str]:
        """지원하는 언어 코드 목록 반환"""
        return ["ko", "en", "zh"]

    def validate_text(self, text: str) -> bool:
        """텍스트 유효성 검사"""
        if not text or not text.strip():
            return False
        if len(text) > 4000:  # 대부분 TTS 서비스의 제한
            return False
        return True