import { styled } from "styled-components";

const Wrapper = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 20px;
`;

export default function Messages() {
  return (
    <Wrapper>
      <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Messages</h1>
      <p style={{ color: "#6b7280", marginTop: 8 }}>Coming soon.</p>
    </Wrapper>
  );
}


