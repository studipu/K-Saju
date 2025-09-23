import { styled } from "styled-components";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useI18n } from "../i18n/i18n";

const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  display: grid;
  place-items: center;
  padding: 48px 20px;
  background-color: #f0f2f5;
`;

const Card = styled.div`
  width: 100%;
  max-width: 800px;
  background: #ffffff;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
`;

const AvatarLabel = styled.label`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #e5e7eb;
  border: 2px solid #ffffff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  margin: 0;
`;

const Subtitle = styled.span`
  font-size: 13px;
  color: #6b7280;
`;

const Body = styled.form`
  padding: 20px 24px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
`;

const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 10px 0;
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

const FullWidthRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: transparent;
  border: 0;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  min-width: 0;
`;


const Label = styled.div`
  font-size: 13px;
  color: #374151;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Control = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-width: 0;
  flex-wrap: wrap;
`;

const InlineGrid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
`;

const InlineGrid4 = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  width: 100%;
`;

const MiniLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 6px 12px;
`;

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <MiniLabel>{label}</MiniLabel>
    {children}
  </div>
);

const VerifiedBadge = ({ ok }: { ok: boolean }) => (
  <span
    aria-label={ok ? 'verified' : 'unverified'}
    title={ok ? 'verified' : 'unverified'}
    style={{
      width: 22,
      height: 22,
      borderRadius: 999,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: ok ? '#10B981' : '#EF4444',
      color: '#ffffff',
      flexShrink: 0,
    }}
  >
    {ok ? (
      <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{ width: 14, height: 14 }}>
        <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" fill="#fff" />
      </svg>
    ) : (
      <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{ width: 14, height: 14 }}>
        <path d="M10 8.586L5.293 3.879A1 1 0 103.879 5.293L8.586 10l-4.707 4.707a1 1 0 101.414 1.414L10 11.414l4.707 4.707a1 1 0 001.414-1.414L11.414 10l4.707-4.707a1 1 0 10-1.414-1.414L10 8.586z" fill="#fff" />
      </svg>
    )}
  </span>
);

const Input = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  font-size: 15px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }
`;

const Select = styled.select`
  width: 100%;
  height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  font-size: 15px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 90px;
  padding: 12px 16px;
  border-radius: 16px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  font-size: 15px;
  resize: vertical;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 8px 0 4px 0;
`;

const Button = styled.button<{ $primary?: boolean }>`
  appearance: none;
  border: 1px solid ${(p) => (p.$primary ? "#111827" : "#d1d5db")};
  background: ${(p) => (p.$primary ? "#111827" : "#ffffff")};
  color: ${(p) => (p.$primary ? "#ffffff" : "#111827")};
  height: 40px;
  padding: 0 16px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
`;

