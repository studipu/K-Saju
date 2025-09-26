import { styled } from "styled-components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/i18n";
import { supabase } from "../supabase";
import starBg from "../assets/star_bg.png";
import heroBg from "../assets/hero_bg.jpg";
import homeBg from "../assets/home_bg.jpg";
import yinyangBg from "../assets/yinyang_bg.mp4";
import LoadingScreen from "../components/loading_screen";
import { 
  SparklesIcon, 
  PencilSquareIcon, 
  MicrophoneIcon, 
  MapPinIcon 
} from '@heroicons/react/24/outline';

// Import mysterious fonts for multiple languages from Google Fonts
const fontLinks = [
  // Korean mysterious fonts
  'https://fonts.googleapis.com/css2?family=Song+Myung&family=Jua&family=Gugi&family=Stylish:wght@400&family=Kirang+Haerang&display=swap',
  // Korean clean fonts  
  'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap',
  // Latin mysterious fonts
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:wght@400;600;700&family=Cormorant+Garamond:wght@400;500;600;700&display=swap',
  // Japanese fonts
  'https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500;600;700&family=Sawarabi+Mincho&display=swap',
  // Chinese fonts
  'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&family=Ma+Shan+Zheng&display=swap'
];

fontLinks.forEach(href => {
  const link = document.createElement('link');
  link.href = href;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
});

const Wrapper = styled.div<{ $language: string }>`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: ${props => getFontFamily(props.$language, 'body')};
`;

const HeroSection = styled.section`
  width: 100%;
  height: 400px; /* Match the hero image height */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #000000;
  
  @media (max-width: 960px) {
    height: auto;
    min-height: 300px;
  }
  
  @media (max-width: 768px) {
    height: auto;
    min-height: 250px;
  }
`;

const HeroBgImage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 960px;
  height: 400px; /* 960px / 2.4 aspect ratio = 400px height */
  background-image: url(${heroBg});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
  
  @media (max-width: 960px) {
    width: 100%;
    max-width: none;
    height: auto;
    min-height: 200px;
    background-size: cover;
  }
  
  @media (max-width: 768px) {
    height: auto;
    min-height: 150px;
    background-size: cover;
  }
`;

const HeroContent = styled.div`
  text-align: left;
  color: white;
  z-index: 1;
  width: 100%;
  max-width: 960px;
  padding: 0 1.5rem;
  position: relative;
  
  @media (max-width: 768px) {
    text-align: center;
    padding: 0 1rem;
  }
`;

const HeroTitle = styled.h1<{ $language: string }>`
  font-family: ${props => getFontFamily(props.$language, 'heading')};
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  max-width: 450px;
  word-wrap: break-word;
  hyphens: auto;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    max-width: 100%;
  }
`;

const HeroSubtitle = styled.p`
  font-family: inherit;
  font-size: 1.1rem;
  font-weight: 400;
  margin-bottom: 1.5rem;
  opacity: 0.9;
  line-height: 1.5;
  max-width: 400px;
  word-wrap: break-word;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    max-width: 100%;
  }
