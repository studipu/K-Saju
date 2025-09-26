import { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { useI18n } from "../i18n/i18n";
import { useRealtimeAgent } from "../hooks/useRealtimeAgent";

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
  margin-bottom: 20px;

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

const TranslationPair = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(102, 126, 234, 0.1);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
    border-color: rgba(102, 126, 234, 0.3);
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(135deg, #4facfe, #00f2fe);
  }
`;

const PairHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(107, 114, 128, 0.1);
`;

const LanguageTag = styled.span<{ $isSource?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${props => props.$isSource
    ? 'linear-gradient(135deg, #e0e7ff, #c7d2fe)'
    : 'linear-gradient(135deg, #dcfce7, #bbf7d0)'};
  color: ${props => props.$isSource ? '#4338ca' : '#166534'};
  font-size: 12px;
  font-weight: 600;
  border-radius: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TranslationArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  color: white;
  font-size: 16px;
  margin: 0 8px;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.1); opacity: 1; }
  }
`;

const PairContent = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  align-items: center;
`;

const LanguageMessage = styled.div<{ $isSource?: boolean }>`
  padding: 16px 20px;
  background: ${props => props.$isSource
    ? 'linear-gradient(135deg, #f8fafc, #e8f2ff)'
    : 'linear-gradient(135deg, #f0fdf4, #ecfdf5)'};
  border: 2px solid ${props => props.$isSource
    ? 'rgba(79, 172, 254, 0.2)'
    : 'rgba(34, 197, 94, 0.2)'};
  border-radius: 16px;
  position: relative;
`;

const LanguageLabel = styled.div<{ $isSource?: boolean }>`
  font-size: 11px;
  font-weight: 700;
  color: ${props => props.$isSource ? '#4338ca' : '#166534'};
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 8px;
  opacity: 0.8;
`;

const MessageTextStyled = styled.div`
  font-weight: 500;
  color: #111827;
  line-height: 1.6;
  font-size: 16px;
`;

