import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Về chúng tôi",
  description: "Câu chuyện và cách HolisticVN đồng hành cùng hành trình phục hồi.",
  path: "/about",
});
export default function AboutPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Về HolisticVN"
        title="Sống trọn nhịp của mình, bằng một cơ thể khỏe hơn."
        description="HolisticVN tin rằng phục hồi là một hành trình mang tính cá nhân — không chỉ là giảm đau, mà là mở rộng điều bạn có thể làm."
        image="/images/Stretching.jpg"
      />
      <section className="section">
        <div className="shell about-story">
          <div className="about-story__image">
            <Image
              src="/images/Signage.jpg"
              fill
              sizes="(max-width: 760px) 100vw, 45vw"
              alt="Bảng hiệu Holistic rehab & performance tại phòng tập"
              style={{ objectPosition: "50% 28%" }}
            />
          </div>
          <div>
            <p className="eyebrow">Triết lý</p>
            <h2 className="display">Lắng nghe trước. Can thiệp sau.</h2>
            <p>
              Chúng tôi không cố gắng tách cơn đau khỏi phần còn lại của cuộc sống. Thay vào đó,
              HolisticVN xem chuyển động, công việc, thói quen và mục tiêu của bạn như một tổng thể.
            </p>
            <p>
              Điều tạo nên một kế hoạch tốt không phải là nó phức tạp, mà là bạn có thể thực sự sống
              cùng nó.
            </p>
            <Link href="/booking" className="text-link">
              Đặt buổi tư vấn đầu tiên <span>→</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <p className="eyebrow">Đội ngũ</p>
          <h2 className="display">Đội ngũ HolisticVN</h2>
          <div className="about-team">
            <Image
              src="/images/team.jpg"
              width={1920}
              height={1281}
              sizes="(max-width: 1360px) 100vw, 1360px"
              alt="Đội ngũ HolisticVN trong đồng phục xanh, chụp trước bảng hiệu holistic rehab & performance"
            />
          </div>
        </div>
      </section>
      <section className="principles">
        <div className="shell">
          <p className="eyebrow">Điều chúng tôi giữ vững</p>
          <div>
            {[
              [
                "01",
                "Rõ ràng",
                "Bạn biết mình đang làm gì, vì sao và điều gì sẽ diễn ra tiếp theo.",
              ],
              ["02", "Cá nhân", "Không có hai cơ thể hay hai nhịp sống hoàn toàn giống nhau."],
              [
                "03",
                "Bền vững",
                "Mục tiêu không phải một buổi trị liệu tốt, mà là sự thay đổi có thể duy trì.",
              ],
            ].map(([n, t, d]) => (
              <article key={n}>
                <span>{n}</span>
                <h3 className="display">{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
