import { styled } from "styled-components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/i18n";
import { supabase } from "../supabase";

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
  
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 0.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: #1f2937;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  position: relative;
  max-width: 100%;
  width: 100%;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 0.5rem 0;
  }
`;

const CardsViewport = styled.div`
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  padding: 0 100px;
  
  @media (max-width: 1200px) {
    padding: 0 80px;
  }
  
  @media (max-width: 768px) {
    padding: 0 60px;
  }
  
  @media (max-width: 480px) {
    padding: 0 50px;
  }
`;

const CardsInner = styled.div`
  width: 100%;
  max-width: 1296px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  padding: 1rem 0;
  
  @media (max-width: 768px) {
    padding: 0.5rem 0;
  }
`;

const CardsWrapper = styled.div<{ translateX: number }>`
  display: flex;
  gap: 2rem;
  transform: translateX(${props => props.translateX}px);
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  width: fit-content;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
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
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
    ${props => props.position === 'left' ? 'left: 20px;' : 'right: 20px;'}
  }
  
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 0.9rem;
    ${props => props.position === 'left' ? 'left: 15px;' : 'right: 15px;'}
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
  
  @media (max-width: 1200px) {
    width: 280px;
    padding: 1.75rem;
  }
  
  @media (max-width: 768px) {
    width: 200px;
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    width: 180px;
    padding: 1.25rem;
  }
  
  @media (max-width: 360px) {
    width: 160px;
    padding: 1rem;
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
  
  @media (max-width: 1200px) {
    width: 280px;
  }
  
  @media (max-width: 768px) {
    width: 200px;
  }
  
  @media (max-width: 480px) {
    width: 180px;
  }
  
  @media (max-width: 360px) {
    width: 160px;
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
  
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 0.5rem;
  }
`;

const AIServicesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 4rem;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 1200px) {
    gap: 3rem;
  }
  
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    max-width: 600px;
  }
  
  @media (max-width: 480px) {
    gap: 1.5rem;
    max-width: 400px;
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
  
  @media (max-width: 768px) {
    width: 100%;
  }
  
  @media (max-width: 480px) {
    width: 100%;
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
  
  @media (max-width: 1200px) {
    width: 120px;
    height: 120px;
    font-size: 3rem;
  }
  
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }
  
  @media (max-width: 480px) {
    width: 70px;
    height: 70px;
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }
`;

const AIServiceTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

// "왜 K-Saju인가요?" 섹션 스타일
const WhySection = styled.section`
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 0.5rem;
  }
`;

const WhyContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const WhyHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const WhyTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const WhyIcon = styled.span`
  font-size: 2rem;
  color: #8b5cf6;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    border-radius: 8px;
  }
`;

const FeatureHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }
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
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const FeatureDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
  font-size: 1rem;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    line-height: 1.4;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    line-height: 1.3;
  }
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
  
  @media (max-width: 1200px) {
    width: 280px;
  }
  
  @media (max-width: 768px) {
    width: 200px;
  }
  
  @media (max-width: 480px) {
    width: 180px;
  }
  
  @media (max-width: 360px) {
    width: 160px;
  }