const ProfileIcon = styled.div<{ $speaker: "user" | "assistant" }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${(p) => p.$speaker === "user"
    ? "linear-gradient(135deg, #4facfe, #00f2fe)"
    : "linear-gradient(135deg, #43e97b, #38f9d7)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
  box-shadow: 0 8px 24px ${(p) => p.$speaker === "user"
    ? "rgba(79, 172, 254, 0.3)"
    : "rgba(67, 233, 123, 0.3)"};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 32px ${(p) => p.$speaker === "user"
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

const MessageText = styled.div`
  font-weight: 500;
  color: #111827;
  line-height: 1.5;
  font-size: 16px;
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

const StatusIndicator = styled.div<{ $isConnected: boolean; $isRecording: boolean; $isConnecting?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${(p) => {
    if (p.$isRecording) return "linear-gradient(135deg, #ff6b6b, #ff8e53)";
    if (p.$isConnecting) return "linear-gradient(135deg, #fbbf24, #f59e0b)";
    if (p.$isConnected) return "linear-gradient(135deg, #43e97b, #38f9d7)";
    return "linear-gradient(135deg, #e0e7ff, #c7d2fe)";
  }};
  border-radius: 25px;
  color: ${(p) => (p.$isRecording || p.$isConnected || p.$isConnecting) ? "white" : "#4338ca"};
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px ${(p) => {
    if (p.$isRecording) return "rgba(255, 107, 107, 0.3)";
    if (p.$isConnecting) return "rgba(251, 191, 36, 0.3)";
    if (p.$isConnected) return "rgba(67, 233, 123, 0.3)";
    return "rgba(67, 56, 202, 0.1)";
  }};
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
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  color: #b91c1c;
  padding: 12px 16px;
  border-radius: 8px;
  margin: 10px 0;
  font-size: 14px;
  text-align: center;
`;


type SpeechLang = "en-US" | "ko-KR" | "ja-JP" | "zh-CN" | "es-ES";

const LANG_OPTIONS: Array<{ code: SpeechLang; label: string; icon: string; name: string }> = [
  { code: "en-US", label: "English (US)", icon: "🇺🇸", name: "English" },
  { code: "ko-KR", label: "한국어", icon: "🇰🇷", name: "Korean" },
  { code: "zh-CN", label: "中文(简体)", icon: "🇨🇳", name: "Chinese" },
  { code: "ja-JP", label: "日本語", icon: "🇯🇵", name: "Japanese" },
  { code: "es-ES", label: "Español", icon: "🇪🇸", name: "Spanish" },
];

export default function LiveTranslation() {
  const { t } = useI18n();
  const conversationRef = useRef<HTMLDivElement | null>(null);
  const [customerLang, setCustomerLang] = useState<SpeechLang>("en-US");
  const [openLangMenu, setOpenLangMenu] = useState(false);

  // selectedLang 먼저 정의
  const selectedLang = LANG_OPTIONS.find(lang => lang.code === customerLang);

  const {
    isConnected,
    isRecording,
    messages,
    error,
    isConnecting,
    startRecording,
    stopRecording,
  } = useRealtimeAgent({
    customerLanguage: selectedLang?.name || 'English'
  });

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

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStartRecording = () => {
    if (!isRecording) {
      startRecording(); // 자동으로 연결도 처리됨
    } else {
      stopRecording();
    }
  };

  const renderLangPicker = () => (
    <LangPicker data-lang-picker>
      <LangButton
        onClick={() => setOpenLangMenu(!openLangMenu)}
        aria-haspopup="menu"
        aria-label="Language"
      >
        <span style={{ fontSize: 18 }}>
          {selectedLang?.icon}
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
        <SubTitle>OpenAI Agent SDK로 실시간 사주풀이 번역</SubTitle>
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


          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}

        </Panel>

        {/* Right column: conversation area */}
        <Panel>
          <PanelHeader>
            <PanelTitle>
              🗣️ {t("liveTranslation")}
            </PanelTitle>
          </PanelHeader>

          <StatusIndicator $isConnected={isConnected} $isRecording={isRecording} $isConnecting={isConnecting}>
            <WaveIcon $animate={isRecording || isConnecting} />
            {isRecording
              ? "🎤 음성 번역 중..."
              : isConnecting
                ? "🔄 번역기 연결 중..."
                : isConnected
                  ? "✅ 번역기 준비됨"
                  : "🎯 녹음 버튼을 눌러 시작하세요"}
          </StatusIndicator>

          <RecordingButtons>
            <Button
              onClick={handleStartRecording}
              $customer={!isRecording}
              $danger={isRecording}
              $recording={isRecording}
              disabled={isConnecting}
            >
              {isConnecting
                ? "🔄 연결 중..."
                : isRecording
                  ? "🛑 녹음 중지"
                  : "🎤 음성 번역하기"}
            </Button>
          </RecordingButtons>

          <ConversationArea ref={conversationRef}>
            {messages.length === 0 && (
              <div style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#6b7280",
                fontSize: "16px",
                lineHeight: 1.6
              }}>
                🎤 음성 버튼을 클릭하고 번역을 시작하세요<br/>
                <span style={{ fontSize: "14px" }}>
                  한국어나 {selectedLang?.name || 'English'}로 말씀하시면 즉시 번역해드립니다
                </span>
              </div>
            )}

            {messages.map((message, index) => {
              // Check if this is a user message followed by an assistant message (translation pair)
              const nextMessage = messages[index + 1];
              const isTranslationPair = message.role === 'user' && nextMessage?.role === 'assistant';

              if (isTranslationPair) {
                // Detect languages based on content
                const userIsKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(message.content);
                const assistantIsKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(nextMessage.content);

                const originalLang = userIsKorean ? 'Korean' : selectedLang?.name || 'English';
                const translatedLang = assistantIsKorean ? 'Korean' : selectedLang?.name || 'English';

                return (
                  <TranslationPair key={`pair-${message.id}`}>
                    <PairHeader>
                      <LanguageTag $isSource>
                        🔤 Original
                      </LanguageTag>
                      <TranslationArrow>→</TranslationArrow>
                      <LanguageTag>
                        🌍 Translation
                      </LanguageTag>
                    </PairHeader>

                    <PairContent>
                      <LanguageMessage $isSource>
                        <LanguageLabel $isSource>
                          {originalLang}
                        </LanguageLabel>
                        <MessageTextStyled>{message.content}</MessageTextStyled>
                      </LanguageMessage>

                      <TranslationArrow>↔</TranslationArrow>

                      <LanguageMessage>
                        <LanguageLabel>
                          {translatedLang}
                        </LanguageLabel>
                        <MessageTextStyled>{nextMessage.content}</MessageTextStyled>
                      </LanguageMessage>
                    </PairContent>
                  </TranslationPair>
                );
              }

              // Skip assistant messages that were already shown in pairs
              if (message.role === 'assistant' && messages[index - 1]?.role === 'user') {
                return null;
              }

              // Single message
              return (
                <MessageItem key={message.id}>
                  <ProfileIcon $speaker={message.role}>
                    {message.role === "user" ? "🗣️" : "🔄"}
                  </ProfileIcon>
                  <MessageContent>
                    <MessageText>{message.content}</MessageText>
                  </MessageContent>
                </MessageItem>
              );
            })}
          </ConversationArea>
        </Panel>
      </Grid>
    </Page>
  );
}