import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Language = "en" | "ko" | "zh" | "ja" | "es";

type Translations = Record<string, string>;

const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: "K-Saju",
    logo: "K-Saju",
    home: "Home",
    messages: "Messages",
    signIn: "Sign in",
    signOut: "Sign out",
    profile: "Profile",
    language: "Language",
    customerSupport: "Customer Support",
    faq: "FAQ",
    contact: "Contact",
    safety: "Safety",
    about: "About",
    careers: "Careers",
    newsroom: "Newsroom",
    investors: "Investors",
    blog: "Blog",
    forum: "Forum",
    events: "Events",
    partnerships: "Partnerships",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    cookies: "Cookies Policy",
    compliance: "Compliance",
    allRightsReserved: "All rights reserved.",
    myProfile: "My Profile",
    settings: "Settings",
    logout: "Log out",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    loading: "Loading...",
    logIn: "Log In",
    createAccount: "Create Account",
    or: "OR",
    continueWithGoogle: "Continue with Google",
    continueWithApple: "Continue with Apple",
    continueWithKakao: "Continue with Kakao",
    dontHaveAccount: "Don't have an account?",
    createOne: "Create one",
    alreadyHaveAccount: "Already have an account?",
    logInHere: "Log in",
    liveTranslation: "Live Translation",
    sessionInfo: "Session Info",
    liveTranscription: "Live Transcription",
    start: "Start",
    stop: "Stop",
    speakerAUnderstands: "Speaker A understands",
    speakerBUnderstands: "Speaker B understands",
    webSpeechNotSupported:
      "Your browser may not support real-time transcription (Web Speech API). Basic recording fallback is used.",
    recording: "Recording",
  },
  ko: {
    appName: "케이사주",
    logo: "케이사주",
    home: "홈",
    messages: "메시지",
    signIn: "로그인",
    signOut: "로그아웃",
    profile: "프로필",
    language: "언어",
    customerSupport: "고객 지원",
    faq: "자주 묻는 질문",
    contact: "연락처",
    safety: "안전",
    about: "회사 소개",
    careers: "채용",
    newsroom: "뉴스룸",
    investors: "투자자",
    blog: "블로그",
    forum: "포럼",
    events: "이벤트",
    partnerships: "파트너십",
    privacy: "개인정보처리방침",
    terms: "이용약관",
    cookies: "쿠키 정책",
    compliance: "컴플라이언스",
    allRightsReserved: "모든 권리 보유.",
    myProfile: "내 프로필",
    settings: "설정",
    logout: "로그아웃",
    email: "이메일",
    password: "비밀번호",
    confirmPassword: "비밀번호 확인",
    loading: "로딩 중...",
    logIn: "로그인",
    createAccount: "계정 만들기",
    or: "또는",
    continueWithGoogle: "Google로 이용하기",
    continueWithApple: "Apple로 이용하기",
    continueWithKakao: "카카오로 이용하기",
    dontHaveAccount: "계정이 없으시나요?",
    createOne: "만들기",
    alreadyHaveAccount: "이미 계정이 있으시나요?",
    logInHere: "로그인",
    liveTranslation: "실시간 번역",
    sessionInfo: "세션 정보",
    liveTranscription: "실시간 음성 인식",
    start: "시작",
    stop: "중지",
    speakerAUnderstands: "화자 A 언어",
    speakerBUnderstands: "화자 B 언어",
    webSpeechNotSupported:
      "브라우저에서 실시간 음성 인식을 지원하지 않을 수 있습니다. 기본 녹음 기능을 사용합니다.",
    recording: "녹음중",
  },
  zh: {
    appName: "K-Saju",
    logo: "K-Saju",
    home: "首页",
    messages: "消息",
    signIn: "登录",
    signOut: "登出",
    profile: "个人资料",
    language: "语言",
    customerSupport: "客户支持",
    faq: "常见问题",
    contact: "联系我们",
    safety: "安全",
    about: "关于我们",
    careers: "招聘",
    newsroom: "新闻室",
    investors: "投资者",
    blog: "博客",
    forum: "论坛",
    events: "活动",
    partnerships: "合作伙伴",
    privacy: "隐私政策",
    terms: "服务条款",
    cookies: "Cookie政策",
    compliance: "合规性",
    allRightsReserved: "版权所有。",
    myProfile: "我的资料",
    settings: "设置",
    logout: "登出",
    email: "邮箱",
    password: "密码",
    confirmPassword: "确认密码",
    loading: "加载中...",
    logIn: "登录",
    createAccount: "创建账户",
    or: "或",
    continueWithGoogle: "使用 Google 继续",
    continueWithApple: "使用 Apple 继续",
    continueWithKakao: "使用 Kakao 继续",
    dontHaveAccount: "没有账户？",
    createOne: "创建一个",
    alreadyHaveAccount: "已有账户？",
    logInHere: "登录",
    liveTranslation: "实时翻译",
    sessionInfo: "会话信息",
    liveTranscription: "实时转录",
    start: "开始",
    stop: "停止",
    speakerAUnderstands: "说话者A语言",
    speakerBUnderstands: "说话者B语言",
    webSpeechNotSupported:
      "您的浏览器可能不支持实时语音识别（Web Speech API）。使用基本录音回退功能。",
    recording: "录音中",
  },
  ja: {
    appName: "K-Saju",
    logo: "K-Saju",
    home: "ホーム",
    messages: "メッセージ",
    signIn: "サインイン",
    signOut: "サインアウト",
    profile: "プロフィール",
    language: "言語",
    customerSupport: "カスタマーサポート",
    faq: "よくある質問",
    contact: "お問い合わせ",
    safety: "安全性",
    about: "会社概要",
    careers: "採用情報",
    newsroom: "ニュースルーム",
    investors: "投資家向け情報",
    blog: "ブログ",
    forum: "フォーラム",
    events: "イベント",
    partnerships: "パートナーシップ",
    privacy: "プライバシーポリシー",
    terms: "利用規約",
    cookies: "クッキーポリシー",
    compliance: "コンプライアンス",
    allRightsReserved: "全著作権所有。",
    myProfile: "マイプロフィール",
    settings: "設定",
    logout: "ログアウト",
    email: "メールアドレス",
    password: "パスワード",
    confirmPassword: "パスワードの確認",
    loading: "読み込み中...",
    logIn: "ログイン",
    createAccount: "アカウント作成",
    or: "または",
    continueWithGoogle: "Googleで続行",
    continueWithApple: "Appleで続行",
    continueWithKakao: "Kakaoで続行",
    dontHaveAccount: "アカウントをお持ちではありませんか？",
    createOne: "作成する",
    alreadyHaveAccount: "すでにアカウントをお持ちですか？",
    logInHere: "ログイン",
    liveTranslation: "リアルタイム翻訳",
    sessionInfo: "セッション情報",
    liveTranscription: "リアルタイム音声認識",
    start: "開始",
    stop: "停止",
    speakerAUnderstands: "話者A言語",
    speakerBUnderstands: "話者B言語",
    webSpeechNotSupported:
      "お使いのブラウザではリアルタイム音声認識（Web Speech API）をサポートしていない可能性があります。基本録音機能を使用します。",
    recording: "録音中",
  },
  es: {
    appName: "K-Saju",
    logo: "K-Saju",
    home: "Inicio",
    messages: "Mensajes",
    signIn: "Iniciar sesión",
    signOut: "Cerrar sesión",
    profile: "Perfil",
    language: "Idioma",
    customerSupport: "Atención al Cliente",
    faq: "Preguntas Frecuentes",
    contact: "Contacto",
    safety: "Seguridad",
    about: "Acerca de",
    careers: "Empleos",
    newsroom: "Sala de Prensa",
    investors: "Inversores",
    blog: "Blog",
    forum: "Foro",
    events: "Eventos",
    partnerships: "Socios",
    privacy: "Política de Privacidad",
    terms: "Términos de Servicio",
    cookies: "Política de Cookies",
    compliance: "Cumplimiento",
    allRightsReserved: "Todos los derechos reservados.",
    myProfile: "Mi Perfil",
    settings: "Configuración",
    logout: "Cerrar sesión",
    email: "Correo electrónico",
    password: "Contraseña",
    confirmPassword: "Confirmar contraseña",
    loading: "Cargando...",
    logIn: "Iniciar sesión",
    createAccount: "Crear cuenta",
    or: "O",
    continueWithGoogle: "Continuar con Google",
    continueWithApple: "Continuar con Apple",
    continueWithKakao: "Continuar con Kakao",
    dontHaveAccount: "¿No tienes una cuenta?",
    createOne: "Crear una",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    logInHere: "Iniciar sesión",
    liveTranslation: "Traducción en Vivo",
    sessionInfo: "Información de Sesión",
    liveTranscription: "Transcripción en Vivo",
    start: "Iniciar",
    stop: "Detener",
    speakerAUnderstands: "Idioma del Hablante A",
    speakerBUnderstands: "Idioma del Hablante B",
    webSpeechNotSupported:
      "Su navegador puede no soportar transcripción en tiempo real (Web Speech API). Se usa grabación básica como respaldo.",
    recording: "Grabando",
  },
};

