import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { styled } from "styled-components";
import { useI18n } from "../i18n/i18n";

const Page = styled.div`
  margin: 0 auto;
  padding: 20px 20px 40px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Button = styled.button<{ $primary?: boolean; $danger?: boolean }>`
  appearance: none;
  border: 1px solid ${p => (p.$danger ? "#dc2626" : p.$primary ? "#111111" : "#e5e7eb")};
  background: ${p => (p.$danger ? "#dc2626" : p.$primary ? "#111111" : "#ffffff")};
  color: ${p => (p.$danger || p.$primary ? "#ffffff" : "#111827")};
  height: 40px;
  padding: 0 16px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.15s ease;
  &:hover { filter: brightness(0.98); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
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
  height: 44px;
`;

const PanelTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.2;
  display: flex;
  align-items: center;
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
  &:hover { background: #f9fafb; }
`;

const LangMenu = styled.div`
  position: absolute;
  right: 0;
  top: 42px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  width: 200px;
  overflow: hidden;
  z-index: 10;
`;

const SpeakerLangBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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
  &:hover { background: #f3f4f6; }
  &:first-child { border-radius: 12px 12px 0 0; }
  &:last-child { border-radius: 0 0 12px 12px; }
`;


const ChatWrap = styled.div`
  height: 68vh;
  min-height: 420px;
  overflow: auto;
  padding: 12px;
  background: #fafafa;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
`;

const ChatItem = styled.div<{ $right?: boolean }>`
  display: flex;
  justify-content: ${p => (p.$right ? "flex-end" : "flex-start")};
  padding: 6px 4px;
`;

const Bubble = styled.div<{ $right?: boolean }>`
  max-width: 74%;
  background: ${p => (p.$right ? "#111111" : "#ffffff")};
  color: ${p => (p.$right ? "#ffffff" : "#111827")};
  border: 1px solid ${p => (p.$right ? "#0f0f0f" : "#e5e7eb")};
  border-radius: 16px;
  padding: 10px 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
`;

const BubbleOriginal = styled.div`
  font-weight: 600;
  margin-bottom: 6px;
`;

const BubbleTranslation = styled.div`
  font-size: 13px;
  opacity: 0.9;
`;

type SpeechLang = "en-US" | "ko-KR" | "ja-JP" | "zh-CN" | "es-ES";

const LANG_OPTIONS: Array<{ code: SpeechLang; label: string; icon: string }> = [
  { code: "en-US", label: "English (US)", icon: "🇺🇸" },
  { code: "ko-KR", label: "한국어", icon: "🇰🇷" },
  { code: "zh-CN", label: "中文(简体)", icon: "🇨🇳" },
  { code: "ja-JP", label: "日本語", icon: "🇯🇵" },
  { code: "es-ES", label: "Español", icon: "🇪🇸" },
];

type FinalMessage = { id: string; text: string; timestamp: number };

function useRecorderSpeech(lang: SpeechLang) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [supported, setSupported] = useState<boolean>(false);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [messages, setMessages] = useState<FinalMessage[]>([]);

  useEffect(() => {
    const SR: typeof window.SpeechRecognition | undefined = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) setSupported(true);
  }, []);

  const start = useCallback(async () => {
    setInterim("");
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      const rec: SpeechRecognition = new SR();
      recognitionRef.current = rec;
      rec.lang = lang;
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (e: SpeechRecognitionEvent) => {
        let interimAgg = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i];
          const txt = res[0].transcript.trim();
          if (res.isFinal) {
            const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            setMessages(prev => [...prev, { id, text: txt, timestamp: Date.now() }]);
          } else {
            interimAgg += (interimAgg ? " " : "") + txt;
          }
        }
        setInterim(interimAgg);
      };
      rec.onend = () => setListening(false);
      rec.onerror = () => setListening(false);
      rec.start();
      setListening(true);
    } else {
      // Fallback to MediaRecorder (no real-time transcript)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.start();
      setListening(true);
    }
  }, [lang]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== "inactive") mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      mediaRecorderRef.current = null;
    }
    setListening(false);
    setInterim("");
  }, []);

  return { supported, listening, interim, messages, start, stop };
}

async function translateText(text: string, target: SpeechLang) {
  if (!text.trim()) return "";
  try {
    const endpoint = import.meta.env.VITE_TRANSLATE_API_URL;
    if (endpoint) {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, target }),
      });
      if (res.ok) {
        const data = await res.json();
        return (data.translation ?? data.translatedText ?? text) as string;
      }
    }
    return text;
  } catch {
    return text;
  }
}

export default function LiveTranslation() {
  const { t } = useI18n();
  const [langA, setLangA] = useState<SpeechLang>("en-US");
  const [langB, setLangB] = useState<SpeechLang>("ko-KR");
  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-lang-picker]')) {
        setOpenA(false);
        setOpenB(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const recA = useRecorderSpeech(langA);
  const recB = useRecorderSpeech(langB);

  type ChatMsg = { id: string; speaker: "A" | "B"; text: string; timestamp: number };
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const chat: ChatMsg[] = useMemo(() => {
    const a = recA.messages.map(m => ({ id: `A-${m.id}`, speaker: "A" as const, text: m.text, timestamp: m.timestamp }));
    const b = recB.messages.map(m => ({ id: `B-${m.id}`, speaker: "B" as const, text: m.text, timestamp: m.timestamp }));
    return [...a, ...b].sort((x, y) => x.timestamp - y.timestamp);
  }, [recA.messages, recB.messages]);

  // Translate new messages based on opposite user's understanding
  const lastTranslatedRef = useRef<string | null>(null);
  useEffect(() => {
    if (chat.length === 0) return;
    const latest = chat[chat.length - 1];
    if (lastTranslatedRef.current === latest.id) return;
    lastTranslatedRef.current = latest.id;
    const target = latest.speaker === "A" ? langB : langA;
    (async () => {
      const out = await translateText(latest.text, target);
      setTranslations(prev => ({ ...prev, [latest.id]: out }));
    })();
  }, [chat, langA, langB]);

  // Re-translate existing messages when language settings change
  useEffect(() => {
    if (chat.length === 0) return;
    (async () => {
      const updates: Record<string, string> = {};
      for (const m of chat) {
        const target = m.speaker === "A" ? langB : langA;
        updates[m.id] = await translateText(m.text, target);
      }
      setTranslations(prev => ({ ...prev, ...updates }));
    })();
  }, [langA, langB]);

  const startAll = useCallback(() => { recA.start(); recB.start(); }, [recA, recB]);
  const stopAll = useCallback(() => { recA.stop(); recB.stop(); }, [recA, recB]);

  const running = recA.listening || recB.listening;
  const chatRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chat, recA.interim, recB.interim]);

  const handleToggleLangPicker = (picker: 'A' | 'B') => {
    if (picker === 'A') {
      setOpenA(!openA);
      setOpenB(false); // Close B when opening A
    } else {
      setOpenB(!openB);
      setOpenA(false); // Close A when opening B
    }
  };

  const renderLangPicker = (
    value: SpeechLang,
    setValue: (v: SpeechLang) => void,
    open: boolean,
    picker: 'A' | 'B'
  ) => (
    <LangPicker data-lang-picker>
      <LangButton onClick={() => handleToggleLangPicker(picker)} aria-haspopup="menu" aria-label="Language">
        <span style={{ fontSize: 18 }}>
          {LANG_OPTIONS.find(o => o.code === value)?.icon}
        </span>
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 12 12" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s ease' }}
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
      {open && (
        <LangMenu>
          {LANG_OPTIONS.map(opt => (
            <LangMenuItem key={opt.code} onClick={() => { setValue(opt.code); setOpenA(false); setOpenB(false); }}>
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
        {/* Left column: user language settings */}
        <Panel>
          <PanelHeader>
            <PanelTitle>{t("sessionInfo")}</PanelTitle>
            <div></div>
          </PanelHeader>
          <div style={{ display: "grid", gap: 12 }}>
            <SpeakerLangBox>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{t("speakerAUnderstands")}</div>
              {renderLangPicker(langA, setLangA, openA, 'A')}
            </SpeakerLangBox>
            <SpeakerLangBox>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{t("speakerBUnderstands")}</div>
              {renderLangPicker(langB, setLangB, openB, 'B')}
            </SpeakerLangBox>
            {!recA.supported || !recB.supported ? (
              <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280", lineHeight: 1.4 }}>
                {t("webSpeechNotSupported")}
              </div>
            ) : null}
          </div>
        </Panel>

        {/* Right column: live transcription controls + chat */}
        <Panel>
          <PanelHeader>
            <PanelTitle>{t("liveTranslation")}</PanelTitle>
            <Controls>
              <Button onClick={startAll} $primary disabled={running}>{t("start")}</Button>
              <Button onClick={stopAll} $danger disabled={!running}>{t("stop")}</Button>
            </Controls>
          </PanelHeader>
          <ChatWrap ref={chatRef}>
            {chat.map((m) => (
              <ChatItem key={m.id} $right={m.speaker === "B"}>
                <Bubble $right={m.speaker === "B"}>
                  <BubbleOriginal>{m.text}</BubbleOriginal>
                  <BubbleTranslation>{translations[m.id] ?? ""}</BubbleTranslation>
                </Bubble>
              </ChatItem>
            ))}
            {/* Interim bubbles */}
            {recA.interim && (
              <ChatItem $right={false}>
                <Bubble $right={false}>
                  <BubbleOriginal>{recA.interim}</BubbleOriginal>
                </Bubble>
              </ChatItem>
            )}
            {recB.interim && (
              <ChatItem $right>
                <Bubble $right>
                  <BubbleOriginal>{recB.interim}</BubbleOriginal>
                </Bubble>
              </ChatItem>
            )}
          </ChatWrap>
        </Panel>
      </Grid>
    </Page>
  );
}


