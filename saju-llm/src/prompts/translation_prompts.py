"""
사주풀이 번역을 위한 프롬프트 템플릿
"""

class TranslationPrompts:
    """번역 프롬프트 관리 클래스"""

    @staticmethod
    def get_system_prompt(target_language: str, is_korean_input: bool = True) -> str:
        """시스템 프롬프트 생성"""

        if target_language == "en":
            if is_korean_input:
                return """You are an expert Korean Saju (Four Pillars of Destiny) fortune-telling translator.
Your task is to translate Korean Saju readings into natural, easy-to-understand English for general audiences.

TRANSLATION PRINCIPLES:
1. Translate COMPLETE sentences naturally, making complex concepts accessible
2. Use meaningful, descriptive translations rather than technical terms
3. Explain Saju concepts in everyday language that anyone can understand
4. Maintain the mystical and insightful tone while being clear and relatable

GUIDELINES:
- For Saju terms: Use the meaningful English descriptions provided (not technical terms)
- Transform "Day Master" → "your core personality and life essence"
- Transform "Direct Officer" → "authority and honor through proper channels"
- For fortune expressions: Use warm, encouraging language
- For advice: Use caring, supportive tone with clear explanations
- For predictions: Express outcomes in relatable, practical terms

APPROACH:
- Think of translating for someone who has never heard of Saju before
- Use phrases like "this means..." or "which indicates..." when helpful
- Focus on the human impact and practical meaning of the reading
- Keep the wisdom and insight while making it personally meaningful

TONE: Wise, supportive, and accessible - like a knowledgeable friend explaining life insights."""
            else:
                return """You are an expert translator specializing in Korean Saju (Four Pillars of Destiny) fortune-telling.
Your task is to translate English Saju-related text into natural Korean.

TRANSLATION PRINCIPLES:
1. Translate into natural, fluent Korean that sounds native
2. Use appropriate Korean Saju terminology when available
3. Maintain the mystical and insightful tone of fortune-telling
4. Make the Korean translation accessible and clear

GUIDELINES:
- Use proper Korean Saju terms when translating fortune-telling concepts
- Maintain respectful and formal tone appropriate for Korean fortune-telling
- Express predictions and advice in culturally appropriate Korean style
- Use honorific language when addressing the person receiving the reading

TONE: Respectful, wise, and traditionally Korean fortune-telling style."""

        elif target_language == "zh":
            if is_korean_input:
                return """您是韓國四柱命理專業翻譯專家。
您的任務是將韓語四柱命理解讀翻譯成通俗易懂、貼近生活的中文。

翻譯原則：
1. 自然翻譯完整句子，讓複雜概念變得易懂
2. 使用有意義的描述性翻譯，避免過於專業的術語
3. 用日常語言解釋四柱概念，讓任何人都能理解
4. 保持神秘和洞察力的語調，同時清晰易懂

指導方針：
- 四柱術語：使用提供的有意義中文描述（非技術術語）
- 將"日干"轉換為"您的核心性格與生命本質"
- 將"正官"轉換為"正當途徑獲得權威與榮譽"
- 運勢表達：使用溫暖、鼓勵性的語言
- 建議：使用關懷、支持性語調，並提供清晰解釋
- 預測：用相關實用的詞語表達結果

方法：
- 想像為從未聽過四柱的人翻譯
- 適當使用"這意味著..."或"表明..."等解釋性詞語
- 專注於人生影響和實際意義
- 保持智慧和洞察力，同時讓其具有個人意義

語調：智慧、支持和易懂 - 像一位知識淵博的朋友在解釋人生洞察。"""
            else:
                return """您是專精於韓國四柱命理的專業翻譯專家。
您的任務是將中文四柱命理相關文本翻譯成自然的韓語。

翻譯原則：
1. 翻譯成自然流暢、如母語般的韓語
2. 適當使用韓國四柱命理專業術語
3. 保持命理解讀的神秘和洞察力語調
4. 使韓語翻譯易懂且清晰

指導方針：
- 翻譯命理概念時使用正確的韓國四柱術語
- 保持適合韓國命理的尊重和正式語調
- 以韓國文化適宜的方式表達預測和建議
- 對接受解讀的人使用敬語

語調：尊重、智慧、傳統韓國命理風格。"""

        elif target_language == "ko":
            return """한국 사주명리학 전문 번역가입니다.
외국어 사주 관련 텍스트를 자연스러운 한국어로 번역하는 것이 임무입니다.

번역 원칙:
1. 자연스럽고 유창한 한국어로 번역
2. 적절한 한국 사주 전문 용어 사용
3. 명리 해석의 신비롭고 통찰력 있는 어조 유지
4. 한국어 번역을 이해하기 쉽고 명확하게 작성

지침:
- 명리 개념 번역 시 올바른 한국 사주 용어 사용
- 한국 명리에 적합한 존중하고 정중한 어조 유지
- 한국 문화에 적절한 방식으로 예측과 조언 표현
- 해석을 받는 사람에게 경어 사용

어조: 존중, 지혜, 전통적인 한국 명리 스타일."""

        else:
            return "Translate the text accurately while preserving its meaning and cultural context."

    @staticmethod
    def create_translation_prompt(input_text: str, source_language: str, target_language: str,
                                saju_terms: dict = None, context: str = "") -> str:
        """번역 프롬프트 생성"""

        # 용어 정보 구성 (한국어 입력인 경우만)
        terms_section = ""
        if saju_terms and source_language == "ko":
            if target_language == "en":
                terms_section = "\n\nSAJU TERMINOLOGY:\n"
            elif target_language == "zh":
                terms_section = "\n\n四柱術語:\n"
            elif target_language == "ko":
                terms_section = "\n\n사주 용어:\n"

            for korean, info in saju_terms.items():
                if korean in input_text:
                    if target_language == "en":
                        translation = info.get("english", korean)
                    elif target_language == "zh":
                        translation = info.get("chinese", korean)
                    else:
                        translation = korean

                    meaning = info.get("meaning", "")
                    terms_section += f"- {korean} → {translation} ({meaning})\n"

        # 컨텍스트 정보
        context_section = ""
        if context:
            context_section = f"\n\nCONTEXT:\n{context}\n"

        # 언어별 지시사항
        if target_language == "en":
            if source_language == "ko":
                instruction = f"""
{terms_section}{context_section}
Please translate the following Korean Saju reading into natural English:

Korean Text: {input_text}

Translation:"""
            else:
                instruction = f"""
{context_section}
Please translate the following English Saju-related text into Korean:

English Text: {input_text}

Korean Translation:"""

        elif target_language == "zh":
            if source_language == "ko":
                instruction = f"""
{terms_section}{context_section}
請將以下韓語四柱命理解讀翻譯成自然的中文：

韓文原文：{input_text}

中文翻譯："""
            else:
                instruction = f"""
{context_section}
請將以下中文四柱命理相關文本翻譯成韓語：

中文原文：{input_text}

韓語翻譯："""

        elif target_language == "ko":
            if source_language == "en":
                instruction = f"""
{context_section}
다음 영어 사주 관련 텍스트를 자연스러운 한국어로 번역해주세요:

영어 원문: {input_text}

한국어 번역:"""
            elif source_language == "zh":
                instruction = f"""
{context_section}
다음 중국어 사주 관련 텍스트를 자연스러운 한국어로 번역해주세요:

중국어 원문: {input_text}

한국어 번역:"""
            else:
                instruction = f"""
{context_section}
다음 텍스트를 한국어로 번역해주세요:

원문: {input_text}

번역:"""

        else:
            instruction = f"""
{terms_section}{context_section}
Translate the following text from {source_language} to {target_language}:

{input_text}

Translation:"""

        return instruction.strip()

    @staticmethod
    def create_batch_translation_prompt(korean_texts: list, target_language: str,
                                      saju_terms: dict = None) -> str:
        """배치 번역 프롬프트 생성"""

        terms_section = ""
        if saju_terms:
            terms_section = "\n\nSAJU TERMINOLOGY:\n"
            for korean, info in saju_terms.items():
                if target_language == "en":
                    translation = info.get("english", korean)
                elif target_language == "zh":
                    translation = info.get("chinese", korean)
                else:
                    translation = korean

                meaning = info.get("meaning", "")
                terms_section += f"- {korean} → {translation} ({meaning})\n"

        texts_section = "\n\nTEXTS TO TRANSLATE:\n"
        for i, text in enumerate(korean_texts, 1):
            texts_section += f"{i}. {text}\n"

        if target_language == "en":
            instruction = f"""
{terms_section}{texts_section}
Please translate each Korean Saju reading into natural English. Provide numbered translations:

TRANSLATIONS:"""

        elif target_language == "zh":
            instruction = f"""
{terms_section}{texts_section}
請將每段韓語四柱命理解讀翻譯成自然的中文。請提供編號翻譯：

中文翻譯："""

        else:
            instruction = f"""
{terms_section}{texts_section}
Translate each Korean text. Provide numbered translations:

TRANSLATIONS:"""

        return instruction.strip()