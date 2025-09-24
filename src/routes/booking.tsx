import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useI18n } from '../i18n/i18n';

const Container = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 0;
  margin: 0;
  width: 100%;
  position: relative;
  
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
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
`;

const BusinessInfo = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #e5e7eb;
`;

const BusinessName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const BusinessDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DetailLabel = styled.span`
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
`;

const DetailValue = styled.span`
  font-size: 1rem;
  color: #1f2937;
  font-weight: 600;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const Required = styled.span`
  color: #dc2626;
  margin-left: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const TimeSlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
`;

const TimeSlot = styled.button<{ $selected?: boolean; $disabled?: boolean }>`
  padding: 0.75rem;
  border: 2px solid ${props => props.$selected ? '#3b82f6' : '#e5e7eb'};
  border-radius: 8px;
  background: ${props => props.$selected ? '#3b82f6' : props.$disabled ? '#f3f4f6' : 'white'};
  color: ${props => props.$selected ? 'white' : props.$disabled ? '#9ca3af' : '#374151'};
  font-weight: 500;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    border-color: #3b82f6;
    background: ${props => props.$selected ? '#3b82f6' : '#f8fafc'};
  }
`;

const ServiceOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ServiceOption = styled.div<{ $selected?: boolean }>`
  padding: 1rem;
  border: 2px solid ${props => props.$selected ? '#3b82f6' : '#e5e7eb'};
  border-radius: 12px;
  background: ${props => props.$selected ? '#f0f9ff' : 'white'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #3b82f6;
    background: #f8fafc;
  }
`;

const ServiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const ServiceName = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const ServicePrice = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: #059669;
`;

const ServiceDescription = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
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

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f4f6;
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// 캘린더 스타일
const CalendarContainer = styled.div`
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  background: white;
  margin-top: 1rem;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const CalendarTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const CalendarNavButton = styled.button`
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #374151;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e5e7eb;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

const CalendarDayHeader = styled.div<{ $isWeekend?: boolean; $isSunday?: boolean; $isSaturday?: boolean }>`
  text-align: center;
  font-weight: 600;
  color: ${props => {
    if (props.$isSunday) return '#dc2626'; // 일요일 빨강
    if (props.$isSaturday) return '#2563eb'; // 토요일 파랑
    return '#6b7280'; // 평일 회색
  }};
  font-size: 0.9rem;
  padding: 0.5rem 0;
`;

const CalendarDay = styled.button<{ $isSelected?: boolean; $isDisabled?: boolean; $isToday?: boolean; $isOtherMonth?: boolean }>`
  aspect-ratio: 1;
  border: none;
  border-radius: 8px;
  background: ${props => {
    if (props.$isSelected) return '#3b82f6';
    if (props.$isToday) return '#f0f9ff';
    if (props.$isDisabled) return '#f9fafb';
    return 'white';
  }};
  color: ${props => {
    if (props.$isSelected) return 'white';
    if (props.$isOtherMonth) return '#d1d5db';
    if (props.$isDisabled) return '#9ca3af';
    if (props.$isToday) return '#3b82f6';
    return '#374151';
  }};
  cursor: ${props => props.$isDisabled || props.$isOtherMonth ? 'not-allowed' : 'pointer'};
  font-weight: ${props => props.$isToday || props.$isSelected ? '600' : '400'};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${props => {
      if (props.$isSelected) return '#3b82f6';
      if (props.$isToday) return '#e0f2fe';
      return '#f3f4f6';
    }};
  }
  
  &:disabled {
    opacity: 0.5;
  }
`;

// Mock business data (실제로는 props나 API에서 받아올 데이터)
const mockBusinessData = {
  id: 1,
  title: "AI 사주 분석",
  base_price: 29000,
  currency: "KRW",
  contact: {
    phone: "02-1234-5678",
    address: "서울특별시 강남구 역삼동 123-45",
    business_hours: "09:00 - 21:00"
  }
};

interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  selectedDate: string;
  selectedTime: string;
  selectedService: number;
  specialRequests: string;
}