`;

const CTAButton = styled.button`
  background: #6210CC;
  border: 2px solid rgba(139, 92, 246, 0.4);
  color: white;
  padding: 0.75rem 1.5rem;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.2;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -150%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 20%,
      rgba(255, 255, 255, 0.6) 50%,
      transparent 80%
    );
    transform: rotate(45deg);
    animation: continuousShine 2.5s ease-in-out infinite;
  }
  
  @keyframes continuousShine {
    0% {
      left: -150%;
      opacity: 0;
    }
    30% {
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    100% {
      left: 150%;
      opacity: 0;
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%,
      rgba(255, 255, 255, 0.05) 100%
    );
    border-radius: 50px;
    pointer-events: none;
  }
  
  &:hover {
    background: #4c1d95;
    border-color: rgba(139, 92, 246, 0.7);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
    
    &::before {
      animation-duration: 1.5s; /* Faster animation on hover */
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;


const PopularSection = styled.section`
  min-height: 50vh;
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    min-height: 40vh;
  }
`;

const RecommendedSection = styled.section`
  min-height: 50vh;
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    min-height: 40vh;
  }
`;

const HotDealsSection = styled.section`
  min-height: 50vh;
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    min-height: 40vh;
  }
`;

const ClosingSection = styled.section`
  min-height: 40vh;
  padding: 3rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  overflow: hidden;
  
  &::before {
    content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(66, 66, 66, 0.7) 0%,
      rgba(33, 33, 33, 0.8) 100%
    );
    z-index: 2;
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    padding: 2.5rem 1rem;
    min-height: 35vh;
  }
`;

const ClosingVideoBackground = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100vh;
  height: 100vw;
  object-fit: cover;
  transform: translate(-50%, -50%) rotate(90deg);
  z-index: 1;
  
  @media (max-width: 768px) {
    width: 100vh;
    height: 100vw;
  }
`;

const ClosingContainer = styled.div`
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(139, 92, 246, 0.2);
  border-radius: 32px;
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: 
    0 20px 60px rgba(139, 92, 246, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  z-index: 3;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(
      45deg,
      rgba(139, 92, 246, 0.3) 0%,
      rgba(212, 175, 55, 0.3) 25%,
      rgba(139, 92, 246, 0.3) 50%,
      rgba(212, 175, 55, 0.3) 75%,
      rgba(139, 92, 246, 0.3) 100%
    );
    border-radius: 32px;
    z-index: -1;
    animation: borderGlow 3s ease-in-out infinite;
  }
  
  @keyframes borderGlow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  
  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 24px;
    
    &::before {
      border-radius: 24px;
    }
  }
`;

const ClosingTitle = styled.h2<{ $language: string }>`
  font-family: ${props => getFontFamily(props.$language, 'heading')};
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c1810;
  margin-bottom: 1.5rem;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const ClosingSubtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
`;


const SectionTitleContainer = styled.div`
  width: 100%;
  max-width: 960px;
  margin: 0 auto 2rem auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    margin: 0 auto 2rem auto;
    padding: 0 1rem;
    gap: 1rem;
  }
`;

const SectionTitle = styled.h2<{ $language: string }>`
  font-family: ${props => getFontFamily(props.$language, 'heading')};
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  margin: 0;
  white-space: nowrap;
  line-height: 1.3;
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
  padding: 0;
  position: relative;
  max-width: 100%;
  width: 100%;
  z-index: 2;
`;

const CardsViewport = styled.div`
  width: 100%;
  max-width: 960px; /* Match other sections - full width */
  margin: 0 auto;
  position: relative;
  overflow: visible;
  padding: 0; /* No padding - arrows positioned outside */
`;

const CardsInner = styled.div`
  width: 100%; /* Use full 960px width */
  max-width: 960px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  padding: 0.75rem 0;
`;

const CardsWrapper = styled.div<{ translateX: number }>`
  display: flex;
  gap: 2rem;
  transform: translateX(${props => props.translateX}px);
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  width: fit-content;
  padding: 0; /* Remove padding to align arrows properly */
  
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

const NavButton = styled.button<{ position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.position === 'left' ? 'left: -20px;' : 'right: -20px;'} /* Position so border goes through center */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  color: #8b5cf6;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(139, 92, 246, 0.5);
    color: #7c3aed;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    transform: translateY(-50%) scale(1.05);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.7);
    border-color: rgba(156, 163, 175, 0.3);
    color: #9ca3af;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 1rem;
    ${props => props.position === 'left' ? 'left: -18px;' : 'right: -18px;'}
  }
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
    ${props => props.position === 'left' ? 'left: -16px;' : 'right: -16px;'}
  }
