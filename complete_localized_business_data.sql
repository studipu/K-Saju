-- Complete Localized Business Data with Reviews
-- This script adds properly formatted multilingual content for all fields including reviews

-- First ensure we have the translations column
ALTER TABLE locations 
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

-- Ensure we have the location_reviews table with proper structure
CREATE TABLE IF NOT EXISTS location_reviews (
  id SERIAL PRIMARY KEY,
  location_id UUID REFERENCES locations(id),
  name VARCHAR(100) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Clear existing reviews for this location to avoid duplicates
DELETE FROM location_reviews 
WHERE location_id = '550e8400-e29b-41d4-a716-446655440002';

-- Update the main business with comprehensive multilingual translations
UPDATE locations 
SET 
  -- Basic Korean fields
  title = 'K-SAJU 프리미엄 사주상담소',
  subtitle = '전통 명리학과 AI 기술의 완벽한 조화',
  description = 'K-SAJU는 수백 년 전통의 동양 명리학과 최첨단 인공지능 기술을 완벽하게 결합한 혁신적인 사주 분석 서비스입니다.

저희는 단순한 운세 상담을 넘어서, 개인의 근본적인 성향과 잠재력을 깊이 있게 분석하여 인생의 방향성을 제시하는 프리미엄 컨설팅 서비스를 제공합니다.

🔮 **전통과 혁신의 만남**

- 조선시대부터 전해 내려온 정통 명리학 원리 적용
- 현대 AI 딥러닝 기술을 통한 패턴 분석  
- 수만 건의 사례 데이터베이스 기반 정확도 향상

⭐ **개인 맞춤형 심층 분석**

개인의 출생 정보를 바탕으로 다음과 같은 영역을 종합적으로 분석합니다:

- 기본 성격 및 성향 분석 (선천적 기질, 후천적 성향)
- 연간/월간 운세 흐름 및 중요 시기 예측
- 직업 적성 및 사업 운세 (창업, 취업, 이직 타이밍)
- 연애 및 결혼 궁합 (배우자 만날 시기, 궁합 분석)
- 건강 관리 포인트 및 주의사항
- 재물 운세 및 투자 타이밍
- 인간관계 및 사회생활 조언

💡 **차별화된 서비스 특징**

1. **이중 검증 시스템**: 전통 명리학자의 해석 + AI 분석 결과 비교 검토
2. **상세한 리포트 제공**: 60페이지 분량의 개인 맞춤 분석서 제공
3. **정기 업데이트**: 월간 운세 업데이트 및 중요 시기 알림 서비스
4. **애프터케어**: 3개월간 무료 추가 상담 및 질의응답 지원

🏆 **검증된 전문성**

- 30년 경력의 명리학 전문가 직접 감수
- 고객 만족도 98.7% (2024년 기준)
- 재방문율 85% 이상의 높은 신뢰도
- 각종 미디어 출연 및 저서 발간',
  
  -- Contact info updates
  phone = '02-3456-7890',
  
  -- Your custom photos (now accessible from public folder)
  main_image_url = '/images/main_photo.png',
  gallery_images = ARRAY[
    '/images/main_photo.png',
    '/images/sub_photo1.jpg',
    '/images/sub_photo2.jpg'
  ],

  -- Comprehensive multilingual translations
  translations = jsonb_build_object(
    'title', jsonb_build_object(
      'ko', 'K-SAJU 프리미엄 사주상담소',
      'en', 'K-SAJU Premium Fortune Consulting',
      'ja', 'K-SAJU プレミアム四柱推命相談所',
      'zh', 'K-SAJU 高级命理咨询中心',
      'es', 'K-SAJU Consultoría Premium de Fortuna'
    ),
    'subtitle', jsonb_build_object(
      'ko', '전통 명리학과 AI 기술의 완벽한 조화',
      'en', 'Perfect Harmony of Traditional Astrology and AI Technology',
      'ja', '伝統命理学とAI技術の完璧な調和',
      'zh', '传统命理学与AI技术的完美结合',
      'es', 'Perfecta Armonía de Astrología Tradicional y Tecnología IA'
    ),
    'address', jsonb_build_object(
      'ko', E'서울특별시 강남구 역삼동\n테헤란로 123, 코리아빌딩 15층\n(지하철 2호선 역삼역 3번 출구 도보 5분)',
      'en', E'15F, Korea Building\n123 Teheran-ro, Yeoksam-dong\nGangnam-gu, Seoul, South Korea\n(5 min walk from Yeoksam Station Exit 3)',
      'ja', E'韓国ソウル特別市江南区駅三洞\nテヘラン路123、コリアビル15階\n(地下鉄2号線駅三駅3番出口徒歩5分)',
      'zh', E'首尔特别市江南区驿三洞\n德黑兰路123号，韩国大厦15层\n(地铁2号线驿三站3号出口步行5分钟)',
      'es', E'Piso 15, Edificio Korea\n123 Teheran-ro, Yeoksam-dong\nGangnam-gu, Seúl, Corea del Sur\n(5 min a pie desde Estación Yeoksam Salida 3)'
    ),
    'business_hours', jsonb_build_object(
      'ko', E'평일 09:00 - 21:00\n주말 10:00 - 18:00\n(예약제 운영, 24시간 온라인 예약 가능)',
      'en', E'Weekdays 09:00 - 21:00\nWeekends 10:00 - 18:00\n(By appointment only, 24/7 online booking available)',
      'ja', E'平日 09:00 - 21:00\n週末 10:00 - 18:00\n(予約制運営、24時間オンライン予約可能)',
      'zh', E'工作日 09:00 - 21:00\n周末 10:00 - 18:00\n(预约制运营，24小时在线预约)',
      'es', E'Días laborables 09:00 - 21:00\nFines de semana 10:00 - 18:00\n(Solo con cita previa, reserva online 24/7)'
    ),
    'phone', jsonb_build_object(
      'ko', E'02-3456-7890\n(상담 예약 전용)\n010-1234-5678',
      'en', E'02-3456-7890\n(Consultation reservations only)\n010-1234-5678',
      'ja', E'02-3456-7890\n(相談予約専用)\n010-1234-5678',
      'zh', E'02-3456-7890\n(咨询预约专线)\n010-1234-5678',
      'es', E'02-3456-7890\n(Solo reservas de consulta)\n010-1234-5678'
    ),
    'description', jsonb_build_object(
      'en', 'K-SAJU Premium Fortune Consulting combines centuries-old Eastern astrology with cutting-edge AI technology to provide revolutionary life guidance services.

We go beyond simple fortune telling to offer premium consulting services that deeply analyze individual fundamental traits and potential, providing clear direction for your life path.

🔮 **Fusion of Tradition and Innovation**

- Application of authentic astrology principles passed down since the Joseon Dynasty
- Pattern analysis through modern AI deep learning technology
- Enhanced accuracy based on tens of thousands of case databases

⭐ **Personalized Comprehensive Analysis**

Based on your birth information, we comprehensively analyze the following areas:

- Basic personality and temperament analysis (innate disposition, acquired tendencies)
- Annual/monthly fortune flow and critical period predictions
- Career aptitude and business fortune (startup, employment, career change timing)
- Love and marriage compatibility (timing to meet spouse, compatibility analysis)
- Health management points and precautions
- Wealth fortune and investment timing
- Interpersonal relationships and social life advice

💡 **Distinctive Service Features**

1. **Dual Verification System**: Traditional astrologer interpretation + AI analysis comparison
2. **Detailed Report Provision**: 60-page personalized analysis report
3. **Regular Updates**: Monthly fortune updates and critical period notification service
4. **Aftercare**: 3-month free additional consultation and Q&A support

🏆 **Verified Expertise**

- Direct supervision by 30-year experienced astrology expert
- 98.7% customer satisfaction (as of 2024)
- High reliability with 85%+ return visit rate
- Various media appearances and published works',
      'ja', 'K-SAJU プレミアム四柱推命は、何世紀にもわたる東洋の占星術と最先端のAI技術を組み合わせた革新的な人生指導サービスです。

私たちは単純な運勢相談を超えて、個人の根本的な性向と潜在能力を深く分析し、人生の方向性を提示するプレミアムコンサルティングサービスを提供します。

🔮 **伝統と革新の出会い**

- 朝鮮王朝時代から伝わる正統四柱推命原理の適用
- 現代AIディープラーニング技術によるパターン分析
- 数万件の事例データベースに基づく精度向上

⭐ **個人カスタマイズ深層分析**

個人の出生情報に基づいて以下の領域を総合的に分析します：

- 基本性格及び性向分析（先天的気質、後天的性向）
- 年間・月間運勢の流れと重要時期予測
- 職業適性及び事業運勢（創業、就職、転職タイミング）
- 恋愛及び結婚相性（配偶者に出会う時期、相性分析）
- 健康管理ポイント及び注意事項
- 財運及び投資タイミング
- 人間関係及び社会生活アドバイス

💡 **差別化されたサービス特徴**

1. **二重検証システム**: 伝統四柱推命師の解釈 + AI分析結果比較検討
2. **詳細レポート提供**: 60ページ分量の個人カスタム分析書提供
3. **定期アップデート**: 月間運勢アップデート及び重要時期アラームサービス
4. **アフターケア**: 3ヶ月間無料追加相談及び質疑応答サポート

🏆 **検証された専門性**

- 30年経験の四柱推命専門家直接監修
- 顧客満足度98.7%（2024年基準）
- 再訪問率85%以上の高い信頼度
- 各種メディア出演及び著書発刊',
      'zh', 'K-SAJU 高级命理咨询将几个世纪的东方命理学与尖端AI技术完美结合，提供革命性的人生指导服务。

我们超越简单的运势咨询，提供深入分析个人根本性向和潜力的高端咨询服务，为您的人生道路提供明确方向。

🔮 **传统与创新的融合**

- 应用自朝鲜王朝传承至今的正统命理学原理
- 通过现代AI深度学习技术进行模式分析
- 基于数万案例数据库提升准确度

⭐ **个性化综合分析**

基于个人出生信息，我们全面分析以下领域：

- 基本性格及性向分析（先天气质，后天性向）
- 年度/月度运势流向及重要时期预测
- 职业适性及事业运势（创业、就业、转职时机）
- 恋爱及婚姻配对（遇到配偶时机，配对分析）
- 健康管理要点及注意事项
- 财运及投资时机
- 人际关系及社交生活建议

💡 **差异化服务特色**

1. **双重验证系统**: 传统命理师解读 + AI分析结果对比审查
2. **详细报告提供**: 60页个人定制分析报告
3. **定期更新**: 月度运势更新及重要时期提醒服务
4. **售后服务**: 3个月免费追加咨询及问答支持

🏆 **验证的专业性**

- 30年经验命理学专家直接监修
- 客户满足度98.7%（2024年标准）
- 85%以上的高回访率
- 各种媒体出演及著作发表',
      'es', 'K-SAJU Consultoría Premium de Fortuna combina la astrología oriental centenaria con tecnología de IA de vanguardia para brindar servicios revolucionarios de orientación de vida.

Vamos más allá de la simple adivinación para ofrecer servicios de consultoría premium que analizan profundamente los rasgos fundamentales individuales y el potencial, proporcionando una dirección clara para su camino de vida.

🔮 **Fusión de Tradición e Innovación**

- Aplicación de principios auténticos de astrología transmitidos desde la Dinastía Joseon
- Análisis de patrones a través de tecnología moderna de aprendizaje profundo de IA
- Precisión mejorada basada en decenas de miles de bases de datos de casos

⭐ **Análisis Integral Personalizado**

Basado en su información de nacimiento, analizamos integralmente las siguientes áreas:

- Análisis básico de personalidad y temperamento (disposición innata, tendencias adquiridas)
- Flujo de fortuna anual/mensual y predicciones de períodos críticos
- Aptitud profesional y fortuna empresarial (timing de startup, empleo, cambio de carrera)
- Compatibilidad amorosa y matrimonial (timing para conocer cónyuge, análisis de compatibilidad)
- Puntos de manejo de salud y precauciones
- Fortuna de riqueza y timing de inversión
- Relaciones interpersonales y consejos de vida social

💡 **Características Distintivas del Servicio**

1. **Sistema de Verificación Dual**: Interpretación de astrólogo tradicional + comparación de análisis de IA
2. **Provisión de Informe Detallado**: Informe de análisis personalizado de 60 páginas
3. **Actualizaciones Regulares**: Actualizaciones de fortuna mensual y servicio de notificación de período crítico
4. **Cuidado Posterior**: 3 meses de consulta adicional gratuita y soporte de preguntas y respuestas

🏆 **Experiencia Verificada**

- Supervisión directa por experto en astrología con 30 años de experiencia
- 98.7% de satisfacción del cliente (a partir de 2024)
- Alta confiabilidad con tasa de visita de retorno del 85%+
- Varias apariciones en medios y obras publicadas'
    )
  )
WHERE id = '550e8400-e29b-41d4-a716-446655440002';

-- Insert sample reviews (simplified - no language filtering for now)
INSERT INTO location_reviews (location_id, name, rating, text, date) VALUES
-- Mixed reviews for demo purposes
('550e8400-e29b-41d4-a716-446655440002', '김지혜', 5, '정말 정확한 분석이었어요! AI와 전통 사주가 만난 결과가 놀라웠습니다. 특히 성격 분석 부분이 너무 정확해서 깜짝 놀랐어요. 앞으로의 계획도 더 구체적으로 세울 수 있게 되었습니다.', '2024-12-15'),
('550e8400-e29b-41d4-a716-446655440002', '박민수', 5, '30년 경력의 전문가가 직접 검토해주신다니 믿음이 갔어요. 60페이지 리포트도 정말 상세하고, 월간 업데이트 서비스까지 있어서 만족스럽습니다. 가격 대비 최고의 서비스!', '2024-12-10'),
('550e8400-e29b-41d4-a716-446655440002', '이서연', 4, '친구 추천으로 받아봤는데 정말 좋았어요. 특히 연애운과 직업운 분석이 도움이 많이 되었습니다. 다만 예약이 좀 어려운 것 같아요. 그래도 기다린 보람이 있었습니다.', '2024-12-05'),
('550e8400-e29b-41d4-a716-446655440002', '최동훈', 5, 'AI 기술과 전통이 만난 독특한 서비스네요. 분석 결과가 정말 세밀하고 실용적이에요. 3개월 무료 상담도 너무 좋은 서비스입니다. 주변에 추천하고 다니고 있어요!', '2024-11-28'),
('550e8400-e29b-41d4-a716-446655440002', '정미영', 5, '처음엔 반신반의했는데 결과를 보고 정말 놀랐어요. 제 성향과 앞으로의 운세가 이렇게 정확할 수가 있나 싶었습니다. 24시간 온라인 예약도 편리하고 강남 접근성도 좋아요.', '2024-11-20'),
('550e8400-e29b-41d4-a716-446655440002', 'Sarah Johnson', 5, 'Amazing accuracy! The combination of AI technology with traditional Korean astrology is fascinating. The personality analysis was spot-on, and the career guidance really helped me make important decisions. Highly recommend!', '2024-12-12'),
('550e8400-e29b-41d4-a716-446655440002', 'Michael Chen', 4, 'Very detailed 60-page report and professional service. The master astrologer review gives me confidence in the results. Monthly updates are a nice touch. Only wish the appointment booking was easier for foreigners.', '2024-12-08'),
('550e8400-e29b-41d4-a716-446655440002', 'Emma Rodriguez', 5, 'Incredible service! The blend of traditional wisdom and modern AI is revolutionary. The relationship compatibility analysis was particularly insightful. Great location in Gangnam too. Worth every penny!', '2024-11-30'),
('550e8400-e29b-41d4-a716-446655440002', 'David Kim', 5, 'As a Korean-American, I was curious about traditional saju but wanted modern accuracy. This service delivers both perfectly! The English consultation was professional and the aftercare support is excellent.', '2024-11-25'),
('550e8400-e29b-41d4-a716-446655440002', '田中美咲', 5, '本当に素晴らしいサービスでした！AIと伝統的な四柱推命の組み合わせが革新的で、分析結果も非常に詳細で正確でした。特に性格分析と将来の運勢予測が印象的でした。', '2024-12-07'),
('550e8400-e29b-41d4-a716-446655440002', '佐藤健太', 4, '30年の経験を持つ専門家の監修があるということで信頼できました。60ページのレポートも充実していて、月次更新サービスも良いですね。ソウル旅行の際に利用してよかった！', '2024-11-22'),
('550e8400-e29b-41d4-a716-446655440002', '山田花子', 5, '韓国の伝統的な命理学に興味があって体験しました。AIを使った現代的なアプローチが素晴らしく、恋愛運と仕事運の分析が特に参考になりました。また利用したいです。', '2024-11-18'),
('550e8400-e29b-41d4-a716-446655440002', '王美丽', 5, '非常准确的分析！AI技术与传统命理学的结合真的很神奇。性格分析特别准确，职业建议也很实用。60页的详细报告物超所值，强烈推荐！', '2024-12-03'),
('550e8400-e29b-41d4-a716-446655440002', '李明', 4, '作为中国人，对韩国的四柱推命很好奇。这个服务结合了传统和现代技术，分析结果很详细。江南区的位置也很方便，服务态度专业。', '2024-11-26'),
('550e8400-e29b-41d4-a716-446655440002', '张小华', 5, '朋友推荐来的，结果超出期待！特别是感情运势和财运分析很准确。3个月的免费后续咨询也很贴心。下次来首尔还会再来！', '2024-11-15'),
('550e8400-e29b-41d4-a716-446655440002', 'María González', 5, '¡Increíble precisión! La combinación de IA con astrología tradicional coreana es fascinante. El análisis de personalidad fue muy exacto y los consejos para mi carrera han sido invaluables. ¡Totalmente recomendado!', '2024-12-01'),
('550e8400-e29b-41d4-a716-446655440002', 'Carlos Mendoza', 4, 'Servicio muy profesional con un reporte detallado de 60 páginas. La supervisión del experto con 30 años de experiencia da mucha confianza. La ubicación en Gangnam es muy conveniente.', '2024-11-19');

-- Verify the updates
SELECT '🌟 Complete localized business data created successfully!' as status;
SELECT 'Updated fields:' as info;
SELECT 'Translations available for:', jsonb_object_keys(translations) as translation_fields
FROM locations 
WHERE id = '550e8400-e29b-41d4-a716-446655440002';

SELECT 'Total reviews inserted:' as info;
SELECT COUNT(*) as review_count
FROM location_reviews 
WHERE location_id = '550e8400-e29b-41d4-a716-446655440002';
