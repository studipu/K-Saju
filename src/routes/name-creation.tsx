import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useI18n } from '../i18n/i18n';
import { generateKoreanName, type NameGenerationResponse } from '../services/openai';

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
  personality: string[];
  nationality: string;
}

const NameCreation: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    originalName: '',
    gender: '',
    personality: [],
    nationality: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NameGenerationResponse | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    // 페이지 진입 시 상단으로 스크롤
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
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

  const handlePersonalityChange = (personality: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      personality: checked 
        ? [...prev.personality, personality]
        : prev.personality.filter(p => p !== personality)
    }));
    
    // 에러 메시지 제거
    if (errors.personality) {
      setErrors(prev => ({
        ...prev,
        personality: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.originalName.trim()) {
      newErrors.originalName = '이름을 입력해주세요';
    }
    if (!formData.gender) {
      newErrors.gender = '성별을 선택해주세요';
    }
    if (formData.personality.length === 0) {
      newErrors.personality = '성격을 하나 이상 선택해주세요';
    }
    if (!formData.nationality) {
      newErrors.nationality = '국적을 선택해주세요';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Supabase Edge Function을 통해 한국 이름 생성
      const nameResult = await generateKoreanName(formData);
      setResult(nameResult);
    } catch (error) {
      console.error('이름 생성 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      alert(`이름 생성 중 오류가 발생했습니다: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleShare = () => {
    const shareText = `🎭 한국 이름 작명 결과\n\n🔊 발음 기반 이름: ${result?.sound_based.name_hangul} (${result?.sound_based.romanization})\n${result?.sound_based.note}\n\n📝 의미 기반 이름: ${result?.meaning_based.name_hangul} (${result?.meaning_based.romanization})\n한자: ${result?.meaning_based.name_hanja}\n${result?.meaning_based.meaning}\n\n#한국이름 #이름작명 #K-Saju`;
    
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
      personality: [],
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
          
          <LoadingSpinner />
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
            {/* Sound-based Name */}
            <NameCard>
              <KoreanName>{result.sound_based.name_hangul}</KoreanName>
              
              <PronunciationSection>
                <PronunciationTitle>🔊 발음</PronunciationTitle>
                <PronunciationRow>
                  <PronunciationLabel>로마자:</PronunciationLabel>
                  <PronunciationText>{result.sound_based.romanization}</PronunciationText>
                </PronunciationRow>
              </PronunciationSection>
              
              <NameMeaning>{result.sound_based.note}</NameMeaning>
            </NameCard>

            {/* Meaning-based Name */}
            <NameCard style={{ marginTop: '2rem' }}>
              <KoreanName>{result.meaning_based.name_hangul}</KoreanName>
              
              <PronunciationSection>
                <PronunciationTitle>🔊 발음</PronunciationTitle>
                <PronunciationRow>
                  <PronunciationLabel>로마자:</PronunciationLabel>
                  <PronunciationText>{result.meaning_based.romanization}</PronunciationText>
                </PronunciationRow>
                <PronunciationRow>
                  <PronunciationLabel>한자:</PronunciationLabel>
                  <PronunciationText>{result.meaning_based.name_hanja}</PronunciationText>
                </PronunciationRow>
              </PronunciationSection>
              
              <NameMeaning>{result.meaning_based.meaning}</NameMeaning>
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
            <Label>성격 (복수 선택 가능) <Required>*</Required></Label>
            <RadioGroup>
              <RadioLabel>
                <RadioInput
                  type="checkbox"
                  value="active"
                  checked={formData.personality.includes('active')}
                  onChange={(e) => handlePersonalityChange('active', e.target.checked)}
                />
                <RadioText>활발하고 에너지 넘치는</RadioText>
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="checkbox"
                  value="calm"
                  checked={formData.personality.includes('calm')}
                  onChange={(e) => handlePersonalityChange('calm', e.target.checked)}
                />
                <RadioText>차분하고 안정적인</RadioText>
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="checkbox"
                  value="creative"
                  checked={formData.personality.includes('creative')}
                  onChange={(e) => handlePersonalityChange('creative', e.target.checked)}
                />
                <RadioText>창의적이고 독창적인</RadioText>
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="checkbox"
                  value="kind"
                  checked={formData.personality.includes('kind')}
                  onChange={(e) => handlePersonalityChange('kind', e.target.checked)}
                />
                <RadioText>따뜻하고 친근한</RadioText>
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="checkbox"
                  value="strong"
                  checked={formData.personality.includes('strong')}
                  onChange={(e) => handlePersonalityChange('strong', e.target.checked)}
                />
                <RadioText>강인하고 의지가 강한</RadioText>
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="checkbox"
                  value="wise"
                  checked={formData.personality.includes('wise')}
                  onChange={(e) => handlePersonalityChange('wise', e.target.checked)}
                />
                <RadioText>지혜롭고 똑똑한</RadioText>
              </RadioLabel>
            </RadioGroup>
            {errors.personality && <ErrorMessage>{errors.personality}</ErrorMessage>}
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