`;

const MoreCard = styled.div`
  width: 220px;
  flex-shrink: 0;
  background: linear-gradient(145deg, #2a1f3d 0%, #1a1229 100%);
  border: 3px solid #8b5cf6;
  border-radius: 16px;
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(139, 92, 246, 0.3),
    0 0 20px rgba(139, 92, 246, 0.2);
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    border: 2px dashed rgba(139, 92, 246, 0.4);
    border-radius: 12px;
    background: radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
  }
  
  &::after {
    content: '⭐';
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    color: #8b5cf6;
    font-size: 20px;
    animation: twinkle 2s ease-in-out infinite alternate;
  }
  
  @keyframes twinkle {
    0% { opacity: 0.5; transform: translateX(-50%) scale(1); }
    100% { opacity: 1; transform: translateX(-50%) scale(1.1); }
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 15px 35px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(139, 92, 246, 0.5),
      0 0 30px rgba(139, 92, 246, 0.4);
      
    &::before {
      border-color: rgba(139, 92, 246, 0.7);
      background: radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
    }
  }
`;

const MoreCardIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #8b5cf6;
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
  animation: pulse 2s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
`;

const MoreCardTitle = styled.h3<{ $language: string }>`
  font-family: ${props => getFontFamily(props.$language, 'heading')};
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #e2e8f0;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(139, 92, 246, 0.3);
  letter-spacing: 1px;
`;

const MoreCardSubtitle = styled.p`
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 400;
  color: #a78bfa;
  line-height: 1.4;
  opacity: 0.9;
`;

const HotDealsCard = styled.div`
  width: 220px;
  flex-shrink: 0;
  background: linear-gradient(145deg, #f8f6f0 0%, #f0ede5 100%);
  border: 3px solid #8b7355;
  border-radius: 16px;
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.4s ease;
  cursor: pointer;
  position: relative;
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    border: 2px solid #d4af37;
    border-radius: 12px;
    background: linear-gradient(45deg, transparent 30%, rgba(212, 175, 55, 0.1) 50%, transparent 70%);
    pointer-events: none;
    z-index: 1;
  }
  
  &::after {
    content: '✦';
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    color: #d4af37;
    font-size: 16px;
    z-index: 3;
    opacity: 0.7;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 15px 35px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.9),
      0 0 20px rgba(212, 175, 55, 0.3);
      
    &::before {
      border-color: #f4d03f;
      background: linear-gradient(45deg, transparent 20%, rgba(244, 208, 63, 0.15) 50%, transparent 80%);
    }
    
    &::after {
      opacity: 1;
      text-shadow: 0 0 8px rgba(212, 175, 55, 0.8);
    }
  }
`;

const DiscountBadge = styled.div<{ $language: string }>`
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  border: 1px solid #7f1d1d;
  font-family: ${props => getFontFamily(props.$language, 'accent')};
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1.2;
  display: block;
  margin: 0 auto 0.5rem auto;
  position: relative;
  z-index: 3;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  box-shadow: 0 2px 4px rgba(220, 38, 38, 0.3);
  letter-spacing: 0.3px;
  text-transform: uppercase;
  text-align: center;
  width: fit-content;
`;

const OriginalPrice = styled.div`
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  color: #9ca3af;
  text-decoration: line-through;
  margin-bottom: 0.25rem;
  line-height: 1.2;
  text-align: center;
`;

// Unified sections container with gradient background
const UnifiedSectionsContainer = styled.div`
  position: relative;
  background-image: url(${homeBg});
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  background-attachment: local;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(30, 9, 50, 0.6) 0%,
      rgba(0, 0, 0, 0.7) 100%
    );
    z-index: 1;
    pointer-events: none;
  }
`;

const AIServicesSection = styled.section`
  min-height: 50vh;
  padding: 2.5rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    min-height: 40vh;
  }
`;

const AIServicesContainer = styled.div`
  display: flex;
  align-items: stretch;
  gap: 2rem;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
  }
`;

const AIServicesHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 2rem;
  margin-top: 0;
  
  @media (max-width: 768px) {
    text-align: center;
    align-items: center;
    margin-bottom: 1.5rem;
  }
`;

const MagicTitle = styled.h2<{ $language: string }>`
  font-family: ${props => getFontFamily(props.$language, 'heading')};
  font-size: 2.2rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin: 0;
  padding-top: 0;
  line-height: 1.3;
  background: linear-gradient(135deg, #8b5cf6 0%, #c084fc 50%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  max-width: 320px;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    max-width: 100%;
    text-align: center;
  }
`;

const AIServicesGrid = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  justify-content: flex-start;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
    justify-content: center;
    align-items: center;
  }
`;

