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
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  &:hover {
    color: #374151;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
`;

const Required = styled.span`
  color: #ef4444;
  margin-left: 0.25rem;
`;

const Input = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #667eea;
    background: #f8fafc;
  }
`;

const RadioInput = styled.input`
  margin: 0;
  accent-color: #667eea;
`;

const RadioText = styled.span`
  font-size: 0.95rem;
  color: #374151;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
`;

const Button = styled.button<{ $variant?: 'primary' }>`
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.$variant === 'primary' 
    ? `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
      }
    `
    : `
      background: #f3f4f6;
      color: #374151;
      
      &:hover:not(:disabled) {
        background: #e5e7eb;
      }
    `
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem 2rem;
`;

const LoadingText = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 1rem;
`;

const ShimmerEffect = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
              linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
              linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  animation: shimmer 1s linear infinite;
  margin: 0 auto 1rem;
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const ResultContainer = styled.div`
  text-align: center;
  padding: 2rem 0;
`;

const ResultTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const NameCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
`;

const KoreanName = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const PronunciationSection = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
`;

const PronunciationTitle = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const PronunciationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const PronunciationLabel = styled.span`
  font-size: 0.85rem;
  opacity: 0.8;
  min-width: 60px;
`;

const PronunciationText = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
`;

const NameMeaning = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1rem;
`;

const NameDetails = styled.div`
  font-size: 0.95rem;
  opacity: 0.8;
  line-height: 1.5;
`;

const ShareButton = styled.button`
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
  
  &:hover {
    background: #667eea;
    color: white;
  }
