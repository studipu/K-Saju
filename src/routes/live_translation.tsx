import { useCallback, useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { useI18n } from "../i18n/i18n";

const Page = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
`;

const MainTitle = styled.h1`
  color: white;
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SubTitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  margin: 0;
  font-weight: 400;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button<{ $primary?: boolean; $danger?: boolean; $customer?: boolean; $business?: boolean; $recording?: boolean }>`
  appearance: none;
  border: none;
  background: ${(p) => {
    if (p.$recording) return "linear-gradient(135deg, #ff6b6b, #ff8e53)";
    if (p.$danger) return "linear-gradient(135deg, #ff6b6b, #ee5a6f)";
    if (p.$customer) return "linear-gradient(135deg, #4facfe, #00f2fe)";
    if (p.$business) return "linear-gradient(135deg, #43e97b, #38f9d7)";
    return "linear-gradient(135deg, #667eea, #764ba2)";
  }};
  color: white;
  height: 56px;
  padding: 0 24px;
  border-radius: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 16px;
  min-width: 160px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    &:hover {
      transform: none;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    }
  }

  ${(p) => p.$recording && `
    animation: pulse 2s infinite;

    @keyframes pulse {
      0% {
        box-shadow: 0 8px 32px rgba(255, 107, 107, 0.3);
      }
      50% {
        box-shadow: 0 8px 32px rgba(255, 107, 107, 0.6), 0 0 0 10px rgba(255, 107, 107, 0.1);
      }
      100% {
        box-shadow: 0 8px 32px rgba(255, 107, 107, 0.3);
      }
    }
  `}
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 32px;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const Panel = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2);
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
`;

const PanelTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1.2;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LangPicker = styled.div`
  position: relative;
`;

const LangButton = styled.button`
  appearance: none;
  border: 2px solid #e0e7ff;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  color: #4338ca;
  height: 48px;
  padding: 0 20px;
  border-radius: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(67, 56, 202, 0.1);

  &:hover {
    background: linear-gradient(135deg, #f8fafc, #e0e7ff);
    border-color: #c7d2fe;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(67, 56, 202, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LangMenu = styled.div`
  position: absolute;
  right: 0;
  top: 56px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1);
  width: 220px;
  overflow: hidden;
  z-index: 10;
  animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const LangMenuItem = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: transparent;
  border: 0;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  text-align: left;
  color: #374151;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
    color: #4338ca;
    transform: translateX(4px);
  }

  &:first-child {
    border-radius: 16px 16px 0 0;
  }

  &:last-child {
    border-radius: 0 0 16px 16px;
  }

  span:first-child {
    font-size: 20px;
  }
`;

const CustomerLangBox = styled.div`
  background: linear-gradient(135deg, #f8fafc, #e8f2ff);
  border: 2px solid rgba(102, 126, 234, 0.1);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(102, 126, 234, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.1);
  }
`;

const ConversationArea = styled.div`
  height: 70vh;
  min-height: 500px;
  overflow-y: auto;
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #e8f2ff 100%);
  border: 2px solid rgba(102, 126, 234, 0.1);
  border-radius: 20px;
  position: relative;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #5a67d8, #6b46c1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 20px;
    background: linear-gradient(to bottom, rgba(248, 250, 252, 0.8), transparent);
    pointer-events: none;
    z-index: 1;
  }
`;

const MessageItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
`;

const ProfileIcon = styled.div<{ $speaker: "customer" | "business" }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${(p) => p.$speaker === "customer"
    ? "linear-gradient(135deg, #4facfe, #00f2fe)"
    : "linear-gradient(135deg, #43e97b, #38f9d7)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
  box-shadow: 0 8px 24px ${(p) => p.$speaker === "customer"
    ? "rgba(79, 172, 254, 0.3)"
    : "rgba(67, 233, 123, 0.3)"};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 32px ${(p) => p.$speaker === "customer"
      ? "rgba(79, 172, 254, 0.4)"
      : "rgba(67, 233, 123, 0.4)"};
  }
