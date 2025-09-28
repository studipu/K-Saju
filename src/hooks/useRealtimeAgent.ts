import { useEffect, useRef, useState, useCallback } from 'react';
import { RealtimeAgent, RealtimeSession, OpenAIRealtimeWebSocket } from '@openai/agents/realtime';

interface RealtimeAgentConfig {
  customerLanguage?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  type: 'text' | 'audio';
}

export function useRealtimeAgent({ customerLanguage = 'English' }: RealtimeAgentConfig) {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [currentUserTranscript, setCurrentUserTranscript] = useState('');
  const [currentAssistantTranscript, setCurrentAssistantTranscript] = useState('');
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const sessionRef = useRef<RealtimeSession | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const playbackAudioContextRef = useRef<AudioContext | null>(null);
  const audioChunksRef = useRef<ArrayBuffer[]>([]);
  const isPlayingAudioRef = useRef<boolean>(false);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const scheduledSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  // 번역 에이전트 생성
  const createAgent = useCallback(() => {
    const isEnglish = customerLanguage === 'English';
    const isKoreanInput = true; // 기본적으로 한국어 입력으로 가정

    // customerLanguage에 따른 전문 프롬프트 생성
    const getTranslationInstructions = () => {
      // 언어별 용어집 매핑
      const getSajuTerms = (targetLang: string) => {
        if (targetLang === 'English') {
          return `SAJU TERMINOLOGY (Korean ↔ English):
사주 = Four Pillars, 명리 = destiny analysis, 운세 = fortune
재운 = financial luck, 연애운 = love fortune, 건강운 = health fortune
궁합 = compatibility, 오행 = Five Elements, 천간 = Heavenly Stems
지지 = Earthly Branches, 대운 = major fortune period, 년운 = yearly fortune
월운 = monthly fortune, 일운 = daily fortune, 신살 = spiritual influences`;
        } else if (targetLang === 'Chinese') {
          return `SAJU TERMINOLOGY (Korean ↔ Chinese):
사주 = 四柱, 명리 = 命理, 운세 = 運勢
재운 = 財運, 연애운 = 戀愛運, 건강운 = 健康運
궁합 = 合婚, 오행 = 五行, 천간 = 天干
지지 = 地支, 대운 = 大運, 년운 = 年運`;
        } else {
          return `SAJU BASIC TERMS:
사주 = Four Pillars, 운세 = fortune, 재운 = wealth luck
연애운 = love fortune, 건강운 = health fortune, 궁합 = compatibility`;
        }
      };

      // 예시 생성
      const getExamples = (targetLang: string) => {
        if (targetLang === 'English') {
          return `EXAMPLES:
Input: "안녕하세요" → Output: "Hello"
Input: "How are you?" → Output: "어떻게 지내세요?"
Input: "오늘 운세 좀 봐주세요" → Output: "Please look at today's fortune"
Input: "What is my luck today?" → Output: "오늘 제 운은 어떤가요?"`;
        } else if (targetLang === 'Chinese') {
          return `EXAMPLES:
Input: "안녕하세요" → Output: "您好"
Input: "你好" → Output: "안녕하세요"
Input: "오늘 운세 좀 봐주세요" → Output: "請看看今天的運勢"
Input: "今天運氣怎麼樣？" → Output: "오늘 운세는 어떤가요?"`;
        } else {
          return `EXAMPLES:
Input: "안녕하세요" → Output: "Hello" (in ${targetLang})
Input: "${targetLang} greeting" → Output: "안녕하세요"`;
        }
      };

      return `STRICT TRANSLATION MODE ONLY - NO CONVERSATIONS ALLOWED

You are a translation machine specialized in Saju (Four Pillars) fortune-telling. You MUST translate every single input without exception.

MANDATORY RULES - NEVER BREAK THESE:
1. Korean input → ALWAYS translate to ${customerLanguage}
2. ANY non-Korean input (${customerLanguage}, English, Chinese, Japanese, etc.) → ALWAYS translate to Korean ONLY
3. NEVER answer questions, NEVER have conversations
4. NEVER say things like "I can help you", "What would you like", etc.
5. ONLY output the direct translation, nothing else

VOICE & TONE GUIDELINES:
- Speak with a calm, mystical, and wise tone appropriate for fortune-telling
- Use a gentle, soothing pace that conveys spiritual insight
- Maintain respectful formality when translating fortune-telling content
- Preserve the mystical atmosphere in your voice delivery

DETECTION & TRANSLATION RULES:
- If input sounds Korean → translate to ${customerLanguage} immediately
- If input sounds like ANY other language → translate to Korean ONLY
- This includes ${customerLanguage}, English, Chinese, Japanese, and all other languages
- ALL non-Korean languages must become Korean
- NEVER ask for clarification, just translate

${getSajuTerms(customerLanguage)}

TRANSLATION EXAMPLES:
Korean → ${customerLanguage}:
Input: "안녕하세요" → Output: ${customerLanguage === 'English' ? '"Hello"' : customerLanguage === 'Chinese' ? '"您好"' : `"Hello" (in ${customerLanguage})`}
Input: "오늘 운세 좀 봐주세요" → Output: ${customerLanguage === 'English' ? '"Please look at today\'s fortune"' : customerLanguage === 'Chinese' ? '"請看看今天的運勢"' : `"Please look at today's fortune" (in ${customerLanguage})`}

ANY Language → Korean:
Input: "Hello" → Output: "안녕하세요"
Input: "How are you?" → Output: "어떻게 지내세요?"
Input: "What is my luck?" → Output: "제 운은 어떤가요?"
${customerLanguage === 'Chinese' ? `Input: "你好" → Output: "안녕하세요"
Input: "今天運氣怎麼樣？" → Output: "오늘 운세는 어떤가요?"` : ''}

ABSOLUTELY FORBIDDEN:
- Answering questions instead of translating
- Having conversations or giving advice
- Asking "What can I help you with?"
- Explaining what you are or what you do
- ANY response that is not a direct translation

YOU ARE A TRANSLATION MACHINE ONLY. TRANSLATE EVERYTHING.
KOREAN → ${customerLanguage.toUpperCase()} | ALL OTHER LANGUAGES → KOREAN
SPEAK WITH MYSTICAL, WISE TONE FOR SAJU TRANSLATIONS.`;
    };

    return new RealtimeAgent({
      name: 'Professional Saju Translator',
      instructions: getTranslationInstructions(),
    });
  }, [customerLanguage]);

  // 세션 연결
  const connect = useCallback(async () => {
    if (isConnected || isConnecting) return;

    setIsConnecting(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file');
      }

      const agent = createAgent();

      // WebSocket transport with useInsecureApiKey option
      const transport = new OpenAIRealtimeWebSocket({
        useInsecureApiKey: true
      });

      const session = new RealtimeSession(agent, {
        model: 'gpt-4o-realtime-preview-2024-10-01',
        transport,
        config: {
          inputAudioFormat: 'pcm16',
          outputAudioFormat: 'pcm16',
          voice: 'coral', // 사주풀이에 적합한 따뜻하고 차분한 여성 목소리
          inputAudioTranscription: {
            model: 'whisper-1'
          },
          outputAudioTranscription: {
            enabled: true
          },
          turnDetection: {
            type: 'server_vad',
            threshold: 0.1, // 더 민감하게 설정
            prefixPaddingMs: 200, // 짧게
            silenceDurationMs: 500, // 더 빠르게 응답
          },
          // 말하기 속도와 톤 조절 (가능한 경우)
          maxResponseOutputTokens: 150, // 간결한 번역을 위해 토큰 제한
        },
      });

      // PCM16을 WAV로 변환하는 함수
      const pcm16ToWav = (pcm16Data: ArrayBuffer, sampleRate: number = 24000) => {
        const buffer = new ArrayBuffer(44 + pcm16Data.byteLength);
        const view = new DataView(buffer);

        // WAV 헤더 작성
        const writeString = (offset: number, string: string) => {
          for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
          }
        };

        writeString(0, 'RIFF');
        view.setUint32(4, 36 + pcm16Data.byteLength, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true); // Sub-chunk size
        view.setUint16(20, 1, true); // Audio format (PCM)
        view.setUint16(22, 1, true); // Number of channels (mono)
        view.setUint32(24, sampleRate, true); // Sample rate
        view.setUint32(28, sampleRate * 2, true); // Byte rate
        view.setUint16(32, 2, true); // Block align
        view.setUint16(34, 16, true); // Bits per sample
        writeString(36, 'data');
        view.setUint32(40, pcm16Data.byteLength, true);

        // PCM16 데이터 복사
        const pcm16View = new Int16Array(pcm16Data);
        const wavView = new Int16Array(buffer, 44);
        wavView.set(pcm16View);

        return buffer;
      };

      // 오디오 재생을 위한 AudioContext 생성
      const createPlaybackContext = () => {
        if (!playbackAudioContextRef.current) {
          playbackAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return playbackAudioContextRef.current;
      };

      // 연속적인 오디오 스케줄링 함수
      const scheduleAudioChunk = async (pcm16Data: ArrayBuffer) => {
        try {
          const audioContext = createPlaybackContext();

          // PCM16 데이터를 AudioBuffer로 변환
          const audioBuffer = audioContext.createBuffer(1, pcm16Data.byteLength / 2, 24000);
          const channelData = audioBuffer.getChannelData(0);
          const int16Array = new Int16Array(pcm16Data);

          // Int16을 Float32로 변환하고 80% 속도 적용
          for (let i = 0; i < int16Array.length; i++) {
            channelData[i] = int16Array[i] / 32767.0;
          }

          // AudioBufferSourceNode 생성
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);

          // 시작 시간 계산 - 이전 청크의 끝에 이어서 재생
          const currentTime = audioContext.currentTime;
          const startTime = Math.max(currentTime, nextStartTimeRef.current);

          // 다음 청크의 시작 시간을 설정 (정상 속도)
          const chunkDuration = audioBuffer.duration; // 정상 속도로 재생시 실제 소요 시간
          nextStartTimeRef.current = startTime + chunkDuration;

          // 첫 번째 청크가 아니라면 약간의 오버랩을 추가해서 끊김 방지
          const actualStartTime = scheduledSourcesRef.current.length > 0 ?
            startTime - 0.01 : // 10ms 오버랩
            startTime;

          scheduledSourcesRef.current.push(source);

          source.onended = () => {
            console.log('✅ Audio chunk finished');
            // 완료된 source를 배열에서 제거
            const index = scheduledSourcesRef.current.indexOf(source);
            if (index > -1) {
              scheduledSourcesRef.current.splice(index, 1);
            }
          };

          source.playbackRate.value = 1.0; // 정상 속도
          source.start(actualStartTime);

          console.log(`✅ Audio chunk scheduled at ${actualStartTime.toFixed(3)}s, duration: ${chunkDuration.toFixed(3)}s`);

        } catch (error) {
          console.error('❌ Audio scheduling failed:', error);
        }
      };

      // 오디오 이벤트 처리 - 연속 스트리밍 + 임시 전사 메시지 추가
      session.on('audio', (audioEvent) => {
        console.log('🔊 Audio event received from Agent SDK:', audioEvent);
        if (audioEvent && audioEvent.data) {
          console.log('🎵 Scheduling audio chunk, size:', audioEvent.data.byteLength);
          scheduleAudioChunk(audioEvent.data);

          // AI가 응답을 시작했다면 임시 메시지 추가
          if (!currentAssistantTranscript) {
            console.log('🤖 AI started speaking, adding placeholder message');
            const assistantMessage: ChatMessage = {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: '[AI가 응답 중...]',
              timestamp: Date.now(),
              type: 'audio'
            };
            setMessages(prev => {
              // 이미 placeholder가 있는지 확인
              const hasPlaceholder = prev.some(msg =>
                msg.role === 'assistant' && msg.content === '[AI가 응답 중...]'
              );
              if (!hasPlaceholder) {
                return [...prev, assistantMessage];
              }
              return prev;
            });
            setCurrentAssistantTranscript('[AI가 응답 중...]');
          }
        } else {
          console.log('⚠️ No audio data in event');
        }
      });

      // 오디오 중단 처리 - 모든 스케줄된 청크 중지
      session.on('audio_interrupted', () => {
        console.log('🛑 Audio interrupted - stopping all scheduled chunks');

        // 모든 스케줄된 오디오 소스 중지
        scheduledSourcesRef.current.forEach(source => {
          try {
            source.stop();
          } catch (error) {
            // 이미 중지된 소스일 수 있음
          }
        });

        // 참조 초기화
        scheduledSourcesRef.current = [];
        nextStartTimeRef.current = 0;

        // AI 응답 완료 처리 - 실제 번역된 내용으로 추정
        console.log('🤖 AI response completed, updating placeholder message');
        setMessages(prev => {
          return prev.map(msg => {
            if (msg.role === 'assistant' && msg.content === '[AI가 응답 중...]') {
              // 사용자의 마지막 입력을 기반으로 번역 내용 추정
              const lastUserMessage = prev.filter(m => m.role === 'user').pop();
              let translatedContent = `${customerLanguage} 번역 완료`;

              if (lastUserMessage && lastUserMessage.content !== '[사용자 음성 입력 중...]') {
                // 간단한 번역 예시 (실제 번역이 아닌 표시용)
                if (customerLanguage === 'English') {
                  translatedContent = `"${lastUserMessage.content}"의 영어 번역이 음성으로 재생되었습니다`;
                } else if (customerLanguage === 'Chinese') {
                  translatedContent = `"${lastUserMessage.content}"의 중국어 번역이 음성으로 재생되었습니다`;
                } else {
                  translatedContent = `"${lastUserMessage.content}"의 ${customerLanguage} 번역이 음성으로 재생되었습니다`;
                }
              }

              return {
                ...msg,
                content: translatedContent,
                timestamp: Date.now()
              };
            }
            return msg;
          });
        });
        setCurrentAssistantTranscript('');

        console.log('✅ All audio sources stopped');
      });

      // 사용자 음성 입력 전사 완료 이벤트 처리 (올바른 이벤트명)
      session.on('conversation.item.input_audio_transcription.completed', (event: any) => {
        console.log('🎤 User audio transcription completed:', JSON.stringify(event, null, 2));
        if (event && event.transcript && event.transcript.trim()) {
          const userMessage: ChatMessage = {
            id: `user-${Date.now()}-${Math.random()}`,
            role: 'user',
            content: event.transcript.trim(),
            timestamp: Date.now(),
            type: 'audio'
          };
          console.log('💬 Adding user transcription to chat:', userMessage);
          setMessages(prev => {
            console.log('📊 Current messages before adding user:', prev.length);
            // 중복 방지: 같은 내용의 메시지가 이미 있는지 확인
            const isDuplicate = prev.some(msg =>
              msg.role === 'user' &&
              msg.content === userMessage.content &&
              Math.abs(msg.timestamp - userMessage.timestamp) < 2000 // 2초 내
            );
            if (isDuplicate) {
              console.log('💬 Duplicate user message, skipping');
              return prev;
            }
            const newMessages = [...prev, userMessage];
            console.log('📊 New messages after adding user:', newMessages.length);
            return newMessages;
          });
        } else {
          console.log('⚠️ No valid transcript in user audio event:', event);
        }
      });

      // AI 응답 텍스트 실시간 처리 - response.output_text.delta로 토큰 단위 수신

      // 기존 output_text 이벤트 제거 - rawEvent로 대체됨

      // rawEvent 사용으로 RealtimeAgent의 이벤트 스트림 처리
      let rawCurrentAssistantMessageId: string | undefined;
      let assistantTextBuffer = "";

      // 실제 이벤트 구조 디버깅 및 올바른 이벤트 처리
      console.log('🔍 모든 이벤트 디버깅 시작');

      // 사용 가능한 모든 이벤트 타입들을 리스닝
      const allEventTypes = [
        'response.output_text.delta',
        'response.output_text.done',
        'response.text.delta',
        'response.text.done',
        'response.audio_transcript.delta',
        'response.audio_transcript.done',
        'response.content_part.added',
        'response.content_part.done',
        'conversation.item.created',
        'response.created',
        'response.done',
        'conversation.item.input_audio_transcription.completed',
        'conversation.item.input_audio_transcription.failed'
      ];

      allEventTypes.forEach(eventType => {
        session.on(eventType as any, (event: any) => {
          console.log(`🔔 이벤트 수신: ${eventType}`, event);

          // AI 응답 텍스트 델타 처리
          if (eventType === 'response.output_text.delta' || eventType === 'response.text.delta') {
            if (event && event.delta) {
              console.log('✅ 텍스트 델타 처리:', event.delta);
              assistantTextBuffer += event.delta;
              rawCurrentAssistantMessageId = addOrUpdateAssistantMessage(assistantTextBuffer, rawCurrentAssistantMessageId);
            }
          }

          // AI 응답 오디오 전사 델타 처리 (대안)
          if (eventType === 'response.audio_transcript.delta') {
            if (event && event.delta) {
              console.log('✅ 오디오 전사 델타 처리:', event.delta);
              assistantTextBuffer += event.delta;
              rawCurrentAssistantMessageId = addOrUpdateAssistantMessage(assistantTextBuffer, rawCurrentAssistantMessageId);
            }
          }

          // 응답 완료 처리
          if (eventType === 'response.done' || eventType === 'response.output_text.done' || eventType === 'response.audio_transcript.done') {
            console.log('✅ 응답 완료 처리');
            assistantTextBuffer = "";
            rawCurrentAssistantMessageId = undefined;
            setCurrentAssistantTranscript('');
          }

          // 사용자 음성 전사 처리
          if (eventType === 'conversation.item.input_audio_transcription.completed') {
            if (event && event.transcript && event.transcript.trim()) {
              console.log('✅ 사용자 전사 처리:', event.transcript);
              const userMessage: ChatMessage = {
                id: `user-${Date.now()}-${Math.random()}`,
                role: 'user',
                content: event.transcript.trim(),
                timestamp: Date.now(),
                type: 'audio'
              };
              setMessages(prev => {
                const withoutPlaceholder = prev.filter(msg =>
                  !(msg.role === 'user' && msg.content === '[사용자 음성 입력 중...]')
                );
                return [...withoutPlaceholder, userMessage];
              });
            }
          }
        });
      });

      // 추가적으로 rawEvent도 시도
      if (typeof (session as any).on === 'function') {
        try {
          (session as any).on('rawEvent', (event: any) => {
            console.log('🔍 rawEvent 발견:', event.type, event);
          });
        } catch (e) {
          console.log('🔍 rawEvent 지원되지 않음');
        }
      }

      // 도우미 함수: assistant 메시지 추가/업데이트 (타자치는 효과)
      const addOrUpdateAssistantMessage = (content: string, messageId?: string): string => {
        let newMessageId = messageId;

        console.log('📝 메시지 업데이트:', { content, messageId });

        setMessages(prev => {
          console.log('📊 현재 메시지 개수:', prev.length);

          // placeholder를 찾아서 교체하거나 기존 메시지 업데이트
          const placeholderIndex = prev.findIndex(msg =>
            msg.role === 'assistant' &&
            (msg.content === '[AI가 응답 중...]' || msg.id === messageId)
          );

          if (placeholderIndex !== -1) {
            console.log('✅ placeholder/기존 메시지 업데이트:', placeholderIndex);
            // 기존 메시지 업데이트
            const updatedMessage = {
              ...prev[placeholderIndex],
              content: content,
              timestamp: Date.now()
            };
            newMessageId = updatedMessage.id;
            return [
              ...prev.slice(0, placeholderIndex),
              updatedMessage,
              ...prev.slice(placeholderIndex + 1)
            ];
          } else {
            console.log('✅ 새 assistant 메시지 생성');
            // 새 메시지 생성
            const assistantMessage: ChatMessage = {
              id: `assistant-${Date.now()}-${Math.random()}`,
              role: 'assistant',
              content: content,
              timestamp: Date.now(),
              type: 'audio'
            };
            newMessageId = assistantMessage.id;
            const newMessages = [...prev, assistantMessage];
            console.log('📊 새 메시지 추가 후 개수:', newMessages.length);
            return newMessages;
          }
        });

        return newMessageId || `assistant-${Date.now()}-${Math.random()}`;
      };

      // 모든 이벤트 리스너들
      session.on('audio_interrupted', () => {
        console.log('🛑 Audio interrupted');
      });

      session.on('error', (error) => {
        console.error('❌ Session error:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        if (error && typeof error === 'object' && 'error' in error) {
          console.error('❌ Inner error:', (error as any).error);
        }
        setError('세션 오류: ' + (error && typeof error === 'object' && 'message' in error ? (error as any).message : JSON.stringify(error)));
      });

      // history_updated 이벤트로 확실하게 메시지 받기
      session.on('history_updated', (history: any[]) => {
        console.log('📝 History updated from Agent SDK:', history.length, 'items');
        const newMessages: ChatMessage[] = [];

        for (const item of history) {
          console.log('📋 Processing history item:', item.type, item);

          if (item.type === 'message' && item.role && item.content) {
            const content = Array.isArray(item.content)
              ? item.content.map((c: any) => c.type === 'text' ? c.text : '').join('')
              : item.content || '';

            if (typeof content === 'string' && content.trim()) {
              const message: ChatMessage = {
                id: `${item.role}-${Date.now()}-${Math.random()}`,
                role: item.role,
                content: content.trim(),
                timestamp: Date.now(),
                type: 'audio'
              };

              console.log('💬 Adding message to history:', message);
              newMessages.push(message);
            }
          }
        }

        console.log('📨 Setting messages:', newMessages.length, 'total messages');
        setMessages(newMessages);
      });

      // 모든 가능한 이벤트들 리스닝
      const eventTypes = [
        'connected', 'disconnected', 'response',
        'input_audio_buffer.speech_started', 'input_audio_buffer.speech_stopped',
        'input_audio_buffer.committed', 'conversation.item.created',
        'response.created', 'response.done', 'response.output_item.added',
        'response.content_part.added', 'response.audio_transcript.done',
        'response.audio_transcript.delta',
        'session.created', 'session.updated',
        'conversation.item.input_audio_transcription.completed',
        'history_updated'
      ];
      eventTypes.forEach(eventType => {
        session.on(eventType as any, (...args: any[]) => {
          console.log(`🔔 Event: ${eventType}`, args);
        });
      });

      // 연결 (transport에서 이미 useInsecureApiKey 설정됨)
      await session.connect({ apiKey });
      sessionRef.current = session;
      setIsConnected(true);
      console.log('✅ Agent connected successfully');

    } catch (err) {
      console.error('❌ Connection failed:', err);
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  }, [createAgent, isConnected, isConnecting]);

  // Web Speech API 설정
  const setupSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.log('⚠️ Speech Recognition not supported');
      return null;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ko-KR'; // 한국어 설정

    recognition.onstart = () => {
      console.log('🎤 Speech recognition started');
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      console.log('🎤 Speech result:', { final: finalTranscript, interim: interimTranscript });

      if (finalTranscript) {
        // 최종 결과를 채팅에 추가
        const userMessage: ChatMessage = {
          id: `user-${Date.now()}-${Math.random()}`,
          role: 'user',
          content: finalTranscript.trim(),
          timestamp: Date.now(),
          type: 'audio'
        };

        setMessages(prev => {
          // placeholder 메시지를 실제 전사로 교체
          const withoutPlaceholder = prev.filter(msg =>
            !(msg.role === 'user' && msg.content === '[사용자 음성 입력 중...]')
          );
          return [...withoutPlaceholder, userMessage];
        });

        setCurrentUserTranscript(finalTranscript);
        setIsUserSpeaking(false);
      } else if (interimTranscript) {
        // 임시 결과로 placeholder 업데이트
        setMessages(prev => {
          return prev.map(msg => {
            if (msg.role === 'user' && msg.content === '[사용자 음성 입력 중...]') {
              return { ...msg, content: `🎤 ${interimTranscript}` };
            }
            return msg;
          });
        });
      }
    };

    recognition.onerror = (event: any) => {
      console.error('❌ Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      console.log('🎤 Speech recognition ended');
    };

    return recognition;
  }, []);

  // 음성 녹음 시작 (연속 모드)
  const startRecording = useCallback(async () => {
    if (isRecording) {
      console.log('⚠️ Already recording, ignoring start request');
      return;
    }

    setError(null); // 이전 오류 초기화

    try {
      // 연결되지 않은 경우 먼저 연결
      if (!isConnected) {
        console.log('🔄 Connecting to Agent SDK...');
        await connect();

        // 세션이 완전히 준비될 때까지 기다림
        let attempts = 0;
        while (!sessionRef.current && attempts < 30) { // 최대 3초 대기
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (!sessionRef.current) {
          throw new Error('Session failed to initialize after connection');
        }

        console.log('✅ Session ready for recording');
      }

      if (!sessionRef.current) {
        throw new Error('Session not ready - please try again');
      }

      // 마이크 테스트 먼저 수행
      console.log('🎤 Testing microphone access...');
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API not supported in this browser');
      }

      // 사용 가능한 오디오 장치 확인
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      console.log('🎤 Available audio input devices:', audioInputs.length, audioInputs);

      if (audioInputs.length === 0) {
        throw new Error('No audio input devices found');
      }

      // 마이크 권한 요청 및 스트림 획득
      console.log('🎤 Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false, // Agent SDK에서 직접 처리
        }
      });

      console.log('✅ Microphone access granted');
      console.log('🎤 Stream details:', {
        active: stream.active,
        tracks: stream.getTracks().length,
        audioTracks: stream.getAudioTracks().map(track => ({
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState,
          label: track.label
        }))
      });

      streamRef.current = stream;

      // AudioContext 생성 (24kHz로 설정)
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000
      });
      audioContextRef.current = audioContext;

      console.log('🔧 AudioContext created:', {
        state: audioContext.state,
        sampleRate: audioContext.sampleRate,
        currentTime: audioContext.currentTime
      });

      // AudioContext가 suspended 상태라면 resume
      if (audioContext.state === 'suspended') {
        console.log('🔧 AudioContext is suspended, resuming...');
        await audioContext.resume();
        console.log('✅ AudioContext resumed, state:', audioContext.state);
      }

      try {
        console.log('🔧 Loading AudioWorklet module...');
        await audioContext.audioWorklet.addModule('/audio-processor.js');
        console.log('✅ AudioWorklet module loaded');

        // 마이크 입력을 AudioContext에 연결
        const source = audioContext.createMediaStreamSource(stream);
        console.log('✅ MediaStreamSource created');

        // AudioWorkletNode 생성
        console.log('🔧 Creating AudioWorkletNode...');
        const workletNode = new AudioWorkletNode(audioContext, 'pcm16-processor');
        workletNodeRef.current = workletNode;
        console.log('✅ AudioWorkletNode created');

        // 워크렛에서 오는 오디오 데이터 처리
        console.log('🔧 Setting up workletNode.port.onmessage handler...');
        workletNode.port.onmessage = (event) => {
          if (event.data.type === 'audioData' && sessionRef.current) {
            const { buffer, level, samples, count } = event.data;

            // 첫 번째 오디오 데이터 수신 시 알림
            if (count === 1) {
              console.log('🎉 First audio data received from AudioWorklet!');
            }

            // 사용자 음성 감지 및 placeholder 메시지 추가
            const significantAudio = level > 0.02; // 2% 이상
            if (significantAudio && !isUserSpeaking) {
              console.log('🎤 User started speaking, adding placeholder message');
              setIsUserSpeaking(true);
              const userMessage: ChatMessage = {
                id: `user-${Date.now()}`,
                role: 'user',
                content: '[사용자 음성 입력 중...]',
                timestamp: Date.now(),
                type: 'audio'
              };
              setMessages(prev => {
                // 이미 placeholder가 있는지 확인
                const hasPlaceholder = prev.some(msg =>
                  msg.role === 'user' && msg.content === '[사용자 음성 입력 중...]'
                );
                if (!hasPlaceholder) {
                  return [...prev, userMessage];
                }
                return prev;
              });
              setCurrentUserTranscript('[사용자 음성 입력 중...]');
            }

            // 음성이 약해지면 사용자 발화 종료로 간주
            if (!significantAudio && isUserSpeaking && count % 50 === 0) {
              console.log('🎤 User might have stopped speaking (low level detected)');
              // 2초 후에 placeholder 제거하도록 지연
              setTimeout(() => {
                setIsUserSpeaking(false);
                setCurrentUserTranscript('');
              }, 2000);
            }

            // 오디오 레벨 로깅 (매 50번째마다 - 더 자주 표시)
            if (count % 50 === 0) {
              console.log('🔊 Audio level:', (level * 100).toFixed(1) + '%', 'samples:', samples, 'count:', count);
            }

            // 오디오가 너무 작으면 경고
            if (level < 0.001 && count % 100 === 0) {
              console.warn('⚠️ Very low audio level detected. Check microphone volume.');
            }

            // 유의미한 오디오 레벨이 있을 때만 상세 로깅
            if (level > 0.01) {
              console.log('🎤 Sending PCM16 audio:', buffer.byteLength, 'bytes', 'level:', (level * 100).toFixed(1) + '%');
            }

            try {
              // Agent SDK가 기대하는 형식으로 전송
              sessionRef.current.sendAudio(buffer);

              // 전송 통계 추적
              if (count === 1) {
                console.log('📡 Started sending audio to Agent SDK');
              }

              if (level > 0.01) { // 유의미한 오디오만 성공 로그
                console.log('✅ PCM16 audio sent successfully, level:', (level * 100).toFixed(1) + '%', 'count:', count);
              }

              // 매 100번째마다 전송 상태 확인
              if (count % 100 === 0) {
                console.log('📊 Audio transmission stats - Count:', count, 'Recent level:', (level * 100).toFixed(2) + '%');
              }
            } catch (error) {
              console.error('❌ Failed to send PCM16 audio:', error);
            }
          }
        };
        console.log('✅ Message handler set up');

        // 오디오 그래프 연결
        console.log('🔧 Connecting audio graph...');
        console.log('🔧 Source node:', source);
        console.log('🔧 Worklet node:', workletNode);

        source.connect(workletNode);
        console.log('✅ Source connected to worklet');

        // AudioWorkletNode가 처리되려면 destination에도 연결해야 할 수 있음
        workletNode.connect(audioContext.destination);
        console.log('✅ Worklet connected to destination');

        console.log('✅ Complete audio graph: source → workletNode → destination');

      } catch (workletError) {
        console.warn('⚠️ AudioWorklet failed:', workletError);
        console.warn('🔄 Falling back to ScriptProcessorNode for compatibility');

        // Fallback to ScriptProcessorNode for compatibility
        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        console.log('✅ ScriptProcessorNode created (fallback)');

        let fallbackCount = 0;
        processor.onaudioprocess = (event) => {
          if (!sessionRef.current) return;

          fallbackCount++;
          const inputBuffer = event.inputBuffer;
          const inputData = inputBuffer.getChannelData(0);

          // 오디오 레벨 계산 (RMS)
          let sum = 0;
          for (let i = 0; i < inputData.length; i++) {
            sum += inputData[i] * inputData[i];
          }
          const rms = Math.sqrt(sum / inputData.length);
          const level = Math.max(0, Math.min(1, rms));

          // 첫 번째 오디오 처리 시 알림
          if (fallbackCount === 1) {
            console.log('🎉 First audio data processed with ScriptProcessorNode!');
          }

          // 주기적 레벨 로깅
          if (fallbackCount % 50 === 0) {
            console.log('🔊 Audio level (fallback):', (level * 100).toFixed(1) + '%', 'count:', fallbackCount);
          }

          const pcm16Buffer = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            const sample = Math.max(-1, Math.min(1, inputData[i]));
            pcm16Buffer[i] = sample * 0x7FFF;
          }

          try {
            sessionRef.current.sendAudio(pcm16Buffer.buffer);
            if (level > 0.01) { // 유의미한 오디오만 성공 로그
              console.log('✅ PCM16 audio sent (fallback), level:', (level * 100).toFixed(1) + '%');
            }
          } catch (error) {
            console.error('❌ Failed to send PCM16 audio (fallback):', error);
          }
        };

        source.connect(processor);
        processor.connect(audioContext.destination);
        console.log('✅ Audio processing connected (ScriptProcessorNode fallback)');
      }

      // Web Speech API 시작
      const recognition = setupSpeechRecognition();
      if (recognition) {
        setSpeechRecognition(recognition);
        recognition.start();
        console.log('🎤 Speech recognition started along with recording');
      }

      setIsRecording(true);
      console.log('🎤 Recording started - continuous PCM16 streaming');

    } catch (err) {
      console.error('❌ Recording failed:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('마이크 권한이 필요합니다. 브라우저에서 마이크 접근을 허용해주세요.');
        } else if (err.name === 'NotFoundError') {
          setError('마이크를 찾을 수 없습니다. 마이크가 연결되어 있는지 확인해주세요.');
        } else {
          setError(`녹음 오류: ${err.message}`);
        }
      } else {
        setError('녹음을 시작할 수 없습니다.');
      }
    }
  }, [isRecording, isConnected, connect]);

  // 음성 녹음 중지 및 세션 종료
  const stopRecording = useCallback(() => {
    console.log('🛑 Stopping recording and terminating session...');

    // Speech Recognition 중지
    if (speechRecognition) {
      speechRecognition.stop();
      setSpeechRecognition(null);
      console.log('🎤 Speech recognition stopped');
    }

    // 모든 스케줄된 오디오 소스 중지
    scheduledSourcesRef.current.forEach(source => {
      try {
        source.stop();
      } catch (error) {
        // 이미 중지된 소스일 수 있음
      }
    });
    scheduledSourcesRef.current = [];
    nextStartTimeRef.current = 0;

    // 재생용 AudioContext 정리
    if (playbackAudioContextRef.current) {
      playbackAudioContextRef.current.close();
      playbackAudioContextRef.current = null;
    }

    // AudioWorklet 정리
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // 스트림 정리
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // 세션 종료
    if (sessionRef.current) {
      sessionRef.current = null;
    }

    // 오디오 청크 정리
    audioChunksRef.current = [];
    isPlayingAudioRef.current = false;

    setIsRecording(false);
    setIsConnected(false);
    setIsUserSpeaking(false);
    setCurrentUserTranscript('');
    setCurrentAssistantTranscript('');
    setMessages([]); // 대화 내역 초기화
    console.log('✅ Recording stopped and session terminated');
  }, []);

  // 연결 해제
  const disconnect = useCallback(() => {
    stopRecording();

    if (sessionRef.current) {
      sessionRef.current = null;
    }

    setIsConnected(false);
    setMessages([]);
    console.log('🔌 Disconnected');
  }, [stopRecording]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isRecording,
    messages,
    error,
    isConnecting,
    connect,
    disconnect,
    startRecording,
    stopRecording,
  };
}