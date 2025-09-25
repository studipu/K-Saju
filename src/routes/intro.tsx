import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/i18n";
import starBg from "../assets/star_bg.png";

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.section`
  width: 100%;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background-image: url(${starBg});
  background-size: cover;
  background-position: center;
  background-repeat: repeat;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(76, 29, 149, 0.85);
    z-index: 1;
    pointer-events: none;
  }
`;

const HeroContent = styled.div`
  text-align: center;
  color: white;
  z-index: 2;
  max-width: 800px;
  padding: 0 2rem;
  position: relative;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CTAButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
  z-index: 2;
`;

const WhySection = styled.section`
  min-height: 100vh;
  padding: 4rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background-image: url(${starBg});
  background-size: cover;
  background-position: center;
  background-repeat: repeat;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(55, 48, 163, 0.75);
    z-index: 1;
    pointer-events: none;
  }
`;

const WhyContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const WhyHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 2;
`;

const WhyTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
`;

const WhyIcon = styled.span`
  font-size: 2rem;
  color: #8b5cf6;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.98);
  }
`;

const FeatureHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  flex-shrink: 0;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const FeatureDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
  font-size: 1rem;
  margin: 0;
`;

export function Intro() {
  const { t } = useI18n();
  const navigate = useNavigate();

  const whyFeatures = [
    {
      id: 1,
      title: "다국어 지원",
      icon: "🌍",
      description: "영어, 중국어, 일본어, 스페인어로 실시간 번역 서비스를 제공하여 언어 장벽 없이 정확한 사주 풀이를 받으실 수 있습니다."
    },
    {
      id: 2,
      title: "전통 사주풀이",
      icon: "🏮",
      description: "수백 년의 역사를 가진 한국 전통 사주풀이 기법으로 당신의 운명과 미래를 정확하게 해석해드립니다."
    },
    {
      id: 3,
      title: "검증된 업체",
      icon: "🤝",
      description: "엄선된 전문 사주풀이 업체들과 매칭되어 신뢰할 수 있는 고품질의 상담 서비스를 경험하세요."
    },
    {
      id: 4,
      title: "맞춤형 매칭",
      icon: "🎯",
      description: "당신의 위치, 선호도, 예산에 맞는 최적의 사주 풀이 업체를 AI가 추천해드립니다."
    },
    {
      id: 5,
      title: "프리미엄 경험",
      icon: "💎",
      description: "한국 문화의 깊이를 느낄 수 있는 특별한 경험과 기억에 남을 문화 체험을 제공합니다."
    },
    {
      id: 6,
      title: "편리한 예약",
      icon: "📱",
      description: "간편한 온라인 예약 시스템으로 언제 어디서나 쉽게 사주풀이 상담을 예약하실 수 있습니다."
    }
  ];

  const handleGetStarted = () => {
    navigate('/');
  };

  return (
    <Wrapper>
      <HeroSection>
        <BackgroundPattern />
        <HeroContent>
          <HeroTitle>
            {t("whyChooseUs", "Why Choose K-Saju?")}
          </HeroTitle>
          <HeroSubtitle>
            {t("introSubtitle", "Discover the ancient wisdom of Korean fortune telling with modern convenience and multilingual support.")}
          </HeroSubtitle>
          <CTAButton onClick={handleGetStarted}>
            {t("getStarted", "Get Started")}
          </CTAButton>
        </HeroContent>
      </HeroSection>
      
      <WhySection>
        <WhyContainer>
          <WhyHeader>
            <WhyTitle>
              <WhyIcon>⭐</WhyIcon>
              왜 K-Saju인가요?
            </WhyTitle>
          </WhyHeader>
          
          <FeaturesGrid>
            {whyFeatures.map((feature) => (
              <FeatureCard key={feature.id}>
                <FeatureHeader>
                  <FeatureIcon>{feature.icon}</FeatureIcon>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                </FeatureHeader>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </WhyContainer>
      </WhySection>
    </Wrapper>
  );
}
