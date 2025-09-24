import { styled } from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/i18n";

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.section`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const HeroContent = styled.div`
  text-align: center;
  color: white;
  z-index: 2;
  max-width: 800px;
  padding: 0 2rem;
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
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  z-index: 1;
`;

const PopularSection = styled.section`
  padding: 4rem 2rem;
  background: #f8fafc;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: #1f2937;
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  position: relative;
  max-width: 100%;
  width: 100%;
`;

const CardsViewport = styled.div`
  width: 100%;
  max-width: 1500px; /* 4개 카드 + 3개 간격 + 화살표 공간 */
  margin: 0 auto;
  position: relative;
  overflow: visible; /* 화살표가 보이도록 */
  padding: 0 100px; /* 화살표 버튼을 위한 충분한 좌우 패딩 */
`;

const CardsInner = styled.div`
  width: 1296px; /* 정확한 계산: 4개 카드(300px × 4 = 1200px) + 3개 간격(32px × 3 = 96px) = 1296px */
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  padding: 1rem 0; /* 상하 패딩 추가로 hover 시 잘림 방지 */
`;

const CardsWrapper = styled.div<{ translateX: number }>`
  display: flex;
  gap: 2rem;
  transform: translateX(${props => props.translateX}px);
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  width: fit-content;
`;

const NavButton = styled.button<{ position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.position === 'left' ? 'left: 30px;' : 'right: 30px;'}
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  color: #6b7280;
  z-index: 10;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: translateY(-50%);
  }
`;

const MoreCard = styled.div`
  width: 300px;
  flex-shrink: 0;
  background: #f3f4f6;
  border-radius: 16px;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #374151;
  padding: 2rem;
  text-align: center;
  border: 1px solid #e5e7eb;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const MoreCardIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #9ca3af;
`;

const MoreCardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #374151;
`;

const MoreCardSubtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
`;

const HotDealsCard = styled.div`
  width: 300px;
  flex-shrink: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border: 2px solid #f59e0b;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
  }
`;

const DiscountBadge = styled.div`
  background: #f59e0b;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 0.5rem;
`;

const OriginalPrice = styled.div`
  font-size: 0.9rem;
  color: #9ca3af;
  text-decoration: line-through;
  margin-bottom: 0.25rem;
`;

const AIServicesSection = styled.section`
  padding: 4rem 2rem;
  background: #f8fafc;
`;

const AIServicesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 4rem;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 3rem;
  }
`;

const AIServiceCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const AIServiceIcon = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  color: white;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 25px -5px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 35px -5px rgba(102, 126, 234, 0.4);
  }
`;

const AIServiceTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
`;

const PopularCard = styled.div`
  width: 300px;
  flex-shrink: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(45deg, #f3f4f6, #e5e7eb);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #6b7280;
  font-weight: 600;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1f2937;
`;

const CardPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #059669;
  margin-bottom: 1rem;
`;

const CardRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled.span`
  color: #fbbf24;
  font-size: 1.2rem;
`;

const RatingText = styled.span`
  color: #6b7280;
  font-size: 0.9rem;
`;

export function Home() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recommendedIndex, setRecommendedIndex] = useState(0);
  const [hotDealsIndex, setHotDealsIndex] = useState(0);

  const aiServices = [
    {
      id: 1,
      title: t("todayFortune"),
      icon: "🍀"
    },
    {
      id: 2,
      title: t("sajuAnalysis"),
      icon: "📅"
    },
    {
      id: 3,
      title: t("nearbySearch"),
      icon: "🗺️"
    },
    {
      id: 4,
      title: t("nameCreation"),
      icon: "✍️"
    }
  ];
  
  const getPrice = (basePrice: number) => {
    const { language } = useI18n();
    const exchangeRates = {
      ko: 1, // 원화 기준
      en: 0.00075, // USD (1원 = 0.00075달러)
      zh: 0.0054, // CNY (1원 = 0.0054위안)
      ja: 0.11, // JPY (1원 = 0.11엔)
      es: 0.00069 // EUR (1원 = 0.00069유로)
    };
    
    const rate = exchangeRates[language] || 1;
    const convertedPrice = Math.round(basePrice * rate);
    
    switch (language) {
      case 'ko': return `₩${convertedPrice.toLocaleString()}`;
      case 'en': return `$${convertedPrice}`;
      case 'zh': return `¥${convertedPrice}`;
      case 'ja': return `¥${convertedPrice}`;
      case 'es': return `€${convertedPrice}`;
      default: return `₩${convertedPrice.toLocaleString()}`;
    }
  };

  const popularServices = [
    {
      id: 1,
      title: t("aiSajuAnalysis"),
      price: getPrice(29900),
      rating: 4.8,
      image: "사주 서비스 1"
    },
    {
      id: 2,
      title: t("compatibilityAnalysis"),
      price: getPrice(19900),
      rating: 4.5,
      image: "사주 서비스 2"
    },
    {
      id: 3,
      title: t("nameCreationService"),
      price: getPrice(39900),
      rating: 4.9,
      image: "사주 서비스 3"
    },
    {
      id: 4,
      title: t("tarotCard"),
      price: getPrice(49900),
      rating: 4.7,
      image: "사주 서비스 4"
    },
    {
      id: 5,
      title: t("todayFortuneService"),
      price: getPrice(34900),
      rating: 4.6,
      image: "사주 서비스 5"
    },
    {
      id: 6,
      title: t("sajuConsultation"),
      price: getPrice(59900),
      rating: 4.9,
      image: "사주 서비스 6"
    },
    {
      id: 7,
      title: t("dreamInterpretation"),
      price: getPrice(69900),
      rating: 4.8,
      image: "사주 서비스 7"
    }
  ];

  const recommendedServices = [
    {
      id: 1,
      title: t("aiSajuConsultation"),
      price: getPrice(39900),
      rating: 4.9,
      image: "추천 서비스 1"
    },
    {
      id: 1,
      title: t("compatibilityAnalysisPro"),
      price: getPrice(44900),
      rating: 4.7,
      image: "추천 서비스 2"
    },
    {
      id: 1,
      title: t("nameCreationPro"),
      price: getPrice(54900),
      rating: 4.8,
      image: "추천 서비스 3"
    },
    {
      id: 1,
      title: t("tarotReading"),
      price: getPrice(24900),
      rating: 4.6,
      image: "추천 서비스 4"
    },
    {
      id: 1,
      title: t("dreamConsultation"),
      price: getPrice(34900),
      rating: 4.7,
      image: "추천 서비스 5"
    },
    {
      id: 1,
      title: t("fortuneAnalysis"),
      price: getPrice(49900),
      rating: 4.9,
      image: "추천 서비스 6"
    },
    {
      id: 1,
      title: t("sajuMyeongri"),
      price: getPrice(64900),
      rating: 4.8,
      image: "추천 서비스 7"
    }
  ];

  const hotDealsServices = [
    {
      id: 1,
      title: t("sajuPackage"),
      price: getPrice(99900),
      originalPrice: getPrice(149900),
      discount: "33%",
      rating: 4.9,
      image: "핫딜 서비스 1"
    },
    {
      id: 1,
      title: t("annualSaju"),
      price: getPrice(199900),
      originalPrice: getPrice(299900),
      discount: "33%",
      rating: 4.8,
      image: "핫딜 서비스 2"
    },
    {
      id: 1,
      title: t("newMemberBenefit"),
      price: getPrice(9900),
      originalPrice: getPrice(29900),
      discount: "67%",
      rating: 4.7,
      image: "핫딜 서비스 3"
    },
    {
      id: 1,
      title: t("premiumSaju"),
      price: getPrice(79900),
      originalPrice: getPrice(99900),
      discount: "20%",
      rating: 4.9,
      image: "핫딜 서비스 4"
    },
    {
      id: 1,
      title: t("businessSaju"),
      price: getPrice(149900),
      originalPrice: getPrice(199900),
      discount: "25%",
      rating: 4.8,
      image: "핫딜 서비스 5"
    },
    {
      id: 1,
      title: t("sajuMasterPack"),
      price: getPrice(299900),
      originalPrice: getPrice(399900),
      discount: "25%",
      rating: 4.9,
      image: "핫딜 서비스 6"
    },
    {
      id: 1,
      title: t("sajuStarterPack"),
      price: getPrice(14900),
      originalPrice: getPrice(24900),
      discount: "40%",
      rating: 4.6,
      image: "핫딜 서비스 7"
    }
  ];

  const cardsPerView = 4;
  const cardWidth = 300; // min-width of each card
  const cardGap = 32; // 2rem = 32px
  const totalCardWidth = cardWidth + cardGap;
  
  const totalCards = popularServices.length + 1; // +1 for more card
  const maxIndex = Math.max(0, Math.ceil(totalCards / cardsPerView) - 1);
  
  // 4개씩만 보이도록 슬라이드 계산
  const translateX = -currentIndex * cardsPerView * totalCardWidth;
  const recommendedTranslateX = -recommendedIndex * cardsPerView * totalCardWidth;
  const hotDealsTranslateX = -hotDealsIndex * cardsPerView * totalCardWidth;

  const handlePrev = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
  };

  const handleRecommendedPrev = () => {
    setRecommendedIndex(Math.max(0, recommendedIndex - 1));
  };

  const handleRecommendedNext = () => {
    setRecommendedIndex(Math.min(maxIndex, recommendedIndex + 1));
  };

  const handleHotDealsPrev = () => {
    setHotDealsIndex(Math.max(0, hotDealsIndex - 1));
  };

  const handleHotDealsNext = () => {
    setHotDealsIndex(Math.min(maxIndex, hotDealsIndex + 1));
  };

  const handleMoreClick = () => {
    // 더보기 버튼 클릭 시 처리 (예: 모든 서비스 보기 페이지로 이동)
    console.log('더보기 클릭');
  };

  const handleBusinessClick = (businessId: number) => {
    navigate(`/business/${businessId}`);
  };

  const handleScrollToServices = () => {
    const aiServicesSection = document.getElementById('ai-services-section');
    if (aiServicesSection) {
      aiServicesSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleAIServiceClick = (serviceId: number) => {
    if (serviceId === 3) { // 근처 찾기 (id: 3)
      navigate('/locations');
    }
    // 다른 서비스들은 필요에 따라 추가 처리
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i}>★</Star>);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half">☆</Star>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`}>☆</Star>);
    }
    
    return stars;
  };

  return (
    <Wrapper>
      <HeroSection>
        <BackgroundPattern />
        <HeroContent>
          <HeroTitle>
            {t("heroTitle").split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < t("heroTitle").split('\n').length - 1 && <br />}
              </span>
            ))}
          </HeroTitle>
          <HeroSubtitle>
            {t("heroSubtitle").split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < t("heroSubtitle").split('\n').length - 1 && <br />}
              </span>
            ))}
          </HeroSubtitle>
          <CTAButton onClick={handleScrollToServices}>
            {t("heroButton")}
          </CTAButton>
        </HeroContent>
      </HeroSection>
      
      <AIServicesSection id="ai-services-section">
        <SectionTitle>{t("aiServices")}</SectionTitle>
        <AIServicesContainer>
          {aiServices.map((service) => (
            <AIServiceCard key={service.id} onClick={() => handleAIServiceClick(service.id)}>
              <AIServiceIcon>
                {service.icon}
              </AIServiceIcon>
              <AIServiceTitle>{service.title}</AIServiceTitle>
            </AIServiceCard>
          ))}
        </AIServicesContainer>
      </AIServicesSection>
      
      <PopularSection>
        <SectionTitle>{t("popularServices")}</SectionTitle>
        <CardsContainer>
          <CardsViewport>
            <NavButton 
              position="left" 
              onClick={handlePrev} 
              disabled={currentIndex === 0}
            >
              ‹
            </NavButton>
            
            <CardsInner>
              <CardsWrapper translateX={translateX}>
                {popularServices.map((service) => (
                  <PopularCard key={service.id} onClick={() => handleBusinessClick(service.id)}>
                    <CardImage>{service.image}</CardImage>
                    <CardContent>
                      <CardTitle>{service.title}</CardTitle>
                      <CardPrice>{service.price}</CardPrice>
                      <CardRating>
                        <Stars>
                          {renderStars(service.rating)}
                        </Stars>
                        <RatingText>({service.rating})</RatingText>
                      </CardRating>
                    </CardContent>
                  </PopularCard>
                ))}
                
                <MoreCard onClick={handleMoreClick}>
                  <MoreCardIcon>➕</MoreCardIcon>
                  <MoreCardTitle>더보기</MoreCardTitle>
                  <MoreCardSubtitle>모든 서비스 보기</MoreCardSubtitle>
                </MoreCard>
              </CardsWrapper>
            </CardsInner>
            
            <NavButton 
              position="right" 
              onClick={handleNext} 
              disabled={currentIndex >= maxIndex}
            >
              ›
            </NavButton>
          </CardsViewport>
        </CardsContainer>
      </PopularSection>

      <PopularSection>
        <SectionTitle>{t("recommendedBy")}</SectionTitle>
        <CardsContainer>
          <CardsViewport>
            <NavButton 
              position="left" 
              onClick={handleRecommendedPrev} 
              disabled={recommendedIndex === 0}
            >
              ‹
            </NavButton>
            
            <CardsInner>
              <CardsWrapper translateX={recommendedTranslateX}>
                {recommendedServices.map((service) => (
                  <PopularCard key={service.id} onClick={() => handleBusinessClick(service.id)}>
                    <CardImage>{service.image}</CardImage>
                    <CardContent>
                      <CardTitle>{service.title}</CardTitle>
                      <CardPrice>{service.price}</CardPrice>
                      <CardRating>
                        <Stars>
                          {renderStars(service.rating)}
                        </Stars>
                        <RatingText>({service.rating})</RatingText>
                      </CardRating>
                    </CardContent>
                  </PopularCard>
                ))}
                
                <MoreCard onClick={handleMoreClick}>
                  <MoreCardIcon>➕</MoreCardIcon>
                  <MoreCardTitle>더보기</MoreCardTitle>
                  <MoreCardSubtitle>모든 서비스 보기</MoreCardSubtitle>
                </MoreCard>
              </CardsWrapper>
            </CardsInner>
            
            <NavButton 
              position="right" 
              onClick={handleRecommendedNext} 
              disabled={recommendedIndex >= maxIndex}
            >
              ›
            </NavButton>
          </CardsViewport>
        </CardsContainer>
      </PopularSection>

      <PopularSection>
        <SectionTitle>{t("hotDeals")}</SectionTitle>
        <CardsContainer>
          <CardsViewport>
            <NavButton 
              position="left" 
              onClick={handleHotDealsPrev} 
              disabled={hotDealsIndex === 0}
            >
              ‹
            </NavButton>
            
            <CardsInner>
              <CardsWrapper translateX={hotDealsTranslateX}>
                {hotDealsServices.map((service) => (
                  <HotDealsCard key={service.id} onClick={() => handleBusinessClick(service.id)}>
                    <CardImage>{service.image}</CardImage>
                    <CardContent>
                      <DiscountBadge>{service.discount} 할인</DiscountBadge>
                      <CardTitle>{service.title}</CardTitle>
                      <OriginalPrice>{service.originalPrice}</OriginalPrice>
                      <CardPrice>{service.price}</CardPrice>
                      <CardRating>
                        <Stars>
                          {renderStars(service.rating)}
                        </Stars>
                        <RatingText>({service.rating})</RatingText>
                      </CardRating>
                    </CardContent>
                  </HotDealsCard>
                ))}
                
                <MoreCard onClick={handleMoreClick}>
                  <MoreCardIcon>➕</MoreCardIcon>
                  <MoreCardTitle>더보기</MoreCardTitle>
                  <MoreCardSubtitle>모든 서비스 보기</MoreCardSubtitle>
                </MoreCard>
              </CardsWrapper>
            </CardsInner>
            
            <NavButton 
              position="right" 
              onClick={handleHotDealsNext} 
              disabled={hotDealsIndex >= maxIndex}
            >
              ›
            </NavButton>
          </CardsViewport>
        </CardsContainer>
      </PopularSection>
    </Wrapper>
  );
}