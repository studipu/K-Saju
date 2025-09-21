"""
음성 녹음 및 STT 처리 모듈
OpenAI Whisper API를 활용한 음성-텍스트 변환
"""
import os
import time
import wave
import tempfile
from typing import Optional, Dict, Any

try:
    import pyaudio
    PYAUDIO_AVAILABLE = True
except ImportError:
    pyaudio = None
    PYAUDIO_AVAILABLE = False

from openai import OpenAI

class AudioRecorder:
    """음성 녹음 및 STT 처리 클래스"""

    def __init__(self, api_key: str = None):
        """
        AudioRecorder 초기화

        Args:
            api_key: OpenAI API 키
        """
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key or self.api_key == "your_openai_api_key_here":
            raise ValueError("OpenAI API key is required for STT functionality")

        self.client = OpenAI(api_key=self.api_key)

        # 오디오 설정
        self.sample_rate = 16000
        self.chunk_size = 1024
        self.channels = 1

        # PyAudio 초기화
        if PYAUDIO_AVAILABLE:
            self.audio_format = pyaudio.paInt16
            self.audio = pyaudio.PyAudio()
        else:
            raise ImportError("pyaudio is required for audio recording. Please install: pip install pyaudio")

    def record_audio(self, duration: int = 10) -> str:
        """
        음성 녹음

        Args:
            duration: 녹음 시간 (초)

        Returns:
            녹음된 오디오 파일 경로
        """
        print("🎤 음성 입력을 시작합니다...")
        print(f"   {duration}초간 녹음됩니다.")

        # 임시 파일 생성
        temp_file = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
        temp_filename = temp_file.name
        temp_file.close()

        # 녹음 스트림 시작
        stream = self.audio.open(
            format=self.audio_format,
            channels=self.channels,
            rate=self.sample_rate,
            input=True,
            frames_per_buffer=self.chunk_size
        )

        print("🔴 녹음 시작!")

        frames = []
        start_time = time.time()

        try:
            while True:
                data = stream.read(self.chunk_size)
                frames.append(data)

                elapsed_time = time.time() - start_time

                # 시간 체크
                if elapsed_time >= duration:
                    print(f"⏰ {duration}초가 경과하여 녹음을 종료합니다.")
                    break

        except KeyboardInterrupt:
            print("\n⏹️  사용자가 녹음을 중단했습니다.")

        finally:
            stream.stop_stream()
            stream.close()

        # WAV 파일로 저장
        with wave.open(temp_filename, 'wb') as wav_file:
            wav_file.setnchannels(self.channels)
            wav_file.setsampwidth(self.audio.get_sample_size(self.audio_format))
            wav_file.setframerate(self.sample_rate)
            wav_file.writeframes(b''.join(frames))

        print(f"💾 녹음 완료: {len(frames) * self.chunk_size / self.sample_rate:.1f}초")
        return temp_filename

    def transcribe_audio(self, audio_file_path: str, language: str = "ko") -> Dict[str, Any]:
        """
        오디오 파일을 텍스트로 변환

        Args:
            audio_file_path: 오디오 파일 경로
            language: 음성 언어 코드 (ko, en 등)

        Returns:
            STT 결과 딕셔너리
        """
        try:
            print("🔄 음성을 텍스트로 변환 중...")

            with open(audio_file_path, "rb") as audio_file:
                transcript = self.client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    language=language,
                    response_format="verbose_json"
                )

            result = {
                "success": True,
                "text": transcript.text,
                "language": transcript.language,
                "duration": transcript.duration,
                "confidence": getattr(transcript, 'confidence', None)
            }

            print(f"✅ 음성 인식 완료: '{transcript.text}'")
            return result

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "text": ""
            }
        finally:
            # 임시 파일 삭제
            try:
                os.unlink(audio_file_path)
            except:
                pass

    def record_and_transcribe(self, duration: int = 10, language: str = "ko") -> Dict[str, Any]:
        """
        녹음과 STT를 한 번에 처리

        Args:
            duration: 최대 녹음 시간 (초)
            language: 음성 언어 코드

        Returns:
            STT 결과 딕셔너리
        """
        try:
            # 녹음
            audio_file = self.record_audio(duration=duration)

            # STT 처리
            result = self.transcribe_audio(audio_file, language=language)

            return result

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "text": ""
            }

    def __del__(self):
        """리소스 정리"""
        if hasattr(self, 'audio') and self.audio:
            self.audio.terminate()