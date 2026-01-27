"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PlanSuccessPage() {
  const search = useSearchParams();
  const plan = search.get("plan") || "plus";

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-12">
      <h1 className="text-2xl font-bold text-emerald-700">결제 완료(모의)</h1>
      <p className="text-slate-700">
        {plan.toUpperCase()} 플랜 결제가 완료되었다고 가정합니다. 실제 PG 연동
        후에는 이 페이지에서 플랜 활성화 결과를 안내하고 메인으로 이동하세요.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="btn-primary">
          메인으로 이동
        </Link>
        <Link href="/plans" className="btn-ghost">
          요금제 다시 보기
        </Link>
      </div>
    </main>
  );
}
