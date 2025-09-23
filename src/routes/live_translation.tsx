import { useCallback, useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { useI18n } from "../i18n/i18n";

const Page = styled.div`
  margin: 0 auto;
  padding: 20px 20px 40px;
  max-width: 1200px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button<{ $primary?: boolean; $danger?: boolean; $customer?: boolean; $business?: boolean }>`
  appearance: none;
  border: 1px solid ${(p) =>
    p.$danger ? "#dc2626" :
    p.$primary ? "#111111" :
    p.$customer ? "#3b82f6" :
    p.$business ? "#10b981" : "#e5e7eb"};
  background: ${(p) =>
    p.$danger ? "#dc2626" :
    p.$primary ? "#111111" :
    p.$customer ? "#3b82f6" :
    p.$business ? "#10b981" : "#ffffff"};
  color: ${(p) => (p.$danger || p.$primary || p.$customer || p.$business ? "#ffffff" : "#111827")};
  height: 40px;
  padding: 0 16px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.15s ease;
  &:hover {
    filter: brightness(0.98);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const Panel = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.2;
`;

const LangPicker = styled.div`
  position: relative;
`;

const LangButton = styled.button`
  appearance: none;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #111827;
  height: 36px;
  padding: 0 8px;
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover {
    background: #f9fafb;
  }
`;

const LangMenu = styled.div`
  position: absolute;
  right: 0;
  top: 42px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 200px;
  overflow: hidden;
  z-index: 10;
`;

const LangMenuItem = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #ffffff;
  border: 0;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
  transition: background-color 0.15s ease;
  &:hover {
    background: #f3f4f6;
  }
  &:first-child {
    border-radius: 12px 12px 0 0;
  }
  &:last-child {
    border-radius: 0 0 12px 12px;
  }
`;

const CustomerLangBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const ConversationArea = styled.div`
  height: 70vh;
  min-height: 500px;
  overflow-y: auto;
  padding: 16px;
  background: #fafafa;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
`;

const MessageItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
`;

const ProfileIcon = styled.div<{ $speaker: "customer" | "business" }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(p) => p.$speaker === "customer" ? "#3b82f6" : "#10b981"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
`;

const MessageContent = styled.div`
  flex: 1;
  background: #ffffff;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
`;

const OriginalText = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
  color: #111827;
  line-height: 1.4;
`;

const KoreanText = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-style: italic;
  line-height: 1.4;
  padding-top: 4px;
  border-top: 1px solid #f3f4f6;
`;

const RecordingButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

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

function useRecorderSpeech() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [supported, setSupported] = useState<boolean>(true);
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
          const apiUrl = import.meta.env.VITE_SAJU_API_URL || 'http://localhost:8000';
          const formData = new FormData();
          formData.append('audio_file', audioBlob, 'recording.webm');

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

          formData.append('target_language', targetLang);
          formData.append('source_language', sourceLang);

          const response = await fetch(`${apiUrl}/translate/audio`, {
            method: 'POST',
            body: formData,
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
                originalText: '[테스트] 음성 입력',
                koreanText: '[테스트] 음성이 정상적으로 입력되었습니다',
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
              originalText: '[오프라인] 음성 녹음 완료',
              koreanText: '[오프라인] 음성이 성공적으로 녹음되었습니다',
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

  const recorder = useRecorderSpeech();

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
      <Grid>
        {/* Left column: language settings */}
        <Panel>
          <PanelHeader>
            <PanelTitle>고객 언어 설정</PanelTitle>
          </PanelHeader>
          <CustomerLangBox>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
              고객 언어
            </div>
            {renderLangPicker()}
          </CustomerLangBox>
          {!recorder.supported && (
            <div
              style={{
                marginTop: 8,
                fontSize: 12,
                color: "#6b7280",
                lineHeight: 1.4,
              }}
            >
              {t("webSpeechNotSupported")}
            </div>
          )}
        </Panel>

        {/* Right column: conversation area */}
        <Panel>
          <PanelHeader>
            <PanelTitle>{t("liveTranslation")}</PanelTitle>
          </PanelHeader>

          <RecordingButtons>
            <Button
              onClick={handleCustomerRecord}
              $customer
              disabled={running}
            >
              {running && recorder.currentSpeaker === "customer"
                ? `${t("recording")} (${Math.ceil(10 - recorder.recordingTime)}s)`
                : "고객 음성"}
            </Button>
            <Button
              onClick={handleBusinessRecord}
              $business
              disabled={running}
            >
              {running && recorder.currentSpeaker === "business"
                ? `${t("recording")} (${Math.ceil(10 - recorder.recordingTime)}s)`
                : "업체 음성"}
            </Button>
            <Button onClick={recorder.stop} $danger disabled={!running}>
              {t("stop")}
            </Button>
          </RecordingButtons>

          <ConversationArea ref={conversationRef}>
            {recorder.messages.map((message) => (
              <MessageItem key={message.id}>
                <ProfileIcon $speaker={message.speaker}>
                  {message.speaker === "customer" ? "고" : "업"}
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
                  고
                </ProfileIcon>
                <MessageContent>
                  <OriginalText>{recorder.interim}</OriginalText>
                </MessageContent>
              </MessageItem>
            )}
          </ConversationArea>
        </Panel>
      </Grid>
    </Page>
  );
}