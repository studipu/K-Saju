import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useI18n } from '../i18n/i18n';

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  padding: 4rem 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    z-index: -1;
  }
  
  @media (max-width: 768px) {
    padding: 2rem 0;
  }
`;

const ContentWrapper = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #374151;
  }
`;

const FortuneIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
  text-align: center;
`;

const FortuneCard = styled.div`
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 16px;
  padding: 2rem;
  margin: 2rem 0;
  border: 2px solid #0ea5e9;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: shimmer 3s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
  }
`;

const FortuneTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: #0c4a6e;
  margin-bottom: 1rem;
  text-align: center;
`;

const FortuneContent = styled.div`
  font-size: 1.2rem;
  line-height: 1.8;
  color: #075985;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FortuneDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const FortuneDetailCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #0ea5e9;
`;

const DetailTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DetailContent = styled.p`
  color: #4b5563;
  font-size: 1rem;
  line-height: 1.6;
`;

const LuckyElements = styled.div`
  background: #fef3c7;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 2rem 0;
  border: 2px solid #f59e0b;
`;

const LuckyTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LuckyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const LuckyItem = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const LuckyEmoji = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const LuckyLabel = styled.div`
  font-size: 0.9rem;
  color: #92400e;
  font-weight: 500;
`;

const LuckyValue = styled.div`
  font-size: 1rem;
  color: #1f2937;
  font-weight: 600;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 3rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.$variant === 'primary' ? `
    background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px -5px rgba(139, 92, 246, 0.4);
    }
  ` : `
    background: white;
    color: #374151;
    border: 2px solid #e5e7eb;
    
    &:hover {
      border-color: #d1d5db;
      background: #f9fafb;
    }
  `}
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-radius: 50%;
  border-top-color: #8b5cf6;
  animation: spin 1s ease-in-out infinite;
  margin: 2rem auto;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// 운세 데이터 타입
interface FortuneData {
  overall: string;
  love: string;
  career: string;
  health: string;
  money: string;
  luckyColor: string;
  luckyNumber: number;
  luckyDirection: string;
  advice: string;
}

// Mock 운세 데이터 생성 함수
const generateFortune = (): FortuneData => {
  const fortunes = [
    {
      overall: "오늘은 새로운 시작에 좋은 날입니다. 긍정적인 마음가짐으로 하루를 시작하세요.",
      love: "진심이 통하는 날입니다. 솔직한 마음을 표현해보세요.",
      career: "새로운 기회가 찾아올 수 있습니다. 적극적으로 도전해보세요.",
      health: "활동적인 하루를 보내면 기분이 좋아질 것입니다.",
      money: "계획적인 소비가 필요한 하루입니다.",
      luckyColor: "파란색",
      luckyNumber: 7,
      luckyDirection: "동쪽",
      advice: "오늘은 인내심을 갖고 차근차근 진행하세요."
    },
    {
      overall: "오늘은 인맥을 쌓기에 좋은 날입니다. 새로운 사람들과의 만남이 기대됩니다.",
      love: "마음을 열고 대화해보세요. 좋은 인연이 있을 것입니다.",
      career: "팀워크가 중요한 하루입니다. 협력에 집중하세요.",
      health: "스트레스를 해소할 수 있는 활동을 해보세요.",
      money: "투자보다는 저축에 집중하는 것이 좋습니다.",
      luckyColor: "초록색",
      luckyNumber: 3,
      luckyDirection: "남쪽",
      advice: "주변 사람들과의 관계를 소중히 여기세요."
    },
    {
      overall: "오늘은 집중력이 높은 날입니다. 중요한 일을 처리하기에 좋습니다.",
      love: "진정한 마음을 확인할 수 있는 하루입니다.",
      career: "목표를 향해 한 걸음씩 나아가세요.",
      health: "규칙적인 생활이 건강에 도움이 됩니다.",
      money: "신중한 판단이 필요한 하루입니다.",
      luckyColor: "빨간색",
      luckyNumber: 9,
      luckyDirection: "서쪽",
      advice: "확신을 갖고 결정하세요."
    }
  ];
  
  return fortunes[Math.floor(Math.random() * fortunes.length)];
};

export default function TodayFortune() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [fortune, setFortune] = useState<FortuneData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 페이지 진입 시 상단으로 스크롤
    window.scrollTo(0, 0);
    
    // 운세 데이터 생성 시뮬레이션
    const loadFortune = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기
      setFortune(generateFortune());
      setLoading(false);
    };
    
    loadFortune();
  }, []);
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleShareFortune = () => {
    const shareText = `🍀 오늘의 운세\n\n${fortune?.overall}\n\n💕 연애운: ${fortune?.love}\n💼 사업운: ${fortune?.career}\n💰 재물운: ${fortune?.money}\n\n행운의 색깔: ${fortune?.luckyColor}\n행운의 숫자: ${fortune?.luckyNumber}\n행운의 방향: ${fortune?.luckyDirection}\n\n💡 오늘의 조언: ${fortune?.advice}\n\n#오늘의운세 #K-Saju #사주`;
    
    if (navigator.share) {
      // 네이티브 공유 기능 사용 (모바일)
      navigator.share({
        title: '오늘의 운세',
        text: shareText,
        url: window.location.href
      }).catch(console.error);
    } else if (navigator.clipboard) {
      // 클립보드에 복사 (데스크톱)
      navigator.clipboard.writeText(shareText).then(() => {
        alert('운세가 클립보드에 복사되었습니다!');
      }).catch(() => {
        // 클립보드 실패 시 대체 방법
        handleFallbackShare(shareText);
      });
    } else {
      // 대체 방법
      handleFallbackShare(shareText);
    }
  };
  
  const handleFallbackShare = (text: string) => {
    // 텍스트 영역을 생성하여 사용자가 수동으로 복사할 수 있게 함
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      alert('운세가 클립보드에 복사되었습니다!');
    } catch (err) {
      alert('운세를 복사할 수 없습니다. 직접 복사해주세요.');
    }
    
    document.body.removeChild(textArea);
  };
  
  const handleBookConsultation = () => {
    navigate('/locations');
  };
  
  if (loading) {
    return (
      <Container>
        <ContentWrapper>
          <Header>
            <BackButton onClick={handleBack}>‹ 뒤로 가기</BackButton>
            <FortuneIcon>🔮</FortuneIcon>
            <Title>오늘의 운세 분석 중...</Title>
            <Subtitle>AI가 당신의 운세를 분석하고 있습니다</Subtitle>
          </Header>
          <LoadingSpinner />
        </ContentWrapper>
      </Container>
    );
  }
  
  if (!fortune) {
    return (
      <Container>
        <ContentWrapper>
          <Header>
            <BackButton onClick={handleBack}>‹ 뒤로 가기</BackButton>
            <Title>운세를 불러올 수 없습니다</Title>
            <Subtitle>잠시 후 다시 시도해주세요</Subtitle>
          </Header>
          <ActionButtons>
            <Button onClick={handleBack}>홈으로</Button>
            <Button $variant="primary" onClick={() => window.location.reload()}>
              다시 시도
            </Button>
          </ActionButtons>
        </ContentWrapper>
      </Container>
    );
  }
  
  return (
    <Container>
      <ContentWrapper>
        <Header>
          <BackButton onClick={handleBack}>‹ 뒤로 가기</BackButton>
          <FortuneIcon>🍀</FortuneIcon>
          <Title>오늘의 운세</Title>
          <Subtitle>AI가 분석한 당신만의 특별한 운세입니다</Subtitle>
        </Header>
        
        <FortuneCard>
          <FortuneTitle>✨ 전체 운세</FortuneTitle>
          <FortuneContent>{fortune.overall}</FortuneContent>
        </FortuneCard>
        
        <FortuneDetails>
          <FortuneDetailCard>
            <DetailTitle>💕 연애운</DetailTitle>
            <DetailContent>{fortune.love}</DetailContent>
          </FortuneDetailCard>
          
          <FortuneDetailCard>
            <DetailTitle>💼 사업운</DetailTitle>
            <DetailContent>{fortune.career}</DetailContent>
          </FortuneDetailCard>
          
          <FortuneDetailCard>
            <DetailTitle>🏥 건강운</DetailTitle>
            <DetailContent>{fortune.health}</DetailContent>
          </FortuneDetailCard>
          
          <FortuneDetailCard>
            <DetailTitle>💰 재물운</DetailTitle>
            <DetailContent>{fortune.money}</DetailContent>
          </FortuneDetailCard>
        </FortuneDetails>
        
        <LuckyElements>
          <LuckyTitle>🍀 오늘의 행운 요소</LuckyTitle>
          <LuckyGrid>
            <LuckyItem>
              <LuckyEmoji>🎨</LuckyEmoji>
              <LuckyLabel>행운의 색깔</LuckyLabel>
              <LuckyValue>{fortune.luckyColor}</LuckyValue>
            </LuckyItem>
            
            <LuckyItem>
              <LuckyEmoji>🔢</LuckyEmoji>
              <LuckyLabel>행운의 숫자</LuckyLabel>
              <LuckyValue>{fortune.luckyNumber}</LuckyValue>
            </LuckyItem>
            
            <LuckyItem>
              <LuckyEmoji>🧭</LuckyEmoji>
              <LuckyLabel>행운의 방향</LuckyLabel>
              <LuckyValue>{fortune.luckyDirection}</LuckyValue>
            </LuckyItem>
          </LuckyGrid>
        </LuckyElements>
        
        <FortuneCard>
          <FortuneTitle>💡 오늘의 조언</FortuneTitle>
          <FortuneContent>{fortune.advice}</FortuneContent>
        </FortuneCard>
        
        <ActionButtons>
          <Button onClick={handleShareFortune}>
            📤 공유하기
          </Button>
          <Button $variant="primary" onClick={handleBookConsultation}>
            상세 상담 받기
          </Button>
        </ActionButtons>
      </ContentWrapper>
    </Container>
  );
}
