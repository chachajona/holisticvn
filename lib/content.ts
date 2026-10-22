import type { MethodTagId } from "@/lib/method-tags";

export type ProtocolStep = {
  step: number;
  title: string;
  description: string;
};

export type TreatmentBadge = "popular" | "new";
export type TreatmentFaq = { question: string; answer: string };

export type Treatment = {
  slug: string;
  title: string;
  englishTitle?: string;
  requiresCertifiedPractitioner?: boolean;
  shortDescription: string;
  description: string;
  duration?: string;
  image?: string;
  imageAlt?: string;
  benefits: string[];
  price?: number;
  isPopular?: boolean;
  badge?: TreatmentBadge;
  faqs?: TreatmentFaq[];
  protocols?: ProtocolStep[];
  seo?: { title?: string; description?: string; ogImage?: string };
};

export const serviceGroups = ["therapy", "training", "recovery"] as const;
export type ServiceGroup = (typeof serviceGroups)[number];

export const methodGroups = ["manual", "electro", "rehab", "cold", "infrared"] as const;
export type MethodGroup = (typeof methodGroups)[number];

// Owner-confirmed grouping of the five method groups along the clinic's pathway.
export const methodStages = [
  { id: "therapy", title: "Trị liệu", groups: ["manual", "electro"] },
  { id: "training", title: "Tập luyện", groups: ["rehab"] },
  { id: "recovery", title: "Hồi phục", groups: ["cold", "infrared"] },
] as const satisfies readonly { id: string; title: string; groups: readonly MethodGroup[] }[];
export type MethodStageId = (typeof methodStages)[number]["id"];

export type Service = {
  group: ServiceGroup;
  title: string;
  shortTitle: string;
  summary: string;
  body: string;
  bullets: string[];
  image: string;
  imageAlt: string;
  treatments: Array<{ slug: string; title: string }>;
};

export type Method = {
  group: MethodGroup;
  title: string;
  indexSubtitle: string;
  body: string;
  tags: string[];
  filterTags: MethodTagId[];
  image: string;
  imageAlt: string;
  treatments: Array<{ slug: string; title: string }>;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string | null;
  category: string;
  body: string[];
};

export type Testimonial = {
  quote: string;
  // Verbatim substring of `quote` to emphasise on the homepage.
  highlight?: string;
  context: string;
  avatar?: string;
  rating?: number;
};

export const site = {
  name: "HolisticVN",
  phone: "082 895 9598",
  email: "Holisticrep9@gmail.com",
  address: "109/15 Lê Quốc Hưng, P. Xóm Chiếu, TP. Hồ Chí Minh",
  hours: "09:00 — 21:00",
  hoursNote: "Tất cả các ngày",
  facebookUrl: "https://www.facebook.com/holisticrep/",
  instagramUrl: "https://www.instagram.com/holisticrep/",
  zaloId: process.env.NEXT_PUBLIC_ZALO_ID,
  messengerId: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID,
};

export const mapsHref = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

// keeps "P." / "TP." attached to the word that follows so a line never ends on the abbreviation
export const noBreakAddress = (address: string) => address.replace(/\b(P|TP)\. /g, "$1.\u00A0");

export const branches = [{ name: "Cơ sở Xóm Chiếu", address: site.address }];

// Section ids shared by the footer links and the /services and /treatments pages, so they cannot drift apart.
export const serviceAnchor = {
  therapy: "svc-therapy",
  training: "svc-training",
  recovery: "svc-recovery",
} as const;
export const methodAnchor = {
  manual: "mtd-manual",
  electro: "mtd-electro",
  rehab: "mtd-rehab",
  cold: "mtd-cold",
  infrared: "mtd-infrared",
} as const;
export const footerServices: Array<[string, string]> = [
  ["Trị liệu bằng tay", `/services#${serviceAnchor.therapy}`],
  ["Tập luyện phục hồi & tăng cường", `/services#${serviceAnchor.training}`],
  ["Ngâm lạnh & đèn hồng ngoại", `/services#${serviceAnchor.recovery}`],
];
export const footerMethods: Array<[string, string]> = [
  ["Trị liệu thủ công", `/treatments#${methodAnchor.manual}`],
  ["Trị liệu bằng thiết bị", `/treatments#${methodAnchor.electro}`],
  ["Tập luyện phục hồi & tăng cường", `/treatments#${methodAnchor.rehab}`],
  ["Ngâm lạnh", `/treatments#${methodAnchor.cold}`],
  ["Đèn hồng ngoại", `/treatments#${methodAnchor.infrared}`],
];

// Google Maps listing "Holistic Rehab & Performance", re-read 2026-10-09: 5.0 stars, 645 reviews (644 on 2026-10-06).
export const reviewSummary = {
  average: 5,
  count: 645,
  url: "https://maps.app.goo.gl/9RmecBoycrAkhBE39",
};

// Local image per group: fallback when a CMS service has no usable image.
export const serviceFallbackImage: Record<ServiceGroup, string> = {
  therapy: "/images/Iastm.jpg",
  training: "/images/Coaching.jpg",
  recovery: "/images/Infrared.jpg",
};

