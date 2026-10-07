import Image from "next/image";
import Link from "next/link";
import { methodAnchor } from "@/lib/content";
import { createMetadata } from "@/lib/seo";
import styles from "./treatments.module.css";

/*
DIRECTION CONTRACT (impeccable, brief-pinned — comp supplied as full desktop 1440 /
mobile 390 mock, no concept roll).
THESIS: Phương pháp (Methods) — a curated editorial index of the four technique
families Holistic draws from, presented as a numbered timeline rather than a raw
CMS treatment list, so a first-time visitor understands the "why" before the
"which."
OWN-WORLD: same Warm Clay Editorial v2 chrome as the homepage — card ground, ink
hero panel, sage/clay actions, Roboto Slab headings over Roboto Serif body.
STORY: a visitor unsure which technique fits reads four grouped families, sees
which symptoms each addresses, and books an assessment rather than guessing.
FIRST VIEWPORT: 340px full-bleed dark hero card, breadcrumb, "Phương pháp" title,
one clarifying line.
FORM: comp-led, brief-pinned (no seed key) — see .context/attachments.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
*/

export const metadata = createMetadata({
  title: "Phương pháp",
  description:
    "Bốn nhóm kỹ thuật Holistic phối hợp theo tình trạng cụ thể của bạn: trị liệu thủ công, điện trị liệu, tập luyện phục hồi, ngâm lạnh & hồng ngoại.",
  path: "/treatments",
});

const methods = [
  {
    id: methodAnchor.manual,
    numeral: "01",
    title: "Trị liệu thủ công",
    indexSubtitle: "Đau khớp, đau cơ, lệch tư thế",
    body: "Chuyên viên dùng tay để đánh giá và can thiệp trực tiếp lên khớp, cơ và mô mềm — giải phóng điểm co cứng, nắn chỉnh tư thế lệch, tăng biên độ vận động.",
    tags: ["Đau vai gáy", "Đau lưng dưới", "Lệch chậu"],
    image: "/images/Massage.jpg",
    imageLeft: true,
  },
  {
    id: methodAnchor.electro,
    numeral: "02",
    title: "Điện trị liệu",
    indexSubtitle: "Viêm, sưng, đau mạn tính",
    body: "Dòng điện tần số thấp kích thích thần kinh và cơ, giảm viêm và giảm đau mà không cần can thiệp bằng tay — thường dùng trước khi vận động để giảm co cứng.",
    tags: ["Viêm gân", "Đau mạn tính", "Co cứng cơ"],
    image: "/images/acupuncture.jpg",
    imageLeft: false,
  },
  {
    id: methodAnchor.rehab,
    numeral: "03",
    title: "Tập luyện phục hồi",
    indexSubtitle: "Yếu cơ, mất ổn định khớp",
    body: "Bài tập có kiểm soát để lấy lại sức mạnh và sự ổn định ở vùng bị ảnh hưởng, tăng dần cường độ theo tiến độ hồi phục — nền tảng để tránh tái chấn thương.",
    tags: ["Yếu cơ", "Mất ổn định khớp", "Hậu chấn thương"],
    image: "/images/Exercise.jpg",
    imageLeft: true,
  },
  {
    id: methodAnchor.cold,
    numeral: "04",
    title: "Ngâm lạnh & hồng ngoại",
    indexSubtitle: "Hồi phục sau vận động nặng",
    body: "Nhiệt lạnh giảm sưng ngay sau vận động nặng; hồng ngoại làm giãn mô và tăng tuần hoàn máu sau đó — thường kết hợp làm bước cuối của một buổi trị liệu.",
    tags: ["Sưng cơ", "Sau thi đấu", "Giãn mô"],
    image: "/images/Stretching.jpg",
    imageLeft: false,
  },
];

export default function TreatmentsPage() {
  return (
    <main id="main" className={styles.root}>
      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <Image
            src="/images/acupuncture.jpg"
            alt="Chuyên viên thực hiện kỹ thuật trị liệu tay tại Holistic"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
          <div className={styles.heroScrim} />
          <div className={styles.heroContent}>
            <div className={styles.breadcrumb}>
              <Link href="/">Trang chủ</Link> &nbsp;/&nbsp; Phương pháp
            </div>
            <h1>Phương pháp</h1>
            <p className={styles.heroBody}>
              Mỗi kỹ thuật giải quyết một vấn đề khác nhau. Chuyên viên chọn và phối hợp phương pháp
              dựa trên tình trạng cụ thể của bạn, không áp một công thức chung cho tất cả.
            </p>
          </div>
        </div>
      </section>

      <nav className={styles.index} aria-label="Bốn nhóm kỹ thuật">
        <div className={styles.indexHead}>
          <span>Bốn nhóm kỹ thuật</span>
          <i />
        </div>
        <div className={styles.indexGrid}>
          {methods.map((method) => (
            <a href={`#${method.id}`} key={method.id} className={styles.indexCard}>
              <span className={styles.indexNumeral}>{method.numeral}</span>
              <strong>{method.title}</strong>
              <span>{method.indexSubtitle}</span>
            </a>
          ))}
        </div>
      </nav>

      <div className={styles.timeline}>
        {methods.map((method, i) => (
          <div className={styles.method} id={method.id} key={method.id}>
            <div className={styles.methodRail}>
              <span className={styles.methodNumeral}>{method.numeral}</span>
              {i < methods.length - 1 ? <div className={styles.methodLine} /> : null}
            </div>
            <div className={styles.methodBody}>
              <div className={styles.methodCopy} style={{ order: method.imageLeft ? 2 : 1 }}>
                <h2>{method.title}</h2>
                <p>{method.body}</p>
                <div className={styles.methodTags}>
                  {method.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className={styles.methodMedia} style={{ order: method.imageLeft ? 1 : 2 }}>
                <Image
                  src={method.image}
                  alt={method.title}
                  fill
                  sizes="(max-width: 980px) 100vw, 45vw"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className={styles.note}>
        <div className={styles.noteCard}>
          <div className={styles.noteCopy}>
            <h2>Phần lớn lộ trình kết hợp 2–3 phương pháp trong cùng một buổi.</h2>
          </div>
          <Link href="/booking" className={styles.primaryButton}>
            Đặt buổi đánh giá
          </Link>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaCard}>
          <div className={styles.ctaCopy}>
            <h2>Chưa chắc phương pháp nào phù hợp?</h2>
            <p>Buổi đánh giá đầu tiên sẽ xác định đúng kỹ thuật cho tình trạng của bạn.</p>
          </div>
          <div className={styles.ctaActions}>
            <Link href="/booking" className={styles.lightButton}>
              Đặt lịch hẹn
            </Link>
            <Link href="/contact" className={styles.darkOutlineButton}>
              Liên hệ
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
