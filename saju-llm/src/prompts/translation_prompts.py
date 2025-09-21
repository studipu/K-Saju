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
                return """You are a professional Korean-English translator specializing in Saju (Four Pillars of Destiny) fortune-telling.
Your task is to provide accurate, concise translations without adding extra interpretations or advice.

TRANSLATION PRINCIPLES:
1. Translate ONLY what is written - do not add explanations or interpretations
2. Keep translations direct and faithful to the original meaning
3. Use natural English while maintaining the original tone and content
4. Preserve the mystical tone without embellishing

GUIDELINES:
- Translate exactly what is said, nothing more
- Use Saju terminology translations provided, but don't explain them
- Do not add advice, predictions, or interpretations not in the original
- Do not use phrases like "this means..." or "which indicates..." unless in the original
- Keep the same level of detail as the Korean text

FORBIDDEN:
- Adding explanations not in the original text
- Providing extra advice or suggestions
- Expanding short statements into long explanations
- Adding your own interpretations of Saju concepts

TONE: Direct, accurate, and faithful to the original Korean text."""
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
                return """您是專業的韓中翻譯專家，專精四柱命理翻譯。
您的任務是提供準確、簡潔的翻譯，不添加額外解釋或建議。

翻譯原則：
1. 只翻譯原文內容 - 不添加解釋或詮釋
2. 保持直接且忠實於原意的翻譯
3. 使用自然中文，同時保持原文語調和內容
4. 保持神秘語調但不添油加醋

指導方針：
- 完全按照原文翻譯，不多不少
- 使用提供的四柱術語翻譯，但不解釋它們
- 不添加原文沒有的建議、預測或詮釋
- 除非原文有，否則不使用"這意味著..."或"表明..."等詞語
- 保持與韓文相同的詳細程度

禁止事項：
- 添加原文沒有的解釋
- 提供額外建議或意見
- 將簡短陳述擴展成長篇解釋
- 添加自己對四柱概念的詮釋

語調：直接、準確、忠實於原韓文。"""
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