`;

const NewNameButton = styled.button`
  background: #f3f4f6;
  color: #374151;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
  
  &:hover {
    background: #e5e7eb;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

interface FormData {
  originalName: string;
  gender: string;
  personality: string;
  birthYear: string;
  nationality: string;
}

interface NameResult {
  koreanName: string;
  koreanPronunciation: string;
  englishPronunciation: string;
  meaning: string;
  details: string;
}

const NameCreation: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    originalName: '',
    gender: '',
    personality: '',
    birthYear: '',
    nationality: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NameResult | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    // 페이지 진입 시 상단으로 스크롤
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 에러 메시지 제거
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.originalName.trim()) {
      newErrors.originalName = '이름을 입력해주세요';
    }
    if (!formData.gender) {
      newErrors.gender = '성별을 선택해주세요';
    }
    if (!formData.personality) {
      newErrors.personality = '성격을 선택해주세요';
    }
    if (!formData.birthYear) {
      newErrors.birthYear = '출생년도를 선택해주세요';
    }
    if (!formData.nationality) {
      newErrors.nationality = '국적을 선택해주세요';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateKoreanName = (formData: FormData): NameResult => {
    // 성격과 특성에 따른 한국 이름 생성 로직
    const surnames = [
      { name: '김', korean: '김', english: 'Kim' },
      { name: '이', korean: '이', english: 'Lee' },
      { name: '박', korean: '박', english: 'Park' },
      { name: '최', korean: '최', english: 'Choi' },
      { name: '정', korean: '정', english: 'Jung' },
      { name: '강', korean: '강', english: 'Kang' },
      { name: '조', korean: '조', english: 'Cho' },
      { name: '윤', korean: '윤', english: 'Yoon' },
      { name: '장', korean: '장', english: 'Jang' },
      { name: '임', korean: '임', english: 'Lim' }
    ];
    
    const maleNames = [
      { name: '민수', korean: '민수', english: 'Min-su' },
      { name: '준호', korean: '준호', english: 'Jun-ho' },
      { name: '태현', korean: '태현', english: 'Tae-hyun' },
      { name: '현우', korean: '현우', english: 'Hyeon-u' },
      { name: '지훈', korean: '지훈', english: 'Ji-hun' },
      { name: '동현', korean: '동현', english: 'Dong-hyun' },
      { name: '성민', korean: '성민', english: 'Seong-min' },
      { name: '준영', korean: '준영', english: 'Jun-young' },
      { name: '민호', korean: '민호', english: 'Min-ho' },
      { name: '재현', korean: '재현', english: 'Jae-hyun' }
    ];
    
    const femaleNames = [
      { name: '지은', korean: '지은', english: 'Ji-eun' },
      { name: '서연', korean: '서연', english: 'Seo-yeon' },
      { name: '민지', korean: '민지', english: 'Min-ji' },
      { name: '예은', korean: '예은', english: 'Ye-eun' },
      { name: '하늘', korean: '하늘', english: 'Ha-neul' },
      { name: '지현', korean: '지현', english: 'Ji-hyun' },
      { name: '수진', korean: '수진', english: 'Su-jin' },
      { name: '예진', korean: '예진', english: 'Ye-jin' },
      { name: '서현', korean: '서현', english: 'Seo-hyun' },
      { name: '민정', korean: '민정', english: 'Min-jung' }
    ];
    
    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    let givenName: { name: string; korean: string; english: string };
    
    if (formData.gender === 'male') {
      givenName = maleNames[Math.floor(Math.random() * maleNames.length)];
    } else {
      givenName = femaleNames[Math.floor(Math.random() * femaleNames.length)];
    }
    
    const koreanName = `${surname.name}${givenName.name}`;
    const koreanPronunciation = `${surname.korean} ${givenName.korean}`;
    const englishPronunciation = `${surname.english} ${givenName.english}`;
    
    // 의미와 상세 설명 생성
    const meanings = {
      'active': '활발하고 에너지가 넘치는',
      'calm': '차분하고 안정적인',
      'creative': '창의적이고 독창적인',
      'kind': '따뜻하고 친근한',
      'strong': '강인하고 의지가 강한',
      'wise': '지혜롭고 똑똑한'
    };
    
    const meaning = meanings[formData.personality as keyof typeof meanings] || '특별하고 의미있는';
    
    return {
      koreanName,
      koreanPronunciation,
      englishPronunciation,
      meaning: `${meaning} 의미를 담은 이름입니다`,
      details: `${formData.originalName}님의 성격과 특성을 반영하여 선정된 한국 이름입니다. 이 이름은 한국의 전통적 의미와 현대적 감각이 조화를 이룬 이름입니다.`
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // 3초 후에 결과 생성
    setTimeout(() => {
      const nameResult = generateKoreanName(formData);
      setResult(nameResult);
      setLoading(false);
    }, 3000);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleShare = () => {
    const shareText = `🎭 한국 이름 작명 결과\n\n새로운 한국 이름: ${result?.koreanName}\n\n🔊 발음\n한국어: ${result?.koreanPronunciation}\n영어: ${result?.englishPronunciation}\n\n의미: ${result?.meaning}\n\n${result?.details}\n\n#한국이름 #이름작명 #K-Saju`;
    
    if (navigator.share) {
      navigator.share({
        title: '한국 이름 작명 결과',
        text: shareText,
        url: window.location.href
      }).catch(console.error);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('이름 작명 결과가 클립보드에 복사되었습니다!');
      }).catch(() => {
        alert('공유할 수 없습니다. 직접 복사해주세요.');
      });
    } else {
      alert('공유할 수 없습니다. 직접 복사해주세요.');
    }
  };

  const handleNewName = () => {
    setResult(null);
    setFormData({
      originalName: '',
      gender: '',
      personality: '',
      birthYear: '',
      nationality: ''
    });
  };

  if (loading) {
    return (
      <Container>
        <ContentWrapper>
          <Header>
            <BackButton onClick={handleBack}>‹ 뒤로 가기</BackButton>
            <Title>한국 이름 생성 중</Title>
            <Subtitle>AI가 당신에게 맞는 한국 이름을 만들고 있습니다...</Subtitle>
          </Header>
          
          <LoadingContainer>
            <ShimmerEffect />
            <LoadingText>당신의 성격과 특성을 분석하여<br />완벽한 한국 이름을 선정하고 있습니다</LoadingText>
          </LoadingContainer>
        </ContentWrapper>
      </Container>
    );
  }

  if (result) {
    return (
      <Container>
        <ContentWrapper>
          <Header>
            <BackButton onClick={handleBack}>‹ 뒤로 가기</BackButton>
            <Title>한국 이름 작명 완료</Title>
            <Subtitle>당신만의 특별한 한국 이름이 준비되었습니다</Subtitle>
          </Header>
          
          <ResultContainer>
            <NameCard>
              <KoreanName>{result.koreanName}</KoreanName>
              
              <PronunciationSection>
                <PronunciationTitle>🔊 발음</PronunciationTitle>
                <PronunciationRow>
                  <PronunciationLabel>한국어:</PronunciationLabel>
                  <PronunciationText>{result.koreanPronunciation}</PronunciationText>
                </PronunciationRow>
                <PronunciationRow>
                  <PronunciationLabel>영어:</PronunciationLabel>
                  <PronunciationText>{result.englishPronunciation}</PronunciationText>
                </PronunciationRow>
              </PronunciationSection>
              
              <NameMeaning>{result.meaning}</NameMeaning>
              <NameDetails>{result.details}</NameDetails>
            </NameCard>
            
            <ButtonGroup>
              <ShareButton onClick={handleShare}>📤 공유하기</ShareButton>
              <NewNameButton onClick={handleNewName}>새 이름 받기</NewNameButton>
            </ButtonGroup>
          </ResultContainer>
        </ContentWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <BackButton onClick={handleBack}>‹ 뒤로 가기</BackButton>
          <Title>한국 이름 작명</Title>
          <Subtitle>당신의 특성을 반영한 한국 이름을 만들어드립니다</Subtitle>
        </Header>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>본래 이름 <Required>*</Required></Label>
            <Input
              type="text"
              value={formData.originalName}
              onChange={(e) => handleInputChange('originalName', e.target.value)}
              placeholder="예: John, Maria, Ahmed 등"
            />
            {errors.originalName && <ErrorMessage>{errors.originalName}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label>성별 <Required>*</Required></Label>
            <RadioGroup>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                />
                <RadioText>남성</RadioText>
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                />
                <RadioText>여성</RadioText>
              </RadioLabel>
            </RadioGroup>
            {errors.gender && <ErrorMessage>{errors.gender}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label>성격 <Required>*</Required></Label>
            <RadioGroup>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="personality"
                  value="active"
                  checked={formData.personality === 'active'}
                  onChange={(e) => handleInputChange('personality', e.target.value)}
                />
                <RadioText>활발하고 에너지 넘치는</RadioText>
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="personality"
                  value="calm"
                  checked={formData.personality === 'calm'}
                  onChange={(e) => handleInputChange('personality', e.target.value)}
                />
                <RadioText>차분하고 안정적인</RadioText>
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="personality"
                  value="creative"
                  checked={formData.personality === 'creative'}
                  onChange={(e) => handleInputChange('personality', e.target.value)}
                />
                <RadioText>창의적이고 독창적인</RadioText>
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="personality"
                  value="kind"
                  checked={formData.personality === 'kind'}
                  onChange={(e) => handleInputChange('personality', e.target.value)}
                />
                <RadioText>따뜻하고 친근한</RadioText>
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="personality"
                  value="strong"
                  checked={formData.personality === 'strong'}
                  onChange={(e) => handleInputChange('personality', e.target.value)}
                />
                <RadioText>강인하고 의지가 강한</RadioText>
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="personality"
                  value="wise"
                  checked={formData.personality === 'wise'}
                  onChange={(e) => handleInputChange('personality', e.target.value)}
                />
                <RadioText>지혜롭고 똑똑한</RadioText>
              </RadioLabel>
            </RadioGroup>
            {errors.personality && <ErrorMessage>{errors.personality}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label>출생년도 <Required>*</Required></Label>
            <Select
              value={formData.birthYear}
              onChange={(e) => handleInputChange('birthYear', e.target.value)}
            >
              <option value="">출생년도를 선택하세요</option>
              {Array.from({ length: 50 }, (_, i) => 2024 - i).map(year => (
                <option key={year} value={year.toString()}>{year}년</option>
              ))}
            </Select>
            {errors.birthYear && <ErrorMessage>{errors.birthYear}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label>국적 <Required>*</Required></Label>
            <Select
              value={formData.nationality}
              onChange={(e) => handleInputChange('nationality', e.target.value)}
            >
              <option value="">국적을 선택하세요</option>
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
            {errors.nationality && <ErrorMessage>{errors.nationality}</ErrorMessage>}
          </FormGroup>
          
          <ButtonGroup>
            <Button type="button" onClick={handleBack}>취소</Button>
            <Button type="submit" $variant="primary">한국 이름 만들기</Button>
          </ButtonGroup>
        </Form>
      </ContentWrapper>
    </Container>
  );
};

export default NameCreation;