export const services: Service[] = [
  {
    group: "therapy",
    title: "Trị liệu bằng tay",
    shortTitle: "Trị liệu",
    summary: "Massage trị liệu, nắn chỉnh và các phương pháp hỗ trợ giảm đau, thư giãn cơ.",
    body: "Massage trị liệu toàn thân hoặc cục bộ, nắn chỉnh cột sống và IASTM giúp giảm căng cơ, giảm đau và phục hồi biên độ vận động.",
    bullets: [
      "Massage trị liệu toàn thân hoặc cục bộ",
      "Nắn chỉnh cột sống, châm khô, điện châm (chỉ chuyên viên có chứng nhận thực hiện)",
      "IASTM – cạo mạc, tapping, giác hơi",
      "Xung kích, điện xung, sóng siêu âm hỗ trợ giảm đau và phục hồi mô mềm",
    ],
    image: serviceFallbackImage.therapy,
    imageAlt: "Trị liệu bằng tay",
    treatments: [
      { slug: "dry-needling", title: "Châm khô" },
      { slug: "cupping", title: "Giác hơi" },
      { slug: "iastm", title: "IASTM" },
      { slug: "tapping", title: "Tapping" },
      { slug: "chiropractic-adjustment", title: "Nắn chỉnh cột sống" },
      { slug: "shockwave", title: "Xung kích" },
      { slug: "bio-electric", title: "Điện xung" },
      { slug: "therapeutic-ultrasound", title: "Sóng siêu âm" },
      { slug: "electroacupuncture", title: "Điện châm" },
    ],
  },
  {
    group: "training",
    title: "Tập luyện phục hồi & tăng cường",
    shortTitle: "Tập luyện",
    summary: "Tập luyện phục hồi và tăng cường, cá nhân hoá theo cơ thể bạn.",
    body: "Hai chương trình tập cá nhân hoá: tập luyện phục hồi cho chấn thương, đau mỏi hoặc hạn chế vận động; tập luyện tăng cường để phát triển sức mạnh, kiểm soát và hiệu quả chuyển động.",
    bullets: [
      "Tập luyện phục hồi: cho chấn thương, đau mỏi hoặc hạn chế vận động",
      "Tập luyện tăng cường: phát triển sức mạnh, kiểm soát và hiệu quả chuyển động",
      "Đồng hành xuyên suốt từ tư vấn đến tập luyện",
    ],
    image: serviceFallbackImage.training,
    imageAlt: "Tập luyện phục hồi & tăng cường",
    treatments: [],
  },
  {
    group: "recovery",
    title: "Ngâm lạnh & đèn hồng ngoại",
    shortTitle: "Thư giãn & hồi phục",
    summary: "Ngâm lạnh, đèn hồng ngoại và thư giãn cơ bắp sau tập luyện nặng.",
    body: "Ngâm lạnh giúp giảm viêm, giảm sưng và phục hồi sau vận động cường độ cao; đèn hồng ngoại giúp thư giãn cơ, giảm căng thẳng — thường kết hợp sau buổi trị liệu hoặc tập luyện.",
    bullets: [
      "Ngâm lạnh phục hồi sau vận động cường độ cao",
      "Đèn hồng ngoại thư giãn cơ, giảm căng thẳng",
      "Kết hợp linh hoạt trong lộ trình cá nhân",
    ],
    image: serviceFallbackImage.recovery,
    imageAlt: "Ngâm lạnh & đèn hồng ngoại",
    treatments: [
      { slug: "heat-light", title: "Đèn hồng ngoại" },
      { slug: "cold-plunge", title: "Ngâm lạnh" },
    ],
  },
];

// Local image per group: fallback when a CMS method has no usable image.
export const methodFallbackImage: Record<MethodGroup, string> = {
  manual: "/images/Iastm.jpg",
  electro: "/images/ElectroPulse.jpg",
  rehab: "/images/Coaching.jpg",
  cold: "/images/ColdPlungeTub.jpg",
  infrared: "/images/Infrared.jpg",
};

// Bundled copy, used as-is when Sanity is not configured and per group when a CMS group is missing or invalid.
export const methods: Method[] = [
  {
    group: "manual",
    title: "Trị liệu thủ công",
    indexSubtitle: "Massage, khớp và mô mềm",
    body: "Chuyên viên kết hợp massage, vận động khớp và các kỹ thuật tác động lên mô mềm để hỗ trợ giảm đau mỏi, giảm căng cứng và giúp bạn cử động dễ hơn. Kỹ thuật phù hợp tùy theo tình trạng vận động của bạn.",
    tags: ["Đau mỏi cổ vai gáy", "Đau lưng", "Căng cứng cơ", "Khó cử động", "Giảm đau mỏi"],
    filterTags: ["neck-pain", "back-pain", "muscle-stiffness", "limited-movement", "pain-relief"],
    image: methodFallbackImage.manual,
    imageAlt: "Trị liệu thủ công",
    treatments: [
      { slug: "dry-needling", title: "Châm khô" },
      { slug: "cupping", title: "Giác hơi" },
      { slug: "iastm", title: "IASTM" },
      { slug: "tapping", title: "Tapping" },
      { slug: "chiropractic-adjustment", title: "Nắn chỉnh cột sống" },
    ],
  },
  {
    group: "electro",
    title: "Trị liệu bằng thiết bị",
    indexSubtitle: "Điện xung, siêu âm và xung kích",
    body: "Holistic kết hợp điện xung, siêu âm hoặc xung kích với trị liệu và bài tập khi phù hợp. Mỗi kỹ thuật có cách tác động riêng, hướng đến giảm đau và giúp bạn vận động dễ dàng hơn.",
    tags: ["Căng cứng cơ", "Giảm đau mỏi"],
    filterTags: ["muscle-stiffness", "pain-relief"],
    image: methodFallbackImage.electro,
    imageAlt: "Trị liệu bằng thiết bị",
    treatments: [
      { slug: "shockwave", title: "Xung kích" },
      { slug: "bio-electric", title: "Điện xung" },
      { slug: "therapeutic-ultrasound", title: "Sóng siêu âm" },
      { slug: "electroacupuncture", title: "Điện châm" },
    ],
  },
  {
    group: "rehab",
    title: "Tập luyện phục hồi & tăng cường",
    indexSubtitle: "Phục hồi, sức mạnh và chuyển động",
    body: "Bắt đầu từ khả năng vận động hiện tại, chuyên viên hướng dẫn các bài tập giúp bạn từng bước phục hồi sau chấn thương, tăng sức mạnh và kiểm soát chuyển động. Mức độ tập thay đổi theo mục tiêu sinh hoạt, công việc và thể thao của bạn.",
    tags: [
      "Khó cử động",
      "Giảm đau mỏi",
      "Phục hồi sau chấn thương",
      "Tăng sức mạnh",
      "Kiểm soát chuyển động tốt hơn",
    ],
    filterTags: ["limited-movement", "pain-relief", "injury-rehab", "strength", "movement-control"],
    image: methodFallbackImage.rehab,
    imageAlt: "Tập luyện phục hồi & tăng cường",
    treatments: [],
  },
  {
    group: "cold",
    title: "Ngâm lạnh",
    indexSubtitle: "Hỗ trợ hồi phục sau tập luyện",
    body: "Ngâm nước lạnh có thể giúp dịu cảm giác đau nhức cơ sau buổi tập hoặc vận động cường độ cao. Chuyên viên đánh giá sự phù hợp và hướng dẫn bạn trong buổi ngâm.",
    tags: ["Hồi phục sau tập luyện"],
    filterTags: ["post-workout-recovery"],
    image: methodFallbackImage.cold,
    imageAlt: "Ngâm lạnh",
    treatments: [{ slug: "cold-plunge", title: "Ngâm lạnh" }],
  },
  {
    group: "infrared",
    title: "Đèn hồng ngoại",
    indexSubtitle: "Sức ấm trong buổi trị liệu",
    body: "Đèn hồng ngoại làm ấm vùng được chiếu. Holistic sử dụng sức ấm này để hỗ trợ cảm giác thư giãn, dễ chịu và phối hợp với các phương pháp khác khi phù hợp.",
    tags: ["Căng cứng cơ"],
    filterTags: ["muscle-stiffness"],
    image: methodFallbackImage.infrared,
    imageAlt: "Đèn hồng ngoại",
    treatments: [{ slug: "heat-light", title: "Đèn hồng ngoại" }],
  },
];

