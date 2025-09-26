import { styled } from "styled-components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/i18n";
import { supabase } from "../supabase";
import starBg from "../assets/star_bg.png";
import heroBg from "../assets/hero_bg.jpg";
import { 
  SparklesIcon, 
  PencilSquareIcon, 
  MicrophoneIcon, 
  MapPinIcon 
} from '@heroicons/react/24/outline';

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
  background-image: url(${heroBg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
`;

const HeroContent = styled.div`
  text-align: center;
  color: white;
  z-index: 1;
  max-width: 800px;
  padding: 0 2rem;
  position: relative;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const CTAButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
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
  z-index: 1;
`;

const PopularSection = styled.section`
  height: 50vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background-image: url(${starBg});
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(46, 16, 101, 0.85);
    z-index: 1;
    pointer-events: none;
  }
`;

const RecommendedSection = styled.section`
  height: 50vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background-image: url(${starBg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(46, 16, 101, 0.85) 0%,
      rgba(25, 25, 35, 0.9) 70%,
      rgba(15, 15, 15, 0.9) 100%
    );
    z-index: 1;
    pointer-events: none;
  }
`;

const HotDealsSection = styled.section`
  height: 50vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background-image: url(${starBg}) !important;
  background-size: cover !important;
  background-position: bottom !important;
  background-repeat: no-repeat !important;
  background-attachment: local !important;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(15, 15, 15, 0.9) 0%,
      rgba(0, 0, 0, 0.95) 100%
    ) !important;
    z-index: 1;
    pointer-events: none;
  }
`;

const SectionTitleContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 1.5rem auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin: 0;
  white-space: nowrap;
`;

const Divider = styled.div`
  flex: 1;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 30%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.1) 70%,
    transparent 100%
  );
`;


const AIServicesSectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #1f2937;
  position: relative;
  z-index: 2;
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  position: relative;
  max-width: 100%;
  width: 100%;
  z-index: 2;
`;

const CardsViewport = styled.div`
  width: 100%;
  max-width: 1200px; /* Smaller cards need less space */
  margin: 0 auto;
  position: relative;
  overflow: visible; /* 화살표가 보이도록 */
  padding: 0 80px; /* Reduced padding for smaller layout */
`;

const CardsInner = styled.div`
  width: 976px; /* Updated calculation: 4개 카드(220px × 4 = 880px) + 3개 간격(32px × 3 = 96px) = 976px */
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  padding: 0.75rem 0; /* Reduced padding for smaller components */
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
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(229, 231, 235, 0.5);
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
  z-index: 3;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: translateY(-50%);
  }
`;

const MoreCard = styled.div`
  width: 220px;
  flex-shrink: 0;
  background: rgba(243, 244, 246, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #374151;
  padding: 1.25rem;
  text-align: center;
  border: 1px solid rgba(229, 231, 235, 0.5);
  position: relative;
  z-index: 2;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    background: rgba(243, 244, 246, 0.95);
  }
`;

const MoreCardIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #9ca3af;
`;

const MoreCardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: #374151;
`;

const MoreCardSubtitle = styled.p`
  font-size: 0.8rem;
  color: #6b7280;
`;

const HotDealsCard = styled.div`
  width: 220px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border: 2px solid #f59e0b;
  position: relative;
  z-index: 2;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px -3px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.98);
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
  height: 35vh;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: #ffffff;
`;

const AIServicesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const AIServicesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AIServiceCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 15px -3px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;
  }
`;

const AIServiceIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;
  
  svg {
    width: 18px;
    height: 18px;
    color: white;
  }
  
  &:hover {
    transform: scale(1.05);
  }
`;

const AIServiceTitle = styled.h3`
  font-size: 0.8rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const AIServicesContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 1.5rem;
  
  @media (max-width: 768px) {
    padding-left: 0;
    text-align: center;
  }
`;

const AIServicesTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.75rem;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const AIServicesSubtitle = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
`;


const PopularCard = styled.div`
  width: 220px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
  z-index: 2;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px -3px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.98);
  }
`;

// Special card style for AI Services section (white background)
const AIServicesCard = styled.div`
  width: 220px;
  flex-shrink: 0;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
  z-index: 2;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px -3px rgba(0, 0, 0, 0.15);
    background: #f9fafb;
  }
`;

const CardImage = styled.div<{ $imageUrl?: string }>`
  width: 100%;
  height: 120px;
  background: ${props => 
    props.$imageUrl 
      ? `url(${props.$imageUrl})`
      : 'linear-gradient(45deg, #f3f4f6, #e5e7eb)'
  };
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 600;
`;

const CardContent = styled.div`
  padding: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #1f2937;
  line-height: 1.3;
`;

const CardPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #059669;
  margin-bottom: 0.5rem;
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

// Types for Supabase data
interface LocationService {
  id: number;
  title: string;
  tagline?: string;
  image_url?: string;
  price_krw: number;
  activity_level?: string;
  skill_level?: string;
  max_guests_total?: number;
  min_age?: number;
  place_id: number;
}

