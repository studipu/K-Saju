import { Link, useLocation, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { supabase } from "../supabase";
import { useI18n } from "../i18n/i18n";
import { useEffect, useState } from "react";
import temporaryLogo from "../assets/temporary_logo.png";

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  backdrop-filter: saturate(180%) blur(8px);
  background: #ffffff;
  border-bottom: 1px solid rgba(17, 24, 39, 0.06);
`;

const Inner = styled.div`
  margin: 0 auto;
  width: 100%;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const WhatIsSajuText = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  color: #111827;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.15s ease;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;

  img {
    height: 28px;
    width: auto;
  }
`;

const IconButton = styled.button`
  appearance: none;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #111827;
  height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  svg {
    width: 18px;
    height: 18px;
  }
  &:hover {
    background: #f9fafb;
  }
`;

const ProfileImg = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  display: block;
`;

const ProfileButton = styled.button`
  appearance: none;
  border: 0;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Divider = styled.span`
  display: inline-block;
  width: 1px;
  height: 20px;
  background: #e5e7eb;
  margin: 0 4px;
`;

// Search Locations button with white background
const SearchButton = styled.button`
  appearance: none;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #111827;
  height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f9fafb;
  }
`;

export default function GNB() {
  const { t, language, setLanguage } = useI18n();
  const navigate = useNavigate();
  useLocation();
  const [user, setUser] = useState<null | { id: string; user_metadata?: any; user_metadata_photo?: string; }>(null);
  const [openLang, setOpenLang] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user as any);
    };
    init();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user as any ?? null);
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  // Apply user's preferred language globally when present
  useEffect(() => {
    const pref = (user?.user_metadata as any)?.preferred_language as string | undefined;
    if (pref && ["en", "ko", "zh", "ja", "es"].includes(pref)) {
      setLanguage(pref as any);
    }
  }, [user, setLanguage]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest("[data-dropdown]")) {
        setOpenLang(false);
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onMessages = () => navigate("/messages");
  const onSearchLocations = () => navigate("/locations");
  const onWhatIsSaju = () => navigate("/intro");
  const onSignIn = () => navigate("/sign-in");
  const onProfile = () => navigate("/profile");
  const onLogout = async () => {
    const ok = confirm("Are you sure you want to log out?");
    if (ok) {
      await supabase.auth.signOut();
      navigate("/sign-in");
    }
  };

  const onToggleLang = () => {
    setOpenLang((v) => !v);
    setOpenProfile(false); // Close profile dropdown when opening language
  };
  const onPickLang = (code: string) => setLanguage(code as any);
  const onToggleProfile = () => {
    setOpenProfile((v) => !v);
    setOpenLang(false); // Close language dropdown when opening profile
  };

  return (
    <Bar>
      <Inner>
        <Left>
          <Logo to="/">
            <img src={temporaryLogo} alt="K-Saju" />
          </Logo>
        </Left>
        <Right>
          {/* What is Saju? text */}
          <WhatIsSajuText onClick={onWhatIsSaju}>
            What is Saju?
          </WhatIsSajuText>
          
          {/* Search Locations button placed to the left of language control */}
          <SearchButton onClick={onSearchLocations} aria-label={t("searchLocations")}>
            {"📍 "}{t("searchLocations")}
          </SearchButton>

          {!((user?.user_metadata as any)?.preferred_language) && (
          <div style={{ position: "relative" }} data-dropdown>
            <IconButton onClick={onToggleLang} aria-label={t("language")}>
              <span style={{ fontSize: 20 }}>
                {language === "en" && "🇺🇸"}
                {language === "ko" && "🇰🇷"}
                {language === "zh" && "🇨🇳"}
                {language === "ja" && "🇯🇵"}
                {language === "es" && "🇪🇸"}
              </span>
              <svg
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                style={{ width: 16, height: 16 }}
              >
                <path
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.09 1.03l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.26a.75.75 0 01.02-1.06z"
                  fill="#6b7280"
                />
              </svg>
            </IconButton>
            {openLang && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 44,
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 20,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                  width: 200,
                  overflow: "hidden",
                }}
              >
                {[
                  { code: "en", label: "English", icon: "🇺🇸" },
                  { code: "ko", label: "한국어", icon: "🇰🇷" },
                  { code: "zh", label: "中文", icon: "🇨🇳" },
                  { code: "ja", label: "日本語", icon: "🇯🇵" },
                  { code: "es", label: "Español", icon: "🇪🇸" },
                ].map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => {
                      onPickLang(opt.code);
                      setOpenLang(false);
                    }}
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      background: language === opt.code ? "#f3f4f6" : "#ffffff",
                      border: 0,
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{opt.icon}</span>
                    <span style={{ fontSize: 14 }}>{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          )}

          {user && (
            <IconButton onClick={onMessages} aria-label={t("messages")}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 8h10M7 12h7"
                  stroke="#111827"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-5.586a2 2 0 0 0-1.414.586L8 21v-3H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
                  stroke="#111827"
                  strokeWidth="1.5"
                />
              </svg>
            </IconButton>
          )}
          <Divider />
          {user ? (
            <div style={{ position: "relative" }} data-dropdown>
              <ProfileButton onClick={onToggleProfile} aria-label={t("profile")}>
                {(user.user_metadata?.avatar_url || (user as any).photoURL) ? (
                  <ProfileImg src={user.user_metadata?.avatar_url || (user as any).photoURL} alt="profile" />
                ) : (
                  <svg
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    style={{ width: 38, height: 38 }}
                  >
                    <path
                      d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z"
                      fill="#111827"
                    />
                  </svg>
                )}
              </ProfileButton>
              {openProfile && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 44,
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 20,
                    boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                    width: 200,
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() => {
                      onProfile();
                      setOpenProfile(false);
                    }}
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 16px",
                      background: "#ffffff",
                      border: 0,
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      style={{ width: 18, height: 18 }}
                    >
                      <path
                        d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z"
                        fill="#111827"
                      />
                    </svg>
                    {t("myProfile")}
                  </button>
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setOpenProfile(false);
                    }}
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 16px",
                      background: "#ffffff",
                      border: 0,
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      style={{ width: 18, height: 18 }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                        fill="#111827"
                      />
                    </svg>
                    {t("settings")}
                  </button>
                  <div
                    style={{
                      height: 1,
                      background: "#e5e7eb",
                      margin: "4px 0",
                    }}
                  ></div>
                  <button
                    onClick={() => {
                      onLogout();
                      setOpenProfile(false);
                    }}
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 16px",
                      background: "#ffffff",
                      border: 0,
                      cursor: "pointer",
                      fontSize: 14,
                      color: "#dc2626",
                    }}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      style={{ width: 18, height: 18 }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                        clipRule="evenodd"
                        fill="#dc2626"
                      />
                      <path
                        fillRule="evenodd"
                        d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z"
                        clipRule="evenodd"
                        fill="#dc2626"
                      />
                    </svg>
                    {t("logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <IconButton
              onClick={onSignIn}
              aria-label={t("signIn")}
              style={{
                background: "#181818", // black
                color: "#ffffff",
                borderColor: "#181818",
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                {t("signIn")}
              </span>
            </IconButton>
          )}
        </Right>
      </Inner>
    </Bar>
  );
}