`;

const CardImage = styled.div<{ $imageUrl?: string }>`
  width: 100%;
  height: 200px;
  background: ${props => props.$imageUrl 
    ? `url(${props.$imageUrl})` 
    : 'linear-gradient(45deg, #f3f4f6, #e5e7eb)'
  };
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #6b7280;
  font-weight: 600;
  
  @media (max-width: 768px) {
    height: 180px;
    font-size: 1.25rem;
  }
  
  @media (max-width: 480px) {
    height: 160px;
    font-size: 1rem;
  }
  
  @media (max-width: 360px) {
    height: 140px;
    font-size: 0.9rem;
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
  
  @media (max-width: 360px) {
    padding: 0.75rem;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1f2937;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
  
  @media (max-width: 360px) {
    font-size: 0.9rem;
  }
`;

const CardPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #059669;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
  
  @media (max-width: 360px) {
    font-size: 1.1rem;
  }
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
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
  
  @media (max-width: 360px) {
    font-size: 0.9rem;
  }
`;

const RatingText = styled.span`
  color: #6b7280;
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 360px) {
    font-size: 0.75rem;
  }
`;

export function Home() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recommendedIndex, setRecommendedIndex] = useState(0);
  const [hotDealsIndex, setHotDealsIndex] = useState(0);
  const [locationsData, setLocationsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Supabase에서 locations 데이터 가져오기
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('locations')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching locations:', error);
        } else {
          setLocationsData(data || []);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // "왜 K-Saju인가요?" 기능 데이터
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

  const aiServices = [
    {
      id: 1,
      title: t("todayFortune"),
      icon: "🍀"
    },
    {
      id: 2,
      title: t("nameCreation"),
      icon: "✍️"
    },
    {
      id: 3,
      title: "실시간 통역",
      icon: "🎙️"
    },
    {
      id: 4,
      title: t("nearbySearch"),
      icon: "🗺️"
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

  // locations 데이터를 사용한 인기 서비스
  const popularServices = locationsData.slice(0, 7).map((location, index) => ({
    id: location.id || index + 1,
    title: location.name || location.title || `사주 서비스 ${index + 1}`,
    price: getPrice(location.price || 29900),
    rating: location.rating || 4.5 + (index * 0.1),
    image: location.image_url || location.main_image_url || `사주 서비스 ${index + 1}`
  }));

  // locations 데이터를 사용한 추천 서비스 (7-13번째)
  const recommendedServices = locationsData.slice(7, 14).map((location, index) => ({
    id: location.id || index + 8,
    title: location.name || location.title || `추천 서비스 ${index + 1}`,
    price: getPrice(location.price || 39900),
    rating: location.rating || 4.6 + (index * 0.1),
    image: location.image_url || location.main_image_url || `추천 서비스 ${index + 1}`
  }));

  // locations 데이터를 사용한 핫딜 서비스 (14-20번째)
  const hotDealsServices = locationsData.slice(14, 21).map((location, index) => {
    const originalPrice = location.price ? location.price * 1.5 : 149900;
    const discountPercent = Math.floor((1 - (location.price || 99900) / originalPrice) * 100);
    
    return {
      id: location.id || index + 15,
      title: location.name || location.title || `핫딜 서비스 ${index + 1}`,
      price: getPrice(location.price || 99900),
      originalPrice: getPrice(originalPrice),
      discount: `${discountPercent}%`,
      rating: location.rating || 4.7 + (index * 0.1),
      image: location.image_url || location.main_image_url || `핫딜 서비스 ${index + 1}`
    };
  });

  // 반응형 카드 개수 설정
  const getCardsPerView = () => {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 768) return 2;
    if (window.innerWidth <= 1024) return 3;
    return 4;
  };
  
  const [cardsPerView, setCardsPerView] = useState(getCardsPerView());
  
  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const getCardWidth = () => {
    if (window.innerWidth <= 360) return 160;
    if (window.innerWidth <= 480) return 180;
    if (window.innerWidth <= 768) return 200;
    if (window.innerWidth <= 1200) return 280;
    return 300;
  };
  
  const cardWidth = getCardWidth();
  const cardGap = window.innerWidth <= 768 ? 16 : 32; // 1rem = 16px, 2rem = 32px
  const totalCardWidth = cardWidth + cardGap;
  
  const totalCards = popularServices.length + 1; // +1 for more card
  const maxIndex = Math.max(0, Math.ceil(totalCards / cardsPerView) - 1);
  
  // 반응형 슬라이드 계산
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

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <Wrapper>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.2rem',
          color: '#6b7280'
        }}>
          로딩 중...
        </div>
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
      
      {/* "왜 K-Saju인가요?" 섹션 */}
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
                    <CardImage $imageUrl={service.image}>
                      {!service.image && service.image}
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
                    <CardImage $imageUrl={service.image}>
                      {!service.image && service.image}
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
                    <CardImage $imageUrl={service.image}>
                      {!service.image && service.image}
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
      </PopularSection>
    </Wrapper>
  );
}