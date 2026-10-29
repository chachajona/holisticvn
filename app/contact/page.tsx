import { LeadForm } from "@/components/lead-form";
import { getPublicSiteData } from "@/lib/sanity";
import { mapsHref, noBreakAddress } from "@/lib/content";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Liên hệ",
  description: "Liên hệ HolisticVN để nhận tư vấn.",
  path: "/contact",
});
export default async function ContactPage() {
  const { site, branches } = await getPublicSiteData();
  return (
    <main id="main">
      <section className="booking-page">
        <div className="shell booking-page__grid">
          <div>
            <p className="eyebrow">Liên hệ</p>
            <h1 className="display">Một câu hỏi nhỏ cũng xứng đáng được lắng nghe.</h1>
            <p>
              Nếu chưa sẵn sàng đặt lịch, hãy để lại lời nhắn. Bạn cũng có thể liên hệ trực tiếp qua
              điện thoại hoặc chat.
            </p>
            <div className="contact-details">
              <a href={`tel:${site.phone.replaceAll(" ", "")}`}>{site.phone}</a>
              <a href={`mailto:${site.email}`}>{site.email}</a>
              {branches.map((branch) => (
                <a
                  key={branch.address}
                  href={mapsHref(branch.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {noBreakAddress(branch.address)} (xem bản đồ)
                </a>
              ))}
              <span>
                Giờ mở cửa: {site.hours} · {site.hoursNote}
              </span>
            </div>
          </div>
          <div className="booking-page__form">
            <LeadForm kind="contact" />
          </div>
        </div>
      </section>
    </main>
  );
}
