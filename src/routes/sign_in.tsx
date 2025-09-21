import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  Card,
  Divider,
  Error,
  Form,
  Input,
  Logo,
  Page,
  Switcher,
  Wrapper,
  GoogleButton,
  AppleButton,
  KakaoButton,
  LanguageSelector,
} from "../components/auth_components";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useI18n } from "../i18n/i18n";
// Kakao SDK assumed initialized elsewhere

export function Login() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) setError(e.message);
    }
  };
  const onApple = async () => {
    setError("Apple Sign-In not configured yet");
  };
  const onKakao = async () => {
    // Direct OAuth redirect (no Kakao JS SDK required)
    const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID ?? "";
    const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI ?? "";
    if (!clientId || !redirectUri) {
      setError("Kakao env not configured");
      return;
    }
    const authorizeUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
    // Optionally store returnUrl
    // localStorage.setItem("returnUrl", "/profile");
    window.location.href = authorizeUrl;
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || email === "" || password === "") return;
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Page>
      <LanguageSelector />
      <Card>
        <Logo>KS</Logo>
        <Wrapper>
          <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder={t("email")}
          type="email"
          required
        />
        <Input
          onChange={onChange}
          value={password}
          name="password"
          placeholder={t("password")}
          type="password"
          required
        />
            <Input type="submit" value={isLoading ? t("loading") : t("logIn")} />
          </Form>
          <Divider>{t("or")}</Divider>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <GoogleButton onClick={onGoogle} />
            <AppleButton onClick={onApple} />
            <KakaoButton onClick={onKakao} />
          </div>
          {error !== "" ? <Error>{error}</Error> : null}
          <Switcher>
            {t("dontHaveAccount")}{" "}
            <Link to="/sign_up">{t("createOne")} &rarr;</Link>
          </Switcher>
        </Wrapper>
      </Card>
    </Page>
  );
}