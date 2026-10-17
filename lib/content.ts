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

// Owner price list (Vietnamese and English), supplied 2026-10-09: names, one-sentence descriptions
// and prices are verbatim. The price list gives no duration, benefits or steps, so none are shown.
// A treatment without a photo renders without one; only photos that fit are listed.
const catalogue: Array<{
  slug: string;
  title: string;
  englishTitle?: string;
  text: string;
  price: number;
  certified?: true;
  image?: string;
}> = [
  {
    slug: "dry-needling",
    title: "Châm khô",
    englishTitle: "Dry Needling",
    text: "Tác động vào các điểm co cứng (trigger point) để giải phóng căng thẳng, giảm đau và phục hồi chức năng thần kinh – cơ.",
    price: 299000,
    certified: true,
    image: "/images/TreatmentBeds.jpg",
  },
  {
    slug: "cupping",
    title: "Giác hơi",
    englishTitle: "Cupping",
    text: "Dùng áp suất trong ống giác hơi gây xung huyết tại chỗ để giải độc cơ thể và giải quyết một số cơn đau.",
    price: 99000,
    image: "/images/Cupping.jpg",
  },
  {
    slug: "iastm",
    title: "IASTM",
    text: "Dùng dụng cụ chuyên dụng tác động lên mô mềm nhằm giải phóng, tăng lưu thông máu và cải thiện độ đàn hồi của cơ – fascia.",
    price: 199000,
    image: "/images/Iastm.jpg",
  },
  {
    slug: "heat-light",
    title: "Đèn hồng ngoại",
    englishTitle: "Heat Light",
    text: "Thư giãn cơ, giảm căng thẳng, thúc đẩy quá trình tự chữa lành của cơ thể.",
    price: 99000,
    image: "/images/Infrared.jpg",
  },
  {
    slug: "cold-plunge",
    title: "Ngâm lạnh",
    englishTitle: "Cold Plunge",
    text: "Giúp giảm viêm, sưng và phục hồi sau vận động cường độ cao và cải thiện khả năng chịu đựng của hệ thần kinh.",
    price: 149000,
    image: "/images/ColdPlungeTub.jpg",
  },
  {
    slug: "tapping",
    title: "Tapping",
    text: "Hỗ trợ giúp điều chỉnh trương lực cơ, giảm sưng, cải thiện cảm nhận vận động và ổn định khớp trong quá trình phục hồi.",
    price: 99000,
  },
  {
    slug: "shockwave",
    title: "Xung kích",
    englishTitle: "Shockwave Therapy",
    text: "Tái tạo mô, giảm đau tại chỗ nhanh chóng.",
    price: 349000,
  },
  {
    slug: "bio-electric",
    title: "Điện xung",
    englishTitle: "Bio-electric",
    text: "Kích thích thần kinh – cơ bằng xung điện nhẹ nhằm giảm đau, tăng kích hoạt cơ và phục hồi kiểm soát vận động.",
    price: 349000,
  },
  {
    slug: "therapeutic-ultrasound",
    title: "Sóng siêu âm",
    englishTitle: "Therapeutic Ultrasound",
    text: "Giảm đau, giải toả căng cơ, tăng tuần hoàn máu và thúc đẩy quá trình tự chữa lành của cơ thể.",
    price: 349000,
  },
  {
    slug: "electroacupuncture",
    title: "Điện châm",
    englishTitle: "Electroacupuncture",
    text: "Kết hợp châm kim với dòng điện nhẹ nhằm tăng hiệu quả giảm đau, thư giãn cơ và cải thiện lưu thông tuần hoàn.",
    price: 249000,
    certified: true,
  },
  {
    slug: "chiropractic-adjustment",
    title: "Nắn chỉnh cột sống",
    englishTitle: "Chiropractic Adjustment",
    text: "Kỹ thuật huy động và nắn chỉnh khớp cột sống giúp cải thiện cân bằng, giảm chèn ép, tăng khả năng linh hoạt và tối ưu cảm nhận cơ thể.",
    price: 299000,
    certified: true,
  },
];

export const treatments: Treatment[] = catalogue.map(
  ({ text, certified, ...treatment }): Treatment => ({
    ...treatment,
    shortDescription: text,
    description: text,
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
