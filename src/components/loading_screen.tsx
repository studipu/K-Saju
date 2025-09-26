import { styled } from "styled-components";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json";

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
`;

const LottieContainer = styled.div`
  width: 200px;
  height: 200px;
`;

export default function LoadingScreen() {
  return (
    <Wrapper>
      <LottieContainer>
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          autoplay={true}
        />
      </LottieContainer>
    </Wrapper>
  );
}