// 캘린더 컴포넌트
interface CalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  // 달의 첫 번째 날과 마지막 날
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDay.getDay();
  
  // 달의 모든 날짜 생성
  const daysInMonth = lastDay.getDate();
  const days = [];
  
  // 이전 달의 날짜들 (빈 칸 채우기)
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const prevDate = new Date(year, month, -i);
    days.push({
      date: prevDate,
      isOtherMonth: true,
      isDisabled: true
    });
  }
  
  // 현재 달의 날짜들
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isToday = date.toDateString() === today.toDateString();
    const isPast = date < today;
    const isDisabled = isPast; // 주말 제한 제거
    
    days.push({
      date,
      isOtherMonth: false,
      isDisabled,
      isToday
    });
  }
  
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };
  
  const handleDateClick = (date: Date) => {
    if (date >= today) {
      onDateSelect(date.toISOString().split('T')[0]);
    }
  };
  
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  
  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarNavButton onClick={handlePrevMonth}>
          ‹
        </CalendarNavButton>
        <CalendarTitle>
          {year}년 {monthNames[month]}
        </CalendarTitle>
        <CalendarNavButton onClick={handleNextMonth}>
          ›
        </CalendarNavButton>
      </CalendarHeader>
      
      <CalendarGrid>
        {weekDays.map((day, index) => (
          <CalendarDayHeader 
            key={day}
            $isSunday={index === 0}
            $isSaturday={index === 6}
          >
            {day}
          </CalendarDayHeader>
        ))}
        
        {days.map((day, index) => {
          const isSelected = selectedDate === day.date.toISOString().split('T')[0];
          
          return (
            <CalendarDay
              key={index}
              $isSelected={isSelected}
              $isDisabled={day.isDisabled}
              $isToday={day.isToday}
              $isOtherMonth={day.isOtherMonth}
              onClick={() => handleDateClick(day.date)}
              disabled={day.isDisabled}
            >
              {day.date.getDate()}
            </CalendarDay>
          );
        })}
      </CalendarGrid>
    </CalendarContainer>
  );
};

