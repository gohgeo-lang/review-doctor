import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type FeedbackBody = {
  message?: string;
  path?: string;
  userAgent?: string;
  context?: Record<string, any>;
};

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  const body = (await request.json()) as FeedbackBody;
  const message = body.message?.trim();
  const path = body.path?.trim() || "/";
  const userAgent = body.userAgent?.trim() || "";
  const context = body.context;

  if (!message) {
    return NextResponse.json({ error: "메시지를 입력해주세요." }, { status: 400 });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("Supabase env not set. Feedback:", { message, path, userAgent });
    return NextResponse.json({ ok: true, stored: false, note: "Supabase env 미설정" });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const payloadMessage = context
      ? `${message}\n\n---context---\n${JSON.stringify(context)}`
      : message;
    const { error } = await supabase.from("feedback").insert({
      message: payloadMessage,
      path,
      user_agent: userAgent,
    });
    if (error) {
      console.error("Supabase insert error", error);
      return NextResponse.json(
        { error: "피드백 저장에 실패했습니다." },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true, stored: true });
  } catch (err) {
    console.error("Supabase client error", err);
    return NextResponse.json(
      { error: "피드백 저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