export function Home() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recommendedIndex, setRecommendedIndex] = useState(0);
  const [hotDealsIndex, setHotDealsIndex] = useState(0);
  
  // State for Supabase data
  const [services, setServices] = useState<LocationService[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch services from Supabase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('id, title, tagline, image_url, price_krw, activity_level, skill_level, max_guests_total, min_age, place_id');
        
        if (error) {
          console.error('Error fetching services:', error);
        } else if (data) {
          setServices(data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const aiServices = [
    {
      id: 1,
      title: t("todayFortune"),
      icon: SparklesIcon
    },
    {
      id: 2,
      title: t("nameCreation"),
      icon: PencilSquareIcon
    },
    {
      id: 3,
      title: "실시간 통역",
      icon: MicrophoneIcon
    },
    {
      id: 4,
      title: t("nearbySearch"),
      icon: MapPinIcon
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

  // Generate random rating for demo purposes
  const getRandomRating = () => {
    return Math.round((Math.random() * 1.5 + 3.5) * 10) / 10; // Between 3.5 and 5.0
  };

  // Transform Supabase data for display
  const transformServiceData = (service: LocationService, index: number) => ({
    id: service.id,
    title: service.title,
    price: getPrice(service.price_krw),
    rating: getRandomRating(),
    image: service.image_url || `사주 서비스 ${index + 1}`,
    tagline: service.tagline
  });

  // Split services into categories
  const popularServices = services.slice(0, 7).map(transformServiceData);
  const recommendedServices = services.slice(7, 14).map(transformServiceData);
  const hotDealsServices = services.slice(14, 21).map((service, index) => ({
    ...transformServiceData(service, index),
    originalPrice: getPrice(service.price_krw * 1.5), // Simulate original price
    discount: "33%"
  }));


  const cardsPerView = 4;
  const cardWidth = 220; // Updated width for smaller cards
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
    if (serviceId === 1) { // 오늘의 운세 (id: 1)
      navigate('/today-fortune');
    } else if (serviceId === 2) { // 이름 작명 (id: 2)
      navigate('/name-creation');
    } else if (serviceId === 3) { // 실시간 통역 (id: 3)
      navigate('/live-translation');
    } else if (serviceId === 4) { // 근처 찾기 (id: 4)
      navigate('/locations');
    }
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

  // Show loading state while fetching data
  if (loading) {
    return (
      <Wrapper>
        <HeroSection>
          <BackgroundPattern />
          <HeroContent>
            <HeroTitle>Loading...</HeroTitle>
          </HeroContent>
        </HeroSection>
      </Wrapper>
    );
  }

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
        <AIServicesContainer>
          <AIServicesGrid>
            {aiServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <AIServiceCard key={service.id} onClick={() => handleAIServiceClick(service.id)}>
                  <AIServiceIcon>
                    <IconComponent />
                  </AIServiceIcon>
                  <AIServiceTitle>{service.title}</AIServiceTitle>
                </AIServiceCard>
              );
            })}
          </AIServicesGrid>
          
          <AIServicesContent>
            <AIServicesTitle>AI-Powered Saju Services</AIServicesTitle>
            <AIServicesSubtitle>
              Experience the future of Korean fortune telling with our advanced AI technology. 
              Get instant insights, personalized readings, and connect with traditional wisdom 
              through modern innovation.
            </AIServicesSubtitle>
          </AIServicesContent>
        </AIServicesContainer>
      </AIServicesSection>
      
      <PopularSection>
        <SectionTitleContainer>
          <Divider />
          <SectionTitle>{t("popularServices")}</SectionTitle>
          <Divider />
        </SectionTitleContainer>
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
                    <CardImage $imageUrl={service.image && service.image.startsWith('http') ? service.image : undefined}>
                      {!service.image || !service.image.startsWith('http') ? service.image || 'No Image' : ''}
                    </CardImage>
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

              <RecommendedSection>
        <SectionTitleContainer>
          <Divider />
          <SectionTitle>{t("recommendedBy")}</SectionTitle>
          <Divider />
        </SectionTitleContainer>
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
                    <CardImage $imageUrl={service.image && service.image.startsWith('http') ? service.image : undefined}>
                      {!service.image || !service.image.startsWith('http') ? service.image || 'No Image' : ''}
                    </CardImage>
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
              </RecommendedSection>

      <HotDealsSection>
        <SectionTitleContainer>
          <Divider />
          <SectionTitle>{t("hotDeals")}</SectionTitle>
          <Divider />
        </SectionTitleContainer>
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
                    <CardImage $imageUrl={service.image && service.image.startsWith('http') ? service.image : undefined}>
                      {!service.image || !service.image.startsWith('http') ? service.image || 'No Image' : ''}
                    </CardImage>
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
      </HotDealsSection>
    </Wrapper>
  );
}