export default function Booking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  
  // URL 파라미터에서 예약 데이터 읽기
  const searchParams = new URLSearchParams(location.search);
  
  const [formData, setFormData] = useState<BookingFormData>({
    name: searchParams.get('name') || '',
    phone: searchParams.get('phone') || '',
    email: searchParams.get('email') || '',
    selectedDate: searchParams.get('selectedDate') || '',
    selectedTime: searchParams.get('selectedTime') || '',
    selectedService: parseInt(searchParams.get('selectedService') || '1'),
    specialRequests: searchParams.get('specialRequests') || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<BookingFormData>>({});
  
  
  // 시간 슬롯 생성
  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];
  
  // 서비스 옵션
  const serviceOptions = [
    {
      id: 1,
      name: "기본 사주 상담",
      price: 29000,
      description: "AI 기반 기본 사주 분석 및 상담"
    },
    {
      id: 2,
      name: "프리미엄 사주 상담",
      price: 49000,
      description: "상세한 AI 분석 + 전통 사주 해석"
    },
    {
      id: 3,
      name: "VIP 종합 상담",
      price: 79000,
      description: "종합 분석 + 개인 맞춤 조언 + 후속 상담"
    }
  ];
  
  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
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
    const newErrors: Partial<BookingFormData> = {};
    
    if (!formData.name.trim()) newErrors.name = '이름을 입력해주세요.';
    if (!formData.phone.trim()) newErrors.phone = '연락처를 입력해주세요.';
    if (!formData.email.trim()) newErrors.email = '이메일을 입력해주세요.';
    if (!formData.selectedDate) newErrors.selectedDate = '예약 날짜를 선택해주세요.';
    if (!formData.selectedTime) newErrors.selectedTime = '예약 시간을 선택해주세요.';
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }
    
    // 전화번호 형식 검증 (더 유연하게)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다.';
    }
    
    // 전화번호 최소 길이 검증 (국제번호 고려)
    if (formData.phone && formData.phone.replace(/\D/g, '').length < 7) {
      newErrors.phone = '전화번호가 너무 짧습니다. (최소 7자리)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // 예약 데이터를 URL 파라미터로 전달하여 결제 페이지로 이동
    const searchParams = new URLSearchParams({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      selectedDate: formData.selectedDate,
      selectedTime: formData.selectedTime,
      selectedService: formData.selectedService.toString(),
      specialRequests: formData.specialRequests
    });
    
    navigate(`/business/${id}/payment?${searchParams.toString()}`);
  };
  
  const handleCancel = () => {
    navigate(-1);
  };
  
  const formatPrice = (price: number, currency: string) => {
    switch (currency) {
      case 'KRW':
        return `₩${price.toLocaleString()}`;
      case 'USD':
        return `$${price}`;
      default:
        return `₩${price.toLocaleString()}`;
    }
  };
  
  return (
    <Container>
      <ContentWrapper>
        <Header>
          <Title>예약하기</Title>
          <Subtitle>원하는 날짜와 시간을 선택하여 예약해주세요</Subtitle>
        </Header>
        
        <BusinessInfo>
          <BusinessName>{mockBusinessData.title}</BusinessName>
          <BusinessDetails>
            <DetailItem>
              <DetailLabel>주소</DetailLabel>
              <DetailValue>{mockBusinessData.contact.address}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>연락처</DetailLabel>
              <DetailValue>{mockBusinessData.contact.phone}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>운영시간</DetailLabel>
              <DetailValue>{mockBusinessData.contact.business_hours}</DetailValue>
            </DetailItem>
          </BusinessDetails>
        </BusinessInfo>
        
        <form onSubmit={handleSubmit}>
          {/* 서비스 선택 */}
          <FormSection>
            <SectionTitle>🎯 서비스 선택</SectionTitle>
            <ServiceOptions>
              {serviceOptions.map((service) => (
                <ServiceOption
                  key={service.id}
                  $selected={formData.selectedService === service.id}
                  onClick={() => handleInputChange('selectedService', service.id)}
                >
                  <ServiceHeader>
                    <ServiceName>{service.name}</ServiceName>
                    <ServicePrice>{formatPrice(service.price, 'KRW')}</ServicePrice>
                  </ServiceHeader>
                  <ServiceDescription>{service.description}</ServiceDescription>
                </ServiceOption>
              ))}
            </ServiceOptions>
          </FormSection>
          
          {/* 예약자 정보 */}
          <FormSection>
            <SectionTitle>👤 예약자 정보</SectionTitle>
            
            <FormGroup>
              <Label>
                이름 <Required>*</Required>
              </Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="이름을 입력해주세요"
              />
              {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label>
                연락처 <Required>*</Required>
              </Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+82 10-1234-5678 또는 010-1234-5678"
              />
              <div style={{ 
                fontSize: '0.85rem', 
                color: '#6b7280', 
                marginTop: '0.25rem',
                lineHeight: '1.4'
              }}>
                💡 한국: 010-1234-5678 | 해외: +82 10-1234-5678
              </div>
              {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label>
                이메일 <Required>*</Required>
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="example@email.com"
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </FormGroup>
          </FormSection>
          
          {/* 예약 날짜 */}
          <FormSection>
            <SectionTitle>📅 예약 날짜</SectionTitle>
            
            <FormGroup>
              <Label>
                날짜 선택 <Required>*</Required>
              </Label>
              <Calendar 
                selectedDate={formData.selectedDate}
                onDateSelect={(date) => handleInputChange('selectedDate', date)}
              />
              {errors.selectedDate && <ErrorMessage>{errors.selectedDate}</ErrorMessage>}
            </FormGroup>
          </FormSection>
          
          {/* 예약 시간 */}
          <FormSection>
            <SectionTitle>🕐 예약 시간</SectionTitle>
            
            <FormGroup>
              <Label>
                시간 선택 <Required>*</Required>
              </Label>
              <TimeSlotGrid>
                {timeSlots.map((time) => (
                  <TimeSlot
                    key={time}
                    type="button"
                    $selected={formData.selectedTime === time}
                    onClick={() => handleInputChange('selectedTime', time)}
                  >
                    {time}
                  </TimeSlot>
                ))}
              </TimeSlotGrid>
              {errors.selectedTime && <ErrorMessage>{errors.selectedTime}</ErrorMessage>}
            </FormGroup>
          </FormSection>
          
          {/* 특별 요청사항 */}
          <FormSection>
            <SectionTitle>💬 특별 요청사항</SectionTitle>
            
            <FormGroup>
              <Label>요청사항 (선택사항)</Label>
              <TextArea
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                placeholder="특별한 요청사항이나 질문이 있으시면 입력해주세요"
              />
            </FormGroup>
          </FormSection>
          
          <ButtonGroup>
            <Button type="button" onClick={handleCancel}>
              취소
            </Button>
            <Button type="submit" $variant="primary" disabled={loading}>
              {loading ? <LoadingSpinner /> : '결제하기'}
            </Button>
          </ButtonGroup>
        </form>
      </ContentWrapper>
    </Container>
  );
}
