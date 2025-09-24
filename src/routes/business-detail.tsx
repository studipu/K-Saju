import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useI18n } from '../i18n/i18n';

const Container = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 0;
  margin: 0;
  width: 100%;
  position: relative;
  
  /* 전체 화면 너비 확보 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw;
    height: 100%;
    background: #f8fafc;
    z-index: -1;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 0 2rem;
`;

// 이미지 갤러리
const ImageGallery = styled.div`
  position: relative;
  height: 300px;
  overflow: hidden;
  margin-top: 2rem;
`;

const GalleryContainer = styled.div<{ translateX: number }>`
  display: flex;
  gap: 8px;
  transition: transform 0.5s ease;
  transform: translateX(${props => props.translateX}%);
`;

const GalleryImage = styled.div`
  width: calc((100% - 16px) / 3);
  flex-shrink: 0;
  background: #e5e7eb;
  border-radius: 8px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 1rem;
  font-weight: 500;
  height: 300px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const MoreImagesButton = styled.div<{ $isVisible?: boolean }>`
  width: calc((100% - 16px) / 3);
  flex-shrink: 0;
  background: ${props => props.$isVisible ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  border-radius: 8px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 300px;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: ${props => props.$isVisible ? '0 4px 12px rgba(156, 163, 175, 0.3)' : '0 4px 12px rgba(102, 126, 234, 0.3)'};
  }
`;


const GalleryNavButton = styled.button<{ position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.position === 'left' ? 'left: 16px;' : 'right: 16px;'}
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: translateY(-50%) scale(1.1);
  }
`;

// 업체 정보 헤더
const BusinessInfoHeader = styled.div`
  padding: 2rem 0;
  border-bottom: 1px solid #e5e7eb;
`;

const BusinessName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`;

const BusinessAddress = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const BusinessRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const StarIcon = styled.span`
  color: #fbbf24;
  font-size: 1.2rem;
`;

const BusinessRatingText = styled.span`
  color: #374151;
  font-weight: 500;
`;

const BusinessInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BusinessHours = styled.div`
  color: #059669;
  font-weight: 500;
  font-size: 1rem;
`;

// 스크롤 네비게이션
const ScrollNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  padding: 1.5rem 0;
`;

const NavButtons = styled.div`
  display: flex;
`;

const NavButton = styled.button`
  padding: 0.75rem 2rem;
  border: none;
  background: none;
  color: #6b7280;
  font-weight: 500;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #3b82f6;
  }
`;

const NavPriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavPrice = styled.div`
  color: #059669;
  font-weight: 700;
  font-size: 1.4rem;
`;

const NavBookingButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 2rem;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }
`;

// 가격 및 예약 섹션
const PriceBookingSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StartingPrice = styled.div`
  color: #dc2626;
  font-weight: 600;
  font-size: 1.1rem;
`;

const BookingButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }
`;

// 2열 레이아웃
const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 3rem;
  margin: 3rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 100%;
  overflow: hidden;
`;

// 업체 정보 카드
const BusinessInfoCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const BusinessInfoTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

const BusinessInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
  
  &:last-child {
    border-bottom: none;
  }
`;

const BusinessInfoLabel = styled.span`
  color: #6b7280;
  font-weight: 500;
`;

const BusinessInfoValue = styled.span`
  color: #1f2937;
  font-weight: 600;
`;

// 이용 후기 카드
const ReviewsCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  overflow: hidden;
`;

const ReviewSummaryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const OverallScore = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #1f2937;
`;

const ScoreLabel = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
  margin-top: 0.25rem;
  white-space: nowrap;
`;

const ReviewCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3b82f6;
  font-size: 0.9rem;
`;

const ReviewCategories = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const ReviewCategory = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
`;

const CategoryName = styled.span`
  color: #374151;
`;

const CategoryScore = styled.span`
  color: #1f2937;
  font-weight: 600;
`;


// 지도 카드
const MapCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  overflow: hidden;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 0.9rem;
  
  &.loaded {
    background: transparent;
    color: transparent;
  }
`;

const MapNotice = styled.div`
  background: #fffbeb;
  color: #92400e;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const MapButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  
  &:hover {
    background: #2563eb;
  }
`;

const LocationRating = styled.div`
  text-align: center;
`;

const LocationScore = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #059669;
  margin-bottom: 0.25rem;
`;

const LocationLabel = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
`;

// 섹션 스타일
const ContentSection = styled.section`
  margin-bottom: 4rem;
  scroll-margin-top: 100px;
`;

const SectionHeader = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
`;

const BackButton = styled.button`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
`;

const BusinessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const BusinessTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const BusinessSubtitle = styled.p`
  font-size: 1.2rem;
  text-align: center;
  opacity: 0.9;
`;

const Content = styled.div`
  padding: 3rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const MainInfo = styled.div``;

const Sidebar = styled.div``;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #4b5563;
  margin-bottom: 1.5rem;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
  
  &:last-child {
    border-bottom: none;
  }
`;

const FeatureIcon = styled.span`
  font-size: 1.2rem;
`;

const FeatureText = styled.span`
  color: #374151;
`;

const PriceCard = styled.div`
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const Price = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #059669;
  margin-bottom: 0.5rem;
`;

const PriceDescription = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
`;

const RatingSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled.span<{ filled: boolean }>`
  color: ${props => props.filled ? '#fbbf24' : '#e5e7eb'};
  font-size: 1.5rem;
`;

const RatingText = styled.span`
  color: #6b7280;
  font-size: 1.1rem;
`;

const BookButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -5px rgba(102, 126, 234, 0.4);
  }
`;

const ContactInfo = styled.div`
  background: #f3f4f6;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ContactIcon = styled.span`
  font-size: 1.2rem;
  color: #6b7280;
`;

const ContactText = styled.span`
  color: #374151;
`;

const ReviewsSection = styled.div`
  margin-top: 3rem;
  padding-top: 3rem;
  border-top: 2px solid #e5e7eb;
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ReviewCard = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ReviewerName = styled.span`
  font-weight: 600;
  color: #1f2937;
`;

const ReviewDate = styled.span`
  color: #6b7280;
  font-size: 0.9rem;
`;

const ReviewRating = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: 0.5rem;
`;

const ReviewText = styled.p`
  color: #4b5563;
  line-height: 1.5;
`;

// 페이지네이션 스타일
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 1rem 0;
`;

const PaginationButton = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid ${props => props.$active ? '#3b82f6' : '#e5e7eb'};
  background: ${props => props.$active ? '#3b82f6' : 'white'};
  color: ${props => props.$active ? 'white' : props.$disabled ? '#9ca3af' : '#374151'};
  border-radius: 8px;
  font-weight: 500;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    border-color: #3b82f6;
    background: ${props => props.$active ? '#3b82f6' : '#f8fafc'};
  }
  
  &:disabled {
    opacity: 0.5;
  }
`;

const PaginationEllipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: #6b7280;
  font-weight: 500;
`;

// 이미지 모달 스타일
const ImageModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ImageModalCloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
`;

const ImageModalMainImage = styled.div`
  width: 80%;
  max-width: 800px;
  height: 60vh;
  background: #f3f4f6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 1.5rem;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  margin-bottom: 8rem; /* 썸네일 공간 확보 */
