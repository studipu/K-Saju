import { Link } from "react-router-dom";
import { styled } from "styled-components";
import { useI18n } from "../i18n/i18n";

const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow-y: auto;
  overflow-x: hidden;
`;

const Hero = styled.section`
  padding: 80px 24px 120px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="4"/><circle cx="10" cy="10" r="2"/><circle cx="50" cy="50" r="3"/></g></svg>') repeat;
    animation: float 20s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
`;

const Container = styled.div`
  max-width: 95%;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  @media (min-width: 1400px) {
    max-width: 1320px;
  }
`;

const MainTitle = styled.h1`
  font-size: clamp(48px, 8vw, 72px);
  font-weight: 900;
  color: white;
  margin: 0 0 24px 0;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  line-height: 1.1;
  letter-spacing: -0.02em;
  word-wrap: break-word;
  overflow-wrap: break-word;
  width: 100%;
`;

const Subtitle = styled.p`
  font-size: clamp(20px, 4vw, 28px);
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 48px 0;
  font-weight: 400;
  line-height: 1.4;
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-align: center;

  @media (min-width: 900px) {
    max-width: 800px;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 80px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(Link)`
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  color: white;
  padding: 20px 40px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 18px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 12px 40px rgba(255, 107, 107, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 50px rgba(255, 107, 107, 0.5);
  }
`;

const SecondaryButton = styled(Link)`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 18px 36px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 18px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
`;

const Features = styled.section`
  padding: 80px 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
`;

const FeaturesGrid = styled.div`
  max-width: 95%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;

  @media (min-width: 1400px) {
    max-width: 1320px;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(102, 126, 234, 0.1);
  border-radius: 24px;
  padding: 40px 32px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    border-color: rgba(102, 126, 234, 0.2);
  }
`;

const FeatureIcon = styled.div`
  font-size: 48px;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  margin: 0 auto 24px auto;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  color: white;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
`;

const FeatureTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px 0;
`;

const FeatureDescription = styled.p`
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
`;

const SectionTitle = styled.h2`
  font-size: 40px;
  font-weight: 800;
  text-align: center;
  margin: 0 0 64px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Testimonials = styled.section`
  padding: 80px 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #e8f2ff 100%);
`;

const TestimonialGrid = styled.div`
  max-width: 95%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;

  @media (min-width: 1400px) {
    max-width: 1320px;
  }
`;

const TestimonialCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  }
`;

const TestimonialText = styled.blockquote`
  font-size: 16px;
  line-height: 1.6;
  color: #374151;
  margin: 0 0 24px 0;
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const AuthorAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 18px;
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.div`
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
`;

const AuthorCountry = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const CTA = styled.section`
  padding: 80px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: 40px;
  font-weight: 800;
  color: white;
  margin: 0 0 24px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const CTADescription = styled.p`
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 40px 0;
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;

  @media (min-width: 700px) {
    max-width: 600px;
  }
`;

export function Home() {
  const { t, language } = useI18n();

  return (
    <Page>
      <Hero>
        <Container>
          <MainTitle>{t("heroTitle")}</MainTitle>
          <Subtitle>
            {language === "ko" ? t("heroSubtitle") : t("heroSubtitleKorean")}<br/>
            {language === "ko" ? t("heroSubtitleKorean") : t("heroSubtitle")}
          </Subtitle>
          <CTAButtons>
            <PrimaryButton to="/live-translation">
              {t("ctaLiveTranslation")}
            </PrimaryButton>
            <SecondaryButton to="/locations">
              {t("ctaFindLocations")}
            </SecondaryButton>
          </CTAButtons>
        </Container>
      </Hero>

      <Features>
        <Container>
          <SectionTitle>{t("whyKSajuTitle")}</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>🌍</FeatureIcon>
              <FeatureTitle>{t("multiLanguageTitle")}</FeatureTitle>
              <FeatureDescription>
                {t("multiLanguageDesc")}
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>🏮</FeatureIcon>
              <FeatureTitle>{t("traditionalSajuTitle")}</FeatureTitle>
              <FeatureDescription>
                {t("traditionalSajuDesc")}
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>🤝</FeatureIcon>
              <FeatureTitle>{t("verifiedBusinessTitle")}</FeatureTitle>
              <FeatureDescription>
                {t("verifiedBusinessDesc")}
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>🎯</FeatureIcon>
              <FeatureTitle>{t("personalizedMatchingTitle")}</FeatureTitle>
              <FeatureDescription>
                {t("personalizedMatchingDesc")}
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>💎</FeatureIcon>
              <FeatureTitle>{t("premiumExperienceTitle")}</FeatureTitle>
              <FeatureDescription>
                {t("premiumExperienceDesc")}
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>📱</FeatureIcon>
              <FeatureTitle>{t("easyBookingTitle")}</FeatureTitle>
              <FeatureDescription>
                {t("easyBookingDesc")}
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </Container>
      </Features>

      <Testimonials>
        <Container>
          <SectionTitle>{t("testimonialsTitle")}</SectionTitle>
          <TestimonialGrid>
            <TestimonialCard>
              <TestimonialText>
                "{t("testimonial1")}"
              </TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar>S</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>{t("customer1Name")}</AuthorName>
                  <AuthorCountry>{t("customer1Country")}</AuthorCountry>
                </AuthorInfo>
              </TestimonialAuthor>
            </TestimonialCard>

            <TestimonialCard>
              <TestimonialText>
                "{t("testimonial2")}"
              </TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar>田</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>{t("customer2Name")}</AuthorName>
                  <AuthorCountry>{t("customer2Country")}</AuthorCountry>
                </AuthorInfo>
              </TestimonialAuthor>
            </TestimonialCard>

            <TestimonialCard>
              <TestimonialText>
                "{t("testimonial3")}"
              </TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar>李</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>{t("customer3Name")}</AuthorName>
                  <AuthorCountry>{t("customer3Country")}</AuthorCountry>
                </AuthorInfo>
              </TestimonialAuthor>
            </TestimonialCard>
          </TestimonialGrid>
        </Container>
      </Testimonials>

      <CTA>
        <Container>
          <CTATitle>{t("ctaTitle")}</CTATitle>
          <CTADescription>
            {t("ctaDescription")}
          </CTADescription>
          <CTAButtons>
            <PrimaryButton to="/live-translation">
              {t("ctaStartTranslation")}
            </PrimaryButton>
            <SecondaryButton to="/locations">
              {t("ctaFindNearby")}
            </SecondaryButton>
          </CTAButtons>
        </Container>
      </CTA>
    </Page>
  );
}