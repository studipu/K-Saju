#!/usr/bin/env python3
"""
사주풀이 LLM 번역기 - 메인 CLI 인터페이스
GPT-4o-mini를 활용한 사주 전문 번역 도구
"""

import sys
import argparse
from typing import List
from src.translator import SajuTranslator

def print_header():
    """프로그램 헤더 출력"""
    print("=" * 60)
    print("🔮 사주풀이 LLM 번역기 (Saju Fortune Translation)")
    print("   GPT-4o-mini 기반 사주 전문 번역 시스템")
    print("=" * 60)
    print()

def print_translation_result(result: dict, show_details: bool = False):
    """번역 결과 출력"""
    if result["success"]:
        # 음성 입력 정보 표시
        if result.get('input_method') == 'voice' and result.get('stt_info'):
            stt_info = result['stt_info']
            print(f"\n🎤 음성 인식 결과: {stt_info['detected_text']}")
            if show_details and stt_info.get('audio_duration'):
                print(f"   • 녹음 시간: {stt_info['audio_duration']:.1f}초")
            print()

        print(f"📝 원문: {result['original_text']}")
        if result.get('is_korean_input'):
            print(f"🌍 번역 방향: 한국어 → {result['target_language']}")
        else:
            print(f"🌍 번역 방향: {result['source_language']} → {result['target_language']}")
        print(f"✨ 번역 결과:")
        print(f"   {result['translated_text']}")

        if result.get('extracted_terms'):
            print(f"\n🏷️  발견된 사주 용어: {', '.join(result['extracted_terms'])}")

        if show_details:
            print(f"\n📊 상세 정보:")
            print(f"   • 처리 시간: {result['processing_time']:.2f}초")
            print(f"   • 사용 모델: {result['model_used']}")
            if result.get('session_context_used'):
                print(f"   • 세션 컨텍스트: 활성화 (대화 {result.get('conversation_turn', 0)}턴)")
            else:
                print(f"   • 세션 컨텍스트: 비활성화")
            if result.get('token_usage'):
                tokens = result['token_usage']
                print(f"   • 토큰 사용량: {tokens['total_tokens']} (입력: {tokens['prompt_tokens']}, 출력: {tokens['completion_tokens']})")

    else:
        print(f"\n❌ 번역 실패: {result['error']}")

def translate_single(args):
    """단일 텍스트 번역"""
    try:
        translator = SajuTranslator(
            api_key=args.api_key,
            model=args.model,
            enable_context=not args.no_context
        )

        result = translator.translate(
            input_text=args.text,
            target_language=args.language,
            context=args.context or "",
            include_terms=not args.no_terms
        )

        print_translation_result(result, show_details=args.verbose)

    except ValueError as e:
        print(f"\n❌ 설정 오류: {e}")
        print("💡 해결 방법:")
        print("   1. .env 파일에 OPENAI_API_KEY를 설정하세요")
        print("   2. 또는 --api-key 옵션을 사용하세요")
        print("   예: python main.py translate \"텍스트\" --api-key your_key_here")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ 예상치 못한 오류가 발생했습니다: {e}")
        print("💡 다시 시도하거나 관리자에게 문의하세요.")
        sys.exit(1)

def translate_voice(args):
    """음성 입력 번역"""
    try:
        translator = SajuTranslator(
            api_key=args.api_key,
            model=args.model,
            enable_context=not args.no_context
        )

        print(f"\n🎤 음성 입력 번역 모드")
        print(f"   목표 언어: {args.language}")
        print(f"   최대 녹음 시간: {args.duration}초")
        print()

        result = translator.translate_from_audio(
            target_language=args.language,
            max_duration=args.duration,
            include_terms=not args.no_terms
        )

        print_translation_result(result, show_details=args.verbose)

    except ValueError as e:
        print(f"❌ 설정 오류: {e}")
        print("💡 .env 파일에 OPENAI_API_KEY를 설정하거나 --api-key 옵션을 사용하세요.")
        sys.exit(1)
    except ImportError as e:
        print(f"\n❌ 의존성 오류: {e}")
        print("💡 음성 입력을 위한 설치 가이드:")
        print("   macOS: brew install portaudio && pip install pyaudio")
        print("   Ubuntu: sudo apt-get install portaudio19-dev && pip install pyaudio")
        print("   Windows: pip install pyaudio")
        sys.exit(1)
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        sys.exit(1)

