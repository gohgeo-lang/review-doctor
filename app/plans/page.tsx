import Link from "next/link";

const plans = [
  {
    id: "free",
    name: "무료",
    price: "₩0 /월",
    cta: "무료로 사용",
    highlight: false,
    features: [
      "월 10건 생성",
      "기본 톤(정중형)",
      "개인화 응대형 답글 유형만 사용",
      "로그인 필수",
    ],
  },
  {
    id: "plus",
    name: "플러스",
    price: "₩900 /월 (부가세 별도)",
    cta: "구독 준비 중",
    highlight: true,
    features: [
      "월 100건 생성",
      "모든 톤 선택 가능",
      "모든 답글 유형 사용",
      "템플릿/최근 기록/자동 추천",
    ],
  },
  {
    id: "pro",
    name: "프로",
    price: "₩1,900 /월 (부가세 별도)",
    cta: "구독 준비 중",
    highlight: false,
    features: [
      "무제한 생성",
      "모든 기능 무제한",
      "고객 지원 우선 처리",
      "향후 팀 계정/권한 관리 포함 예정",
    ],
  },
];

export default function PlansPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Plans
        </p>
        <h1 className="text-3xl font-bold text-slate-900">요금제 안내</h1>
        <p className="text-base text-slate-600">
          무료는 월 10건, 기본 톤과 개인화 응대형만 제공합니다. 플러스/프로는
          모든 기능과 더 많은 건수를 제공합니다.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl border p-6 shadow-sm ${
              plan.highlight
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-900"
            }`}
          >
            <div className="flex items-baseline justify-between">
              <div>
                <h2 className="text-xl font-bold">{plan.name}</h2>
                <p
                  className={`text-sm ${
                    plan.highlight ? "text-slate-200" : "text-slate-600"
                  }`}
                >
                  {plan.price}
                </p>
              </div>
              {plan.highlight && (
                <span className="rounded-full bg-amber-100 px-2 py-[2px] text-xs font-semibold text-amber-800">
                  인기
                </span>
              )}
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 leading-relaxed text-sm"
                >
                  <span className="mt-[2px] text-emerald-500">•</span>
                  <span
                    className={
                      plan.highlight ? "text-slate-100" : "text-slate-700"
                    }
                  >
                    {f}
                  </span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled
              className={`mt-6 w-full rounded-xl px-4 py-2 text-sm font-semibold ${
                plan.highlight
                  ? "bg-white text-slate-900"
                  : "bg-slate-900 text-white"
              } opacity-70`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </section>

      <div className="flex items-center gap-3">
        <Link href="/" className="btn-ghost">
          ← 메인으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
