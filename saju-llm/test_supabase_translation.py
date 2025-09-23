#!/usr/bin/env python3
"""
Supabase 기반 사주 번역기 테스트 스크립트
"""
import os
import sys
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

# 경로 설정
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.translator import SajuTranslator

def test_basic_translation():
    """기본 번역 테스트"""
    print("🔮 Supabase 기반 사주 번역기 테스트")
    print("=" * 50)

    # 환경 변수 확인
    supabase_url = os.getenv('VITE_SUPABASE_URL')
    supabase_anon_key = os.getenv('VITE_SUPABASE_ANON_KEY')

    print(f"Supabase URL: {supabase_url}")
    print(f"Supabase Key: {'****' if supabase_anon_key else 'Not set'}")
    print()

    if not supabase_url or not supabase_anon_key:
        print("❌ Supabase 환경 변수가 설정되지 않았습니다!")
        print("VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 설정해주세요.")
        return False

    try:
        # 번역기 초기화
        print("📡 Supabase 번역기 초기화 중...")
        translator = SajuTranslator()

        # 테스트 텍스트
        test_text = "갑자년에 태어난 사람은 목의 기운이 강합니다."

        print(f"📝 테스트 텍스트: {test_text}")
        print("🔄 번역 중...")

        # 번역 실행
        result = translator.translate(
            input_text=test_text,
            target_language="en",
            include_terms=True
        )

        # 결과 출력
        if result["success"]:
            print("✅ 번역 성공!")
            print(f"📝 원문: {result['original_text']}")
            print(f"🌍 번역: {result['translated_text']}")
            print(f"⏱️  처리 시간: {result['processing_time']:.2f}초")

            if result.get('extracted_terms'):
                print(f"🏷️  추출된 용어: {', '.join(result['extracted_terms'])}")

            return True
        else:
            print(f"❌ 번역 실패: {result.get('error', 'Unknown error')}")
            return False

    except Exception as e:
        print(f"❌ 테스트 실패: {str(e)}")
        return False

def test_translation_stats():
    """번역기 상태 정보 테스트"""
    print("\n📊 번역기 상태 정보")
    print("-" * 30)

    try:
        translator = SajuTranslator()
        stats = translator.get_translation_stats()

        for key, value in stats.items():
            print(f"{key}: {value}")

    except Exception as e:
        print(f"❌ 상태 정보 조회 실패: {str(e)}")

if __name__ == "__main__":
    success = test_basic_translation()
    test_translation_stats()

    if success:
        print("\n🎉 모든 테스트가 성공했습니다!")
    else:
        print("\n💥 테스트 실패")
        sys.exit(1)