type I18nContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  availableLanguages: Language[];
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem("app.lang") as Language | null;
    if (stored && ["en", "ko", "zh", "ja", "es"].includes(stored))
      return stored as Language;
    const nav = navigator.language?.toLowerCase() ?? "en";
    if (nav.startsWith("ko")) return "ko";
    if (nav.startsWith("zh")) return "zh";
    if (nav.startsWith("ja")) return "ja";
    if (nav.startsWith("es")) return "es";
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("app.lang", language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: string) => {
      const table = TRANSLATIONS[language] ?? TRANSLATIONS.en;
      return table[key] ?? key;
    },
    [language]
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      t,
      availableLanguages: ["en", "ko", "zh", "ja", "es"],
    }),
    [language, setLanguage, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    console.error(
      "useI18n called outside I18nProvider - falling back to English"
    );
    // Return fallback context
    return {
      language: "en" as const,
      setLanguage: () => {},
      t: (key: string) => {
        const fallbacks: Record<string, string> = {
          appName: "K-Saju",
          logo: "K-Saju",
          home: "Home",
          messages: "Messages",
          signIn: "Sign in",
          signOut: "Sign out",
          profile: "Profile",
          language: "Language",
          customerSupport: "Customer Support",
          faq: "FAQ",
          contact: "Contact",
          safety: "Safety",
          about: "About",
          careers: "Careers",
          newsroom: "Newsroom",
          investors: "Investors",
          blog: "Blog",
          forum: "Forum",
          events: "Events",
          partnerships: "Partnerships",
          privacy: "Privacy Policy",
          terms: "Terms of Service",
          cookies: "Cookies Policy",
          compliance: "Compliance",
          allRightsReserved: "All rights reserved.",
          myProfile: "My Profile",
          settings: "Settings",
          logout: "Log out",
        };
        return fallbacks[key] || key;
      },
      availableLanguages: ["en", "ko", "zh", "ja", "es"] as const,
    };
  }
  return ctx;
}