`;

const MessageContent = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  }
`;

const OriginalText = styled.div`
  font-weight: 700;
  margin-bottom: 12px;
  color: #111827;
  line-height: 1.5;
  font-size: 16px;
`;

const KoreanText = styled.div`
  font-size: 15px;
  color: #6b7280;
  font-style: italic;
  line-height: 1.5;
  padding-top: 12px;
  border-top: 2px solid #f1f5f9;
  font-weight: 500;
`;

const RecordingButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const StatusIndicator = styled.div<{ $isRecording: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${(p) => p.$isRecording
    ? "linear-gradient(135deg, #ff6b6b, #ff8e53)"
    : "linear-gradient(135deg, #e0e7ff, #c7d2fe)"};
  border-radius: 25px;
  color: ${(p) => p.$isRecording ? "white" : "#4338ca"};
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px ${(p) => p.$isRecording
    ? "rgba(255, 107, 107, 0.3)"
    : "rgba(67, 56, 202, 0.1)"};
`;

const WaveIcon = styled.div<{ $animate: boolean }>`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  gap: 2px;

  &::before,
  &::after {
    content: '';
    width: 3px;
    background: currentColor;
    border-radius: 2px;
    animation: ${(p) => p.$animate ? "wave 1.5s ease-in-out infinite" : "none"};
  }

  &::before {
    height: 12px;
    animation-delay: 0s;
  }

  &::after {
    height: 8px;
    animation-delay: 0.3s;
  }

  @keyframes wave {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(1.5); }
  }