const VerificationPill = styled.span<{ verified: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${p => (p.verified ? '#065f46' : '#6b7280')};
`;

const VerifyButton = styled.button`
  appearance: none;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
  height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  flex-shrink: 0;
  
  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const VerificationSection = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  gap: 8px;
  align-items: center;
`;

type ProfileForm = {
  fullName: string;
  email: string;
  phone: string;
  preferredLanguage: string;
  bio: string;
  avatarUrl?: string;
};

export default function Profile() {
  const { t, setLanguage, language } = useI18n();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    fullName: "",
    email: "",
    phone: "",
    preferredLanguage: "",
    bio: "",
    avatarUrl: undefined,
  });
  const [initialEmail, setInitialEmail] = useState<string>("");
  const [emailVerified, setEmailVerified] = useState<boolean>(false);
  const [phoneVerified, setPhoneVerified] = useState<boolean>(false);
  const [phoneCode, setPhoneCode] = useState<string>("");
  const [showPhoneVerification, setShowPhoneVerification] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user;
      setUserId(u?.id ?? null);
      setForm({
        fullName: (u?.user_metadata as any)?.full_name || (u?.user_metadata as any)?.name || "",
        email: u?.email || "",
        phone: (u?.user_metadata as any)?.phone || "",
        preferredLanguage: (u?.user_metadata as any)?.preferred_language || "en",
        bio: (u?.user_metadata as any)?.bio || "",
        avatarUrl: (u?.user_metadata as any)?.avatar_url || (u as any)?.photoURL || undefined,
      });
      setInitialEmail(u?.email || "");
      setEmailVerified(!!u?.email_confirmed_at);
      setPhoneVerified(Boolean((u as unknown as { phone_confirmed_at?: string | null })?.phone_confirmed_at));
      // Load from DB profiles table if present
      if (u?.id) {
        const { data: profileRow, error } = await supabase
          .from("profiles")
          .select("full_name, phone, preferred_language, bio, avatar_url")
          .eq("id", u.id)
          .maybeSingle();
        if (error && (error as any).code !== "42P01") {
          // Table exists but query failed
          console.warn("profiles query error", error);
        }
        if (profileRow) {
          setForm((f) => ({
            ...f,
            fullName: profileRow.full_name ?? f.fullName,
            phone: profileRow.phone ?? f.phone,
            preferredLanguage: profileRow.preferred_language ?? "",
            bio: profileRow.bio ?? f.bio,
            avatarUrl: profileRow.avatar_url ?? f.avatarUrl,
          }));
          if (profileRow.preferred_language && profileRow.preferred_language !== language) {
            setLanguage(profileRow.preferred_language as any);
          }
        }
      }
      setLoading(false);
    })();
  }, []);

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!userId) return;
    if (files && files.length === 1) {
      const file = files[0];
      const filePath = `avatars/${userId}`;
      await supabase.storage.from("avatars").upload(filePath, file, { upsert: true });
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const avatarUrl = pub.publicUrl;
      setForm((f) => ({ ...f, avatarUrl }));
      await supabase.auth.updateUser({ data: { avatar_url: avatarUrl } });
      // Mirror to DB profile if table exists
      const { error: upErr } = await supabase
        .from("profiles")
        .upsert({ id: userId, avatar_url: avatarUrl, updated_at: new Date().toISOString() })
        .select()
        .single();
      if (upErr && (upErr as any).code !== "42P01") {
        console.warn("profiles avatar upsert error", upErr);
      }
    }
  };

  const onChange = (field: keyof ProfileForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const onReset = () => {
    setLoading(true);
    (async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user;
      setForm({
        fullName: (u?.user_metadata as any)?.full_name || (u?.user_metadata as any)?.name || "",
        email: u?.email || "",
        phone: (u?.user_metadata as any)?.phone || "",
        preferredLanguage: (u?.user_metadata as any)?.preferred_language || "en",
        bio: (u?.user_metadata as any)?.bio || "",
        avatarUrl: (u?.user_metadata as any)?.avatar_url || (u as any)?.photoURL || undefined,
      });
      setInitialEmail(u?.email || "");
      if (u?.id) {
        const { data: profileRow, error } = await supabase
          .from("profiles")
          .select("full_name, phone, preferred_language, bio, avatar_url")
          .eq("id", u.id)
          .maybeSingle();
        if (!error && profileRow) {
          setForm((f) => ({
            ...f,
            fullName: profileRow.full_name ?? f.fullName,
            phone: profileRow.phone ?? f.phone,
            preferredLanguage: profileRow.preferred_language ?? f.preferredLanguage,
            bio: profileRow.bio ?? f.bio,
            avatarUrl: profileRow.avatar_url ?? f.avatarUrl,
          }));
        }
      }
      setLoading(false);
    })();
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (saving) return;
    if (!emailVerified) {
      alert(t("emailUnverified") || "Email not verified");
      return;
    }
    if (!form.phone || !phoneVerified) {
      alert(t("phoneUnverified") || "Phone not verified");
      return;
    }
    setSaving(true);
    try {
      const payload: any = {
        data: {
          full_name: form.fullName,
          phone: form.phone,
          preferred_language: form.preferredLanguage,
          bio: form.bio,
          avatar_url: form.avatarUrl,
          first_name: (form as any).firstName || null,
          last_name: (form as any).lastName || null,
          gender: (form as any).gender || null,
          birthday: (form as any).birthday || null,
          birth_hour: (form as any).birthHour || null,
          country: (form as any).country || null,
        },
      };
      if (form.email && form.email !== initialEmail) {
        payload.email = form.email;
      }
      const { error } = await supabase.auth.updateUser(payload);
      if (error) throw error;
      // Upsert into profiles table
      if (userId) {
        const { error: dbError } = await supabase
          .from("profiles")
          .upsert({
            id: userId,
            full_name: form.fullName,
            first_name: (form as any).firstName || null,
            last_name: (form as any).lastName || null,
            gender: (form as any).gender || null,
            birthday: (form as any).birthday || null,
            birth_hour: (form as any).birthHour || null,
            country: (form as any).country || null,
            phone: form.phone,
            preferred_language: form.preferredLanguage,
            bio: form.bio,
            avatar_url: form.avatarUrl,
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();
        if (dbError && (dbError as any).code !== "42P01") throw dbError;
      }
      if (form.preferredLanguage) setLanguage(form.preferredLanguage as any);
      alert("Profile updated successfully" + (form.email !== initialEmail ? "\nCheck your inbox to confirm email change." : ""));
      setInitialEmail(form.email);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const sendPhoneCode = async () => {
    if (!form.phone) {
      alert(t("enterPhoneNumber") || "Please enter a phone number");
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({ phone: form.phone });
      if (error) throw error;
      setShowPhoneVerification(true);
      alert(t("sendCodeSuccess") || "Verification code sent to your phone");
    } catch (err) {
      const anyErr = err as any;
      alert(typeof anyErr?.message === "string" ? anyErr.message : JSON.stringify(anyErr));
    }
  };

  const verifyPhone = async () => {
    if (!phoneCode) {
      alert(t("enterVerificationCode") || "Please enter the verification code");
      return;
    }
    try {
      const { error } = await supabase.auth.verifyOtp({ type: "sms", token: phoneCode, phone: form.phone });
      if (error) throw error;
      setPhoneVerified(true);
      setShowPhoneVerification(false);
      setPhoneCode("");
      alert(t("phoneVerifiedSuccess") || "Phone number verified successfully!");
    } catch (err) {
      const anyErr = err as any;
      alert(typeof anyErr?.message === "string" ? anyErr.message : JSON.stringify(anyErr));
    }
  };

  const sendEmailVerification = async () => {
    if (!form.email) {
      alert(t("emailPlaceholder") || "Please enter your email");
      return;
    }
    try {
      // Try resend first (works when email hasn't changed)
      const { error: resendError } = await (supabase.auth as any).resend?.({ type: "signup", email: form.email });
      if (resendError) throw resendError;
      alert(t("verificationEmailSent") || "Verification email sent.");
    } catch (e1) {
      try {
        // Fallback: trigger email change flow (sends confirmation if different)
        const { error } = await supabase.auth.updateUser({ email: form.email });
        if (error) throw error;
        alert(t("verificationEmailSent") || "Verification email sent.");
      } catch (err) {
        const anyErr = err as any;
        alert(typeof anyErr?.message === "string" ? anyErr.message : JSON.stringify(anyErr));
      }
    }
  };

  if (loading) {
    return <Page><div>Loading…</div></Page>;
  }

  return (
    <Page>
      <Card>
        <Header>
          <div>
            <AvatarLabel htmlFor="avatar-input">
              {form.avatarUrl ? (
                <AvatarImg src={form.avatarUrl} alt="avatar" />
        ) : (
          <svg
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
                  style={{ width: 40, height: 40 }}
          >
                  <path
                    d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z"
                    fill="#9ca3af"
                  />
          </svg>
        )}
            </AvatarLabel>
            <HiddenFileInput id="avatar-input" type="file" accept="image/*" onChange={onAvatarChange} />
          </div>
          <TitleBlock>
            <Title>{t("myProfile") || "My Profile"}</Title>
            <Subtitle>{t("updateYourInfo") || "Update your personal information"}</Subtitle>
          </TitleBlock>
        </Header>

        <Body onSubmit={onSubmit}>
          <Section>
            <SectionTitle>{t("basicInfo") || "Basic Info"}</SectionTitle>
            <Grid2>
              <Row>
                <Label>{t("firstName") || "First name"}</Label>
                <Control>
                  <Input value={(form as any).firstName || ""} onChange={(e) => setForm((f) => ({ ...(f as any), firstName: e.target.value }))} placeholder={t("firstNamePlaceholder") || "e.g. Kyle"} />
                </Control>
              </Row>
              <Row>
                <Label>{t("lastName") || "Last name"}</Label>
                <Control>
                  <Input value={(form as any).lastName || ""} onChange={(e) => setForm((f) => ({ ...(f as any), lastName: e.target.value }))} placeholder={t("lastNamePlaceholder") || "e.g. Kim"} />
                </Control>
              </Row>
              <Row>
                <Label>
                  {t("email") || "Email"}
                  <VerificationPill verified={emailVerified}>
                    {emailVerified ? (
                      <>
                        <svg viewBox="0 0 20 20" fill="#10b981" width="14" height="14"><path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"/></svg>
                        {t("verified") || "Verified"}
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 20 20" fill="#9ca3af" width="14" height="14"><path d="M10 8.586L5.293 3.879A1 1 0 103.879 5.293L8.586 10l-4.707 4.707a1 1 0 101.414 1.414L10 11.414l4.707 4.707a1 1 0 001.414-1.414L11.414 10l4.707-4.707a1 1 0 10-1.414-1.414L10 8.586z"/></svg>
                        {t("notVerified") || "Not verified"}
                      </>
                    )}
                  </VerificationPill>
                </Label>
                <Control>
                  <Input type="email" value={form.email} onChange={onChange("email")} placeholder={t("emailPlaceholder") || "you@example.com"} />
                </Control>
              </Row>
              <Row>
                <Label>{t("birthday") || "Birthday"}</Label>
                <Control>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 8, width: '100%' }}>
                    <Input type="date" value={(form as any).birthday || ""} onChange={(e) => setForm((f) => ({ ...(f as any), birthday: e.target.value }))} />
                    <Select value={(form as any).birthHour || ""} onChange={(e) => setForm((f) => ({ ...(f as any), birthHour: e.target.value }))}>
                      <option value="">{t("notSelected")}</option>
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}:00</option>
                      ))}
                    </Select>
                  </div>
                </Control>
              </Row>
            </Grid2>
          </Section>

          <Section>
            <SectionTitle>{t("personal") || "Personal"}</SectionTitle>
            <Grid2>
              <Row>
                <Label>{t("gender") || "Gender"}</Label>
                <Control>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById('gender-menu');
                        if (el) el.style.display = el.style.display === 'block' ? 'none' : 'block';
                      }}
                      style={{
                        appearance: 'none',
                        border: '1px solid #e5e7eb',
                        background: '#ffffff',
                        color: '#111827',
                        height: 38,
                        padding: '0 14px',
                        borderRadius: 999,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        fontSize: 14,
                        width: '100%'
                      }}
                    >
                      <span style={{ fontSize: 14 }}>
                        {((form as any).gender === 'M' && (t('male') || 'Male')) ||
                         ((form as any).gender === 'F' && (t('female') || 'Female')) ||
                         ((form as any).gender === 'O' && (t('other') || 'Other')) ||
                         (t('notSelected') || 'Not Selected')}
                      </span>
                      <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: 16, height: 16, marginLeft: 'auto' }}>
                        <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.09 1.03l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.26a.75.75 0 01.02-1.06z" fill="#6b7280"/>
                      </svg>
                    </button>
                    <div id="gender-menu" style={{ position: 'absolute', right: 0, top: 44, background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 20, boxShadow: '0 10px 20px rgba(0,0,0,0.08)', width: '100%', overflow: 'hidden', display: 'none', zIndex: 10 }}>
                      {[
                        { v: '', l: t('notSelected') || 'Not Selected' },
                        { v: 'M', l: t('male') || 'Male' },
                        { v: 'F', l: t('female') || 'Female' },
                        { v: 'O', l: t('other') || 'Other' },
                      ].map(opt => (
                        <button key={opt.v || 'none'} onClick={(ev) => { ev.preventDefault(); setForm((f:any) => ({ ...f, gender: opt.v })); const el = document.getElementById('gender-menu') as HTMLDivElement; if (el) el.style.display = 'none'; }} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 10, padding: '10px 12px', background: (form as any).gender === opt.v ? '#f3f4f6' : '#ffffff', border: 0, cursor: 'pointer' }}>
                          <span style={{ fontSize: 14 }}>{opt.l}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </Control>
              </Row>
              <Row>
                <Label>{t("country") || "Country"}</Label>
                <Control>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%' }}>
                    <div style={{ position: 'relative' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById('country-menu');
                          if (el) el.style.display = el.style.display === 'block' ? 'none' : 'block';
                        }}
                        style={{
                          appearance: 'none',
                          border: '1px solid #e5e7eb',
                          background: '#ffffff',
                          color: '#111827',
                          height: 38,
                          padding: '0 14px',
                          borderRadius: 999,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          cursor: 'pointer',
                          fontSize: 14,
                          width: '100%'
                        }}
                      >
                        <span style={{ fontSize: 14 }}>
                          {((form as any).country) || (t('notSelected') || 'Not Selected')}
                        </span>
                        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: 16, height: 16, marginLeft: 'auto' }}>
                          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.09 1.03l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.26a.75.75 0 01.02-1.06z" fill="#6b7280"/>
                        </svg>
                      </button>
                      <div id="country-menu" style={{ position: 'absolute', right: 0, top: 44, background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 20, boxShadow: '0 10px 20px rgba(0,0,0,0.08)', width: '100%', overflow: 'hidden', display: 'none', zIndex: 10 }}>
                        {[
                          { v: '', l: t('notSelected') || 'Not Selected' },
                          { v: 'KR', l: 'South Korea' },
                          { v: 'US', l: 'United States' },
                          { v: 'JP', l: 'Japan' },
                          { v: 'CN', l: 'China' },
                          { v: 'ES', l: 'Spain' },
                        ].map(opt => (
                          <button key={opt.v || 'none'} onClick={(ev) => { ev.preventDefault(); setForm((f:any) => ({ ...f, country: opt.v })); const el = document.getElementById('country-menu') as HTMLDivElement; if (el) el.style.display = 'none'; }} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 10, padding: '10px 12px', background: (form as any).country === opt.v ? '#f3f4f6' : '#ffffff', border: 0, cursor: 'pointer' }}>
                            <span style={{ fontSize: 14 }}>{opt.l}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ position: 'relative' }} data-dropdown>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          const menu = document.getElementById('lang-menu-inline');
                          if (menu) menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
                        }}
                        style={{
                          appearance: 'none',
                          border: '1px solid #e5e7eb',
                          background: '#ffffff',
                          color: '#111827',
                          height: 38,
                          padding: '0 14px',
                          borderRadius: 999,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          cursor: 'pointer',
                          fontSize: 14,
                          width: '100%'
                        }}
                      >
                        <span style={{ fontSize: 18 }}>
                          {form.preferredLanguage === 'en' && '🇺🇸'}
                          {form.preferredLanguage === 'ko' && '🇰🇷'}
                          {form.preferredLanguage === 'zh' && '🇨🇳'}
                          {form.preferredLanguage === 'ja' && '🇯🇵'}
                          {form.preferredLanguage === 'es' && '🇪🇸'}
                          {!form.preferredLanguage && '❓'}
                        </span>
                        <span style={{ fontSize: 14 }}>
                          {form.preferredLanguage === 'en' && 'English'}
                          {form.preferredLanguage === 'ko' && '한국어'}
                          {form.preferredLanguage === 'zh' && '中文'}
                          {form.preferredLanguage === 'ja' && '日本語'}
                          {form.preferredLanguage === 'es' && 'Español'}
                          {!form.preferredLanguage && (t('notSelected') || 'Not Selected')}
                        </span>
                        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: 16, height: 16, marginLeft: 'auto' }}>
                          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.09 1.03l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.26a.75.75 0 01.02-1.06z" fill="#6b7280"/>
                        </svg>
                      </button>
                      <div id="lang-menu-inline" style={{ position: 'absolute', right: 0, top: 44, background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 20, boxShadow: '0 10px 20px rgba(0,0,0,0.08)', width: '100%', overflow: 'hidden', display: 'none', zIndex: 10 }}>
                        {[
                          { code: '', label: t('notSelected') || 'Not Selected', icon: '❓' },
                          { code: 'en', label: 'English', icon: '🇺🇸' },
                          { code: 'ko', label: '한국어', icon: '🇰🇷' },
                          { code: 'zh', label: '中文', icon: '🇨🇳' },
                          { code: 'ja', label: '日本語', icon: '🇯🇵' },
                          { code: 'es', label: 'Español', icon: '🇪🇸' },
                        ].map((opt) => (
                          <button key={opt.code || 'none'} onClick={(ev) => { ev.preventDefault(); setForm((f) => ({ ...f, preferredLanguage: opt.code as any })); (document.getElementById('lang-menu-inline') as HTMLDivElement).style.display = 'none'; }} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 10, padding: '10px 12px', background: form.preferredLanguage === opt.code ? '#f3f4f6' : '#ffffff', border: 0, cursor: 'pointer' }}>
                            <span style={{ fontSize: 18 }}>{opt.icon}</span>
                            <span style={{ fontSize: 14 }}>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Control>
              </Row>
            </Grid2>
          </Section>
          <Section>
            <SectionTitle>{t("securityContact") || "Security & Contact"}</SectionTitle>
            <Label>
              {t("email") || "Email"}
              <VerificationPill verified={phoneVerified}>
                {emailVerified ? (
                  <>
                    <svg viewBox="0 0 20 20" fill="#10b981" width="14" height="14"><path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"/></svg>
                    {t("verified") || "Verified"}
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 20 20" fill="#9ca3af" width="14" height="14"><path d="M10 8.586L5.293 3.879A1 1 0 103.879 5.293L8.586 10l-4.707 4.707a1 1 0 101.414 1.414L10 11.414l4.707 4.707a1 1 0 001.414-1.414L11.414 10l4.707-4.707a1 1 0 10-1.414-1.414L10 8.586z"/></svg>
                    {t("notVerified") || "Not verified"}
                  </>
                )}
              </VerificationPill>
            </Label>
            <Control style={{ flexDirection: "column", alignItems: "stretch" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Input type="email" value={form.email} onChange={onChange("email")} placeholder={t("emailPlaceholder") || "you@example.com"} />
                {!emailVerified && (
                  <VerifyButton type="button" onClick={sendEmailVerification} disabled={!form.email}>
                    {t("verify") || "Verify"}
                  </VerifyButton>
                )}
              </div>
            </Control>

            <Label style={{ marginTop: 12 }}>
              {t("phoneNumber") || "Phone number"}
              <VerificationPill verified={phoneVerified}>
                {phoneVerified ? (
                  <>
                    <svg viewBox="0 0 20 20" fill="#10b981" width="14" height="14"><path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"/></svg>
                    {t("verified") || "Verified"}
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 20 20" fill="#9ca3af" width="14" height="14"><path d="M10 8.586L5.293 3.879A1 1 0 103.879 5.293L8.586 10l-4.707 4.707a1 1 0 101.414 1.414L10 11.414l4.707 4.707a1 1 0 001.414-1.414L11.414 10l4.707-4.707a1 1 0 10-1.414-1.414L10 8.586z"/></svg>
                    {t("notVerified") || "Not verified"}
                  </>
                )}
              </VerificationPill>
            </Label>
            <Control style={{ flexDirection: "column", alignItems: "stretch" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Input value={form.phone} onChange={onChange("phone")} placeholder={t("phonePlaceholder") || "e.g. +82 10-1234-5678"} />
                {!phoneVerified && (
                  <VerifyButton type="button" onClick={sendPhoneCode} disabled={!form.phone}>
                    {t("verify") || "Verify"}
                  </VerifyButton>
                )}
              </div>
              {showPhoneVerification && !phoneVerified && (
                <VerificationSection>
                  <Input 
                    value={phoneCode} 
                    onChange={(e) => setPhoneCode(e.target.value)} 
                    placeholder={t("enterVerificationCode") || "Enter verification code"} 
                    style={{ flex: 1 }}
                  />
                  <Button type="button" $primary onClick={verifyPhone}>
                    {t("confirm") || "Confirm"}
                  </Button>
                </VerificationSection>
              )}
            </Control>
          </Section>
          {/* Removed duplicate language button per request */}
          <Section>
            <SectionTitle>{t("aboutYou") || "About you"}</SectionTitle>
            <Label>{t("bio") || "Bio"}</Label>
            <Control>
              <TextArea value={form.bio} onChange={onChange("bio")} placeholder={t("bioPlaceholder") || "A short bio about you"} />
            </Control>
          </Section>

          <Actions style={{ gridColumn: "1 / -1" }}>
            <Button type="submit" $primary disabled={saving}>{saving ? (t("saving") || "Saving…") : (t("saveChanges") || "Save changes")}</Button>
          </Actions>
        </Body>
      </Card>
    </Page>
  );
}