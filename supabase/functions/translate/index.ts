import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

interface TranslationRequest {
  text: string
  target_language?: string
  include_terms?: boolean
}

interface AudioTranslationRequest {
  audio_data: string // base64 encoded audio
  target_language?: string
  source_language?: string
  include_terms?: boolean
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, target_language = 'en', include_terms = true } = await req.json() as TranslationRequest

    // OpenAI API 호출
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a professional Korean traditional fortune-telling (사주) translator.
            Translate Korean saju terms and explanations to ${target_language} accurately,
            preserving cultural context and meaning. If translating to Korean, maintain formal tone.`
          },
          {
            role: 'user',
            content: `Translate this saju-related text to ${target_language}: "${text}"`
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
      })
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const openaiData = await openaiResponse.json()
    const translatedText = openaiData.choices[0].message.content.trim()

    // 사주 용어 추출 (간단한 예시)
    const sajuTerms = include_terms ? extractSajuTerms(text) : []

    const result = {
      success: true,
      original_text: text,
      translated_text: translatedText,
      target_language,
      extracted_terms: sajuTerms,
      processing_time: Date.now(),
      token_usage: openaiData.usage
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Translation error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Translation failed'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})

// 사주 용어 추출 함수 (기본적인 구현)
function extractSajuTerms(text: string): string[] {
  const commonSajuTerms = [
    '갑', '을', '병', '정', '무', '기', '경', '신', '임', '계',
    '자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해',
    '목', '화', '토', '금', '수',
    '정관', '편관', '정재', '편재', '식신', '상관', '비견', '겁재',
    '년주', '월주', '일주', '시주',
    '대운', '세운', '월운', '일운'
  ]

  return commonSajuTerms.filter(term => text.includes(term))
}