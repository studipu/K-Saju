import { styled } from "styled-components";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;

// Tweet list removed

export default function Profile() {
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user;
      setUserId(u?.id ?? null);
      setAvatar((u?.user_metadata as any)?.avatar_url || undefined);
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
      setAvatar(avatarUrl);
      await supabase.auth.updateUser({ data: { avatar_url: avatarUrl } });
    }
  };
  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      <Name>My Profile</Name>
    </Wrapper>
  );
}