#!/usr/bin/env python3
"""
세션 컨텍스트 테스트 스크립트
"""

from src.translator import SajuTranslator

def test_session_context():
    """세션 컨텍스트 테스트"""
    print("🧪 세션 컨텍스트 테스트 시작")
    print("=" * 50)

    # 번역기 초기화 (컨텍스트 활성화)
    translator = SajuTranslator(enable_context=True)

    # 첫 번째 번역
    print("\n1️⃣ 첫 번째 번역:")
    result1 = translator.translate(
        "갑목 일간은 강한 리더십을 가지고 있습니다",
        target_language="en"
    )
    print(f"원문: {result1['original_text']}")
    print(f"번역: {result1['translated_text']}")
    print(f"컨텍스트 사용: {result1['session_context_used']}")
    print(f"대화 턴: {result1['conversation_turn']}")

    # 두 번째 번역 (첫 번째와 연관된)
    print("\n2️⃣ 두 번째 번역 (연관 질문):")
    result2 = translator.translate(
        "이분은 어떤 직업이 좋을까요?",
        target_language="en"
    )
    print(f"원문: {result2['original_text']}")
    print(f"번역: {result2['translated_text']}")
    print(f"컨텍스트 사용: {result2['session_context_used']}")
    print(f"대화 턴: {result2['conversation_turn']}")

    # 세 번째 번역
    print("\n3️⃣ 세 번째 번역:")
    result3 = translator.translate(
        "재물운은 어떻게 볼 수 있나요?",
        target_language="en"
    )
    print(f"원문: {result3['original_text']}")
    print(f"번역: {result3['translated_text']}")
    print(f"컨텍스트 사용: {result3['session_context_used']}")
    print(f"대화 턴: {result3['conversation_turn']}")

    # 히스토리 확인
    print("\n📚 현재 대화 히스토리:")
    history = translator.get_conversation_history()
    for i, entry in enumerate(history, 1):
        print(f"  {i}. {entry}")

    # 컨텍스트 비활성화 테스트
    print("\n4️⃣ 컨텍스트 비활성화 테스트:")
    result4 = translator.translate(
        "정축년생의 특징은?",
        target_language="en",
        use_session_context=False
    )
    print(f"원문: {result4['original_text']}")
    print(f"번역: {result4['translated_text']}")
    print(f"컨텍스트 사용: {result4['session_context_used']}")
    print(f"대화 턴: {result4['conversation_turn']}")

    # 히스토리 초기화 테스트
    print("\n🗑️ 히스토리 초기화 테스트:")
    translator.clear_conversation_history()

    result5 = translator.translate(
        "새로운 대화입니다",
        target_language="en"
    )
    print(f"원문: {result5['original_text']}")
    print(f"번역: {result5['translated_text']}")
    print(f"컨텍스트 사용: {result5['session_context_used']}")
    print(f"대화 턴: {result5['conversation_turn']}")

    print("\n✅ 세션 컨텍스트 테스트 완료!")

if __name__ == "__main__":
    test_session_context()