// Names and prices follow the owner's price list (2026-10-09). Educational copy was
// researched and revised on 2026-10-22; sources: docs/TREATMENT_CONTENT_AUDIT.md.
// Clinic durations, benefits and protocols remain empty until confirmed.
// A treatment without a photo renders without one; only photos that fit are listed.
const catalogue: Array<{
  slug: string;
  title: string;
  englishTitle?: string;
  text: string;
  price: number;
  certified?: true;
  image?: string;
  // Researched patient information; `text` is the short description.
  intro?: string;
  faqs?: TreatmentFaq[];
}> = [
  {
    slug: "dry-needling",
    title: "Châm khô",
    englishTitle: "Dry Needling",
    text: "Dùng kim mảnh, không chứa thuốc, tác động vào vùng cơ đau hoặc điểm co cứng để hỗ trợ giảm đau và cải thiện vận động.",
    price: 299000,
    intro:
      "Châm khô dùng kim mảnh, đặc, đưa qua da vào vùng cơ hoặc điểm co cứng nhạy đau. Kim không chứa thuốc và không tiêm chất gì vào cơ thể. Kỹ thuật này thường được dùng cùng bài tập và các phương pháp phục hồi khác.\n\nMột số nghiên cứu ghi nhận giảm đau sau điều trị, nhưng kết quả còn khác nhau giữa các tình trạng và chưa đủ chắc chắn để hứa trước mức cải thiện. Việc có nên châm khô cần dựa vào đánh giá vùng đau, sức khỏe và lựa chọn của bạn.",
    certified: true,
    image: "/images/TreatmentBeds.jpg",
    faqs: [
      {
        question: "Châm khô có đau không?",
        answer:
          "Bạn có thể thấy châm chích, đau tức hoặc cơ co giật nhẹ khi kim tác động. Sau đó vùng châm có thể nhức hoặc bầm. Hãy báo ngay nếu khó chịu để người thực hiện đánh giá và điều chỉnh.",
      },
      {
        question: "Tôi cần báo những gì trước khi châm khô?",
        answer:
          "Hãy báo nếu bạn đang mang thai, dùng thuốc chống đông, có suy giảm miễn dịch, vừa phẫu thuật hoặc rất sợ kim. Những thông tin này giúp người thực hiện cân nhắc mức độ phù hợp; một số trường hợp cần hỏi bác sĩ trước.",
      },
      {
        question: "Châm khô có rủi ro nào cần biết?",
        answer:
          "Ngoài đau nhức, bầm hoặc choáng, châm khô có nguy cơ nhiễm trùng. Tràn khí màng phổi là biến chứng nghiêm trọng đã được ghi nhận sau châm ở vùng cổ, vai hoặc ngực. Nếu đau ngực hoặc khó thở sau buổi châm, hãy đi cấp cứu ngay và nói rõ bạn vừa được châm khô.",
      },
    ],
  },
  {
    slug: "cupping",
    title: "Giác hơi",
    englishTitle: "Cupping",
    text: "Dùng cốc tạo lực hút trên da, có thể hỗ trợ giảm đau cơ xương khớp ở một số người.",
    price: 99000,
    intro:
      "Giác hơi tạo lực hút bên trong cốc đặt trên da, kéo da và mô nông lên. Có nhiều cách giác hơi; giác khô không chích da, còn giác ướt có chích da và lấy máu. Mỗi cách có mức rủi ro khác nhau.\n\nNghiên cứu gợi ý giác hơi có thể giảm đau ở một số người, nhưng chưa đủ để khẳng định khả năng phục hồi chức năng hay hiệu quả lâu dài. Nếu cân nhắc giác hơi, bạn nên trao đổi về mục tiêu giảm đau và các phương pháp điều trị đang dùng.",
    faqs: [
      {
        question: "Vết đỏ hoặc tím sau giác hơi có phải là độc tố không?",
        answer:
          "Lực hút có thể làm vỡ những mạch máu nhỏ dưới da và để lại vết tròn tạm thời. Màu vết giác không cho biết lượng độc tố trong cơ thể. Chưa có bằng chứng đáng tin cậy để dùng giác hơi như một cách thải độc.",
      },
      {
        question: "Giác hơi có gây bỏng hoặc tổn thương da không?",
        answer:
          "Có thể. Các rủi ro gồm bỏng, nhiễm trùng, sẹo hoặc đổi màu da kéo dài; chàm và vảy nến có thể nặng hơn. Hãy báo trước nếu vùng da đang viêm hoặc có bệnh da.",
      },
      {
        question: "Khi nào tôi cần đi khám sau giác hơi?",
        answer:
          "Bạn nên đi khám nếu bị bỏng, đau nhiều, sốt hoặc vùng da đỏ đau kèm dịch vàng. Đây là những dấu hiệu cần được kiểm tra, không nên coi là phản ứng thải độc.",
      },
    ],
    image: "/images/Cupping.jpg",
  },
  {
    slug: "iastm",
    title: "IASTM",
    text: "Dùng dụng cụ cầm tay vuốt trên da để tác động lên mô mềm, có thể hỗ trợ giảm đau và cải thiện biên độ vận động.",
    price: 199000,
    intro:
      "IASTM là trị liệu mô mềm có hỗ trợ bằng dụng cụ. Người thực hiện dùng dụng cụ cầm tay vuốt trên vùng da cần trị liệu, thường có chất bôi trơn để giảm ma sát.\n\nMột số nghiên cứu ghi nhận giảm đau và tăng biên độ vận động khi dùng IASTM, trong đó nhiều nghiên cứu kết hợp thêm bài tập hoặc phương pháp khác. Kết quả còn khác nhau và bằng chứng về cải thiện chức năng chưa chắc chắn. Vì vậy, lợi ích cần được đánh giá theo tình trạng và phản ứng của từng người.",
    image: "/images/Iastm.jpg",
    faqs: [
      {
        question: "IASTM có tốt hơn trị liệu bằng tay không?",
        answer:
          "Chưa có cơ sở để khẳng định dụng cụ luôn tác động sâu hơn, chính xác hơn hoặc cho kết quả tốt hơn dùng tay. Các nghiên cứu khác nhau về vùng điều trị và phương pháp phối hợp nên không thể áp dụng một kết luận cho mọi trường hợp.",
      },
      {
        question: "Tôi cần báo gì trước khi thực hiện IASTM?",
        answer:
          "Hãy báo nếu bạn dùng thuốc chống đông, có rối loạn đông máu, vết thương hở, da đang viêm hoặc dị ứng với kim loại, chất bôi trơn hay latex. Những vùng có gãy xương chưa lành hoặc viêm tĩnh mạch huyết khối cần được đánh giá trước.",
      },
      {
        question: "Nếu thấy đau nhiều khi dùng dụng cụ thì sao?",
        answer:
          "Hãy nói ngay với người thực hiện để dừng lại và đánh giá. Mức đau nhiều và da quá nhạy cảm là những yếu tố cần thận trọng; bạn không cần cố chịu đau để hoàn thành buổi trị liệu.",
      },
    ],
  },
  {
    slug: "heat-light",
    title: "Đèn hồng ngoại",
    englishTitle: "Heat Light",
    text: "Đèn hồng ngoại tạo hơi ấm tại vùng được chiếu, có thể giúp bớt căng cơ và giảm đau tạm thời.",
    price: 99000,
    intro:
      "Đèn hồng ngoại dùng năng lượng hồng ngoại để làm ấm vùng cơ thể được chiếu. Tác dụng nhiệt có thể giúp cơ thư giãn và giảm đau tạm thời. Đây là cách hỗ trợ cảm giác dễ chịu khi cơ đang căng cứng.\n\nMức nhiệt cần phù hợp với vùng da và cảm giác của bạn. Chiếu quá nóng hoặc quá lâu có thể gây bỏng, nhất là khi da giảm cảm giác. Hiệu quả lâu dài còn tùy nguyên nhân gây đau và kế hoạch phục hồi, không thể suy ra chỉ từ cảm giác ấm sau khi chiếu đèn.",
    image: "/images/Infrared.jpg",
    faqs: [
      {
        question: "Chiếu đèn hồng ngoại có gây bỏng không?",
        answer:
          "Có. Nhiệt quá cao hoặc tiếp xúc quá lâu có thể làm bỏng da. Nếu thấy nóng rát hay khó chịu, hãy báo ngay để dừng chiếu và kiểm tra da.",
      },
      {
        question: "Tình trạng nào cần báo trước khi chiếu đèn?",
        answer:
          "Hãy báo nếu vùng da bị tê, giảm cảm giác, có vết thương hoặc đang sưng nóng đỏ; đồng thời cho biết nếu bạn có tuần hoàn kém hay biến chứng thần kinh do đái tháo đường. Những tình trạng này có thể khiến liệu pháp nhiệt không phù hợp.",
      },
      {
        question: "Đèn hồng ngoại có làm tổn thương lành nhanh hơn không?",
        answer:
          "Chưa thể khẳng định điều đó cho mọi loại đèn hay mọi tình trạng đau. Hơi ấm có thể giúp dễ chịu tạm thời, còn việc hồi phục cần dựa vào nguyên nhân và đánh giá chức năng vận động.",
      },
    ],
  },
  {
    slug: "cold-plunge",
    title: "Ngâm lạnh",
    englishTitle: "Cold Plunge",
    text: "Ngâm trong nước lạnh có thể giúp bớt đau mỏi cơ sau buổi vận động nặng.",
    price: 149000,
    intro:
      "Ngâm lạnh là ngâm một phần hoặc phần lớn cơ thể trong nước lạnh. Một số nghiên cứu ghi nhận người tập bớt đau mỏi cơ trong những ngày sau buổi vận động nặng, so với chỉ nghỉ ngơi. Cảm giác dễ chịu hơn không đồng nghĩa với việc chấn thương đã lành hay cơ bắp luôn phục hồi nhanh hơn.\n\nCách dùng cần phù hợp với sức khỏe và mục tiêu tập luyện. Nước lạnh có thể làm nhịp tim, huyết áp và nhịp thở thay đổi đột ngột. Bạn nên trao đổi về bệnh nền trước khi ngâm và có người theo dõi trong lúc thực hiện.",
    image: "/images/ColdPlungeTub.jpg",
    faqs: [
      {
        question: "Ai cần hỏi ý kiến bác sĩ trước khi ngâm lạnh?",
        answer:
          "Người có bệnh tim, tăng huyết áp hoặc nguy cơ đột quỵ cần hỏi bác sĩ trước. Nếu từng nổi mề đay, khó thở hoặc choáng khi gặp lạnh, hãy báo rõ và chưa ngâm cho đến khi được đánh giá.",
      },
      {
        question: "Khi nào cần dừng ngâm?",
        answer:
          "Hãy dừng ngâm và nhờ người hỗ trợ nếu bạn khó thở, chóng mặt hoặc tê nhiều. Ngâm quá lâu có thể gây hạ thân nhiệt và khiến bạn khó tự ra khỏi bồn. Đừng cố chịu lạnh để đủ thời gian.",
      },
      {
        question: "Có nên ngâm ngay sau mọi buổi tập tạ không?",
        answer:
          "Nếu mục tiêu là tăng cơ, cần cân nhắc việc ngâm lạnh thường xuyên ngay sau tập tạ. Một tổng quan nghiên cứu cho thấy cách dùng này có thể làm giảm mức tăng kích thước cơ; chất lượng bằng chứng còn hạn chế.",
      },
      {
        question: "Nước càng lạnh và ngâm càng lâu có càng tốt không?",
        answer:
          "Không. Nhiệt độ và thời gian cần được chọn theo sức khỏe, mức quen với lạnh và mục tiêu của từng người. Không có một mốc tối ưu chung để tự áp dụng; kéo dài thời gian ngâm làm tăng rủi ro.",
      },
    ],
  },
  {
    slug: "tapping",
    title: "Tapping",
    text: "Dán băng đàn hồi lên da để hỗ trợ cảm nhận vận động; lợi ích giảm đau còn thay đổi theo tình trạng.",
    price: 99000,
    intro:
      "Tapping là kỹ thuật dán băng đàn hồi, thường gọi là kinesiology taping. Băng co giãn theo chuyển động và tạo thêm cảm giác từ vùng da được dán. Cách cắt, vị trí và độ căng của băng được chọn theo mục tiêu hỗ trợ.\n\nBăng dán có thể được dùng như một biện pháp bổ trợ trong phục hồi. Bằng chứng về giảm đau và cải thiện chức năng còn chưa thống nhất; với bệnh lý gân chóp xoay ở vai, tổng quan nghiên cứu chưa xác định rõ lợi ích. Bạn nên được hướng dẫn cách sử dụng phù hợp với vùng cần hỗ trợ và tình trạng da của mình.",
    faqs: [
      {
        question: "Bị ngứa hoặc đỏ da sau khi dán thì làm gì?",
        answer:
          "Hãy tháo băng nếu xuất hiện đỏ da, ngứa hoặc khó chịu. Gỡ chậm, sát mặt da, tránh giật mạnh lên trên; báo với người hướng dẫn trước khi dán lại.",
      },
      {
        question: "Khi nào không nên dán lên vùng da đó?",
        answer:
          "Không dán lên vết thương hở, vùng nhiễm trùng hoặc da đang viêm. Hãy báo trước nếu da mỏng, dễ tổn thương hoặc sẹo còn đang lành để được đánh giá.",
      },
      {
        question: "Tôi có thể tự dán theo hình trên mạng không?",
        answer:
          "Bạn nên được hướng dẫn vị trí và độ căng phù hợp trước khi tự dán. Hình minh họa không cho biết nguyên nhân đau hay mức hỗ trợ cần thiết. Thời gian giữ băng cũng cần theo hướng dẫn cho loại băng và tình trạng da của bạn.",
      },
    ],
  },
  {
    slug: "shockwave",
    title: "Xung kích",
    englishTitle: "Shockwave Therapy",
    text: "Dùng sóng cơ học tác động vào vùng được trị liệu, với mục tiêu hỗ trợ giảm đau ở một số vấn đề gân và cân gan chân kéo dài.",
    price: 349000,
    intro:
      "Xung kích (ESWT) truyền các xung sóng cơ học qua da bằng một đầu phát đặt tại vùng cần trị liệu. Phương pháp này được cân nhắc cho một số tình trạng đau gân hoặc cân gan chân kéo dài, nhất là khi các biện pháp ban đầu chưa giúp cải thiện đủ.\n\nMục tiêu là giảm đau để việc sinh hoạt và tập phục hồi dễ thực hiện hơn. Hiệu quả phụ thuộc vào tình trạng cụ thể và không xuất hiện giống nhau ở mọi người. Các nghiên cứu về xung kích cho đau cân gan chân còn cho kết quả khác nhau; vì vậy, không nên kỳ vọng mô sẽ được tái tạo hay hết đau ngay sau một buổi.",
    faqs: [
      {
        question: "Xung kích có gây đau hoặc có rủi ro gì?",
        answer:
          "Bạn có thể nghe tiếng gõ của máy và thấy khó chịu tại vùng tác động. Sau buổi trị liệu, vùng đó có thể đau, đỏ, sưng hoặc bầm. Hãy báo nếu cảm giác quá sức chịu đựng; đau nhiều hơn không có nghĩa là hiệu quả hơn. Rách gân hoặc cân mạc là rủi ro rất hiếm nhưng đã được ghi nhận.",
      },
      {
        question: "Có cần hết đau ngay mới được xem là có hiệu quả?",
        answer:
          "Không. Một số người thấy dễ chịu sớm, nhưng cũng có người cải thiện chậm hoặc không đáp ứng. Nên đánh giá cả mức đau lẫn khả năng sinh hoạt và thực hiện bài tập. Nếu triệu chứng không tiến triển hoặc tăng lên, cần trao đổi lại để xem xét kế hoạch điều trị.",
      },
      {
        question: "Tôi cần báo những gì trước khi làm xung kích?",
        answer:
          "Hãy báo nếu bạn đang mang thai, dùng thuốc chống đông, có máy tạo nhịp tim, giảm cảm giác ở vùng trị liệu hoặc mới tiêm corticosteroid tại đó. Vết thương, nhiễm trùng, khối u hoặc phẫu thuật tại vùng này cũng cần được trao đổi trước. Không tự ngưng thuốc đang dùng để chuẩn bị trị liệu.",
      },
    ],
  },
  {
    slug: "bio-electric",
    title: "Điện xung",
    englishTitle: "Bio-electric",
    text: "Dùng xung điện với mục tiêu hỗ trợ trị liệu; tác dụng cụ thể phụ thuộc vào thiết bị, chế độ và tình trạng cần điều trị.",
    price: 349000,
    image: "/images/ElectroPulse.jpg",
    intro:
      'Điện xung là tên gọi chung cho nhiều cách dùng xung điện trong trị liệu. Có loại hướng đến giảm cảm giác đau, có loại dùng để tạo co cơ phục vụ tập phục hồi. Hai mục tiêu này cần được phân biệt khi lựa chọn phương pháp.\n\nTrước khi thực hiện, bạn nên hỏi loại máy và chế độ được đề xuất, mục tiêu của buổi trị liệu và cách đánh giá đáp ứng. Hiệu quả của một phương pháp kích thích điện không thể suy ra chỉ từ tên gọi "điện xung"; cần xem xét đúng loại thiết bị và vấn đề sức khỏe của bạn.',
    faqs: [
      {
        question: "Điện xung có phải là TENS hay NMES không?",
        answer:
          'TENS dùng kích thích điện qua da nhằm giảm đau tạm thời; NMES hướng đến kích thích cơ co lại. Tên dịch vụ "Điện xung" chưa cho biết phòng khám đang sử dụng loại nào. Bạn nên hỏi rõ trước khi quyết định, vì tác dụng và lưu ý của từng loại khác nhau.',
      },
      {
        question: "Khi trị liệu bằng điện, tôi sẽ cảm thấy gì?",
        answer:
          "Tùy phương pháp, bạn có thể thấy tê râm ran hoặc cơ co theo nhịp. Cần được giải thích trước cảm giác dự kiến của loại máy được dùng. Hãy báo ngay nếu thấy đau, rát hoặc khó chịu, để người thực hiện kiểm tra và điều chỉnh.",
      },
      {
        question: "Có trường hợp nào cần trao đổi trước khi dùng điện xung?",
        answer:
          "Hãy báo nếu bạn có máy tạo nhịp tim hoặc thiết bị điện cấy ghép, bệnh tim, động kinh, đang mang thai, vùng da tổn thương hoặc giảm cảm giác. Việc có thể thực hiện hay cần chọn phương án khác phụ thuộc vào loại máy, vị trí tác động và đánh giá sức khỏe.",
      },
    ],
  },
  {
    slug: "therapeutic-ultrasound",
    title: "Sóng siêu âm",
    englishTitle: "Therapeutic Ultrasound",
    text: "Dùng sóng âm tần số cao truyền vào mô qua đầu phát trên da; mức phù hợp và lợi ích cần được cân nhắc theo từng tình trạng.",
    price: 349000,
    intro:
      "Siêu âm trị liệu dùng đầu phát truyền sóng âm tần số cao vào mô. Gel giúp sóng truyền từ đầu phát qua da. Sóng có thể tạo tác động cơ học và nhiệt trong mô; cảm giác trên da thường rất ít.\n\nTác động lên mô không đồng nghĩa với việc phương pháp này đã được chứng minh giúp mọi chấn thương lành nhanh hơn. Bằng chứng về lợi ích phụ thuộc vào bệnh lý được điều trị. Bạn nên được giải thích lý do lựa chọn siêu âm và cách đánh giá kết quả, nhất là khi triệu chứng chưa có chẩn đoán rõ.",
    faqs: [
      {
        question: "Siêu âm trị liệu có nóng hoặc đau không?",
        answer:
          "Bạn có thể chỉ cảm thấy gel mát và đầu phát di chuyển trên da. Không cần cảm thấy nóng mới có tác động. Nếu bị đau, rát hoặc triệu chứng tăng lên trong lúc thực hiện, hãy báo ngay để kiểm tra.",
      },
      {
        question: "Siêu âm có được khuyến nghị cho đau thắt lưng không?",
        answer:
          "Hướng dẫn NICE NG59 của Anh không khuyến nghị siêu âm để điều trị đau thắt lưng, dù có hay không kèm đau thần kinh tọa. Nếu bạn đang đau lưng, nên trao đổi về đánh giá nguyên nhân, duy trì vận động và bài tập phù hợp trước khi lựa chọn liệu pháp.",
      },
      {
        question: "Tôi cần báo thông tin sức khỏe nào trước khi làm?",
        answer:
          "Hãy báo nếu bạn đang hoặc có thể mang thai, vùng trị liệu bị tê hay giảm cảm giác nóng đau, tuần hoàn kém, có vết thương, nhiễm trùng hoặc khối u. Các yếu tố này có thể ảnh hưởng đến việc chọn vị trí và phương pháp trị liệu.",
      },
    ],
  },
  {
    slug: "electroacupuncture",
    title: "Điện châm",
    englishTitle: "Electroacupuncture",
    text: "Kết hợp kim châm với kích thích điện, được cân nhắc để hỗ trợ giảm đau tùy tình trạng và mức độ phù hợp của người bệnh.",
    price: 249000,
    intro:
      "Điện châm kết hợp châm kim với kích thích điện truyền qua các kim được nối với thiết bị. Bạn có thể cảm thấy châm nhẹ, tức tại vị trí kim hoặc tê râm ran khi có kích thích điện. Cảm giác cần được theo dõi và trao đổi trong lúc thực hiện.\n\nMột số nghiên cứu về điện châm ở người thoái hoá khớp gối ghi nhận cải thiện đau và chức năng, nhưng kết quả này không áp dụng chung cho mọi loại đau. Khi cân nhắc phương pháp, cần trao đổi về lợi ích dự kiến cho đúng tình trạng của bạn, các nguy cơ liên quan đến kim và dòng điện, cùng những lựa chọn điều trị khác.",
    certified: true,
    faqs: [
      {
        question: "Điện châm có hiệu quả hơn châm kim thông thường không?",
        answer:
          "Việc thêm kích thích điện không tự động có nghĩa là hiệu quả hơn. Kết quả còn phụ thuộc vào bệnh lý, cách thực hiện và tiêu chí đánh giá. Nghiên cứu so sánh với châm giả cũng không đủ để kết luận điện châm luôn tốt hơn châm thủ công.",
      },
      {
        question: "Tôi cần báo gì trước khi điện châm?",
        answer:
          "Hãy báo về máy tạo nhịp tim hoặc thiết bị điện cấy ghép, thai kỳ, động kinh, tiền sử ngất, rối loạn đông máu, thuốc chống đông và tình trạng da ở vùng châm. Đặc biệt, người có máy tạo nhịp tim hoặc máy khử rung cấy ghép cần trao đổi với bác sĩ trước, vì kích thích điện có thể không phù hợp.",
      },
      {
        question: "Điện châm có những rủi ro nào?",
        answer:
          "Có thể đau tại chỗ kim, bầm, chảy máu nhẹ hoặc chóng mặt. Biến chứng hiếm nhưng nghiêm trọng gồm nhiễm trùng và tổn thương cơ quan, trong đó có tràn khí màng phổi khi châm gần ngực. Nếu đau ngực hoặc khó thở sau châm, hãy đi cấp cứu ngay và nói rõ bạn vừa được điện châm.",
      },
      {
        question: "Tôi có phải chịu đau trong lúc điện châm không?",
        answer:
          "Tê râm ran hoặc cảm giác tức nhẹ có thể xảy ra; bạn nên báo ngay khi đau nhói, khó chịu nhiều hoặc choáng. Bạn có quyền yêu cầu dừng và trao đổi về phương án khác. Không cần cố chịu đau để buổi trị liệu có tác dụng.",
      },
    ],
  },
  {
    slug: "chiropractic-adjustment",
    title: "Nắn chỉnh cột sống",
    englishTitle: "Chiropractic Adjustment",
    text: "Tác động lên các khớp cột sống nhằm hỗ trợ giảm đau và cải thiện vận động ở người phù hợp.",
    price: 299000,
    intro:
      "Các kỹ thuật tác động lên khớp cột sống được dùng để hỗ trợ giảm đau và cải thiện vận động. Với đau thắt lưng, mức cải thiện thường không lớn và còn tùy tình trạng của từng người.\n\nTrước khi thực hiện, cần đánh giá triệu chứng, bệnh nền và giải thích kỹ thuật dự định dùng. Với đau thắt lưng, trị liệu bằng tay nên nằm trong kế hoạch có tập luyện phục hồi để hỗ trợ việc trở lại sinh hoạt và vận động.",
    certified: true,
    faqs: [
      {
        question: "Huy động khớp và nắn chỉnh nhanh có giống nhau không?",
        answer:
          "Hai cách này khác nhau. Huy động khớp dùng chuyển động trong tầm vận động của khớp, không dùng lực đẩy nhanh; nắn chỉnh có thể có lực đẩy nhanh, có kiểm soát. Bạn nên hỏi rõ kỹ thuật và vùng cột sống sẽ được tác động trước khi đồng ý.",
      },
      {
        question: "Nắn chỉnh cột sống có rủi ro gì?",
        answer:
          "Có thể bị ê đau, cứng hoặc đau đầu tạm thời. Biến cố nghiêm trọng rất hiếm nhưng đã được báo cáo. Riêng nắn chỉnh nhanh vùng cổ có liên quan đến rách thành động mạch cổ và đột quỵ; quan hệ nhân quả còn tranh luận, song cần được giải thích trước khi thực hiện.",
      },
      {
        question: "Tôi cần báo những thông tin sức khỏe nào?",
        answer:
          "Hãy báo bệnh nền và thuốc đang dùng, nhất là thuốc chống đông, tình trạng xương khớp yếu hoặc tổn thương nặng, bệnh thần kinh hay nguy cơ đột quỵ. Những yếu tố này có thể làm kỹ thuật không phù hợp hoặc cần được đánh giá thêm.",
      },
    ],
  },
];

