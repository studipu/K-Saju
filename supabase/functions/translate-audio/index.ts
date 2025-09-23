import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

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
    const {
      audio_data,
      target_language = 'en',
      source_language = 'ko',
      include_terms = true
    } = await req.json() as AudioTranslationRequest

    // Convert base64 audio to blob for OpenAI
    const audioBuffer = Uint8Array.from(atob(audio_data), c => c.charCodeAt(0))
    const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' })

    // OpenAI Whisper API 호출 (STT)
    const formData = new FormData()
    formData.append('file', audioBlob, 'audio.wav')
    formData.append('model', 'whisper-1')
    formData.append('language', source_language)

    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData
    })

    if (!whisperResponse.ok) {
      throw new Error(`Whisper API error: ${whisperResponse.statusText}`)
    }

    const whisperData = await whisperResponse.json()
    const transcribedText = whisperData.text.trim()

    if (!transcribedText) {
      throw new Error('No speech detected in audio')
    }

    // 번역 수행
    const translationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `Translate this saju-related text to ${target_language}: "${transcribedText}"`
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
      })
    })

    if (!translationResponse.ok) {
      throw new Error(`Translation API error: ${translationResponse.statusText}`)
    }

    const translationData = await translationResponse.json()
    const translatedText = translationData.choices[0].message.content.trim()

    // 사주 용어 추출
    const sajuTerms = include_terms ? extractSajuTerms(transcribedText) : []

    const result = {
      success: true,
      original_text: transcribedText,
      translated_text: translatedText,
      target_language,
      source_language,
      extracted_terms: sajuTerms,
      processing_time: Date.now(),
      stt_info: {
        detected_text: transcribedText,
        detected_language: whisperData.language || source_language
      },
      input_method: 'voice_upload'
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
    console.error('Audio translation error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Audio translation failed'
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

// 사주 용어 추출 함수
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