`;

const ImageModalThumbnails = styled.div`
  display: flex;
  gap: 1rem;
  max-width: 60%;
  overflow-x: auto;
  padding: 1rem 0;
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  z-index: 1001;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
`;

const ImageModalThumbnail = styled.div<{ $active?: boolean }>`
  width: 120px;
  height: 80px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.$active ? '#3b82f6' : 'transparent'};
  flex-shrink: 0;
  
  &:hover {
    transform: scale(1.05);
    border-color: #3b82f6;
  }
`;

// 구글 맵 훅
function useGoogleMaps(apiKey?: string) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!apiKey) return;
    if (window.google && (window as any).google.maps) {
      setLoaded(true);
      return;
    }
    const id = "gmaps-sdk";
    if (document.getElementById(id)) return;
    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.defer = true;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=marker`;
    s.onload = () => setLoaded(true);
    s.onerror = () => setLoaded(false);
    document.head.appendChild(s);
  }, [apiKey]);
  return loaded;
}

// DB 스키마에 맞춘 타입 정의
interface BusinessFeature {
  id: number;
  icon: string;
  text: string;
}

interface BusinessContact {
  phone: string;
  email: string;
  address: string;
  website?: string;
}

interface BusinessReview {
  id: number;
  name: string;
  date: string;
  rating: number;
  text: string;
}

