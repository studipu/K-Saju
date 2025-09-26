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
  nationality: string;
}

export interface NameGenerationResponse {
  sound_based: {
    name_hangul: string;
    romanization: string;
    note: string;
  };
  meaning_based: {
    name_hangul: string;
    name_hanja: string;
    romanization: string;
    meaning: string;
  };
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
- Original name: ${formData.originalName}  (e.g., John, Maria, Ahmed)
- Gender: ${formData.gender === 'male' ? 'Male' : 'Female'}
- Personality traits: ${personalityText}  (multiple choices possible)
- Nationality: ${getNationalityDescription(formData.nationality)}

Task:
Generate **two completely different Korean names** with the following rules:

1. Sound-based name
   - Must be **3 Korean characters**: 1-syllable surname + 2-syllable given name (natural Korean male/female name pattern).  
   - Do **not** directly transliterate the original name (e.g., "Robert → 로버트" is NOT allowed).  
   - Use the **sound of the original name** to inspire the Korean surname and given name, but adapt them to **sensible, natural Korean names**.  
   - Provide a short explanation (2–3 sentences) describing how the English name was adapted.  

2. Meaning-based name
   - Create one Korean name using Hanja.  
   - You may choose a surname with meaningful Hanja that aligns with the person's personality traits.  
   - Include:
     - Hangul (Korean characters)
     - Hanja (Chinese characters)
     - Romanization
     - Explanation (2–3 sentences) describing the meaning of each character, including the surname if meaningful, and why this name matches the person’s personality traits.  
   - Ensure this name is different from the sound-based name.

Return output in **strict JSON** format:

{
  "sound_based": {
    "name_hangul": "...",
    "romanization": "...",
    "note": "..."
  },
  "meaning_based": {
    "name_hangul": "...",
    "name_hanja": "...",
    "romanization": "...",
    "meaning": "..."
  }
}

Examples of pattern for inspiration:

1. Daniel Lewis → 류다현 (Ryu Da-hyun)  
   Note: 'Lewis' inspires the surname 'Ryu', 'Daniel' inspires given name 'Da-hyun'.

2. Alexander Hamilton → 한준호 (Han Jun-ho)  
   Note: 'Hamilton' inspires the surname 'Han', 'Alexander' inspires given name 'Jun-ho'.

Important: Always create **3-character Korean names for sound-based**, and do **not directly copy the original name** into Hangul.
Ensure that the generated names follow appropriate patterns for the specified gender, using natural male or female Korean name conventions.
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

    //console.log('📡 OpenAI 응답:', content);

    // JSON 파싱
    const result = JSON.parse(content) as NameGenerationResponse;
    
    // 필수 필드 검증
    if (!result.sound_based?.name_hangul || !result.sound_based?.romanization || !result.sound_based?.note ||
        !result.meaning_based?.name_hangul || !result.meaning_based?.name_hanja || 
        !result.meaning_based?.romanization || !result.meaning_based?.meaning) {
      throw new Error('OpenAI 응답 형식이 올바르지 않습니다');
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


// 성격 설명 함수
const getPersonalityDescription = (personality: string): string => {
  const descriptions: { [key: string]: string } = {
    'active': '활발하고 에너지 넘치는',
    'calm': '차분하고 안정적인',
    'creative': '창의적이고 독창적인',
    'kind': '따뜻하고 친근한',
    'strong': '강인하고 의지가 강한',
    'wise': '지혜롭고 똑똑한'
  };
  return descriptions[personality] || '특별한';
};

// 국적 설명 함수
const getNationalityDescription = (nationality: string): string => {
  const descriptions: { [key: string]: string } = {
    'us': '미국',
    'uk': '영국',
    'canada': '캐나다',
    'australia': '호주',
    'germany': '독일',
    'france': '프랑스',
    'japan': '일본',
    'china': '중국',
    'thailand': '태국',
    'vietnam': '베트남',
    'india': '인도',
    'brazil': '브라질',
    'mexico': '멕시코',
    'other': '기타'
  };
  return descriptions[nationality] || '기타';
};

// 폴백 이름 생성 함수 (OpenAI 실패 시 사용)
const generateFallbackName = (formData: NameGenerationRequest): NameGenerationResponse => {
  const surnames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
  const maleNames = ['민수', '준호', '태현', '현우', '지훈', '동현', '성민', '준영', '민호', '재현'];
  const femaleNames = ['지은', '서연', '민지', '예은', '하늘', '지현', '수진', '예진', '서현', '민정'];
  
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const givenName = formData.gender === 'male' 
    ? maleNames[Math.floor(Math.random() * maleNames.length)]
    : femaleNames[Math.floor(Math.random() * femaleNames.length)];
  
  const soundBasedName = `${surname}${givenName}`;
  const meaningBasedName = `${surname}${givenName}`;
  
  return {
    sound_based: {
      name_hangul: soundBasedName,
      romanization: `${surname} ${givenName}`,
      note: `${formData.originalName}의 발음을 한국어로 재현한 이름입니다.`
    },
    meaning_based: {
      name_hangul: meaningBasedName,
      name_hanja: '金民秀', // 예시 한자
      romanization: `${surname} ${givenName}`,
      meaning: `${formData.originalName}님의 성격을 반영한 의미있는 한국 이름입니다.`
    }
  };
};
