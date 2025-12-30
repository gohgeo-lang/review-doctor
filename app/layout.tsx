import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "리뷰박사 | 답글 생성기",
  description:
    "리뷰를 붙여넣고 업종과 톤을 선택해 매장 맞춤 답글을 빠르게 생성합니다."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
