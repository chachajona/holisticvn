import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/content";

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="shell site-footer__grid">
      <div><Image src="/assets/logo/lockup-on-dark.svg" width={210} height={47} alt="holistic — rehab & performance" /><p className="site-footer__intro">Không chạy theo việc hết đau thật nhanh. Chúng tôi cùng bạn xây lại mối quan hệ bền vững với cơ thể.</p></div>
      <div><p className="eyebrow">Khám phá</p><Link href="/services">Dịch vụ</Link><Link href="/treatments">Liệu pháp</Link><Link href="/about">Về HolisticVN</Link><Link href="/blog">Góc nhìn</Link></div>
      <div><p className="eyebrow">Kết nối</p><a href={`tel:${site.phone.replaceAll(" ", "")}`}>{site.phone}</a><a href={`mailto:${site.email}`}>{site.email}</a><span>{site.address}</span></div>
      <div><p className="eyebrow">Đặt lịch</p><p>Bắt đầu bằng một cuộc trò chuyện ngắn về điều bạn đang cần.</p><Link href="/booking" className="button">Gửi yêu cầu <span>→</span></Link></div>
    </div>
    <div className="shell site-footer__bottom"><span>© {new Date().getFullYear()} HolisticVN</span><div><Link href="/privacy-policy">Quyền riêng tư</Link><Link href="/terms-conditions">Điều khoản</Link><Link href="/cookie-policy">Cookie</Link></div></div>
  </footer>;
}
