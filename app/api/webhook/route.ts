import { NextResponse } from "next/server";

// PG 웹훅 수신용 자리. 실제 PG 서명 검증/이벤트 처리 로직을 여기에 구현하세요.
export async function POST(request: Request) {
  // TODO: 서명 검증, 이벤트 타입별 분기, DB 업데이트
  await request.text(); // 본문 읽기 (지금은 미사용)
  return NextResponse.json({ received: true });
}
