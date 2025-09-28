import OpenAI from 'openai';

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface NameGenerationRequest {
  originalName: string;
  gender: string;
  personality: string[];
}

export interface NameGenerationResponse {
  name_hangul: string;
  name_hanja: string;
  romanization: string;
  meaning: string;
}

export const generateKoreanName = async (
  formData: NameGenerationRequest
): Promise<NameGenerationResponse> => {
  console.log('🚀 OpenAI API 직접 호출 시작:', formData);
  
  try {
    // 성격 배열을 문자열로 변환
    const personalityDescriptions = formData.personality.map(p => getPersonalityDescription(p));
    const personalityText = personalityDescriptions.join(', ');

    // OpenAI API 직접 호출
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a Korean name generator. Always respond in strict JSON format only.'
        },
        {
          role: 'user',
          content: `You are a Korean name generator for foreigners.

Input fields:

Original name: ${formData.originalName} (full name, e.g., John Smith, 李小龍, 山田太郎, María González)

Gender: ${formData.gender === 'male' ? 'Male' : 'Female'}

Personality traits: ${personalityText} (multiple choices possible)

Task:
Generate one Korean name primarily inspired by the sound of the original name, but also provide a meaningful Hanja interpretation reflecting the person’s personality traits.

Rules:

The name must be 3 Korean characters: 1-syllable surname + 2-syllable given name (natural Korean male/female name pattern).

Do not directly transliterate the original name.

Use the sound of the original name to inspire both surname and given name, adapting to sensible, natural Korean names.

Provide a Hanja interpretation for meaning, reflecting personality traits.

Return output in strict JSON format:

{
  "name_hangul": "...",
  "name_hanja": "...",
  "romanization": "...",
  "meaning": "Explain briefly the meaning of each character and why this name fits the person."
}


Examples:

English name: Kevin De Bruyne → 김덕배 (Kim Deok-bae)

Explanation: The sound of "De Bruyne" inspires “Deok-bae” (덕배) and “Kevin” inspires the surname “Kim” (김) for a natural Korean male name. Hanja 德培 represents 德 (Deok, virtue) and 培 (Bae, cultivate), meaning “one who cultivates virtue,” reflecting creativity and a warm, friendly personality.

Chinese name: 李小龍 → 이소룡 (Lee So-ryong)

Explanation: The sound “Li Xiao-long” inspires the Korean pronunciation “So-ryong” (소룡) with surname Lee (이). Hanja 小龍 represents 小 (So, small) and 龍 (Ryong, dragon), interpreted as “small but powerful dragon,” reflecting strong and determined traits.

Japanese name: 山田太郎 → 이태로 (Lee Tae-ro)

Explanation: The sound “Yamada Taro” inspires the Korean given name “Tae-ro” (태로) with surname Lee (이), following the 1+2 글자 패턴. Hanja 泰魯 represents 泰 (Tae, peaceful) and 魯 (Ro, bright/clear), interpreted as “one who is bright and peaceful,” reflecting wisdom and stability.

Spanish name: María González → 마리안 (Ma-ri-an)

Explanation: The sound “María” inspires “Ma-ri” (마리) and “González” inspires the surname “An” (안). Hanja 安理 represents 安 (An, peace) and 理 (Ri, reason), interpreted as “one who brings peace and clarity,” reflecting kindness and intelligence.

`
        }
      ],
      temperature: 0.8,
      max_tokens: 500
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('OpenAI 응답이 비어있습니다');
    }

    console.log('📡 OpenAI 응답:', content);

    // JSON 파싱 (마크다운 코드 블록 제거)
    let result: NameGenerationResponse;
    try {
      // 마크다운 코드 블록 제거
      let cleanContent = content.trim();
      
      // ```json과 ``` 제거
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '');
      }
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '');
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.replace(/\s*```$/, '');
      }
      
      console.log('🧹 정리된 JSON:', cleanContent);
      
      result = JSON.parse(cleanContent) as NameGenerationResponse;
    } catch (parseError) {
      console.error('❌ JSON 파싱 오류:', parseError);
      console.log('📝 원본 응답:', content);
      throw new Error('OpenAI 응답이 유효한 JSON 형식이 아닙니다');
    }
    
    console.log('🔍 파싱된 결과:', result);
    
    // 필수 필드 검증 (더 자세한 오류 메시지)
    const missingFields = [];
    
    if (!result.name_hangul) missingFields.push('name_hangul');
    if (!result.name_hanja) missingFields.push('name_hanja');
    if (!result.romanization) missingFields.push('romanization');
    if (!result.meaning) missingFields.push('meaning');
    
    if (missingFields.length > 0) {
      console.error('❌ 누락된 필드들:', missingFields);
      console.log('📝 현재 결과 구조:', JSON.stringify(result, null, 2));
      throw new Error(`OpenAI 응답에서 필수 필드가 누락되었습니다: ${missingFields.join(', ')}`);
    }

    
    //console.log('✅ OpenAI API 성공:', result);
    return result;
  } catch (error) {
    console.error('❌ OpenAI API 호출 오류:', error);
    console.log('🔄 폴백 로직 실행 중...');
    
    // 에러 발생 시 기본 이름 생성 로직으로 fallback
    const fallbackResult = generateFallbackName(formData);
    //console.log('📝 폴백 결과:', fallbackResult);
    return fallbackResult;
  }
};


// 성격 설명 함수 (영어로 변환)
const getPersonalityDescription = (personality: string): string => {
  const descriptions: { [key: string]: string } = {
    'active': 'active and energetic',
    'calm': 'calm and stable',
    'creative': 'creative and original',
    'kind': 'warm and friendly',
    'strong': 'strong and determined',
    'wise': 'wise and intelligent'
  };
  return descriptions[personality] || 'special';
};


// 폴백 이름 생성 함수 (OpenAI 실패 시 사용)
const generateFallbackName = (formData: NameGenerationRequest): NameGenerationResponse => {
  const surnames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
  const maleNames = ['민수', '준호', '태현', '현우', '지훈', '동현', '성민', '준영', '민호', '재현'];
  const femaleNames = ['지은', '서연', '민지', '예은', '하늘', '지현', '수진', '예진', '서현', '민정'];
  const maleHanja = ['民秀', '俊浩', '泰賢', '賢宇', '智勳', '東炫', '成民', '俊英', '民浩', '在炫'];
  const femaleHanja = ['智恩', '瑞妍', '民智', '藝恩', '河娜', '智賢', '秀珍', '藝珍', '瑞賢', '民貞'];
  
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const givenName = formData.gender === 'male' 
    ? maleNames[Math.floor(Math.random() * maleNames.length)]
    : femaleNames[Math.floor(Math.random() * femaleNames.length)];
  
  const hanjaName = formData.gender === 'male'
    ? maleHanja[Math.floor(Math.random() * maleHanja.length)]
    : femaleHanja[Math.floor(Math.random() * femaleHanja.length)];
  
  const fullName = `${surname}${givenName}`;
  const fullHanja = `金${hanjaName}`; // 성씨는 김으로 고정
  
  return {
    name_hangul: fullName,
    name_hanja: fullHanja,
    romanization: `${surname} ${givenName}`,
    meaning: `${formData.originalName}님의 성격을 반영한 의미있는 한국 이름입니다.`
  };
};
