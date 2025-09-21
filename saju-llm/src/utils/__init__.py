from .saju_terms import SajuTermDatabase

try:
    from .audio_recorder import AudioRecorder
    __all__ = ['SajuTermDatabase', 'AudioRecorder']
except ImportError:
    # pyaudio가 설치되지 않은 경우
    __all__ = ['SajuTermDatabase']