`

type SpeechLang = "en-US" | "ko-KR" | "ja-JP" | "zh-CN" | "es-ES";

const LANG_OPTIONS: Array<{ code: SpeechLang; label: string; icon: string }> = [
  { code: "en-US", label: "English (US)", icon: "🇺🇸" },
  { code: "ko-KR", label: "한국어", icon: "🇰🇷" },
  { code: "zh-CN", label: "中文(简体)", icon: "🇨🇳" },
  { code: "ja-JP", label: "日本語", icon: "🇯🇵" },
  { code: "es-ES", label: "Español", icon: "🇪🇸" },
];

type FinalMessage = {
  id: string;
  originalText: string;
  koreanText: string;
  timestamp: number;
  speaker: "customer" | "business";
};

function useRecorderSpeech(translations: {
  testVoiceInput: string;
  testVoiceRecorded: string;
  offlineRecordingComplete: string;
  offlineRecordingSuccess: string;
}) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [supported] = useState<boolean>(true);
  const [listening, setListening] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<"customer" | "business" | null>(null);
  const [interim, setInterim] = useState("");
  const [messages, setMessages] = useState<FinalMessage[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);

  const startRecording = useCallback(async (speaker: "customer" | "business", customerLang: SpeechLang) => {
    setInterim("");
    setRecordingTime(0);
    setCurrentSpeaker(speaker);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mr;

      const audioChunks: Blob[] = [];

      mr.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mr.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

        try {
          // Supabase Edge Function 사용
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

          if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('Supabase configuration missing');
          }

          // 오디오를 base64로 변환
          const reader = new FileReader();
          const audioBase64 = await new Promise<string>((resolve, reject) => {
            reader.onload = () => {
              const base64 = (reader.result as string).split(',')[1];
              resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(audioBlob);
          });

          // 언어 코드 매핑
          const langMap: Record<string, string> = {
            'en-US': 'en',
            'ko-KR': 'ko',
            'zh-CN': 'zh',
            'ja-JP': 'ja',
            'es-ES': 'es'
          };

          const customerLanguageCode = langMap[customerLang] || 'en';

          // 고객이면 선택된 언어에서 한국어로, 업체면 한국어에서 선택된 언어로
          const targetLang = speaker === 'customer' ? 'ko' : customerLanguageCode;
          const sourceLang = speaker === 'customer' ? customerLanguageCode : 'ko';

          console.log(`Speaker: ${speaker}, Customer Lang: ${customerLang} -> ${customerLanguageCode}, Source: ${sourceLang}, Target: ${targetLang}`);

          const response = await fetch(`${supabaseUrl}/functions/v1/translate-audio`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseAnonKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              audio_data: audioBase64,
              target_language: targetLang,
              source_language: sourceLang,
              include_terms: true
            }),
          });

          if (response.ok) {
            const result = await response.json();
            const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

            // 고객: 원문(고객언어) + 한국어, 업체: 번역(고객언어) + 원문(한국어)
            let displayOriginal, displayKorean;

            if (speaker === 'customer') {
              // 고객: 원문(고객언어) 위에, 한국어 아래에
              displayOriginal = result.original_text;
              displayKorean = result.translated_text;
            } else {
              // 업체: 번역(고객언어) 위에, 원문(한국어) 아래에
              displayOriginal = result.translated_text;
              displayKorean = result.original_text;
            }

            setMessages((prev) => [
              ...prev,
              {
                id,
                originalText: displayOriginal,
                koreanText: displayKorean,
                timestamp: Date.now(),
                speaker
              },
            ]);
          } else {
            // Fallback
            const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            setMessages((prev) => [
              ...prev,
              {
                id,
                originalText: translations.testVoiceInput,
                koreanText: translations.testVoiceRecorded,
                timestamp: Date.now(),
                speaker
              },
            ]);
          }
        } catch (error) {
          console.error('API 오류:', error);
          const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          setMessages((prev) => [
            ...prev,
            {
              id,
              originalText: translations.offlineRecordingComplete,
              koreanText: translations.offlineRecordingSuccess,
              timestamp: Date.now(),
              speaker
            },
          ]);
        }

        stream.getTracks().forEach(track => track.stop());
        setListening(false);
        setCurrentSpeaker(null);
      };

      mr.start();
      setListening(true);

      recordingTimeoutRef.current = setTimeout(() => {
        if (mr.state === 'recording') {
          mr.stop();
        }
      }, 10000);

      const interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 10) {
            clearInterval(interval);
            return 10;
          }
          return prev + 0.1;
        });
      }, 100);

    } catch (error) {
      console.error('녹음 시작 실패:', error);
      setListening(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setListening(false);
    setCurrentSpeaker(null);
    setInterim("");
    setRecordingTime(0);
  }, []);

  return { supported, listening, interim, messages, startRecording, stop, recordingTime, currentSpeaker };
}

export default function LiveTranslation() {
  const { t } = useI18n();
  const [customerLang, setCustomerLang] = useState<SpeechLang>("en-US");

  // Get translations for use in callbacks
  const translations = {
    testVoiceInput: t('testVoiceInput'),
    testVoiceRecorded: t('testVoiceRecorded'),
    offlineRecordingComplete: t('offlineRecordingComplete'),
    offlineRecordingSuccess: t('offlineRecordingSuccess'),
  };
  const [openLangMenu, setOpenLangMenu] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest("[data-lang-picker]")) {
        setOpenLangMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const recorder = useRecorderSpeech(translations);

  const handleCustomerRecord = () => {
    recorder.startRecording('customer', customerLang);
  };

  const handleBusinessRecord = () => {
    recorder.startRecording('business', customerLang);
  };

  const running = recorder.listening;
  const conversationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [recorder.messages]);

  const renderLangPicker = () => (
    <LangPicker data-lang-picker>
      <LangButton
        onClick={() => setOpenLangMenu(!openLangMenu)}
        aria-haspopup="menu"
        aria-label="Language"
      >
        <span style={{ fontSize: 18 }}>
          {LANG_OPTIONS.find((o) => o.code === customerLang)?.icon}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: openLangMenu ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s ease",
          }}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="#6b7280"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </LangButton>
      {openLangMenu && (
        <LangMenu>
          {LANG_OPTIONS.map((opt) => (
            <LangMenuItem
              key={opt.code}
              onClick={() => {
                setCustomerLang(opt.code);
                setOpenLangMenu(false);
              }}
            >
              <span style={{ fontSize: 18 }}>{opt.icon}</span>
              <span>{opt.label}</span>
            </LangMenuItem>
          ))}
        </LangMenu>
      )}
    </LangPicker>
  );

  return (
    <Page>
      <Header>
        <MainTitle>{t("liveTranslationTitle")}</MainTitle>
        <SubTitle>{t("liveTranslationSubtitle")}</SubTitle>
      </Header>

      <Grid>
        {/* Left column: language settings */}
        <Panel>
          <PanelHeader>
            <PanelTitle>
              🌍 {t("customerLanguageSettings")}
            </PanelTitle>
          </PanelHeader>
          <CustomerLangBox>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#4338ca" }}>
              💬 {t("customerLanguage")}
            </div>
            {renderLangPicker()}
          </CustomerLangBox>
          {!recorder.supported && (
            <div
              style={{
                marginTop: 12,
                fontSize: 14,
                color: "#ef4444",
                lineHeight: 1.4,
                padding: "12px 16px",
                background: "rgba(239, 68, 68, 0.1)",
                borderRadius: "12px",
                border: "1px solid rgba(239, 68, 68, 0.2)"
              }}
            >
              ⚠️ {t("webSpeechNotSupported")}
            </div>
          )}
        </Panel>

        {/* Right column: conversation area */}
        <Panel>
          <PanelHeader>
            <PanelTitle>
              🗣️ {t("liveTranslation")}
            </PanelTitle>
          </PanelHeader>

          <StatusIndicator $isRecording={running}>
            <WaveIcon $animate={running} />
            {running
              ? `🔴 ${recorder.currentSpeaker === "customer" ? t("customerVoice").replace("🎤 ", "") : t("businessVoice").replace("🎯 ", "")} - ${Math.ceil(10 - recorder.recordingTime)} ${t("secondsLeft")}`
              : t("waitingMessage")}
          </StatusIndicator>

          <RecordingButtons>
            <Button
              onClick={handleCustomerRecord}
              $customer
              $recording={running && recorder.currentSpeaker === "customer"}
              disabled={running}
            >
              {t("customerVoice")}
            </Button>
            <Button
              onClick={handleBusinessRecord}
              $business
              $recording={running && recorder.currentSpeaker === "business"}
              disabled={running}
            >
              {t("businessVoice")}
            </Button>
            <Button onClick={recorder.stop} $danger disabled={!running}>
              ⏹️ {t("stop")}
            </Button>
          </RecordingButtons>

          <ConversationArea ref={conversationRef}>
            {recorder.messages.length === 0 && (
              <div style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#6b7280",
                fontSize: "16px",
                lineHeight: 1.6
              }}>
                {t("noConversationYet")}<br/>
                <span style={{ fontSize: "14px" }}>{t("pressButtonToStart")}</span>
              </div>
            )}

            {recorder.messages.map((message) => (
              <MessageItem key={message.id}>
                <ProfileIcon $speaker={message.speaker}>
                  {message.speaker === "customer" ? "🙋" : "👩‍💼"}
                </ProfileIcon>
                <MessageContent>
                  <OriginalText>{message.originalText}</OriginalText>
                  <KoreanText>🇰🇷 {message.koreanText}</KoreanText>
                </MessageContent>
              </MessageItem>
            ))}

            {/* Interim message during recording */}
            {recorder.interim && (
              <MessageItem>
                <ProfileIcon $speaker="customer">
                  🎤
                </ProfileIcon>
                <MessageContent>
                  <OriginalText style={{ opacity: 0.7 }}>{recorder.interim}</OriginalText>
                </MessageContent>
              </MessageItem>
            )}
          </ConversationArea>
        </Panel>
      </Grid>
    </Page>
  );
}