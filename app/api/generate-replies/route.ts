import { NextResponse } from "next/server";
import OpenAI from "openai";

type RequestBody = {
  industry?: string;
  reviewsText?: string;
  tone?:
    | "정중형"
    | "친근형"
    | "담백형"
    | "공감형"
    | "단호형"
    | "유머형"
    | "논리형"
    | "열정형"
    | "차분형"
    | "권위형";
  storeTone?: string;
  services?: string;
  introText?: string;
  outroText?: string;
  replyTypes?: string[];
  generateIntro?: boolean;
  generateOutro?: boolean;
  storeName?: string;
};

const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

type Tone = NonNullable<RequestBody["tone"]>;

const toHints = (text?: string) => {
  if (!text) return "";
  return text
    .replace(/[\r\n]+/g, " ")
    .replace(/[.,!?]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .slice(0, 12)
    .join(", ");
};

const toneGuides: Record<Tone, string> = {
  정중형:
    "격식을 갖추고 사과/감사 표현을 분명히 하지만 과장 없이, '고객님' 호칭 유지",
  친근형:
    "따뜻하고 부드러운 말투, 부담 없는 존칭(예: ~하세요, ~해요), 감정 공감 강조",
  담백형: "군더더기 없이 짧게, 핵심만 전달",
  공감형: "감정을 먼저 받아주고 공감 표현을 추가",
  단호형:
    "간결하고 단정한 어조, 규정/원칙을 명확히 안내, 불필요한 사과 반복 금지",
  유머형: "가벼운 위트와 말하듯 표현을 사용하되 과장/불필요한 농담은 금지",
  논리형: "근거·순서·사실 중심으로 정리해 안내",
  열정형: "에너지 있고 적극적인 표현을 사용하되 과장된 약속은 금지",
  차분형: "감정 기복 없이 안정적인 어조, 침착하게 안내",
  권위형: "전문가처럼 리드하되 고객을 내려다보지 않고 존중하는 표현",
};

const toneSpecificRules: Record<Tone, string[]> = {
  정중형: ["문장 끝맺음은 ~습니다/~입니다 위주", "감탄사, 이모지 사용 금지"],
  친근형: [
    "'드리겠습니다/하도록 하겠습니다' 같은 격식 표현 금지",
    "~해요/~했어요/~할게요 어미 사용",
    "감정 표현 1~2회(예: 고마워요/반가워요/아쉬웠겠다)",
    "구어체 연결어 사용: 그리고/또/그래서/다음에",
  ],
  담백형: [
    "한 문장에 한 개 정보, 길게 늘이지 않음",
    "수식어 최소화, 불필요한 감탄 금지",
  ],
  공감형: [
    "첫 문장에 공감/이해 표현 포함(예: 속상하셨을 것 같아요)",
    "공감 후 짧은 안내로 이어가기",
  ],
  단호형: [
    "규정/정책을 명확히 언급하고 준수 촉구",
    "사과는 1회 이하, 반복 금지",
    "감탄사·이모지·완화 표현 금지",
    "요구/제안은 직설적으로 전달",
  ],
  유머형: [
    "가벼운 위트/말장난/비유를 2~3회 포함(웃음표현은 과하지 않게). 예: '뷰 맛집 인정', '주차는 숨바꼭질이었죠? 다음엔 바로 찾게 도울게요'",
    "민감/불만 리뷰에서는 위트를 아주 짧게 넣거나 상황 설명 후 한 줄만 사용",
    "격식 표현·딱딱한 안내문 어투 금지",
    "친근한 구어체 연결어와 말하듯 리듬을 유지",
    "농담/말장난 직후에는 이모티콘(0~1개)을 붙여 톤을 부드럽게 만들기, 민감/불만 리뷰에서는 이모티콘 사용 금지",
  ],
  논리형: [
    "근거·순서·사실 중심(예: 1) 확인 2) 조치 3) 안내/다음 단계)",
    "숫자나 접두어(1) 2) 3))로 단계를 반드시 명시해 흐름을 보여주기",
    "각 단계는 서로 다른 내용이어야 함: 1) 문제/감사 확인, 2) 조치·점검 계획(가능하면 일정), 3) 안내/추가 채널/다음 방문 제안, 4) 선택적으로 기대 문장",
    "단순히 번호만 붙인 일반 문장 금지, 감탄사/중복 사과 최소화",
  ],
  열정형: [
    "에너지 있는 표현(바로, 곧, 최선을 다해) 사용",
    "과장/과도한 약속 금지",
    "적극적 행동 동사 사용: 살펴보겠습니다 → 바로 살펴보고, 확인하겠습니다 → 곧 확인하고 조치하겠습니다",
    "감탄사 1~2회 허용, 리듬감 있는 짧은 문장 위주",
    "긍정적/전진적 표현을 2회 이상 포함: 기대합니다, 힘이 납니다, 더 나은 모습, 금방 준비하겠습니다",
    "소극적 접속사(그러나/하지만) 대신 '그리고/바로/곧/특히/무엇보다' 같은 전환어로 에너지를 유지",
  ],
  차분형: ["침착한 어조, 불필요한 감정 기복 없이 안내", "안심시키는 표현 포함"],
  권위형: [
    "전문가처럼 리드(예: 이 경우 이렇게 대응하는 게 가장 좋습니다)",
    "존중 표현 유지, 명확한 지침 제시",
    "자신감 있는 어휘 사용: 권장합니다/필수입니다/이렇게 하시면 좋습니다",
    "모호한 표현·과도한 사과 최소화, 근거/기준/절차를 제시",
    "1) 기준/원칙 제시 2) 권장 행동/절차 안내 3) 예상 결과/다음 단계 제시",
    "권위 있는 어미 사용(~입니다/하십시오/권장합니다), 단 친근/유머 어투 금지",
  ],
};

const replyTypeGuides: Record<string, string> = {
  "사과·공감형":
    "불편에 대해 간결히 사과하고 감정을 공감. 과도한 책임/보상 약속 금지",
  사실확인형: "상황/주문 정보/시간대 등 구체 정보 확인 요청을 정중히 안내",
  "해결 안내형": "지금 가능한 조치와 절차를 명확히 안내",
  "재발 방지 약속형": "내부 개선/교육/프로세스 보완을 과장 없이 약속",
  "원인 설명형": "간단한 원인 설명, 변명 없이 사실만 전달",
  "보상 대신 대안 제시형":
    "환불/보상 대신 가능한 대안(재조리/재방문 시 최선 등) 제시",
  "감사·칭찬 수용형": "칭찬에 감사하고 강점을 강화하는 메시지 추가",
  리뷰유도형: "만족 시 리뷰/사진/재방문을 부담 없이 부탁",
  "재방문 유도형": "다음 방문 기대감을 표현하고 맞이하겠다는 메시지",
  "브랜드 톤 강화형": "매장 가치/철학을 한 문장으로 자연스럽게 반영",
  "정정·오해 해소형": "사실과 다른 부분을 정중히 바로잡고 오해를 해소",
  "정책 안내형": "교환/환불/운영시간/라스트오더 등 정책을 간결히 안내",
  "안전·위생 안심형": "위생/품질 관리 프로세스를 구체적으로 언급(과장 금지)",
  "속도·지연 사과형": "대기/배송 지연에 대해 사과하고 개선 의지를 언급",
  "품질 점검형": "맛/온도/포장/양 등 품질 점검과 조치 계획을 안내",
  "개인화 응대형": "고객이 언급한 포인트 1~2개를 구체적으로 반영",
  "진정·갈등 완화형": "톤을 낮춰 감정을 진정시키고 갈등 완화 문장 구성",
  "외부요인 분리형": "배달기사/플랫폼 등 외부 요소를 공격하지 않고 분리해 설명",
  "추가 채널 유도형": "민감한 내용은 DM/전화/채팅으로 이어가자고 안내",
  "요약·마무리형": "핵심을 한 줄로 정리하고 '다음엔 더 잘하겠다'로 마무리",
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OPENAI_API_KEY가 설정되지 않았습니다. 환경 변수를 추가해 주세요.",
      },
      { status: 400 }
    );
  }

  const body = (await request.json()) as RequestBody;
  const industry = body.industry?.trim();
  const reviewsText = body.reviewsText?.trim();
  const tone = body.tone && toneGuides[body.tone] ? body.tone : "정중형";
  const storeTone = body.storeTone?.trim().slice(0, 20);
  const services = body.services?.trim();
  const toneGuide = toneGuides[tone];
  const introText = body.introText?.trim();
  const outroText = body.outroText?.trim();
  const generateIntro = Boolean(body.generateIntro);
  const generateOutro = Boolean(body.generateOutro);
  const storeName = body.storeName?.trim();
  const introHint = generateIntro ? toHints(introText) : introText;
  const outroHint = generateOutro ? toHints(outroText) : outroText;
  const replyTypes = (body.replyTypes || [])
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 3);

  if (!industry || !reviewsText) {
    return NextResponse.json(
      { error: "업종과 리뷰 내용을 모두 입력해주세요." },
      { status: 400 }
    );
  }

  if (replyTypes.length === 0) {
    return NextResponse.json(
      { error: "생성할 답글 유형을 최소 1개 선택해주세요." },
      { status: 400 }
    );
  }

  const client = new OpenAI({ apiKey });
  const toneRuleText = (toneSpecificRules[tone] || []).join("\n");

  const prompt = [
    "너는 매장 리뷰 답글 작성 도우미다. 목표는 '현실적·안전·일관된 톤'의 답글을 만드는 것이다.",
    "우선순위(충돌 시 위가 우선):",
    "1) 안전/금지(허위·과장·보상/환불 약속·법률/의료 조언 금지)",
    "2) 기타 요청사항(storeTone) 반영",
    "3) 톤(toneGuide) 일관성",
    "4) 업종/서비스 적합성",
    "5) 선택된 답글 유형(replyTypes) 특성",
    "6) 문장 스타일(연결어/리듬 등 세부 규칙)",
    "규칙:",
    "- 한국어로 작성",
    `- 톤 가이드: ${tone} 톤 = ${toneGuide}`,
    toneRuleText || "- 톤에 맞춰 일관된 어조를 유지",
    "- 업종에 맞는 현실적인 표현 사용",
    services ? `- 주요 상품/서비스 참고: ${services}` : "- 주요 상품/서비스 정보 없음",
    storeName
      ? `- 매장명은 intro에 1회 자연스럽게 포함: "저희 ${storeName}" 형태, 과도한 반복 금지`
      : "- 매장명 정보 없음",
    "- 배달/온라인 쇼핑/홈쇼핑/스마트스토어 등 비내점 업종이면 '방문/내점' 표현 금지, '다음 주문/배송/재구매'로 유도",
    "- 과장/허위 보상/환불 약속 금지",
    "- 법률/의료 조언 금지",
    "- 1인칭 매장 시점 유지: '저희/우리'로 말하고 제3자/AI/대행 언급 금지",
    "- 고객 호칭은 일관되게 '고객님' 사용, 이름 추측/별칭/친애하는 등 어색한 표현 금지",
    "- 첫 문장 또는 본문 초반에 매장 주체를 자연스럽게 드러내기(예: 저희는/저희 매장은)",
    "- AI/챗봇/도우미 메타 표현(도와드리겠습니다/AI가) 사용 금지",
    "- 시설/배수/온도/설비 문제는 '점검/수리/개선'으로 표현하고, '물 제공'처럼 부적절한 약속은 금지",
    "- 선택된 답글 유형들을 조합하여 '답글 1개'만 생성",
    "- 각 답글의 title은 선택된 답글 유형을 쉼표로 이어붙여 사용",
    "- text(intro/body/outro)는 선택된 모든 유형 특성을 반영",
    "- 기타 요청사항(storeTone)이 제공되면 반드시 반영:",
    "  - 의미를 바꾸지 말고 자연스럽게 문장에 포함(‘요청하신 대로’ 같은 메타 언급 금지)",
    "  - intro 또는 body에 최소 1회 명시적으로 반영",
    "  - 다른 규칙과 충돌하면 storeTone을 우선 반영하고, 나머지 규칙을 조정",
    "- 답글 구조: intro(1문장) + body(2~4문장) + outro(1문장) = 기본 4~6문장",
    "- 리뷰가 길거나 이슈가 많으면 body를 4~8문장까지 확장(이슈당 1~2문장), intro/outro는 각각 1문장 유지",
    "- 마지막 문장(outro)은 재방문 유도 역할(추가 유도 문장 중복 금지)",
    "- 꼬릿말은 상황에 맞는 자연스러운 마무리 한 문장으로, '편안한 시간 보내세요' 같은 부자연스러운 상투어는 피하기",
    "- 머릿말/꼬릿말:",
    "  - 자동 생성 OFF: 제공된 문구가 있으면 그대로 사용(수정/축약 금지), 없으면 빈 문자열",
    "  - 자동 생성 ON: 힌트는 키워드 참고용이며 그대로 복사 금지(동일 어절 3개 연속 금지, 어휘 50% 이상 교체/축약, 1문장 15~30자)",
    "  - 힌트와 유사하면 즉시 다른 표현으로 재작성",
    "- intro 첫 문장은 전환어(또한/그리고/또/이어/한편/무엇보다/따라서/특히/다만/그러나 등)로 시작하지 말 것",
    "- body 2번째 문장부터 필요 시 연결어를 쓰되, 같은 연결어를 연속 반복하지 말기",
    "- 클라이언트에서 줄바꿈을 처리할 수 있도록 intro/body/outro를 별도로 반환",
    "- 반드시 JSON만 반환(설명/마크다운/코드블록 금지)",
    "- 자체 체크리스트: 1) storeTone이 intro 또는 body에 반영됐는가? 2) 금지 약속/허위·과장 없는가? 3) 문장 수 규칙 준수? 4) outro가 재방문 유도 역할? 5) 자동 생성 시 힌트 복사 안 했는가? 6) 1인칭 매장 시점/고객님 호칭을 일관되게 지켰는가?",
    "",
    `업종: ${industry}`,
    `톤: ${tone}`,
    storeTone
      ? `기타 요청사항(storeTone, 최우선): ${storeTone}`
      : "기타 요청사항(storeTone): (없음)",
    storeName ? `매장명: ${storeName}` : "매장명: (없음)",
    generateIntro
      ? [
          "머릿말 자동 생성: 톤/업종에 맞는 1문장 인사(15~30자).",
          introHint ? `머릿말 힌트(키워드 참고용, 복사 금지): ${introHint}` : "머릿말 힌트: (없음)",
        ].join(" ")
      : introHint
        ? `머릿말(제공됨, 그대로 사용): ${introHint}`
        : "머릿말: (없음)",
    generateOutro
      ? [
          "꼬릿말 자동 생성: 톤/업종에 맞는 1문장 마무리/재방문 유도(15~30자).",
          outroHint ? `꼬릿말 힌트(키워드 참고용, 복사 금지): ${outroHint}` : "꼬릿말 힌트: (없음)",
        ].join(" ")
      : outroHint
        ? `꼬릿말(제공됨, 그대로 사용): ${outroHint}`
        : "꼬릿말: (없음)",
    `선택된 답글 유형(제목에 모두 포함): ${replyTypes.join(", ")}`,
    "유형별 작성 가이드:",
    ...replyTypes.map((type) => `- ${type}: ${replyTypeGuides[type] ?? ""}`),
    "리뷰 목록:",
    reviewsText,
    "",
    `응답 JSON 형식: {"replies":[{"title":"${replyTypes.join(
      ", "
    )}","intro":"(1문장)","body":"(2~4문장, 필요 시 4~8문장 확장)","outro":"(1문장, 재방문 유도)"}]}`,
  ].join("\n");

  try {
    const response = await client.responses.create({
      model: DEFAULT_MODEL,
      input: [{ role: "user", content: prompt }],
      temperature: 0.6,
      max_output_tokens: 700,
    });

    const text = (() => {
      const direct = (response as any).output_text as string | undefined;
      if (direct) return direct;
      const content = (response as any).output?.[0]?.content;
      if (Array.isArray(content)) {
        return content
          .map((part: any) => {
            if (typeof part?.text === "string") return part.text;
            if (typeof part === "string") return part;
            return "";
          })
          .join("")
          .trim();
      }
      return "";
    })();

    const jsonText = (() => {
      if (!text) return "";
      try {
        JSON.parse(text);
        return text;
      } catch {
        const match = text.match(/\{[\s\S]*\}/);
        return match ? match[0] : "";
      }
    })();
    let parsed: unknown;

    try {
      parsed = JSON.parse(jsonText);
    } catch {
      return NextResponse.json(
        { error: "AI 응답을 해석하지 못했습니다. 입력을 다시 확인해주세요." },
        { status: 500 }
      );
    }

    const rawReplies = (
      parsed as {
        replies?: {
          title?: string;
          text?: string;
          intro?: string;
          body?: string;
          outro?: string;
        }[];
      }
    ).replies;

    const replies =
      rawReplies
        ?.slice(0, 1)
        .map((reply) => {
          const intro =
            introText?.length || !generateIntro
              ? introText
              : reply.intro?.trim() || "";
          const outro =
            outroText?.length || !generateOutro
              ? outroText
              : reply.outro?.trim() || "";
          const body = reply.body?.trim() || reply.text?.trim() || "";
          const assembled = [intro, body, outro]
            .filter(Boolean)
            .join("\n\n")
            .trim();
          if (!assembled) return null;
          const combinedTitle = replyTypes.join(", ");
          return {
            title: combinedTitle || reply.title || "답글",
            text: assembled,
          };
        })
        .filter(Boolean) ?? [];

    if (!replies || replies.length === 0) {
      return NextResponse.json(
        { error: "답글 생성에 실패했습니다. 입력을 다시 확인해주세요." },
        { status: 500 }
      );
    }

    return NextResponse.json({ replies });
  } catch (error) {
    console.error("OpenAI error", error);
    return NextResponse.json(
      { error: "답글 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