def translate_batch(args):
    """배치 번역"""
    try:
        translator = SajuTranslator(
            api_key=args.api_key,
            model=args.model,
            enable_context=not args.no_context
        )

        korean_texts = args.texts
        if args.file:
            # 파일에서 텍스트 읽기
            with open(args.file, 'r', encoding='utf-8') as f:
                korean_texts = [line.strip() for line in f if line.strip()]

        result = translator.translate_batch(
            korean_texts=korean_texts,
            target_language=args.language,
            include_terms=not args.no_terms
        )

        if result["success"]:
            print(f"\n📝 배치 번역 완료 ({len(result['original_texts'])}개 텍스트)")
            print(f"🌍 목표 언어: {result['target_language']}")

            for i, (original, translation) in enumerate(zip(result['original_texts'], result['translations']), 1):
                print(f"\n{i}. 원문: {original}")
                print(f"   번역: {translation}")

            if result.get('extracted_terms'):
                print(f"\n🏷️  발견된 사주 용어: {', '.join(result['extracted_terms'])}")

            if args.verbose:
                print(f"\n📊 상세 정보:")
                print(f"   • 처리 시간: {result['processing_time']:.2f}초")
                print(f"   • 사용 모델: {result['model_used']}")
                if result.get('token_usage'):
                    tokens = result['token_usage']
                    print(f"   • 토큰 사용량: {tokens['total_tokens']} (입력: {tokens['prompt_tokens']}, 출력: {tokens['completion_tokens']})")
        else:
            print(f"\n❌ 배치 번역 실패: {result['error']}")

    except ValueError as e:
        print(f"\n❌ 설정 오류: {e}")
        print("💡 해결 방법:")
        print("   1. .env 파일에 OPENAI_API_KEY를 설정하세요")
        print("   2. 또는 --api-key 옵션을 사용하세요")
        print("   예: python main.py translate \"텍스트\" --api-key your_key_here")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ 예상치 못한 오류가 발생했습니다: {e}")
        print("💡 다시 시도하거나 관리자에게 문의하세요.")
        sys.exit(1)

def interactive_mode(args):
    """대화형 번역 모드"""
    try:
        translator = SajuTranslator(
            api_key=args.api_key,
            model=args.model,
            enable_context=not args.no_context
        )

        print("\n🎯 대화형 번역 모드")
        print(f"   목표 언어: {args.language}")
        print(f"   컨텍스트 모드: {'활성화' if not args.no_context else '비활성화'}")
        if args.voice:
            print("   입력 방식: 음성 입력")
            print(f"   최대 녹음 시간: {args.duration}초")
        else:
            print("   입력 방식: 텍스트 입력")
        print("   종료하려면 'quit' 또는 'exit'를 입력하세요.")
        if not args.no_context:
            print("   대화 히스토리 초기화: 'clear'를 입력하세요.")
        if args.voice:
            print("   음성 입력을 건너뛰려면 Enter를 눌러 텍스트 입력으로 전환할 수 있습니다.")
        print()

        while True:
            try:
                if args.voice:
                    # 음성 입력 모드
                    print("🎤 음성 입력을 시작하려면 Enter를 누르세요 (텍스트 입력: 't' + Enter):", end=" ")
                    user_input = input().strip()

                    if user_input.lower() in ['quit', 'exit', '종료']:
                        print("👋 번역기를 종료합니다.")
                        break
                    elif user_input.lower() == 'clear':
                        translator.clear_conversation_history()
                        continue
                    elif user_input.lower() == 't':
                        # 텍스트 입력으로 전환
                        korean_text = input("🔮 사주풀이 텍스트를 입력하세요: ").strip()
                        if korean_text.lower() in ['quit', 'exit', '종료']:
                            print("👋 번역기를 종료합니다.")
                            break
                        elif korean_text.lower() == 'clear':
                            translator.clear_conversation_history()
                            continue
                        if not korean_text:
                            continue

                        result = translator.translate(
                            input_text=korean_text,
                            target_language=args.language,
                            include_terms=not args.no_terms
                        )
                    else:
                        # 음성 입력
                        result = translator.translate_from_audio(
                            target_language=args.language,
                            max_duration=args.duration,
                            include_terms=not args.no_terms
                        )
                else:
                    # 텍스트 입력 모드
                    korean_text = input("🔮 사주풀이 텍스트를 입력하세요: ").strip()

                    if korean_text.lower() in ['quit', 'exit', '종료']:
                        print("👋 번역기를 종료합니다.")
                        break
                    elif korean_text.lower() == 'clear':
                        translator.clear_conversation_history()
                        continue

                    if not korean_text:
                        continue

                    result = translator.translate(
                        input_text=korean_text,
                        target_language=args.language,
                        include_terms=not args.no_terms
                    )

                print_translation_result(result, show_details=args.verbose)
                print()

            except KeyboardInterrupt:
                print("\n\n👋 번역기를 종료합니다.")
                break

    except ValueError as e:
        print(f"\n❌ 설정 오류: {e}")
        print("💡 해결 방법:")
        print("   1. .env 파일에 OPENAI_API_KEY를 설정하세요")
        print("   2. 또는 --api-key 옵션을 사용하세요")
        print("   예: python main.py translate \"텍스트\" --api-key your_key_here")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ 예상치 못한 오류가 발생했습니다: {e}")
        print("💡 다시 시도하거나 관리자에게 문의하세요.")
        sys.exit(1)