interface Business {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  main_image_url?: string;
  gallery_images?: string[];
  icon?: string;
  features: BusinessFeature[];
  base_price: number;
  price_description: string;
  currency: string;
  rating: number;
  review_count: number;
  contact: BusinessContact;
  business_hours: string;
  reviews: BusinessReview[];
  created_at: string;
  updated_at: string;
}

// Mock data - 실제로는 Supabase DB에서 가져올 데이터
const mockBusinessData: Record<string, Business> = {
  "1": {
    id: 1,
    title: "AI 사주 분석",
    subtitle: "인공지능 기반 정확한 사주 해석",
    description: "최신 AI 기술을 활용하여 정확하고 상세한 사주 분석을 제공합니다. 전통 사주학과 현대 기술이 만나 더욱 정밀한 운세를 알려드립니다.",
    main_image_url: "/images/ai-saju-hero.jpg",
    gallery_images: [
      "/images/saju-reception.jpg",
      "/images/saju-consultation.jpg", 
      "/images/saju-lounge.jpg"
    ],
    icon: "🔮",
    features: [
      { id: 1, icon: "🤖", text: "AI 기반 정확한 분석" },
      { id: 2, icon: "📊", text: "상세한 운세 리포트" },
      { id: 3, icon: "🔮", text: "다양한 관점의 해석" },
      { id: 4, icon: "💡", text: "개인 맞춤 조언" },
      { id: 5, icon: "📱", text: "모바일 최적화" }
    ],
    base_price: 29000,
    price_description: "1회 상담 기준",
    currency: "KRW",
    rating: 4.8,
    review_count: 127,
    business_hours: "Open 09:00 - 21:00",
    contact: {
      phone: "02-1234-5678",
      email: "info@sajuai.com",
      address: "서울특별시 강남구 역삼동 123-45",
      website: "https://www.sajuai.com"
    },
    reviews: [
      {
        id: 1,
        name: "김사주",
        date: "2024.01.15",
        rating: 5,
        text: "정말 정확한 분석이었습니다. AI가 이렇게 정밀할 줄 몰랐어요!"
      },
      {
        id: 2,
        name: "이운세",
        date: "2024.01.10",
        rating: 5,
        text: "친구 추천으로 받았는데 정말 만족스럽습니다. 상세한 설명도 좋고요."
      },
      {
        id: 3,
        name: "박점술",
        date: "2024.01.08",
        rating: 4,
        text: "가격 대비 품질이 좋습니다. 다음에도 이용하고 싶어요."
      },
      {
        id: 4,
        name: "최명리",
        date: "2024.01.05",
        rating: 5,
        text: "전문적이고 상세한 분석이 인상적이었습니다. 추천합니다!"
      },
      {
        id: 5,
        name: "정사주",
        date: "2024.01.03",
        rating: 4,
        text: "AI 분석이 정말 정확해서 놀랐어요. 다음에도 꼭 이용할 예정입니다."
      },
      {
        id: 6,
        name: "한운세",
        date: "2024.01.01",
        rating: 5,
        text: "친절한 상담과 정확한 분석으로 만족스러운 경험이었습니다."
      },
      {
        id: 7,
        name: "오점술",
        date: "2023.12.28",
        rating: 4,
        text: "가격 대비 품질이 우수합니다. 주변 지인들에게도 추천했어요."
      },
      {
        id: 8,
        name: "윤사주",
        date: "2023.12.25",
        rating: 5,
        text: "AI 기술과 전통 사주학의 만남이 정말 인상적이었습니다."
      },
      {
        id: 9,
        name: "강명리",
        date: "2023.12.22",
        rating: 4,
        text: "상세한 리포트와 친절한 설명이 좋았습니다. 만족해요!"
      },
      {
        id: 10,
        name: "임운세",
        date: "2023.12.20",
        rating: 5,
        text: "정확한 분석과 실용적인 조언이 도움이 많이 되었습니다."
      },
      {
        id: 11,
        name: "조사주",
        date: "2023.12.18",
        rating: 4,
        text: "AI 분석이 정말 놀라웠습니다. 전통 사주와의 조화가 인상적이에요."
      },
      {
        id: 12,
        name: "신명리",
        date: "2023.12.15",
        rating: 5,
        text: "친절한 상담과 정확한 분석으로 만족스러운 경험이었습니다."
      },
      {
        id: 13,
        name: "백운세",
        date: "2023.12.12",
        rating: 4,
        text: "가격 대비 품질이 우수합니다. 주변 지인들에게도 추천했어요."
      },
      {
        id: 14,
        name: "송점술",
        date: "2023.12.10",
        rating: 5,
        text: "상세한 리포트와 친절한 설명이 좋았습니다. 만족해요!"
      },
      {
        id: 15,
        name: "허사주",
        date: "2023.12.08",
        rating: 4,
        text: "AI 기술과 전통 사주학의 만남이 정말 인상적이었습니다."
      },
      {
        id: 16,
        name: "노운세",
        date: "2023.12.05",
        rating: 5,
        text: "정말 만족스러운 서비스였습니다. 추천합니다!"
      },
      {
        id: 17,
        name: "서점술",
        date: "2023.12.03",
        rating: 4,
        text: "AI 분석이 정확해서 놀랐어요. 다음에도 이용할 예정입니다."
      },
      {
        id: 18,
        name: "권사주",
        date: "2023.12.01",
        rating: 5,
        text: "친절한 상담과 정확한 분석으로 만족스러운 경험이었습니다."
      },
      {
        id: 19,
        name: "남운세",
        date: "2023.11.28",
        rating: 4,
        text: "AI 분석이 정말 정확해서 놀랐어요. 다음에도 이용할 예정입니다."
      },
      {
        id: 20,
        name: "도점술",
        date: "2023.11.25",
        rating: 5,
        text: "정말 만족스러운 서비스였습니다. 추천합니다!"
      },
      {
        id: 21,
        name: "라사주",
        date: "2023.11.22",
        rating: 4,
        text: "친절한 상담과 정확한 분석으로 만족스러운 경험이었습니다."
      },
      {
        id: 22,
        name: "마명리",
        date: "2023.11.20",
        rating: 5,
        text: "AI 기술과 전통 사주학의 만남이 정말 인상적이었습니다."
      },
      {
        id: 23,
        name: "바운세",
        date: "2023.11.18",
        rating: 4,
        text: "상세한 리포트와 친절한 설명이 좋았습니다. 만족해요!"
      },
      {
        id: 24,
        name: "사점술",
        date: "2023.11.15",
        rating: 5,
        text: "정확한 분석과 실용적인 조언이 도움이 많이 되었습니다."
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z"
  }
};

export default function BusinessDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // 구글 맵 관련
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapObj = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const loaded = useGoogleMaps(apiKey);
  
  // 총 7개의 이미지
  const totalImages = 7;
  const maxIndex = 3; // 사진 4,5,더보기를 보여주는 인덱스
  
  // 슬라이드 계산 (개별 사진 단위로)
  const getTranslateX = () => {
    return -currentImageIndex * (100 / 3); // 3개씩 보이므로 100/3씩 이동
  };

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        
        // TODO: Supabase에서 실제 데이터 가져오기
        // const { data, error } = await supabase
        //   .from('businesses')
        //   .select(`
        //     *,
        //     features:business_features(*),
        //     reviews:business_reviews(*)
        //   `)
        //   .eq('id', id)
        //   .single();
        
        // 임시로 mock 데이터 사용
        if (id && mockBusinessData[id as keyof typeof mockBusinessData]) {
          const mockData = mockBusinessData[id as keyof typeof mockBusinessData];
          setBusiness(mockData);
        } else {
          setBusiness(null);
        }
      } catch (error) {
        console.error('Error fetching business:', error);
        setBusiness(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBusiness();
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleBook = () => {
    // 예약 페이지로 이동
    navigate(`/business/${id}/booking`);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev > 0 ? prev - 1 : prev
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev < maxIndex ? prev + 1 : prev
    );
  };

  const handleMoreImages = () => {
    alert('더 많은 사진을 보시려면 업체에 직접 문의해주세요!');
  };

  const handleImageClick = (index: number) => {
    // 더보기 버튼을 클릭한 경우 (index 5) 6번 사진을 선택
    const actualIndex = index === 5 ? 5 : index;
    setSelectedImageIndex(actualIndex);
    setIsImageModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsImageModalOpen(false);
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };


  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // 구글 맵 초기화
  useEffect(() => {
    console.log('Map initialization check:', { loaded, business: !!business, apiKey: !!apiKey });
    
    if (!apiKey) {
      setMapError('Google Maps API 키가 설정되지 않았습니다.');
      return;
    }
    
    if (!loaded) {
      console.log('Google Maps API not loaded yet');
      return;
    }
    
    if (!business) {
      console.log('Business data not loaded yet');
      return;
    }
    
    if (!mapRef.current) {
      console.log('Map container not ready');
      return;
    }
    
    if (!window.google) {
      console.log('Google Maps not available');
      setMapError('Google Maps를 로드할 수 없습니다.');
      return;
    }

    console.log('Initializing map for address:', business.contact.address);

    // 주소를 좌표로 변환 (Geocoding)
    const geocoder = new (window as any).google.maps.Geocoder();
    geocoder.geocode({ address: business.contact.address }, (results: any, status: any) => {
      console.log('Geocoding result:', { status, results });
      
      let location;
      
      if (status === 'OK' && results[0]) {
        location = results[0].geometry.location;
        console.log('Location found:', location.toString());
      } else {
        console.warn('Geocoding failed, using default location');
        // 기본 위치: 서울 강남구 중심
        location = new (window as any).google.maps.LatLng(37.5665, 126.978);
      }
      
      try {
        // 지도 초기화
        mapObj.current = new (window as any).google.maps.Map(mapRef.current, {
          center: location,
          zoom: 15,
          mapId: "d3fault",
          clickableIcons: false,
          disableDefaultUI: false,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
            { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] }
          ]
        });

        // 마커 추가
        markerRef.current = new (window as any).google.maps.Marker({
          position: location,
          map: mapObj.current,
          title: business.title,
          animation: (window as any).google.maps.Animation.DROP
        });

        // 정보창 추가
        const infoWindow = new (window as any).google.maps.InfoWindow({
          content: `
            <div style="padding: 10px;">
              <h3 style="margin: 0 0 5px 0; color: #1f2937;">${business.title}</h3>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">${business.contact.address}</p>
              <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">${business.contact.phone}</p>
            </div>
          `
        });

        markerRef.current.addListener("click", () => {
          infoWindow.open(mapObj.current, markerRef.current);
        });

        setMapLoaded(true);
        setMapError(null);
        console.log('Map initialized successfully');
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('지도를 초기화하는 중 오류가 발생했습니다.');
      }
    });
  }, [loaded, business, apiKey]);

  const formatPrice = (price: number, currency: string) => {
    switch (currency) {
      case 'KRW':
        return `₩${price.toLocaleString()}`;
      case 'USD':
        return `$${price}`;
      case 'EUR':
        return `€${price}`;
      case 'JPY':
        return `¥${price}`;
      default:
        return `₩${price.toLocaleString()}`;
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} filled={i <= rating}>
          ★
        </Star>
      );
    }
    return stars;
  };

  // 리뷰 페이지네이션 로직
  const reviewsPerPage = 3;
  const totalReviews = business?.reviews.length || 0;
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);
  const startIndex = (currentReviewPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = business?.reviews.slice(startIndex, endIndex) || [];

  const handlePageChange = (page: number) => {
    setCurrentReviewPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    
    if (totalPages <= 4) {
      // 4페이지 이하면 모든 페이지 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationButton
            key={i}
            $active={currentReviewPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationButton>
        );
      }
    } else if (totalPages === 5) {
      // 5페이지일 때: 모든 페이지 표시
      for (let i = 1; i <= 5; i++) {
        pages.push(
          <PaginationButton
            key={i}
            $active={currentReviewPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationButton>
        );
      }
    } else if (totalPages === 6) {
      // 6페이지일 때: 1, ..., 3, 4, 5, 6 또는 1, 2, 3, 4, ..., 6
      
      if (currentReviewPage <= 4) {
        // 현재 페이지가 4 이하면: 1, 2, 3, 4, ..., 6
        for (let i = 1; i <= 4; i++) {
          pages.push(
            <PaginationButton
              key={i}
              $active={currentReviewPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationButton>
          );
        }
        pages.push(<PaginationEllipsis key="ellipsis">...</PaginationEllipsis>);
        pages.push(
          <PaginationButton
            key={6}
            $active={currentReviewPage === 6}
            onClick={() => handlePageChange(6)}
          >
            6
          </PaginationButton>
        );
      } else {
        // 현재 페이지가 5 이상이면: 1, ..., 3, 4, 5, 6
        pages.push(
          <PaginationButton
            key={1}
            $active={currentReviewPage === 1}
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationButton>
        );
        pages.push(<PaginationEllipsis key="ellipsis">...</PaginationEllipsis>);
        for (let i = 3; i <= 6; i++) {
          pages.push(
            <PaginationButton
              key={i}
              $active={currentReviewPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationButton>
          );
        }
      }
    } else {
      // 7페이지 이상일 때: 1, ..., 가운데3개, ..., 마지막페이지
      
      // 첫 페이지
      pages.push(
        <PaginationButton
          key={1}
          $active={currentReviewPage === 1}
          onClick={() => handlePageChange(1)}
        >
          1
        </PaginationButton>
      );
      
      // 가운데 3개 페이지 계산
      let centerStart, centerEnd;
      
      if (currentReviewPage <= 3) {
        // 현재 페이지가 3 이하면: 2, 3, 4
        centerStart = 2;
        centerEnd = Math.min(4, totalPages - 1);
      } else if (currentReviewPage >= totalPages - 2) {
        // 현재 페이지가 마지막-2 이상이면: 마지막-3, 마지막-2, 마지막-1
        centerStart = Math.max(2, totalPages - 3);
        centerEnd = totalPages - 1;
      } else {
        // 현재 페이지가 중간이면: 현재-1, 현재, 현재+1
        centerStart = currentReviewPage - 1;
        centerEnd = currentReviewPage + 1;
      }
      
      // 왼쪽 생략 표시 (가운데 시작이 3보다 클 때)
      if (centerStart > 2) {
        pages.push(<PaginationEllipsis key="left-ellipsis">...</PaginationEllipsis>);
      }
      
      // 가운데 3개 페이지
      for (let i = centerStart; i <= centerEnd; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(
            <PaginationButton
              key={i}
              $active={currentReviewPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationButton>
          );
        }
      }
      
      // 오른쪽 생략 표시 (가운데 끝이 마지막-2보다 작을 때)
      if (centerEnd < totalPages - 1) {
        pages.push(<PaginationEllipsis key="right-ellipsis">...</PaginationEllipsis>);
      }
      
      // 마지막 페이지 (1이 아닌 경우만)
      if (totalPages !== 1) {
        pages.push(
          <PaginationButton
            key={totalPages}
            $active={currentReviewPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationButton>
        );
      }
    }

     return (
       <PaginationContainer>
         <PaginationButton
           $disabled={currentReviewPage === 1}
           onClick={() => currentReviewPage > 1 && handlePageChange(currentReviewPage - 1)}
         >
           ‹
         </PaginationButton>
         {pages}
         <PaginationButton
           $disabled={currentReviewPage === totalPages}
           onClick={() => currentReviewPage < totalPages && handlePageChange(currentReviewPage + 1)}
         >
           ›
         </PaginationButton>
       </PaginationContainer>
     );
  };

  if (loading) {
    return (
      <Container>
        <ContentWrapper>
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p>로딩 중...</p>
          </div>
        </ContentWrapper>
      </Container>
    );
  }

  if (!business) {
    return (
      <Container>
        <ContentWrapper>
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p>{t("businessNotFound")}</p>
          </div>
        </ContentWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <ContentWrapper>
        {/* 이미지 갤러리 */}
        <ImageGallery>
            <GalleryContainer translateX={getTranslateX()}>
              {/* 사진 1, 2, 3 */}
              <GalleryImage onClick={() => handleImageClick(0)}>사진 1</GalleryImage>
              <GalleryImage onClick={() => handleImageClick(1)}>사진 2</GalleryImage>
              <GalleryImage onClick={() => handleImageClick(2)}>사진 3</GalleryImage>
              
              {/* 사진 4, 5 */}
              <GalleryImage onClick={() => handleImageClick(3)}>사진 4</GalleryImage>
              <GalleryImage onClick={() => handleImageClick(4)}>사진 5</GalleryImage>
              
              {/* 더보기 버튼 */}
              <MoreImagesButton 
                $isVisible={currentImageIndex >= 2}
                onClick={() => handleImageClick(5)}
              >
                더보기
              </MoreImagesButton>
              
              {/* 사진 6, 7 */}
              <GalleryImage onClick={() => handleImageClick(5)}>사진 6</GalleryImage>
              <GalleryImage onClick={() => handleImageClick(6)}>사진 7</GalleryImage>
            </GalleryContainer>
          
          {/* 왼쪽 화살표 (첫 번째가 아닐 때만 표시) */}
          {currentImageIndex > 0 && (
            <GalleryNavButton position="left" onClick={handlePrevImage}>
              ‹
            </GalleryNavButton>
          )}
          
          {/* 오른쪽 화살표 (사진 5까지는 표시, 더보기 슬라이드 후에는 숨김) */}
          {currentImageIndex < 3 && (
            <GalleryNavButton position="right" onClick={handleNextImage}>
              ›
            </GalleryNavButton>
          )}
        </ImageGallery>

        {/* 스크롤 네비게이션 */}
        <ScrollNavigation>
          <NavButtons>
            <NavButton onClick={() => scrollToSection('overview')}>
              개요
            </NavButton>
            <NavButton onClick={() => scrollToSection('services')}>
              서비스
            </NavButton>
            <NavButton onClick={() => scrollToSection('reviews')}>
              이용후기
            </NavButton>
            <NavButton onClick={() => scrollToSection('location')}>
              위치
            </NavButton>
            <NavButton onClick={() => scrollToSection('contact')}>
              연락처
            </NavButton>
          </NavButtons>
          
          <NavPriceSection>
            <NavPrice>{formatPrice(business.base_price, business.currency)}</NavPrice>
            <NavBookingButton onClick={handleBook}>
              예약하기
            </NavBookingButton>
          </NavPriceSection>
        </ScrollNavigation>

        {/* 2열 레이아웃 */}
        <TwoColumnLayout>
          <LeftColumn>
            {/* 업체 정보 카드 */}
            <BusinessInfoCard>
              <BusinessInfoTitle>{business.title}</BusinessInfoTitle>
              <BusinessInfoItem>
                <BusinessInfoLabel>주소</BusinessInfoLabel>
                <BusinessInfoValue>{business.contact.address}</BusinessInfoValue>
              </BusinessInfoItem>
              <BusinessInfoItem>
                <BusinessInfoLabel>평점</BusinessInfoLabel>
                <BusinessInfoValue>
                  ⭐ {business.rating} ({business.review_count}개 리뷰)
                </BusinessInfoValue>
              </BusinessInfoItem>
              <BusinessInfoItem>
                <BusinessInfoLabel>운영시간</BusinessInfoLabel>
                <BusinessInfoValue>{business.business_hours}</BusinessInfoValue>
              </BusinessInfoItem>
              <BusinessInfoItem>
                <BusinessInfoLabel>전화번호</BusinessInfoLabel>
                <BusinessInfoValue>{business.contact.phone}</BusinessInfoValue>
              </BusinessInfoItem>
              <BusinessInfoItem>
                <BusinessInfoLabel>이메일</BusinessInfoLabel>
                <BusinessInfoValue>{business.contact.email}</BusinessInfoValue>
              </BusinessInfoItem>
              {business.contact.website && (
                <BusinessInfoItem>
                  <BusinessInfoLabel>웹사이트</BusinessInfoLabel>
                  <BusinessInfoValue>{business.contact.website}</BusinessInfoValue>
                </BusinessInfoItem>
              )}
            </BusinessInfoCard>

            {/* 개요 섹션 */}
            <ContentSection id="overview">
              <SectionHeader>개요</SectionHeader>
              <p style={{ color: '#4b5563', lineHeight: '1.7' }}>
                {business.description}
              </p>
            </ContentSection>

            {/* 서비스 섹션 */}
            <ContentSection id="services">
              <SectionHeader>주요 서비스</SectionHeader>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {business.features.map((feature) => (
                  <div key={feature.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    padding: '1rem',
                    background: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>{feature.icon}</span>
                    <span style={{ color: '#374151', fontWeight: '500' }}>{feature.text}</span>
                  </div>
                ))}
              </div>
            </ContentSection>
          </LeftColumn>

          <RightColumn>
            {/* 이용 후기 카드 */}
            <ReviewsCard>
              <ReviewSummaryHeader>
                <div>
                  <OverallScore>{business.rating}</OverallScore>
                  <ScoreLabel>매우 좋음</ScoreLabel>
                </div>
                <ReviewCount>
                  <span>✓</span>
                  <span>{business.review_count}건의 이용후기</span>
                  <span 
                    style={{ color: '#3b82f6', cursor: 'pointer' }}
                    onClick={() => scrollToSection('reviews')}
                  >
                    이용후기 모두 보기
                  </span>
                </ReviewCount>
              </ReviewSummaryHeader>
              
              <ReviewCategories>
                <ReviewCategory>
                  <CategoryName>서비스 품질</CategoryName>
                  <CategoryScore>8.7</CategoryScore>
                </ReviewCategory>
                <ReviewCategory>
                  <CategoryName>시설 상태</CategoryName>
                  <CategoryScore>8.2</CategoryScore>
                </ReviewCategory>
                <ReviewCategory>
                  <CategoryName>가격 대비 만족도</CategoryName>
                  <CategoryScore>8.1</CategoryScore>
                </ReviewCategory>
                <ReviewCategory>
                  <CategoryName>접근성 및 편의성</CategoryName>
                  <CategoryScore>8.0</CategoryScore>
                </ReviewCategory>
              </ReviewCategories>

            </ReviewsCard>

            {/* 지도 카드 */}
            <MapCard>
              {!apiKey && (
                <MapNotice>
                  지도를 보려면 VITE_GOOGLE_MAPS_API_KEY 환경변수를 설정해주세요.
                </MapNotice>
              )}
              {apiKey && mapError && (
                <MapNotice>
                  {mapError}
                </MapNotice>
              )}
              {apiKey && !mapLoaded && !mapError && (
                <MapContainer>
                  지도를 로딩 중...
                </MapContainer>
              )}
              <MapContainer 
                ref={mapRef} 
                className={mapLoaded ? 'loaded' : ''}
                style={{ display: mapLoaded ? 'block' : 'none' }}
              />
            </MapCard>
          </RightColumn>
        </TwoColumnLayout>

        {/* 추가 섹션들 */}
        <Content>
          {/* 이용후기 상세 섹션 */}
          <ContentSection id="reviews">
            <SectionHeader>💬 {t("customerReviews")}</SectionHeader>
            <ReviewsList>
              {currentReviews.map((review) => (
                <ReviewCard key={review.id}>
                  <ReviewHeader>
                    <ReviewerName>{review.name}</ReviewerName>
                    <ReviewDate>{review.date}</ReviewDate>
                  </ReviewHeader>
                  <ReviewRating>
                    {renderStars(review.rating)}
                  </ReviewRating>
                  <ReviewText>{review.text}</ReviewText>
                </ReviewCard>
              ))}
            </ReviewsList>
            {renderPagination()}
          </ContentSection>

          {/* 위치 섹션 */}
          <ContentSection id="location">
            <SectionHeader>📍 위치 정보</SectionHeader>
            <Description>
              <strong>주소:</strong> {business.contact.address}
            </Description>
            <Description>
              <strong>영업시간:</strong> {business.business_hours}
            </Description>
          </ContentSection>

          {/* 연락처 섹션 */}
          <ContentSection id="contact">
            <SectionHeader>📞 {t("contactInfo")}</SectionHeader>
            <ContactInfo>
              <ContactItem>
                <ContactIcon>📞</ContactIcon>
                <ContactText>{business.contact.phone}</ContactText>
              </ContactItem>
              <ContactItem>
                <ContactIcon>📧</ContactIcon>
                <ContactText>{business.contact.email}</ContactText>
              </ContactItem>
              {business.contact.website && (
                <ContactItem>
                  <ContactIcon>🌐</ContactIcon>
                  <ContactText>
                    <a href={business.contact.website} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
                      웹사이트 방문
                    </a>
                  </ContactText>
                </ContactItem>
              )}
            </ContactInfo>
          </ContentSection>
        </Content>
      </ContentWrapper>
      
      {/* 이미지 모달 */}
      {isImageModalOpen && (
        <ImageModalOverlay onClick={handleCloseModal}>
          <ImageModalCloseButton onClick={handleCloseModal}>
            ×
          </ImageModalCloseButton>
          <ImageModalMainImage onClick={(e) => e.stopPropagation()}>
            사진 {selectedImageIndex + 1}
          </ImageModalMainImage>
          <ImageModalThumbnails onClick={(e) => e.stopPropagation()}>
            {Array.from({ length: 10 }, (_, index) => (
              <ImageModalThumbnail
                key={index}
                $active={selectedImageIndex === index}
                onClick={() => handleThumbnailClick(index)}
              >
                사진 {index + 1}
              </ImageModalThumbnail>
            ))}
          </ImageModalThumbnails>
        </ImageModalOverlay>
      )}
    </Container>
  );
}
