import { useEffect, useRef } from "react";
import { styled } from "styled-components";
import { useI18n } from "../i18n/i18n";
import { useRealtimeAgent } from "../hooks/useRealtimeAgent";
import { useUserProfile } from "../hooks/useUserProfile";

// ChatMessage 타입 정의 (useRealtimeAgent에서 가져옴)
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  type: 'text' | 'audio';
  isTranscription?: boolean;
  audioData?: ArrayBuffer;
}

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


const ProfileIcon = styled.div<{ $isKorean: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${(p) => p.$isKorean
    ? "linear-gradient(135deg, #8b5cf6, #a855f7)"
    : "linear-gradient(135deg, #4facfe, #00f2fe)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
  box-shadow: 0 8px 24px ${(p) => p.$isKorean
    ? "rgba(139, 92, 246, 0.3)"
    : "rgba(79, 172, 254, 0.3)"};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 32px ${(p) => p.$isKorean
      ? "rgba(139, 92, 246, 0.4)"
      : "rgba(79, 172, 254, 0.4)"};
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

const TranslationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PrimaryLanguage = styled.div`
  font-weight: 600;
  color: #111827;
  line-height: 1.5;
  font-size: 16px;
`;

const SecondaryLanguage = styled.div`
  font-weight: 400;
  color: #6b7280;
  line-height: 1.4;
  font-size: 14px;
  opacity: 0.7;
  font-style: italic;
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


// 언어별 국기 매핑
const LANGUAGE_ICONS: Record<string, string> = {
  "English": "🇺🇸",
  "Chinese": "🇨🇳",
  "Japanese": "🇯🇵",
  "Spanish": "🇪🇸",
};

export default function LiveTranslation() {
  const { t } = useI18n();
  const conversationRef = useRef<HTMLDivElement | null>(null);

  // 유저 프로필에서 country 기반으로 언어 설정 가져오기
  const { customerLanguage } = useUserProfile();

  const {
    isConnected,
    isRecording,
    messages,
    error,
    isConnecting,
    startRecording,
    stopRecording,
  } = useRealtimeAgent({
    customerLanguage: customerLanguage
  });


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


  return (
    <Page>
      <Header>
        <MainTitle>{t("liveTranslationTitle")}</MainTitle>
      </Header>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
                  ? `✅ 번역기 준비됨 (${customerLanguage} ↔ 한국어)`
                  : "🎯 녹음 버튼을 눌러 시작하세요"}
          </StatusIndicator>

          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}

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
                  한국어나 {customerLanguage}로 말씀하시면 즉시 번역해드립니다
                </span>
              </div>
            )}

{(() => {
              console.log('Processing messages:', messages.length);

              // 메시지를 쌍으로 그룹화하는 로직 개선
              const messageGroups: Array<{ user: ChatMessage; assistant?: ChatMessage; isComplete: boolean }> = [];
              const processedIndexes = new Set<number>();

              // 먼저 메시지를 timestamp 순으로 정렬
              const sortedMessages = [...messages].sort((a, b) => a.timestamp - b.timestamp);

              // 언어 감지 함수
              const isKorean = (text: string) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);

              // 언어 기반 스마트 매칭
              const findMatchingMessage = (currentMsg: ChatMessage, startIndex: number, direction: 'forward' | 'backward') => {
                const currentIsKorean = isKorean(currentMsg.content);
                const targetRole = currentMsg.role === 'user' ? 'assistant' : 'user';

                const searchRange = direction === 'forward'
                  ? Array.from({ length: Math.min(15, sortedMessages.length - startIndex - 1) }, (_, i) => startIndex + 1 + i)
                  : Array.from({ length: Math.min(15, startIndex) }, (_, i) => startIndex - 1 - i);

                let bestMatch = null;
                let fallbackMatch = null;

                for (const j of searchRange) {
                  if (j < 0 || j >= sortedMessages.length || processedIndexes.has(j)) continue;

                  const candidateMsg = sortedMessages[j];
                  if (candidateMsg.role !== targetRole) continue;

                  const candidateIsKorean = isKorean(candidateMsg.content);

                  // 우선순위 1: 언어가 다른 경우 (정상적인 번역 쌍)
                  if (currentIsKorean !== candidateIsKorean) {
                    bestMatch = { message: candidateMsg, index: j };
                    break; // 완벽한 매칭이므로 즉시 반환
                  }

                  // 우선순위 2: 같은 언어인 경우 (AI가 번역하지 않은 경우)
                  if (!fallbackMatch && currentIsKorean === candidateIsKorean) {
                    // 시간 차이가 5초 이내인 경우만 fallback으로 고려
                    const timeDiff = Math.abs(currentMsg.timestamp - candidateMsg.timestamp);
                    if (timeDiff <= 5000) { // 5초 이내
                      fallbackMatch = { message: candidateMsg, index: j };
                    }
                  }
                }

                return bestMatch || fallbackMatch;
              };

              for (let i = 0; i < sortedMessages.length; i++) {
                if (processedIndexes.has(i)) continue;

                const message = sortedMessages[i];

                if (message.role === 'user') {
                  // 사용자 메시지에 대응하는 assistant 메시지를 찾음
                  const match = findMatchingMessage(message, i, 'forward');

                  if (match) {
                    processedIndexes.add(match.index);
                    messageGroups.push({
                      user: message,
                      assistant: match.message,
                      isComplete: true
                    });
                  } else {
                    messageGroups.push({
                      user: message,
                      assistant: undefined,
                      isComplete: false
                    });
                  }
                  processedIndexes.add(i);
                } else if (message.role === 'assistant') {
                  // assistant 메시지에 대응하는 user 메시지를 찾음
                  const match = findMatchingMessage(message, i, 'backward');

                  if (match) {
                    processedIndexes.add(match.index);
                    messageGroups.push({
                      user: match.message,
                      assistant: message,
                      isComplete: true
                    });
                    processedIndexes.add(i);
                  } else {
                    // 앞뒤로 검색해서 매칭 시도
                    const forwardMatch = findMatchingMessage(message, i, 'forward');

                    if (forwardMatch) {
                      processedIndexes.add(forwardMatch.index);
                      messageGroups.push({
                        user: forwardMatch.message,
                        assistant: message,
                        isComplete: true
                      });
                      processedIndexes.add(i);
                    } else {
                      // 정말로 고아가 된 assistant 메시지
                      console.warn('Orphaned assistant message:', message.content);
                      messageGroups.push({
                        user: message as any,
                        assistant: undefined,
                        isComplete: false
                      });
                      processedIndexes.add(i);
                    }
                  }
                }
              }

              console.log('Message groups created:', messageGroups.length);

              // 그룹을 timestamp 순으로 정렬
              const sortedGroups = messageGroups.sort((a, b) => a.user.timestamp - b.user.timestamp);

              return sortedGroups.map((group, groupIndex) => {
                if (group.isComplete && group.assistant) {
                  // 완전한 번역 쌍
                  const userMessage = group.user;
                  const assistantMessage = group.assistant;

                  // 입력한 언어 감지 (사용자가 실제로 입력한 언어)
                  const userIsKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(userMessage.content);
                  const assistantIsKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(assistantMessage.content);

                  // 메시지 쌍에서 한국어와 고객 언어 분리
                  let customerText = '';
                  let koreanText = '';
                  let inputLanguageIcon = '';

                  // 정상적인 번역 쌍인지 확인
                  const isProperTranslation = userIsKorean !== assistantIsKorean;

                  if (isProperTranslation) {
                    // 정상적인 번역 쌍 처리
                    if (userIsKorean) {
                      // 사용자가 한국어로 입력 → AI가 고객 언어로 번역
                      koreanText = userMessage.content;        // 입력: 한국어
                      customerText = assistantMessage.content; // 번역: 고객 언어
                      inputLanguageIcon = "🇰🇷";             // 한국어로 입력했음을 표시
                    } else {
                      // 사용자가 고객 언어로 입력 → AI가 한국어로 번역
                      customerText = userMessage.content;      // 입력: 고객 언어
                      koreanText = assistantMessage.content;   // 번역: 한국어
                      inputLanguageIcon = LANGUAGE_ICONS[customerLanguage] || "🇺🇸"; // 고객 언어로 입력했음을 표시
                    }
                  } else {
                    // AI가 같은 언어로 응답한 경우 (번역 실패)
                    if (userIsKorean) {
                      // 둘 다 한국어인 경우
                      koreanText = userMessage.content;
                      customerText = `[번역 필요: ${assistantMessage.content}]`; // 번역되지 않았음을 표시
                      inputLanguageIcon = "🇰🇷";
                    } else {
                      // 둘 다 고객 언어인 경우
                      customerText = userMessage.content;
                      koreanText = `[번역 필요: ${assistantMessage.content}]`; // 번역되지 않았음을 표시
                      inputLanguageIcon = LANGUAGE_ICONS[customerLanguage] || "🇺🇸";
                    }
                  }

                  console.log(`Group ${groupIndex}: User(${userIsKorean ? 'KR' : 'EN'}): "${userMessage.content}" → AI: "${assistantMessage.content}"`);

                  return (
                    <MessageItem key={`group-${groupIndex}`}>
                      <ProfileIcon $isKorean={userIsKorean}>
                        {inputLanguageIcon}
                      </ProfileIcon>
                      <MessageContent>
                        <TranslationContainer>
                          <PrimaryLanguage>{customerText}</PrimaryLanguage>
                          <SecondaryLanguage>{koreanText}</SecondaryLanguage>
                        </TranslationContainer>
                      </MessageContent>
                    </MessageItem>
                  );
                } else {
                  // 불완전한 메시지 (번역이 아직 진행 중이거나 오류)
                  const message = group.user;
                  const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(message.content);

                  console.warn(`Incomplete group ${groupIndex}: "${message.content}" (role: ${message.role})`);

                  return (
                    <MessageItem key={`incomplete-${groupIndex}`}>
                      <ProfileIcon $isKorean={isKorean}>
                        {message.role === "user"
                          ? (isKorean ? "🇰🇷" : (LANGUAGE_ICONS[customerLanguage] || "🇺🇸"))
                          : "🔄"}
                      </ProfileIcon>
                      <MessageContent>
                        <MessageText>
                          {message.content}
                          {!group.isComplete && message.role === 'user' && (
                            <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
                              번역 중...
                            </div>
                          )}
                        </MessageText>
                      </MessageContent>
                    </MessageItem>
                  );
                }
              });
            })()}
          </ConversationArea>
        </Panel>
      </div>
    </Page>
  );
}