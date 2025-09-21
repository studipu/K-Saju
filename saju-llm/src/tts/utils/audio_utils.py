"""
오디오 처리 유틸리티
"""

import os
import tempfile
import subprocess
from typing import Dict, Any, Optional
from pathlib import Path

class AudioUtils:
    """오디오 파일 처리 유틸리티"""

    @staticmethod
    def get_audio_info(file_path: str) -> Dict[str, Any]:
        """
        오디오 파일 정보 조회

        Args:
            file_path: 오디오 파일 경로

        Returns:
            오디오 정보 딕셔너리
        """
        try:
            if not os.path.exists(file_path):
                return {"error": "File not found"}

            file_size = os.path.getsize(file_path)
            file_ext = Path(file_path).suffix.lower()

            info = {
                "file_path": file_path,
                "file_size": file_size,
                "file_size_mb": round(file_size / (1024 * 1024), 2),
                "format": file_ext.replace('.', ''),
                "exists": True
            }

            # ffprobe를 사용해 상세 정보 조회 (선택적)
            try:
                result = subprocess.run([
                    'ffprobe', '-v', 'quiet', '-print_format', 'json',
                    '-show_format', '-show_streams', file_path
                ], capture_output=True, text=True, timeout=10)

                if result.returncode == 0:
                    import json
                    ffprobe_data = json.loads(result.stdout)

                    if 'format' in ffprobe_data:
                        format_info = ffprobe_data['format']
                        info.update({
                            "duration": float(format_info.get('duration', 0)),
                            "bit_rate": int(format_info.get('bit_rate', 0)),
                            "format_long_name": format_info.get('format_long_name', '')
                        })

                    if 'streams' in ffprobe_data and ffprobe_data['streams']:
                        stream = ffprobe_data['streams'][0]
                        info.update({
                            "sample_rate": int(stream.get('sample_rate', 0)),
                            "channels": int(stream.get('channels', 0)),
                            "codec": stream.get('codec_name', '')
                        })

            except (subprocess.TimeoutExpired, subprocess.CalledProcessError, ImportError):
                # ffprobe가 없거나 실패한 경우 기본 정보만 반환
                pass

            return info

        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    def convert_format(input_path: str,
                      output_path: str,
                      target_format: str = "mp3",
                      quality: str = "high") -> Dict[str, Any]:
        """
        오디오 형식 변환

        Args:
            input_path: 입력 파일 경로
            output_path: 출력 파일 경로
            target_format: 대상 형식 (mp3, wav, ogg, etc.)
            quality: 품질 설정 (low, medium, high)

        Returns:
            변환 결과
        """
        try:
            if not os.path.exists(input_path):
                return {"success": False, "error": "Input file not found"}

            # ffmpeg 품질 설정
            quality_settings = {
                "low": ["-b:a", "64k"],
                "medium": ["-b:a", "128k"],
                "high": ["-b:a", "192k"]
            }

            ffmpeg_args = [
                "ffmpeg", "-i", input_path,
                "-acodec", "libmp3lame" if target_format == "mp3" else "copy",
                "-y"  # 덮어쓰기
            ]

            # 품질 설정 추가
            if target_format in ["mp3"] and quality in quality_settings:
                ffmpeg_args.extend(quality_settings[quality])

            ffmpeg_args.append(output_path)

            result = subprocess.run(
                ffmpeg_args,
                capture_output=True,
                text=True,
                timeout=30
            )

            if result.returncode == 0:
                return {
                    "success": True,
                    "input_path": input_path,
                    "output_path": output_path,
                    "format": target_format,
                    "quality": quality
                }
            else:
                return {
                    "success": False,
                    "error": f"ffmpeg failed: {result.stderr}"
                }

        except subprocess.TimeoutExpired:
            return {"success": False, "error": "Conversion timeout"}
        except Exception as e:
            return {"success": False, "error": str(e)}

    @staticmethod
    def play_audio(file_path: str, player: str = "auto") -> Dict[str, Any]:
        """
        오디오 파일 재생

        Args:
            file_path: 재생할 파일 경로
            player: 사용할 플레이어 (auto, afplay, mpv, vlc)

        Returns:
            재생 결과
        """
        try:
            if not os.path.exists(file_path):
                return {"success": False, "error": "Audio file not found"}

            # 플레이어 자동 선택
            if player == "auto":
                import platform
                system = platform.system().lower()

                if system == "darwin":  # macOS
                    player = "afplay"
                elif system == "linux":
                    player = "mpv"
                elif system == "windows":
                    player = "start"
                else:
                    player = "mpv"

            # 플레이어별 명령어
            commands = {
                "afplay": ["afplay", file_path],
                "mpv": ["mpv", "--no-video", file_path],
                "vlc": ["vlc", "--intf", "dummy", "--play-and-exit", file_path],
                "start": ["start", "", file_path]  # Windows
            }

            if player not in commands:
                return {"success": False, "error": f"Unsupported player: {player}"}

            print(f"🔊 오디오 재생 중: {file_path}")
            print(f"   플레이어: {player}")

            # 백그라운드에서 재생
            process = subprocess.Popen(
                commands[player],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )

            return {
                "success": True,
                "file_path": file_path,
                "player": player,
                "process_id": process.pid,
                "message": "Audio playback started"
            }

        except Exception as e:
            return {"success": False, "error": str(e)}

    @staticmethod
    def create_temp_file(suffix: str = ".mp3") -> str:
        """
        임시 오디오 파일 생성

        Args:
            suffix: 파일 확장자

        Returns:
            임시 파일 경로
        """
        temp_file = tempfile.NamedTemporaryFile(
            suffix=suffix,
            delete=False,
            prefix="saju_tts_"
        )
        temp_file.close()
        return temp_file.name

    @staticmethod
    def cleanup_temp_files(file_paths: list):
        """
        임시 파일들 정리

        Args:
            file_paths: 삭제할 파일 경로 목록
        """
        deleted_count = 0
        for file_path in file_paths:
            try:
                if os.path.exists(file_path):
                    os.unlink(file_path)
                    deleted_count += 1
            except Exception as e:
                print(f"⚠️ 임시 파일 삭제 실패: {file_path} - {e}")

        if deleted_count > 0:
            print(f"🗑️ 임시 파일 {deleted_count}개 정리 완료")

    @staticmethod
    def get_supported_formats() -> Dict[str, list]:
        """지원하는 오디오 형식 반환"""
        return {
            "input": ["mp3", "wav", "ogg", "m4a", "flac", "opus", "aac"],
            "output": ["mp3", "wav", "ogg", "flac"],
            "tts_output": ["mp3", "opus", "aac", "flac"]  # OpenAI TTS 지원 형식
        }