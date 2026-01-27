"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const features = [
  {
    title: "톤·유형 가드레일",
    desc: "정중/공감/단호 등 톤 규칙과 답글 유형 규칙을 구조화해 일관성을 유지합니다.",
  },
  {
    title: "업종/매장 정보 반영",
    desc: "업종, 서비스, 매장명, 요청사항을 반영해 맞춤형 답글을 만듭니다.",
  },
  {
    title: "템플릿과 히스토리",
    desc: "자주 쓰는 설정을 저장하고 최근 답글을 재사용할 수 있습니다.",
  },
  {
    title: "안전한 기본 문장",
    desc: "과장/보상 약속/법률·의료 표현을 피하는 안전 규칙을 적용합니다.",
  },
];
const heroCards = [
  {
    title: "리뷰 응대 자동화",
    desc: "리뷰 텍스트 분석과 톤/유형 추천으로, 고민 없이 바로 답글을 만듭니다.",
    points: [
      "리뷰 붙여넣기만 하면 자동 추천",
      "톤/유형 규칙으로 품질 유지",
      "복사까지 한 번에 완료",
    ],
    accent: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "안전한 브랜드 톤",
    desc: "과장/보상 약속을 피하고 정중한 톤을 유지해 신뢰를 지킵니다.",
    points: [
      "고객님 호칭 고정",
      "과장/보상 표현 자동 차단",
      "매장 시점 일관 유지",
    ],
    accent: "bg-amber-50 text-amber-700",
  },
];

const faqs = [
  {
    q: "ChatGPT로도 가능한가요?",
    a: "가능은 하지만 매번 맥락 입력, 톤 설계, 안전 규칙을 직접 챙겨야 합니다. 리뷰박사는 이 과정을 자동화해 반복 작업을 줄입니다.",
  },
  {
    q: "어떤 사람이 쓰면 좋나요?",
    a: "리뷰 대응 시간이 부족한 자영업자, 반복 응대가 많은 매장, 톤 일관성이 중요한 브랜드에 적합합니다.",
  },
  {
    q: "무료로 쓸 수 있나요?",
    a: "무료 플랜으로 기본 톤과 제한된 유형을 체험할 수 있고, 더 많은 건수와 기능은 유료 플랜에서 제공합니다.",
  },
];

const valueBadges = ["톤 10종", "답글 유형 20종", "템플릿 저장", "최근 기록"];
const brandPillars = [
  {
    title: "정중하고 현실적인 말투",
    desc: "과장 없이, 매장 입장에서 바로 쓸 수 있는 문장으로 답합니다.",
  },
  {
    title: "실수 방지 가드레일",
    desc: "보상 약속·과한 사과·부적절 표현을 자동으로 막습니다.",
  },
  {
    title: "바쁜 사장님 중심",
    desc: "복잡한 설정 없이도 ‘바로 쓰는 답글’이 나오는 흐름입니다.",
  },
];

const cartoons = [
  {
    src: "/landing/cartoon-1.png",
    title: "리뷰 알림에 멈칫",
    desc: "바쁘고 부담스러운 리뷰 답글",
  },
  {
    src: "/landing/cartoon-2.png",
    title: "리뷰만 붙여넣기",
    desc: "복잡한 건 알아서 처리",
  },
  {
    src: "/landing/cartoon-3.png",
    title: "톤·정책 자동 반영",
    desc: "실수 걱정 없이 작성",
  },
  {
    src: "/landing/cartoon-4.png",
    title: "10초면 충분",
    desc: "붙여넣기 → 생성 → 복사",
  },
];