def show_terms(args):
    """사주 용어 조회"""
    try:
        translator = SajuTranslator(
            api_key=args.api_key,
            model=args.model,
            enable_context=False  # 용어 조회는 컨텍스트 불필요
        )

        if args.search:
            # 용어 검색
            terms = translator.search_terms(args.search)
            if terms:
                print(f"\n🔍 '{args.search}' 검색 결과:")
                for term in terms:
                    info = translator.get_term_info(term)
                    print(f"   • {term}: {info.get('english', '')} | {info.get('chinese', '')} | {info.get('meaning', '')}")
            else:
                print(f"\n❌ '{args.search}'와 관련된 용어를 찾을 수 없습니다.")

        elif args.term:
            # 특정 용어 조회
            info = translator.get_term_info(args.term)
            if info:
                print(f"\n📚 용어 정보: {args.term}")
                print(f"   • 영어: {info.get('english', 'N/A')}")
                print(f"   • 중국어: {info.get('chinese', 'N/A')}")
                print(f"   • 의미: {info.get('meaning', 'N/A')}")
            else:
                print(f"\n❌ '{args.term}' 용어를 찾을 수 없습니다.")

        else:
            # 통계 정보
            stats = translator.get_translation_stats()
            print(f"\n📊 사주 용어 데이터베이스 통계:")
            print(f"   • 총 용어 수: {stats['total_terms']}개")
            print(f"   • 지원 언어: {', '.join(stats['available_languages'])}")
            print(f"   • 현재 모델: {stats['model']}")
            print(f"   • 컨텍스트 모드: {'활성화' if stats['context_enabled'] else '비활성화'}")
            if stats['context_enabled']:
                print(f"   • 대화 기록: {stats['conversation_turns']}개")
                print(f"   • 최대 히스토리: {stats['max_history_length']}개")
                print(f"   • 최대 컨텍스트 토큰: {stats['max_context_tokens']}개")

    except ValueError as e:
        print(f"\n❌ 설정 오류: {e}")
        print("💡 해결 방법:")
        print("   1. .env 파일에 OPENAI_API_KEY를 설정하세요")
        print("   2. 또는 --api-key 옵션을 사용하세요")
        print("   예: python main.py translate \"텍스트\" --api-key your_key_here")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ 예상치 못한 오류가 발생했습니다: {e}")
        print("💡 다시 시도하거나 관리자에게 문의하세요.")
        sys.exit(1)