const AIServiceCard = styled.div<{ $color: string }>`
  width: 160px;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-6px) scale(1.03);
  }
`;

const AIServiceShield = styled.div<{ $color: string }>`
  width: 140px;
  height: 160px;
  background: ${props => props.$color};
  position: relative;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.4s ease;
  padding-top: 15px;
  padding-bottom: 25px;
  
  &::before {
    content: '';
    position: absolute;
    top: 6px;
    left: 6px;
    right: 6px;
    bottom: 6px;
    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%);
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }
  
  ${AIServiceCard}:hover & {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    filter: brightness(1.08);
  }
`;

const AIServiceIcon = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  position: relative;
  
  svg {
    width: 32px;
    height: 32px;
    color: white;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
  }
`;

const AIServiceTitle = styled.h3`
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0.5rem 0 0 0;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  text-align: center;
  max-width: 100px;
  word-wrap: break-word;
  z-index: 3;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const AIServicesContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  max-width: 480px;
  
  @media (max-width: 768px) {
  align-items: center;
    max-width: 100%;
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
  margin: 0 0 1.5rem 0;
`;

const NameInputSection = styled.div`
  background: linear-gradient(135deg, #4A0E4E 0%, #2D1B69 100%);
  border-radius: 24px;
  padding: 2rem;
  margin-top: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 25px rgba(74, 14, 78, 0.4);
  width: 100%;
  min-width: 400px;
  
  @media (max-width: 768px) {
    min-width: auto;
    padding: 1.5rem;
  }
`;

const NameInputTitle = styled.h3<{ $language: string }>`
  font-family: ${props => getFontFamily(props.$language, 'heading')};
  font-size: 1.35rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 1rem 0;
  padding-top: 0;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const NameInputSubtitle = styled.p`
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 1.25rem;
  line-height: 1.5;
`;

const NameInputForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NameInput = styled.input`
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 1rem;
  font-size: 0.95rem;
  color: #1f2937;
  transition: all 0.3s ease;
  width: 100%;

  &::placeholder {
  color: #6b7280;
  }
  
  &:focus {
    outline: none;
    border-color: #8B5CF6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
    background: #ffffff;
  }
`;

const NameSubmitButton = styled.button`
  background: #000000;
  border: 2px solid #1a1a1a;
  color: white;
  padding: 1rem 1.25rem;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.2;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    background: #2a2a2a;
    border-color: #3a3a3a;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;


const PopularCard = styled.div`
  width: 220px;
  flex-shrink: 0;
  background: linear-gradient(145deg, #f8f6f0 0%, #f0ede5 100%);
  border: 3px solid #8b7355;
  border-radius: 16px;
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.4s ease;
  cursor: pointer;
  position: relative;
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    border: 2px solid #d4af37;
    border-radius: 12px;
    background: linear-gradient(45deg, transparent 30%, rgba(212, 175, 55, 0.1) 50%, transparent 70%);
    pointer-events: none;
    z-index: 1;
  }
  
  &::after {
    content: '✦';
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    color: #d4af37;
    font-size: 16px;
    z-index: 3;
    opacity: 0.7;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 15px 35px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.9),
      0 0 20px rgba(212, 175, 55, 0.3);
      
    &::before {
      border-color: #f4d03f;
      background: linear-gradient(45deg, transparent 20%, rgba(244, 208, 63, 0.15) 50%, transparent 80%);
    }
    
    &::after {
      opacity: 1;
      text-shadow: 0 0 8px rgba(212, 175, 55, 0.8);
    }
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
  width: calc(100% - 16px);
  height: 120px;
  margin: 8px;
  background: ${props => 
    props.$imageUrl 
      ? `url(${props.$imageUrl})`
      : 'linear-gradient(135deg, #2c1810 0%, #8b4513 50%, #d2691e 100%)'
  };
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 2px solid #8b7355;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: #d4af37;
  font-weight: 600;
  position: relative;
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 4px;
    border: 1px solid rgba(212, 175, 55, 0.3);
    border-radius: 4px;
    background: linear-gradient(45deg, transparent 30%, rgba(212, 175, 55, 0.1) 50%, transparent 70%);
  }
`;

const CardContent = styled.div`
  padding: 1rem;
  position: relative;
  z-index: 2;
  background: linear-gradient(180deg, transparent 0%, rgba(212, 175, 55, 0.03) 100%);
  
  &::before {
    content: '◆';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    color: #d4af37;
    font-size: 12px;
    opacity: 0.6;
  }
`;

const CardTitle = styled.h3<{ $language: string }>`
  font-family: ${props => getFontFamily(props.$language, 'accent')};
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c1810;
  line-height: 1.4;
  text-align: center;
  text-shadow: 0 1px 2px rgba(212, 175, 55, 0.2);
  letter-spacing: 0.5px;
`;

const CardPrice = styled.div<{ $language: string }>`
  font-family: ${props => getFontFamily(props.$language, 'price')};
  font-size: 1.1rem;
  font-weight: 700;
  color: #8b4513;
  margin-bottom: 0.5rem;
  line-height: 1.2;
  text-align: center;
  text-shadow: 0 1px 2px rgba(139, 69, 19, 0.3);
  position: relative;
  
  &::before {
    content: '❋';
    position: absolute;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
    color: #d4af37;
    font-size: 0.8rem;
    opacity: 0.7;
  }
  
  &::after {
    content: '❋';
    position: absolute;
    right: -20px;
    top: 50%;
    transform: translateY(-50%);
    color: #d4af37;
    font-size: 0.8rem;
    opacity: 0.7;
  }
`;

const CardRating = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
  justify-content: center;
`;

const Star = styled.span`
  color: #d4af37;
  font-size: 1.2rem;
  text-shadow: 0 1px 2px rgba(212, 175, 55, 0.4);
  filter: drop-shadow(0 0 2px rgba(212, 175, 55, 0.6));
`;

const RatingText = styled.span`
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  color: #8b7355;
  line-height: 1.2;
  opacity: 0.8;
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

// Language-specific font configurations
const getFontFamily = (language: string, type: 'heading' | 'body' | 'accent' | 'price') => {
  const fontConfigs = {
    ko: {
      heading: "'Song Myung', 'Stylish', 'Kirang Haerang', serif", // Mysterious Korean heading
      body: "'Noto Sans KR', 'Jua', sans-serif", // Clean Korean body text
      accent: "'Gugi', 'Song Myung', cursive", // Decorative Korean text
      price: "'Noto Serif KR', 'Song Myung', serif" // Korean numbers and prices
    },
    en: {
      heading: "'Cinzel', 'Cormorant Garamond', serif", // Mysterious Latin heading
      body: "system-ui, -apple-system, 'Segoe UI', sans-serif", // Clean English body
      accent: "'Crimson Text', 'Cinzel', serif", // Decorative English text  
      price: "'Cinzel', 'Cormorant Garamond', serif" // English prices
    },
    ja: {
      heading: "'Sawarabi Mincho', 'Noto Serif JP', serif", // Mysterious Japanese heading
      body: "'Noto Sans JP', 'Hiragino Sans', sans-serif", // Clean Japanese body
      accent: "'Noto Serif JP', 'Sawarabi Mincho', serif", // Decorative Japanese text
      price: "'Noto Serif JP', serif" // Japanese prices
    },
    zh: {
      heading: "'Ma Shan Zheng', 'Noto Serif SC', serif", // Mysterious Chinese heading  
      body: "'Noto Sans SC', 'PingFang SC', sans-serif", // Clean Chinese body
      accent: "'Ma Shan Zheng', 'Noto Serif SC', serif", // Decorative Chinese text
      price: "'Noto Serif SC', serif" // Chinese prices
    },
    es: {
      heading: "'Cinzel', 'Cormorant Garamond', serif", // Mysterious Spanish heading
      body: "system-ui, -apple-system, 'Segoe UI', sans-serif", // Clean Spanish body  
      accent: "'Crimson Text', 'Cinzel', serif", // Decorative Spanish text
      price: "'Cinzel', 'Cormorant Garamond', serif" // Spanish prices
    }
  };
  
  return fontConfigs[language as keyof typeof fontConfigs]?.[type] || fontConfigs.en[type];
};

export function Home() {
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recommendedIndex, setRecommendedIndex] = useState(0);
  const [hotDealsIndex, setHotDealsIndex] = useState(0);

  // State for Supabase data
  const [services, setServices] = useState<LocationService[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for name input
  const [userName, setUserName] = useState('');

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
      icon: SparklesIcon,
      color: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)" // Red like Gryffindor
    },
    {
      id: 3,
      title: t("liveTranslation"),
      icon: MicrophoneIcon,
      color: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" // Blue like Ravenclaw
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


  const cardWidth = 220;
  const cardGap = 32; // 2rem = 32px
  const totalCardWidth = cardWidth + cardGap;
  const containerWidth = 960; // Available width
  const cardsPerView = Math.floor(containerWidth / totalCardWidth);
  
  // Calculate max scroll positions to ensure last card is fully visible
  const totalCards = popularServices.length + 1; // +1 for more card
  const totalRecommendedCards = recommendedServices.length + 1;
  const totalHotDealsCards = hotDealsServices.length;
  
  const maxIndex = Math.max(0, totalCards - cardsPerView);
  const maxRecommendedIndex = Math.max(0, totalRecommendedCards - cardsPerView);
  const maxHotDealsIndex = Math.max(0, totalHotDealsCards - cardsPerView);
  
  // Slide by individual cards to ensure precise positioning
  const translateX = -currentIndex * totalCardWidth;
  const recommendedTranslateX = -recommendedIndex * totalCardWidth;
  const hotDealsTranslateX = -hotDealsIndex * totalCardWidth;

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
    setRecommendedIndex(Math.min(maxRecommendedIndex, recommendedIndex + 1));
  };

  const handleHotDealsPrev = () => {
    setHotDealsIndex(Math.max(0, hotDealsIndex - 1));
  };

  const handleHotDealsNext = () => {
    setHotDealsIndex(Math.min(maxHotDealsIndex, hotDealsIndex + 1));
  };

  const handleMoreClick = () => {
    // More button click handler
    console.log('View all services clicked');
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

  const handleSearchLocations = () => {
    navigate('/locations');
  };

  const handleAIServiceClick = (serviceId: number) => {
    if (serviceId === 1) { // Today's Fortune (id: 1)
      navigate('/today-fortune');
    } else if (serviceId === 3) { // Live Translation (id: 3)
      navigate('/live-translation');
    }
  };

  const handleNameCreation = () => {
    if (userName.trim()) {
      // Navigate to name-creation page with the entered name as a query parameter
      navigate(`/name-creation?name=${encodeURIComponent(userName.trim())}`);
    } else {
      // If no name entered, just navigate to the page
      navigate('/name-creation');
    }
  };

  const handleNameInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameCreation();
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
    return <LoadingScreen />;
  }

  return (
    <Wrapper $language={language}>
      <HeroSection>
        <HeroBgImage />
        <HeroContent>
          <HeroTitle $language={language}>
            {t("heroTitle")}
          </HeroTitle>
          <HeroSubtitle>
            {t("heroSubtitle")}
          </HeroSubtitle>
          <CTAButton onClick={handleSearchLocations}>
            {"✨ "}{t("searchLocations")}
          </CTAButton>
        </HeroContent>
      </HeroSection>
      
      
      <UnifiedSectionsContainer>
      <AIServicesSection id="ai-services-section">
        <AIServicesContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', paddingTop: 0 }}>
              <AIServicesHeader>
                <MagicTitle $language={language}>{t("aiServicesTitle")}</MagicTitle>
              </AIServicesHeader>
              <AIServicesGrid>
                {aiServices.map((service) => {
                  const IconComponent = service.icon;
                  return (
                    <AIServiceCard key={service.id} $color={service.color} onClick={() => handleAIServiceClick(service.id)}>
                      <AIServiceShield $color={service.color}>
              <AIServiceIcon>
                          <IconComponent />
              </AIServiceIcon>
              <AIServiceTitle>{service.title}</AIServiceTitle>
                      </AIServiceShield>
            </AIServiceCard>
                  );
                })}
              </AIServicesGrid>
            </div>
            
            <AIServicesContent>
              <NameInputSection>
                <NameInputTitle $language={language}>{t("getKoreanName")}</NameInputTitle>
                <NameInputSubtitle>
                  {t("nameInputDescription")}
                </NameInputSubtitle>
                <NameInputForm>
                  <NameInput
                    type="text"
                    placeholder={t("enterFullName")}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onKeyPress={handleNameInputKeyPress}
                  />
                  <NameSubmitButton onClick={handleNameCreation}>
                    {t("createKoreanName")}
                  </NameSubmitButton>
                </NameInputForm>
              </NameInputSection>
            </AIServicesContent>
        </AIServicesContainer>
      </AIServicesSection>
      
      <PopularSection>
        <SectionTitleContainer>
          <Divider />
          <SectionTitle $language={language}>{t("popularServices")}</SectionTitle>
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
                      {!service.image || !service.image.startsWith('http') ? service.image || t("noImage") : ''}
                    </CardImage>
                    <CardContent>
                      <CardTitle $language={language}>{service.title}</CardTitle>
                      <CardPrice $language={language}>{service.price}</CardPrice>
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
                  <MoreCardTitle $language={language}>{t("viewMore")}</MoreCardTitle>
                  <MoreCardSubtitle>{t("viewAllServices")}</MoreCardSubtitle>
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
          <SectionTitle $language={language}>{t("recommendedBy")}</SectionTitle>
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
                      {!service.image || !service.image.startsWith('http') ? service.image || t("noImage") : ''}
                    </CardImage>
                    <CardContent>
                      <CardTitle $language={language}>{service.title}</CardTitle>
                      <CardPrice $language={language}>{service.price}</CardPrice>
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
                  <MoreCardTitle $language={language}>{t("viewMore")}</MoreCardTitle>
                  <MoreCardSubtitle>{t("viewAllServices")}</MoreCardSubtitle>
                </MoreCard>
              </CardsWrapper>
            </CardsInner>
            
            <NavButton 
              position="right" 
              onClick={handleRecommendedNext} 
              disabled={recommendedIndex >= maxRecommendedIndex}
            >
              ›
            </NavButton>
          </CardsViewport>
        </CardsContainer>
              </RecommendedSection>

      <HotDealsSection>
        <SectionTitleContainer>
          <Divider />
          <SectionTitle $language={language}>{t("hotDeals")}</SectionTitle>
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
                      {!service.image || !service.image.startsWith('http') ? service.image || t("noImage") : ''}
                    </CardImage>
                    <CardContent>
                      <DiscountBadge $language={language}>{service.discount} {t("discount")}</DiscountBadge>
                      <CardTitle $language={language}>{service.title}</CardTitle>
                      <OriginalPrice>{service.originalPrice}</OriginalPrice>
                      <CardPrice $language={language}>{service.price}</CardPrice>
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
                  <MoreCardTitle $language={language}>{t("viewMore")}</MoreCardTitle>
                  <MoreCardSubtitle>{t("viewAllServices")}</MoreCardSubtitle>
                </MoreCard>
              </CardsWrapper>
            </CardsInner>
            
            <NavButton 
              position="right" 
              onClick={handleHotDealsNext} 
              disabled={hotDealsIndex >= maxHotDealsIndex}
            >
              ›
            </NavButton>
          </CardsViewport>
        </CardsContainer>
      </HotDealsSection>
      </UnifiedSectionsContainer>
      
      <ClosingSection>
        <ClosingVideoBackground
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={yinyangBg} type="video/mp4" />
        </ClosingVideoBackground>
        <ClosingContainer>
          <ClosingTitle $language={language}>{t("closingTitle")}</ClosingTitle>
          <ClosingSubtitle>{t("closingSubtitle")}</ClosingSubtitle>
          <CTAButton onClick={() => navigate('/intro')}>
            {t("learnMoreButton")}
          </CTAButton>
        </ClosingContainer>
      </ClosingSection>
    </Wrapper>
  );
}