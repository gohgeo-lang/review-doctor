import { NextResponse } from "next/server";

const validPlans = ["plus"] as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const plan = (body?.plan as string)?.toLowerCase();
    if (!validPlans.includes(plan as any) || plan === "free") {
      return NextResponse.json(
        { error: "유효한 유료 플랜을 선택해주세요." },
        { status: 400 }
      );
    }

    // 실제 PG 연동 시 여기에서 결제 세션 생성 후 redirect URL을 반환합니다.
    const redirectUrl = `/plans/success?plan=${plan}`;
    const cancelUrl = `/plans/cancel?plan=${plan}`;

    return NextResponse.json({ redirectUrl, cancelUrl });
  } catch {
    return NextResponse.json(
      { error: "결제 요청을 처리하지 못했습니다." },
      { status: 400 }
    );
  }
}
