export type ProtocolStep = {
  step: number;
  title: string;
  description: string;
};

export type Treatment = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  duration: string;
  image: string;
  benefits: string[];
  price?: number;
  isPopular?: boolean;
  protocols?: ProtocolStep[];
};

export type Service = {
  slug: string;
  title: string;
  description: string;
  treatments: string[];
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
  ["Điện trị liệu", `/treatments#${methodAnchor.electro}`],
  ["Tập luyện phục hồi", `/treatments#${methodAnchor.rehab}`],
  ["Ngâm lạnh", `/treatments#${methodAnchor.cold}`],
  ["Đèn hồng ngoại", `/treatments#${methodAnchor.infrared}`],
];

// Google Maps listing "Holistic Rehab & Performance", re-read 2026-10-09: 5.0 stars, 645 reviews (644 on 2026-10-06).
export const reviewSummary = {
  average: 5,
  count: 645,
  url: "https://maps.app.goo.gl/9RmecBoycrAkhBE39",
};

export const services: Service[] = [
  {
    slug: "phuc-hoi-van-dong",
    title: "Phục hồi vận động",
    description:
      "Lộ trình cá nhân hóa để trở lại nhịp sống, thể thao và công việc một cách tự tin.",
    treatments: ["dry-needling", "iastm"],
  },
  {
    slug: "giam-dau-chuyen-sau",
    title: "Giảm đau chuyên sâu",
    description:
      "Tìm nguyên nhân gốc rễ của cơn đau bằng đánh giá chức năng và trị liệu có định hướng.",
    treatments: ["cupping", "heat-light"],
  },
  {
    slug: "phong-ngua-chan-thuong",
    title: "Phòng ngừa chấn thương",
    description: "Nâng chất lượng chuyển động, tăng sức bền và chủ động bảo vệ cơ thể lâu dài.",
    treatments: ["cold-plunge", "iastm"],
  },
];

export const treatments: Treatment[] = [
  {
    slug: "dry-needling",
    title: "Dry Needling",
    shortDescription:
      "Giải phóng điểm kích hoạt cơ, hỗ trợ giảm đau và cải thiện biên độ vận động.",
    description:
      "Kỹ thuật can thiệp vào mô cơ chuyên sâu, kết hợp đánh giá vận động để xử lý căng cứng kéo dài và đau cơ xương khớp.",
    duration: "45–60 phút",
    image: "/images/TreatmentBeds.jpg",
    benefits: ["Giảm căng cơ", "Hỗ trợ phục hồi", "Tăng biên độ vận động"],
  },
  {
    slug: "cupping",
    title: "Cupping Therapy",
    shortDescription: "Giác hơi hiện đại để thư giãn mô mềm và hỗ trợ tuần hoàn.",
    description:
      "Liệu pháp áp lực âm được sử dụng có mục tiêu, phù hợp trong lộ trình hồi phục và chăm sóc cơ thể sau vận động.",
    duration: "30–45 phút",
    image: "/images/Cupping.jpg",
    benefits: ["Thư giãn mô mềm", "Hỗ trợ tuần hoàn", "Cảm nhận cơ thể tốt hơn"],
  },
  {
    slug: "iastm",
    title: "IASTM",
    shortDescription:
      "Can thiệp mô mềm bằng dụng cụ, hướng tới chuyển động mượt mà và hiệu quả hơn.",
    description:
      "Kỹ thuật hỗ trợ xử lý vùng mô hạn chế vận động, luôn được kết hợp cùng bài tập và hướng dẫn tự chăm sóc.",
    duration: "45 phút",
    image: "/images/Iastm.jpg",
    benefits: ["Cải thiện mô mềm", "Tối ưu chuyển động", "Kết hợp bài tập phục hồi"],
  },
  {
    slug: "heat-light",
    title: "Heat & Light",
    shortDescription:
      "Nhiệt và ánh sáng trị liệu hỗ trợ thư giãn, giảm khó chịu trong giai đoạn hồi phục.",
    description:
      "Phương pháp bổ trợ nhẹ nhàng được điều chỉnh theo tình trạng và mục tiêu phục hồi của từng khách hàng.",
    duration: "30 phút",
    image: "/images/Infrared.jpg",
    benefits: ["Thư giãn", "Hỗ trợ giảm khó chịu", "Phục hồi có kiểm soát"],
  },
  {
    slug: "cold-plunge",
    title: "Cold Plunge",
    shortDescription: "Phục hồi sau vận động bằng liệu pháp lạnh có hướng dẫn.",
    description:
      "Phiên trị liệu lạnh được thiết kế với thời lượng phù hợp, ưu tiên an toàn và đáp ứng thực tế của cơ thể.",
    duration: "15–20 phút",
    image: "/images/ColdPlungeTub.jpg",
    benefits: ["Hồi phục sau vận động", "Tăng tỉnh táo", "Xây dựng thói quen phục hồi"],
  },
];

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
    quote: "Đội ngũ làm việc rất chuyên nghiệp, tiệm sạch sẽ và tiện nghi đầy đủ, trải nghiệm 10/10",
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
