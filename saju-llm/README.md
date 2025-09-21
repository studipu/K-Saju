# 🔮 사주풀이 LLM 번역기

GPT-4o-mini와 OpenAI Whisper를 활용한 한국어 사주풀이 전문 번역 시스템

## 📋 특징

- **전문 번역**: 사주 전문 용어와 문맥을 이해하는 고품질 번역
- **음성 입력**: OpenAI Whisper API를 통한 한국어 음성 인식 지원
- **다국어 지원**: 영어(en)와 중국어(zh) 번역 지원
- **용어 데이터베이스**: 천간, 지지, 십신, 오행 등 사주 전문 용어 포함
- **다양한 사용 모드**: 단일 번역, 음성 번역, 배치 번역, 대화형 모드
- **CLI 인터페이스**: 명령줄에서 쉽게 사용 가능

## 🚀 설치

1. **의존성 설치**
   ```bash
   pip install -r requirements.txt
   ```

2. **음성 입력 지원 (선택사항)**
   ```bash
   # macOS
   brew install portaudio
   pip install pyaudio

   # Ubuntu/Debian
   sudo apt-get install portaudio19-dev
   pip install pyaudio

   # Windows
   pip install pyaudio
   ```

3. **환경 설정**
   ```bash
   cp .env.example .env
   # .env 파일에서 OPENAI_API_KEY 설정
   ```

## 💻 사용법

### 1. 단일 텍스트 번역
```bash
python main.py translate "갑목 일간은 강한 리더십을 가지고 있습니다" --language en
python main.py translate "재물운이 좋습니다" --language zh
```

### 2. 음성 입력 번역
```bash
# 영어로 음성 번역 (최대 10초)
python main.py voice --language en

# 중국어로 음성 번역 (최대 15초)
python main.py voice --language zh --duration 15
```

### 3. 배치 번역
```bash
# 여러 텍스트 동시 번역
python main.py batch --texts "재물운이 좋습니다" "건강운을 조심하세요" --language en

# 파일에서 텍스트 읽어서 번역
python main.py batch --file texts.txt --language zh
```

### 4. 대화형 모드
```bash
# 텍스트 입력 모드
python main.py interactive --language en

# 음성 입력 모드
python main.py interactive --language en --voice --duration 15
```

### 5. 사주 용어 조회
```bash
# 전체 통계
python main.py terms

# 용어 검색
python main.py terms --search "갑목"

# 특정 용어 정보
python main.py terms --term "정관"
```

## 📚 지원 용어

### 천간 (Heavenly Stems)
- 갑, 을, 병, 정, 무, 기, 경, 신, 임, 계

### 지지 (Earthly Branches)
- 자, 축, 인, 묘, 진, 사, 오, 미, 신, 유, 술, 해

### 오행 (Five Elements)
- 목(Wood), 화(Fire), 토(Earth), 금(Metal), 수(Water)

### 십신 (Ten Gods)
- 정관, 편관, 정인, 편인, 정재, 편재, 상관, 식신, 비견, 겁재

### 기본 용어
- 사주, 팔자, 일간, 월지, 대운, 세운

### 운세 표현
- 재물운, 건강운, 애정운, 사업운, 학업운, 결혼운 등

## 🛠️ 설정 옵션

### 환경 변수 (.env)
```
OPENAI_API_KEY=your_api_key_here
DEFAULT_MODEL=gpt-4o-mini
DEFAULT_TEMPERATURE=0.3
DEFAULT_MAX_TOKENS=1500
```

### 명령줄 옵션
- `--language, -l`: 목표 언어 (en, zh)
- `--duration, -d`: 최대 녹음 시간 (초, 음성 입력용)
- `--voice, -v`: 음성 입력 모드 활성화 (대화형 모드)
- `--no-terms`: 사주 용어 정보 제외
- `--context, -c`: 추가 컨텍스트 정보

## 📖 사용 예시

### 예시 1: 텍스트 입력 번역
```bash
python main.py translate "당신의 일간은 갑목이고 정관이 강해서 명예를 얻을 수 있습니다" --language en
```

**결과:**
```
📝 원문: 당신의 일간은 갑목이고 정관이 강해서 명예를 얻을 수 있습니다
🌍 목표 언어: en
✨ 번역 결과:
   Your core personality and life essence is represented by Yang Wood, which means you possess strong leadership qualities and vitality. With a powerful sense of authority and honor through proper channels, you have the potential to achieve recognition and respect in your endeavors.

🏷️ 발견된 사주 용어: 정관, 일간, 갑
```

### 예시 2: 음성 입력 번역
```bash
python main.py voice --language en --duration 15
```

**과정:**
```
🎤 음성 입력을 시작합니다...
   최대 15초간 녹음됩니다.
   말하기를 마치면 자동으로 인식이 완료됩니다.
🔴 녹음 시작!
⏹️ 무음이 감지되어 녹음을 종료합니다.
💾 녹음 완료: 3.2초
🔄 음성을 텍스트로 변환 중...
✅ 음성 인식 완료: '갑목 일간은 강한 리더십을 가지고 있습니다'
🎯 인식된 텍스트: '갑목 일간은 강한 리더십을 가지고 있습니다'

🎤 음성 인식 결과: 갑목 일간은 강한 리더십을 가지고 있습니다

📝 원문: 갑목 일간은 강한 리더십을 가지고 있습니다
🌍 목표 언어: en
✨ 번역 결과:
   Yang Wood as your core personality and life essence means you possess strong leadership qualities and natural vitality.

🏷️ 발견된 사주 용어: 갑, 일간, 목
```

### 예시 3: 운세 조언 번역
```bash
python main.py translate "정관이 강해서 명예를 얻을 수 있지만 겁재가 있어 조심하세요" --language zh
```

**결과:**
```
📝 원문: 정관이 강해서 명예를 얻을 수 있지만 겁재가 있어 조심하세요
🌍 목표 언어: zh
✨번역 결과:
   正官強盛可以獲得名譽，但有劫財請小心。

🏷️ 발견된 사주 용어: 정관, 겁재
```

## 🔧 기술 스택

- **Python 3.8+**
- **OpenAI GPT-4o-mini**: 고품질 번역 엔진
- **python-dotenv**: 환경 변수 관리
- **argparse**: CLI 인터페이스

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 지원

문제가 발생하거나 개선 사항이 있으시면 Issue를 생성해주세요.