import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

function GlobalLoading() {
  return <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>Processing Kakao login…</div>;
}

export default function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (error) throw error;

        const returnUrl = localStorage.getItem("returnUrl");
        if (returnUrl) {
          localStorage.removeItem("returnUrl");
          navigate(returnUrl);
        } else {
          navigate("/profile");
        }
      } catch {
        await supabase.auth.signOut().catch(() => {});
        navigate("/sign_in");
      }
    };

    run();
  }, [navigate]);

  return <GlobalLoading />;
}


