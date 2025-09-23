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
  backdrop-filter: saturate(180%) blur(20px);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95));
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.98));
    border-bottom-color: rgba(102, 126, 234, 0.15);
  }
`;

const Inner = styled.div`
  margin: 0 auto;
  padding: 16px 24px;
  max-width: 1400px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  @media (max-width: 768px) {
    padding: 12px 16px;
    gap: 16px;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
  }

  img {
    height: 40px;
    width: auto;
    transition: all 0.3s ease;
  }
`;

const LogoText = styled.div`
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    display: none;
  }
`;

const IconButton = styled.button<{ $primary?: boolean }>`
  appearance: none;
  border: 2px solid ${(p) => p.$primary ? "transparent" : "rgba(102, 126, 234, 0.2)"};
  background: ${(p) => p.$primary
    ? "linear-gradient(135deg, #667eea, #764ba2)"
    : "rgba(255, 255, 255, 0.8)"};
  backdrop-filter: blur(10px);
  color: ${(p) => p.$primary ? "white" : "#4338ca"};
  height: 44px;
  padding: 0 20px;
  border-radius: 22px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${(p) => p.$primary
    ? "0 8px 32px rgba(102, 126, 234, 0.3)"
    : "0 4px 16px rgba(102, 126, 234, 0.1)"};
  position: relative;
  overflow: hidden;

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

  svg {
    width: 20px;
    height: 20px;
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(p) => p.$primary
      ? "0 12px 40px rgba(102, 126, 234, 0.4)"
      : "0 8px 25px rgba(102, 126, 234, 0.15)"};
    border-color: ${(p) => p.$primary ? "transparent" : "rgba(102, 126, 234, 0.3)"};
    background: ${(p) => p.$primary
      ? "linear-gradient(135deg, #5a67d8, #6b46c1)"
      : "rgba(255, 255, 255, 0.95)"};
  }

  &:active {
    transform: translateY(0);
  }
`;

const ProfileImg = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  display: block;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(102, 126, 234, 0.4);
    transform: scale(1.05);
  }
`;

const Divider = styled.span`
  display: inline-block;
  width: 2px;
  height: 24px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
  border-radius: 1px;
  margin: 0 8px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavMenu = styled.nav`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  text-decoration: none;
  color: ${(p) => p.$active ? "#667eea" : "#6b7280"};
  font-weight: ${(p) => p.$active ? "700" : "500"};
  font-size: 15px;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
    opacity: ${(p) => p.$active ? "1" : "0"};
    transition: opacity 0.3s ease;
  }

  &:hover {
    color: #667eea;
    transform: translateY(-1px);

    &::before {
      opacity: 1;
    }
  }

  span {
    position: relative;
    z-index: 1;
  }
`;

export default function GNB() {
  const { t, language, setLanguage } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
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
            <LogoText>K-Saju</LogoText>
          </Logo>
          <NavMenu>
            <NavLink to="/" $active={location.pathname === "/"}>
              <span>🏠 {t("home")}</span>
            </NavLink>
            <NavLink to="/live-translation" $active={location.pathname === "/live-translation"}>
              <span>🔮 {t("liveTranslation")}</span>
            </NavLink>
            <NavLink to="/locations" $active={location.pathname === "/locations"}>
              <span>📍 {t("locations")}</span>
            </NavLink>
          </NavMenu>
        </Left>
        <Right>
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
                  top: 52,
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "2px solid rgba(102, 126, 234, 0.1)",
                  borderRadius: 16,
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                  width: 220,
                  overflow: "hidden",
                  animation: "slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
                      gap: 12,
                      padding: "16px 20px",
                      background: language === opt.code
                        ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))"
                        : "transparent",
                      border: 0,
                      cursor: "pointer",
                      fontSize: 15,
                      fontWeight: language === opt.code ? 600 : 500,
                      color: language === opt.code ? "#667eea" : "#374151",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (language !== opt.code) {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))";
                        e.currentTarget.style.transform = "translateX(4px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (language !== opt.code) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.transform = "translateX(0)";
                      }
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
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
              <IconButton onClick={onToggleProfile} aria-label={t("profile")}>
                {(user.user_metadata?.avatar_url || (user as any).photoURL) ? (
                  <ProfileImg src={user.user_metadata?.avatar_url || (user as any).photoURL} alt="profile" />
                ) : (
                  <svg
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z"
                      fill="#111827"
                    />
                  </svg>
                )}
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
              {openProfile && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 52,
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    border: "2px solid rgba(102, 126, 234, 0.1)",
                    borderRadius: 16,
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                    width: 220,
                    overflow: "hidden",
                    animation: "slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
                      padding: "16px 20px",
                      background: "transparent",
                      border: 0,
                      cursor: "pointer",
                      fontSize: 15,
                      fontWeight: 500,
                      color: "#374151",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))";
                      e.currentTarget.style.color = "#667eea";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#374151";
                      e.currentTarget.style.transform = "translateX(0)";
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
                      padding: "16px 20px",
                      background: "transparent",
                      border: 0,
                      cursor: "pointer",
                      fontSize: 15,
                      fontWeight: 500,
                      color: "#374151",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))";
                      e.currentTarget.style.color = "#667eea";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#374151";
                      e.currentTarget.style.transform = "translateX(0)";
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
                      padding: "16px 20px",
                      background: "transparent",
                      border: 0,
                      cursor: "pointer",
                      fontSize: 15,
                      fontWeight: 500,
                      color: "#dc2626",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                      e.currentTarget.style.color = "#ef4444";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#dc2626";
                      e.currentTarget.style.transform = "translateX(0)";
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
              $primary
            >
              <span style={{ fontSize: 14, fontWeight: 700 }}>
                ✨ {t("signIn")}
              </span>
            </IconButton>
          )}
        </Right>
      </Inner>
    </Bar>
  );
}
