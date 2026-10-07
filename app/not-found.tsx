import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Không tìm thấy trang",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main">
      <article className="policy">
        <div className="shell">
          <p className="eyebrow">404</p>
          <h1 className="display">Không tìm thấy trang này.</h1>
          <p className="policy__intro">
            Đường dẫn có thể đã thay đổi hoặc không còn tồn tại. Bạn có thể quay lại trang chủ hoặc
            liên hệ để được hỗ trợ.
          </p>
          <p>
            <Link className="button" href="/">
              Về trang chủ
            </Link>{" "}
            <Link href="/contact">Liên hệ HolisticVN</Link>
          </p>
        </div>
      </article>
    </main>
  );
}
