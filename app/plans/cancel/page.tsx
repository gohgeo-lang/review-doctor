"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const PlanCancelContent = () => {
  const search = useSearchParams();
  const plan = search.get("plan") || "plus";

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-12">
      <h1 className="text-2xl font-bold text-rose-700">결제 취소/실패(모의)</h1>
      <p className="text-slate-700">
        {plan.toUpperCase()} 플랜 결제가 취소되었거나 실패한 것으로 처리합니다.
        실제 PG 연동 후에는 여기서 재시도 버튼이나 고객 지원 안내를 노출하세요.
      </p>
      <div className="flex gap-3">
        <Link href="/plans" className="btn-primary">
          다시 시도
        </Link>
        <Link href="/" className="btn-ghost">
          메인으로 이동
        </Link>
      </div>
    </main>
  );
};

export default function PlanCancelPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-12">
          <h1 className="text-2xl font-bold text-rose-700">
            결제 취소/실패(모의)
          </h1>
          <p className="text-slate-700">불러오는 중...</p>
        </main>
      }
    >
      <PlanCancelContent />
    </Suspense>
  );
}