export default function LandingPage() {
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const scrollCarousel = (direction: -1 | 1) => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-card]");
    const width = card?.offsetWidth || el.clientWidth * 0.8;
    el.scrollBy({ left: direction * (width + 16), behavior: "smooth" });
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const interval = window.setInterval(() => {
      const current = carouselRef.current;
      if (!current) return;
      const maxScrollLeft = current.scrollWidth - current.clientWidth;
      if (current.scrollLeft >= maxScrollLeft - 4) {
        current.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      scrollCarousel(1);
    }, 3500);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className="relative">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-16 px-6 pb-16 pt-0">
        <header className="sticky top-0 z-20 -mx-6 border-b border-slate-200 bg-white/95 px-6 py-4 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
                Review Doctor
              </span>
              <span className="text-sm font-semibold text-slate-600">
                리뷰답글 에이전트
              </span>
            </div>
            <nav className="hidden items-center gap-4 text-xs font-semibold text-slate-500 md:flex">
              <a href="#cartoon" className="hover:text-slate-900">
                카툰
              </a>
              <a href="#hero" className="hover:text-slate-900">
                히어로
              </a>
              <a href="#brand-tone" className="hover:text-slate-900">
                브랜드 톤
              </a>
              <a href="#features" className="hover:text-slate-900">
                기능
              </a>
              <a href="#value" className="hover:text-slate-900">
                가치
              </a>
            </nav>
            <Link
              href="/app"
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
            >
              무료로 사용하기
            </Link>
          </div>
        </header>

        <section
          id="cartoon"
          className="flex h-auto flex-col justify-start rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:h-[80vh] lg:overflow-hidden lg:p-10"
        >
          <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:items-stretch lg:h-full">
            <div className="flex flex-col items-center text-center md:h-full md:items-start md:justify-between md:text-left lg:pt-0">
              <span className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-amber-500">
                CARTOON STORY
              </span>
              <div className="mt-4 flex flex-col gap-3 md:gap-2 lg:mt-0 lg:-mt-6">
                <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                  리뷰 답글,
                  <br />
                  10초면 충분합니다.
                </h2>
                <p className="text-base leading-relaxed text-slate-600 md:text-base lg:text-lg">
                  바쁜 사장님을 위한 4컷 스토리로, “붙여넣기 → 추천 → 복사”
                  흐름을 바로 보여줍니다.
                </p>
              </div>
              <div className="mt-6 flex flex-col items-center gap-4 md:items-start">
                <div className="flex flex-wrap justify-center gap-2 text-xs font-semibold text-slate-500 md:justify-start md:text-sm">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                    붙여넣기
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                    자동추천
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                    바로 복사
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                    실수 방지
                  </span>
                </div>
                <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2 md:gap-2">
                  <div className="flex items-center justify-center gap-2 md:justify-start">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                      ✓
                    </span>
                    톤/유형 자동 추천으로 고민 시간을 줄입니다.
                  </div>
                  <div className="flex items-center justify-center gap-2 md:justify-start">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                      ✓
                    </span>
                    과장·보상 약속 같은 위험 표현을 자동 차단합니다.
                  </div>
                  <div className="flex items-center justify-center gap-2 md:justify-start">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                      ✓
                    </span>
                    매장 톤을 일관되게 유지해 신뢰를 쌓습니다.
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-col items-center gap-3 md:items-start">
                <p className="text-sm text-slate-500">
                  지금 바로 사용하고 답글 시간을 절반 이하로 줄여보세요.
                </p>
                <Link
                  href="/app"
                  className="rounded-full bg-slate-900 px-12 py-5 text-lg font-semibold text-white shadow-sm transition hover:bg-slate-800 md:px-12 md:py-5 md:text-lg"
                >
                  무료로 사용하기
                </Link>
              </div>
            </div>
            <div className="relative md:flex md:flex-col md:items-center md:justify-start lg:h-full lg:items-end lg:justify-start lg:pt-2">
              <div
                ref={carouselRef}
                className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 pr-12 lg:h-[calc(80vh-80px)] lg:max-h-[calc(80vh-80px)] lg:items-stretch lg:pb-0"
              >
                {cartoons.map((item) => (
                  <div
                    key={item.title}
                    data-carousel-card
                    className="flex min-w-[100%] snap-center flex-col rounded-[36px] border border-slate-200 bg-white p-5 shadow-[0_35px_80px_-35px_rgba(15,23,42,0.32)] md:min-w-[95%] lg:min-w-[85%] lg:h-full"
                  >
                    <div className="flex h-full flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                      <Image
                        src={item.src}
                        alt={item.title}
                        width={800}
                        height={1200}
                        className="h-full w-full object-cover lg:object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => scrollCarousel(-1)}
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-lg font-semibold text-slate-700 shadow-md backdrop-blur hover:bg-white"
                aria-label="이전"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel(1)}
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-lg font-semibold text-slate-700 shadow-md backdrop-blur hover:bg-white"
                aria-label="다음"
              >
                ›
              </button>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#f7f7fb] to-transparent" />
            </div>
          </div>
        </section>

        <header
          id="hero"
          className="flex h-auto flex-col items-center justify-center gap-6 rounded-[36px] border border-slate-200 bg-white p-4 text-center shadow-sm md:gap-8 md:p-5"
        >
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Review Doctor
            </span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-900">
              바쁜 사장님 전용
            </span>
          </div>
          <div className="flex max-w-4xl flex-col gap-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
              답글은 빠르게, 톤은 안전하게.
            </h1>
            <p className="text-sm leading-relaxed text-slate-600 md:text-base">
              리뷰를 붙여넣기만 하면 톤과 유형을 알아서 고르고, 매장에 맞는
              답글을 즉시 작성합니다. 일관된 브랜드 톤으로 신뢰를 쌓으세요.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-500">
            {valueBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-slate-200 bg-white px-3 py-1"
              >
                {badge}
              </span>
            ))}
          </div>
          <div className="grid w-full max-w-5xl gap-6 pt-4 md:grid-cols-2">
            {heroCards.map((card) => (
              <div
                key={card.title}
                className="flex w-full max-h-[48vh] flex-col rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center shadow-lg md:p-6"
              >
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${card.accent}`}
                >
                  핵심 가치
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900 md:text-xl">
                  {card.title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-600 md:text-sm">
                  {card.desc}
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600 md:text-sm">
                  {card.points.map((point) => (
                    <li key={point} className="flex items-center justify-center gap-2 text-center">
                      <span className="mt-[2px] inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                        ✓
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                    브랜드 톤 안정화
                  </span>
                </div>
              </div>
            ))}
          </div>
        </header>

        <section
          id="brand-tone"
          className="flex h-auto flex-col justify-center rounded-[36px] border border-slate-200 bg-white p-6 shadow-sm md:p-10"
        >
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Review Doctor
              </span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-900">
                Brand Tone
              </span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl lg:text-7xl lg:whitespace-nowrap">
              브랜드 톤을 흔들림 없이 유지합니다
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 md:text-base">
              과장 없이 정중하게, 고객님 호칭과 매장 시점을 일관되게 유지합니다.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-amber-800">
              <span className="rounded-full bg-amber-100 px-3 py-1">
                과장/보상 약속 금지
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">
                고객님 호칭 고정
              </span>
            </div>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {brandPillars.slice(0, 2).map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-lg md:p-8"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Policy
                </p>
                <h3 className="mt-3 text-xl font-bold text-slate-900 md:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-4 text-xs leading-relaxed text-slate-600 md:text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-xs text-slate-700 shadow-lg md:grid-cols-3 md:p-8 md:text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Problem
              </p>
              <p className="mt-2">
                리뷰 대응은 중요하지만, 매번 문장 고민할 시간이 없습니다.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Insight
              </p>
              <p className="mt-2">
                톤과 유형이 정리되면, 답글 품질이 크게 흔들리지 않습니다.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Result
              </p>
              <p className="mt-2">
                리뷰 붙여넣기만 해도 바로 사용할 답글을 얻습니다.
              </p>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="flex h-auto flex-col justify-center gap-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-sm md:gap-10 md:p-10"
        >
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Review Doctor
              </span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-900">
                Features
              </span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
              필요한 기능만, 단단하게
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 md:text-base">
              자영업자가 가장 자주 쓰는 기능부터 빼곡히 채웠습니다.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-lg md:p-8"
              >
                <h3 className="text-lg font-bold text-slate-900 md:text-xl">
                  {feature.title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-600 md:text-sm">
                  {feature.desc}
                </p>
                <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                    자동 추천
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                    톤 고정
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                    안전 규칙
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="value"
          className="flex h-auto flex-col justify-center gap-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-sm md:p-10"
        >
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Review Doctor
              </span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-900">
                Value
              </span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
              왜 필요한가요?
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 md:text-base">
              시간, 품질, 리스크를 한 번에 줄이는 이유를 설명합니다.
            </p>
          </div>
          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-3 md:p-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">시간 절약</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 md:text-sm">
                매번 문장 고민 없이 즉시 답글을 출력해 반복 시간을 줄입니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">일관된 품질</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 md:text-sm">
                톤과 유형 규칙이 내장되어 답글 품질이 들쭉날쭉해지지 않습니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">리스크 감소</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 md:text-sm">
                과장/보상 약속/위험 표현을 피하는 안전 규칙을 제공합니다.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-lg md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold text-slate-900">
                자주 묻는 질문
              </h3>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                FAQ
              </span>
            </div>
            <div className="mt-4 grid gap-4">
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6"
                >
                  <p className="text-xs font-semibold text-slate-900 md:text-sm">
                    {faq.q}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 md:text-sm">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="cta"
          className="flex h-auto flex-col justify-center rounded-[28px] border border-slate-900 bg-slate-900 p-6 text-white shadow-[0_25px_60px_-45px_rgba(15,23,42,0.7)] md:p-8"
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200">
                Review Doctor
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-900">
                Get Started
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
              지금 바로 시작하세요
            </h2>
            <p className="max-w-2xl text-xs text-slate-200 sm:text-sm md:text-base">
              리뷰 대응을 더 빠르고 안전하게. 자동 추천으로 바로 답글을
              만들어보세요.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/app"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900"
              >
                무료로 써보기
              </Link>
              <Link
                href="/plans"
                className="rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white"
              >
                요금제 확인
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