export const treatments: Treatment[] = catalogue.map(
  ({ text, certified, intro, ...treatment }): Treatment => ({
    ...treatment,
    shortDescription: text,
    description: intro ?? text,
    requiresCertifiedPractitioner: certified ?? false,
    benefits: [],
  }),
);

export const posts: Post[] = [
  {
    slug: "dau-lung-khi-ngoi-lau",
    title: "Đau lưng khi ngồi lâu: bắt đầu từ đâu?",
    excerpt: "Ba tín hiệu cơ thể thường bị bỏ qua và cách xây dựng thói quen vận động bền vững.",
    publishedAt: "2026-08-20",
    category: "Vận động",
    body: [
      "Đau lưng hiếm khi chỉ có một nguyên nhân. Thay vì tìm một động tác chữa nhanh, hãy quan sát tư thế, nhịp nghỉ và cách cơ thể phản hồi sau một ngày làm việc.",
      "Một lộ trình tốt thường bắt đầu từ đánh giá chuyển động, mục tiêu cụ thể và những thay đổi nhỏ nhưng đều đặn.",
    ],
  },
  {
    slug: "phuc-hoi-sau-chay-bo",
    title: "Phục hồi sau chạy bộ không chỉ là nghỉ ngơi",
    excerpt:
      "Kết hợp giấc ngủ, dinh dưỡng, vận động nhẹ và trị liệu phù hợp để giữ nhịp tập ổn định.",
    publishedAt: "2026-08-12",
    category: "Thể thao",
    body: [
      "Phục hồi là một phần của quá trình tập luyện. Nó giúp cơ thể thích nghi tốt hơn với khối lượng vận động và giảm nguy cơ quá tải.",
      "Hãy ưu tiên cảm nhận cơ thể, không so sánh máy móc với lịch tập của người khác.",
    ],
  },
  {
    slug: "khi-nao-can-gap-chuyen-gia",
    title: "Khi nào bạn nên gặp chuyên gia phục hồi?",
    excerpt: "Đừng đợi tới khi cơn đau cản trở sinh hoạt mới tìm sự hỗ trợ.",
    publishedAt: "2026-08-01",
    category: "Chăm sóc cơ thể",
    body: [
      "Nếu cơn đau tái diễn, vận động bị giới hạn hoặc bạn không chắc cách trở lại tập luyện an toàn, một buổi đánh giá có thể giúp làm rõ hướng đi.",
      "Mục tiêu là đưa ra lựa chọn phù hợp với cuộc sống thật của bạn, không phải một phác đồ chung cho tất cả mọi người.",
    ],
  },
];

