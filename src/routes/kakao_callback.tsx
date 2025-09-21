import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "../firebase";
import { OAuthProvider, signInWithCredential, setPersistence, browserSessionPersistence, inMemoryPersistence, signOut } from "firebase/auth";

function GlobalLoading() {
  return <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>Processing Kakao login…</div>;
}

export default function KakaoCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const code = params.get("code");
    if (!code) {
      navigate("/");
      return;
    }

    const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
    const KAKAO_CLIENT_SECRET = import.meta.env.VITE_KAKAO_CLIENT_SECRET;
    const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

    const run = async () => {
      try {
        const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: KAKAO_CLIENT_ID ?? "",
            redirect_uri: KAKAO_REDIRECT_URI ?? "",
            code,
            client_secret: KAKAO_CLIENT_SECRET ?? "",
          }),
        });
        const tokenData = await tokenResponse.json();
        if (!tokenResponse.ok || !tokenData.id_token || !tokenData.access_token) {
          navigate("/");
          return;
        }

        const kakaoIdToken: string = tokenData.id_token;

        const payloadBase64Url = kakaoIdToken.split(".")[1];
        const payloadBase64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(payloadBase64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const decodedIdToken = JSON.parse(jsonPayload) as { sub?: string };
        const kakaoSub = decodedIdToken.sub ?? "";
        if (!kakaoSub) {
          navigate("/");
          return;
        }

        const provider = new OAuthProvider("oidc.kakao");
        const credential = provider.credential({ idToken: kakaoIdToken });
        try {
          await setPersistence(auth, browserSessionPersistence);
        } catch {
          // Fallback if sessionStorage blocked
          await setPersistence(auth, inMemoryPersistence);
        }
        await signInWithCredential(auth, credential);

        const returnUrl = localStorage.getItem("returnUrl");
        if (returnUrl) {
          localStorage.removeItem("returnUrl");
          navigate(returnUrl);
        } else {
          navigate("/profile");
        }
      } catch {
        if (auth.currentUser) {
          await signOut(auth).catch(() => {});
        }
        navigate("/sign_in");
      }
    };

    run();
  }, [params, navigate]);

  return <GlobalLoading />;
}