def main():
    """메인 함수"""
    parser = argparse.ArgumentParser(
        description="🔮 사주풀이 LLM 번역기 - GPT-4o-mini 기반 사주 전문 번역",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
사용 예시:
  python main.py translate "갑목 일간은 강한 리더십을 가지고 있습니다" --language en
  python main.py voice --language en --duration 15
  python main.py batch --texts "재물운이 좋습니다" "건강운을 조심하세요" --language zh
  python main.py interactive --language en --voice
  python main.py terms --search "갑목"
        """
    )

    # 전역 옵션
    parser.add_argument('--api-key', help='OpenAI API 키')
    parser.add_argument('--model', help='사용할 모델 (기본: gpt-4o-mini)')
    parser.add_argument('--verbose', '-v', action='store_true', help='상세 정보 출력')
    parser.add_argument('--no-context', action='store_true', help='세션 컨텍스트 비활성화')

    # 서브커맨드
    subparsers = parser.add_subparsers(dest='command', help='사용 가능한 명령어')

    # translate 커맨드
    translate_parser = subparsers.add_parser('translate', help='단일 텍스트 번역')
    translate_parser.add_argument('text', help='번역할 한국어 텍스트')
    translate_parser.add_argument('--language', '-l', choices=['en', 'zh'], default='en', help='목표 언어')
    translate_parser.add_argument('--context', '-c', help='추가 컨텍스트 정보')
    translate_parser.add_argument('--no-terms', action='store_true', help='사주 용어 정보 제외')
    translate_parser.add_argument('--no-context', action='store_true', help='세션 컨텍스트 비활성화')
    translate_parser.add_argument('--verbose', '-v', action='store_true', help='상세 정보 출력')

    # voice 커맨드
    voice_parser = subparsers.add_parser('voice', help='음성 입력 번역')
    voice_parser.add_argument('--language', '-l', choices=['en', 'zh'], default='en', help='목표 언어')
    voice_parser.add_argument('--duration', '-d', type=int, default=10, help='최대 녹음 시간 (초)')
    voice_parser.add_argument('--no-terms', action='store_true', help='사주 용어 정보 제외')
    voice_parser.add_argument('--no-context', action='store_true', help='세션 컨텍스트 비활성화')
    voice_parser.add_argument('--verbose', '-v', action='store_true', help='상세 정보 출력')

    # batch 커맨드
    batch_parser = subparsers.add_parser('batch', help='배치 번역')
    batch_group = batch_parser.add_mutually_exclusive_group(required=True)
    batch_group.add_argument('--texts', nargs='+', help='번역할 텍스트들')
    batch_group.add_argument('--file', help='텍스트 파일 경로 (한 줄당 하나의 텍스트)')
    batch_parser.add_argument('--language', '-l', choices=['en', 'zh'], default='en', help='목표 언어')
    batch_parser.add_argument('--no-terms', action='store_true', help='사주 용어 정보 제외')
    batch_parser.add_argument('--no-context', action='store_true', help='세션 컨텍스트 비활성화')
    batch_parser.add_argument('--verbose', '-v', action='store_true', help='상세 정보 출력')

    # interactive 커맨드
    interactive_parser = subparsers.add_parser('interactive', help='대화형 번역 모드')
    interactive_parser.add_argument('--language', '-l', choices=['en', 'zh'], default='en', help='목표 언어')
    interactive_parser.add_argument('--voice', action='store_true', help='음성 입력 모드 활성화')
    interactive_parser.add_argument('--duration', '-d', type=int, default=10, help='최대 녹음 시간 (초)')
    interactive_parser.add_argument('--no-terms', action='store_true', help='사주 용어 정보 제외')
    interactive_parser.add_argument('--no-context', action='store_true', help='세션 컨텍스트 비활성화')
    interactive_parser.add_argument('--verbose', '-v', action='store_true', help='상세 정보 출력')

    # terms 커맨드
    terms_parser = subparsers.add_parser('terms', help='사주 용어 조회')
    terms_group = terms_parser.add_mutually_exclusive_group()
    terms_group.add_argument('--search', help='용어 검색')
    terms_group.add_argument('--term', help='특정 용어 정보 조회')

    args = parser.parse_args()

    # 헤더 출력
    print_header()

    # 커맨드별 실행
    if args.command == 'translate':
        translate_single(args)
    elif args.command == 'voice':
        translate_voice(args)
    elif args.command == 'batch':
        translate_batch(args)
    elif args.command == 'interactive':
        interactive_mode(args)
    elif args.command == 'terms':
        show_terms(args)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()