// Verbatim excerpts from Google Maps reviews of "Holistic Rehab & Performance", read 2026-10-09
// (Vietnamese view). "…" marks where the review continues. Reviewers are shown as given name + last
// initial; Google only shows relative ages, so dates are tracked in docs/CONTENT_INVENTORY.md.
// Rule: the shown excerpt says nothing about treatment outcomes (pain, recovery, improvement);
// staff, space and process are fine. Thanh X.'s full review does claim an outcome, in the part
// cut at "…". The only edit to review text is dropping the space before commas in Giang H.'s
// excerpt. Earlier quotes are in git history.
export const testimonials: Testimonial[] = [
  {
    quote:
      "… Không gian phòng trị liệu sạch sẽ, yên tĩnh và tạo cảm giác thư giãn ngay từ khi bước vào. Chuyên viên làm việc rất chuyên nghiệp, hỏi kỹ tình trạng cơ thể trước khi bắt đầu và giải thích rõ từng bước trị liệu. Trong quá trình trị liệu cảm thấy dễ chịu, không bị đau hay khó chịu. …",
    highlight: "hỏi kỹ tình trạng cơ thể trước khi bắt đầu và giải thích rõ từng bước trị liệu",
    context: "Thanh X., Google",
    rating: 5,
  },
  {
    quote: "… Ai cần giãn cơ sau khi tập thể dục thể thao thì nên đến đây …",
    highlight: "giãn cơ sau khi tập thể dục thể thao",
    context: "Thảo V., Google",
    rating: 5,
  },
  {
    quote: "… kỹ thuật tay nghề tốt, cơ sở vật chất hiện đại, mọi người nên tới trải nghiệm",
    highlight: "kỹ thuật tay nghề tốt, cơ sở vật chất hiện đại",
    context: "Giang H., Google",
    rating: 5,
  },
  {
    quote:
      "Đội ngũ làm việc rất chuyên nghiệp, tiệm sạch sẽ và tiện nghi đầy đủ, trải nghiệm 10/10",
    highlight: "tiệm sạch sẽ và tiện nghi đầy đủ",
    context: "Dong L., Google",
    rating: 5,
  },
  {
    quote: "Nhân viên nhiệt tình, cơ sở sạch sẽ mát mẻ",
    highlight: "cơ sở sạch sẽ mát mẻ",
    context: "Phi H., Google",
    rating: 5,
  },
];

export function getTreatment(slug: string) {
  return treatments.find((item) => item.slug === slug);
}

export function getPost(slug: string) {
  return posts.find((item) => item.slug === slug);
}
