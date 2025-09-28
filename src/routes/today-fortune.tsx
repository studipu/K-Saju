import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useI18n } from '../i18n/i18n';
import { generateFortune, type FortuneResult, type UserInput } from '../services/fortune';

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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
  
  &::before {
    content: '';
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 4px solid #f3f4f6;
    border-radius: 50%;
    border-top-color: #8b5cf6;
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// 사용자 입력 폼 컴포넌트
const InputForm = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 2px solid #e2e8f0;
`;

const FormTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
  }
`;

const GenerateButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -5px rgba(139, 92, 246, 0.4);
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export default function TodayFortune() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [fortune, setFortune] = useState<FortuneResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [userInput, setUserInput] = useState<UserInput>({
    name: '',
    birthDate: '',
    birthTime: '',
    nationality: ''
  });
  
  useEffect(() => {
    // 페이지 진입 시 상단으로 스크롤
    window.scrollTo(0, 0);
  }, []);
  
  const handleInputChange = (field: keyof UserInput, value: string) => {
    setUserInput(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerateFortune = async () => {
    // 입력 검증
    if (!userInput.name || !userInput.birthDate || !userInput.birthTime || !userInput.nationality) {
      alert('모든 정보를 입력해주세요.');
      return;
    }

    setLoading(true);
    setShowForm(false);
    
    // 운세 생성 시뮬레이션 (2초 대기)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 실제 운세 생성
    const fortuneResult = generateFortune(userInput);
    setFortune(fortuneResult);
    setLoading(false);
  };

  const handleBack = () => {
    navigate('/');
  };
  
  const handleShareFortune = () => {
    if (!fortune) return;
    
    const shareText = `🍀 오늘의 운세\n\n${fortune.overall}\n\n💕 연애운: ${fortune.love}\n💼 사업운: ${fortune.business}\n🏥 건강운: ${fortune.health}\n💰 재물운: ${fortune.wealth}\n\n🍀 행운의 색깔: ${fortune.luckyColor}\n🔢 행운의 숫자: ${fortune.luckyNumber}\n🧭 행운의 방향: ${fortune.luckyDirection}\n🎯 오늘의 행동: ${fortune.luckyAction}\n🍽️ 오늘의 음식: ${fortune.food}\n🔑 오늘의 키워드: ${fortune.keyword}\n💡 오늘의 조언: ${fortune.advice}\n\n#오늘의운세 #K-Saju #사주`;
    
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
            <Subtitle>당신만의 특별한 운세를 생성하고 있습니다</Subtitle>
          </Header>
          <LoadingSpinner />
        </ContentWrapper>
      </Container>
    );
  }

  if (showForm) {
    return (
      <Container>
        <ContentWrapper>
          <Header>
            <BackButton onClick={handleBack}>‹ 뒤로 가기</BackButton>
            <FortuneIcon>🔮</FortuneIcon>
            <Title>오늘의 운세</Title>
            <Subtitle>당신의 정보를 입력하면 개인 맞춤 운세를 제공합니다</Subtitle>
          </Header>
          
          <InputForm>
            <FormTitle>📝 개인 정보 입력</FormTitle>
            <FormGrid>
              <FormGroup>
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  type="text"
                  value={userInput.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="이름을 입력하세요"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="birthDate">생년월일 *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={userInput.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="birthTime">출생시각 *</Label>
                <Input
                  id="birthTime"
                  type="time"
                  value={userInput.birthTime}
                  onChange={(e) => handleInputChange('birthTime', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="nationality">국적 *</Label>
                <Select
                  id="nationality"
                  value={userInput.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                >
                  <option value="">국적을 선택하세요</option>
                  <option value="korean">한국</option>
                  <option value="us">미국</option>
                  <option value="uk">영국</option>
                  <option value="canada">캐나다</option>
                  <option value="australia">호주</option>
                  <option value="germany">독일</option>
                  <option value="france">프랑스</option>
                  <option value="japan">일본</option>
                  <option value="china">중국</option>
                  <option value="thailand">태국</option>
                  <option value="vietnam">베트남</option>
                  <option value="india">인도</option>
                  <option value="brazil">브라질</option>
                  <option value="mexico">멕시코</option>
                  <option value="other">기타</option>
                </Select>
              </FormGroup>
            </FormGrid>
            
            <GenerateButton onClick={handleGenerateFortune}>
              🔮 운세 생성하기
            </GenerateButton>
          </InputForm>
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
            <DetailContent>{fortune.business}</DetailContent>
          </FortuneDetailCard>
          
          <FortuneDetailCard>
            <DetailTitle>🏥 건강운</DetailTitle>
            <DetailContent>{fortune.health}</DetailContent>
          </FortuneDetailCard>
          
          <FortuneDetailCard>
            <DetailTitle>💰 재물운</DetailTitle>
            <DetailContent>{fortune.wealth}</DetailContent>
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
            
            <LuckyItem>
              <LuckyEmoji>🍽️</LuckyEmoji>
              <LuckyLabel>오늘의 음식</LuckyLabel>
              <LuckyValue>{fortune.food}</LuckyValue>
            </LuckyItem>
            
            <LuckyItem>
              <LuckyEmoji>🔑</LuckyEmoji>
              <LuckyLabel>오늘의 키워드</LuckyLabel>
              <LuckyValue>{fortune.keyword}</LuckyValue>
            </LuckyItem>
            
            <LuckyItem>
              <LuckyEmoji>🎯</LuckyEmoji>
              <LuckyLabel>오늘의 행동</LuckyLabel>
              <LuckyValue>{fortune.luckyAction}</LuckyValue>
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
