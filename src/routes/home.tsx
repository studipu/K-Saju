import { styled } from "styled-components";
// Timeline features removed

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
`;

export function Home() {
  return (
    <Wrapper>
      {/* Home content goes here */}
    </Wrapper>
  );
}