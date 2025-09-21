"""
사주 전문 용어 데이터베이스
"""
from typing import Dict, List, Any

class SajuTermDatabase:
    """사주 전문 용어 데이터베이스"""

    def __init__(self):
        self.terms = {
            # 천간 (Heavenly Stems)
            "갑": {"english": "Yang Wood", "chinese": "甲", "meaning": "strong leadership and vitality"},
            "을": {"english": "Yin Wood", "chinese": "乙", "meaning": "gentle flexibility and adaptability"},
            "병": {"english": "Yang Fire", "chinese": "丙", "meaning": "passionate energy and brightness"},
            "정": {"english": "Yin Fire", "chinese": "丁", "meaning": "refined warmth and sensitivity"},
            "무": {"english": "Yang Earth", "chinese": "戊", "meaning": "solid stability and reliability"},
            "기": {"english": "Yin Earth", "chinese": "己", "meaning": "nurturing care and practicality"},
            "경": {"english": "Yang Metal", "chinese": "庚", "meaning": "decisive strength and justice"},
            "신": {"english": "Yin Metal", "chinese": "辛", "meaning": "delicate precision and refinement"},
            "임": {"english": "Yang Water", "chinese": "壬", "meaning": "flowing wisdom and inclusiveness"},
            "계": {"english": "Yin Water", "chinese": "癸", "meaning": "quiet depth and intuition"},

            # 지지 (Earthly Branches)
            "자": {"english": "Rat", "chinese": "子", "meaning": "beginning and wisdom"},
            "축": {"english": "Ox", "chinese": "丑", "meaning": "patience and hard work"},
            "인": {"english": "Tiger", "chinese": "寅", "meaning": "courage and leadership"},
            "묘": {"english": "Rabbit", "chinese": "卯", "meaning": "gentleness and creativity"},
            "진": {"english": "Dragon", "chinese": "辰", "meaning": "transformation and power"},
            "사": {"english": "Snake", "chinese": "巳", "meaning": "wisdom and intuition"},
            "오": {"english": "Horse", "chinese": "午", "meaning": "energy and freedom"},
            "미": {"english": "Goat", "chinese": "未", "meaning": "kindness and artistic sense"},
            "신": {"english": "Monkey", "chinese": "申", "meaning": "cleverness and adaptability"},
            "유": {"english": "Rooster", "chinese": "酉", "meaning": "precision and diligence"},
            "술": {"english": "Dog", "chinese": "戌", "meaning": "loyalty and responsibility"},
            "해": {"english": "Pig", "chinese": "亥", "meaning": "generosity and honesty"},

            # 오행 (Five Elements)
            "오행": {"english": "Five Elements", "chinese": "五行", "meaning": "Wood, Fire, Earth, Metal, Water"},
            "목": {"english": "Wood", "chinese": "木", "meaning": "growth and flexibility"},
            "화": {"english": "Fire", "chinese": "火", "meaning": "passion and energy"},
            "토": {"english": "Earth", "chinese": "土", "meaning": "stability and nurturing"},
            "금": {"english": "Metal", "chinese": "金", "meaning": "strength and justice"},
            "수": {"english": "Water", "chinese": "水", "meaning": "wisdom and flow"},

            # 십신 (Ten Gods) - 의미 중심 번역
            "정관": {"english": "authority and honor through proper channels", "chinese": "正當途徑獲得權威與榮譽", "meaning": "achieving status and recognition through legitimate means"},
            "편관": {"english": "pressure and challenges that forge strength", "chinese": "鍛造力量的壓力與挑戰", "meaning": "difficult situations that build character and resilience"},
            "정인": {"english": "learning and nurturing support", "chinese": "學習與養育的支持", "meaning": "educational guidance and protective mentorship"},
            "편인": {"english": "artistic talent and spiritual insight", "chinese": "藝術天賦與靈性洞察", "meaning": "creative abilities and intuitive understanding"},
            "정재": {"english": "stable wealth and loyal relationships", "chinese": "穩定財富與忠誠關係", "meaning": "consistent income and committed partnerships"},
            "편재": {"english": "business opportunities and flexible income", "chinese": "商業機會與靈活收入", "meaning": "entrepreneurial chances and variable earnings"},
            "상관": {"english": "creative expression and independent spirit", "chinese": "創意表達與獨立精神", "meaning": "artistic output and freedom of thought"},
            "식신": {"english": "contentment and peaceful abundance", "chinese": "滿足與平和豐盛", "meaning": "satisfaction and harmonious prosperity"},
            "비견": {"english": "brotherhood and mutual support", "chinese": "兄弟情誼與相互支持", "meaning": "equal partnerships and collaborative relationships"},
            "겁재": {"english": "competition that teaches valuable lessons", "chinese": "教導寶貴課程的競爭", "meaning": "rivalry that promotes growth and learning"},

            # 기본 용어 - 의미 중심 번역
            "사주": {"english": "your complete life blueprint", "chinese": "您的完整人生藍圖", "meaning": "birth chart showing your destiny pattern"},
            "팔자": {"english": "your predetermined destiny pattern", "chinese": "您預定的命運模式", "meaning": "fate determined by birth time"},
            "일간": {"english": "your core personality and life essence", "chinese": "您的核心性格與生命本質", "meaning": "the fundamental character that defines who you are"},
            "월지": {"english": "your emotional foundation and inner world", "chinese": "您的情感基礎與內心世界", "meaning": "your emotional patterns and subconscious drives"},
            "대운": {"english": "major life phases and opportunities", "chinese": "人生主要階段與機遇", "meaning": "10-year cycles that shape your life journey"},
            "세운": {"english": "yearly influences and changing energies", "chinese": "年度影響與變化能量", "meaning": "annual trends affecting your fortune"},

            # 운세 표현
            "좋은 운": {"english": "good fortune", "chinese": "好運", "meaning": "favorable luck"},
            "나쁜 운": {"english": "bad fortune", "chinese": "壞運", "meaning": "unfavorable luck"},
            "재물운": {"english": "wealth fortune", "chinese": "財運", "meaning": "money luck"},
            "건강운": {"english": "health fortune", "chinese": "健康運", "meaning": "health luck"},
            "애정운": {"english": "love fortune", "chinese": "愛情運", "meaning": "romance luck"},
            "사업운": {"english": "business fortune", "chinese": "事業運", "meaning": "career luck"},
            "학업운": {"english": "academic fortune", "chinese": "學業運", "meaning": "study luck"},
            "결혼운": {"english": "marriage fortune", "chinese": "結婚運", "meaning": "marriage luck"},

            # 시기 표현
            "좋은 시기": {"english": "favorable period", "chinese": "好時期", "meaning": "auspicious time"},
            "어려운 시기": {"english": "challenging period", "chinese": "困難時期", "meaning": "difficult time"},
            "전성기": {"english": "peak period", "chinese": "全盛期", "meaning": "golden time"},
            "침체기": {"english": "stagnant period", "chinese": "低迷期", "meaning": "slow time"},

            # 조언 표현
            "조심하세요": {"english": "be careful", "chinese": "小心", "meaning": "caution needed"},
            "주의하세요": {"english": "pay attention", "chinese": "注意", "meaning": "attention required"},
            "노력이 필요": {"english": "effort needed", "chinese": "需要努力", "meaning": "work required"},
            "인내가 필요": {"english": "patience needed", "chinese": "需要忍耐", "meaning": "patience required"},
        }

    def get_term(self, korean_term: str) -> Dict[str, Any]:
        """용어 정보 조회"""
        return self.terms.get(korean_term, {})

    def translate_term(self, korean_term: str, target_lang: str) -> str:
        """개별 용어 번역"""
        term_info = self.get_term(korean_term)
        if not term_info:
            return korean_term

        if target_lang == "en":
            return term_info.get("english", korean_term)
        elif target_lang == "zh":
            return term_info.get("chinese", korean_term)
        else:
            return korean_term

    def extract_terms_from_text(self, text: str) -> List[str]:
        """텍스트에서 사주 용어 추출"""
        found_terms = []
        # 긴 용어부터 매칭 (중복 방지)
        sorted_terms = sorted(self.terms.keys(), key=len, reverse=True)

        for term in sorted_terms:
            if term in text and term not in found_terms:
                found_terms.append(term)

        return found_terms

    def get_all_terms(self) -> Dict[str, Dict[str, Any]]:
        """모든 용어 반환"""
        return self.terms