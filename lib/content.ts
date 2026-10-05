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
  publishedAt: string;
  category: string;
  body: string[];
};

export type Testimonial = {
  quote: string;
  context: string;
  avatar?: string;
  rating?: number;
};

export const site = {
  name: "HolisticVN",
  phone: "082 895 9598",
  email: "Holisticrep9@gmail.com",
  address: "205 Nguyễn Đình Chiểu, P. Bàn Cờ, TP. Hồ Chí Minh",
  addressSecondary: "109/15 Lê Quốc Hưng, P. Xóm Chiếu, TP. Hồ Chí Minh",
  hours: "09:00 — 21:00",
  hoursNote: "Tất cả các ngày",
  facebookUrl: "https://www.facebook.com/holisticrep/",
  instagramUrl: "https://www.instagram.com/holisticrep/",
  zaloId: process.env.NEXT_PUBLIC_ZALO_ID,
  messengerId: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID,
};

export const mapsHref = (address: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

// keeps "P." / "TP." attached to the word that follows so a line never ends on the abbreviation
export const noBreakAddress = (address: string) => address.replace(/\b(P|TP)\. /g, "$1.\u00A0");

export const branches = [
  { name: "Chi nhánh Bàn Cờ", address: site.address },
  { name: "Chi nhánh Xóm Chiếu", address: site.addressSecondary },
];

export const reviewSummary = { average: 5, count: 41 };

export const services: Service[] = [
  {
    slug: "phuc-hoi-van-dong",
    title: "Phục hồi vận động",
    description: "Lộ trình cá nhân hóa để trở lại nhịp sống, thể thao và công việc một cách tự tin.",
    treatments: ["dry-needling", "iastm"],
  },
  {
    slug: "giam-dau-chuyen-sau",
    title: "Giảm đau chuyên sâu",
    description: "Tìm nguyên nhân gốc rễ của cơn đau bằng đánh giá chức năng và trị liệu có định hướng.",
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
    shortDescription: "Giải phóng điểm kích hoạt cơ, hỗ trợ giảm đau và cải thiện biên độ vận động.",
    description: "Kỹ thuật can thiệp vào mô cơ chuyên sâu, kết hợp đánh giá vận động để xử lý căng cứng kéo dài và đau cơ xương khớp.",
    duration: "45–60 phút",
    image: "/images/acupuncture.jpg",
    benefits: ["Giảm căng cơ", "Hỗ trợ phục hồi", "Tăng biên độ vận động"],
  },
  {
    slug: "cupping",
    title: "Cupping Therapy",
    shortDescription: "Giác hơi hiện đại để thư giãn mô mềm và hỗ trợ tuần hoàn.",
    description: "Liệu pháp áp lực âm được sử dụng có mục tiêu, phù hợp trong lộ trình hồi phục và chăm sóc cơ thể sau vận động.",
    duration: "30–45 phút",
    image: "/images/Massage.jpg",
    benefits: ["Thư giãn mô mềm", "Hỗ trợ tuần hoàn", "Cảm nhận cơ thể tốt hơn"],
  },
  {
    slug: "iastm",
    title: "IASTM",
    shortDescription: "Can thiệp mô mềm bằng dụng cụ, hướng tới chuyển động mượt mà và hiệu quả hơn.",
    description: "Kỹ thuật hỗ trợ xử lý vùng mô hạn chế vận động, luôn được kết hợp cùng bài tập và hướng dẫn tự chăm sóc.",
    duration: "45 phút",
    image: "/images/Stretching.jpg",
    benefits: ["Cải thiện mô mềm", "Tối ưu chuyển động", "Kết hợp bài tập phục hồi"],
  },
  {
    slug: "heat-light",
    title: "Heat & Light",
    shortDescription: "Nhiệt và ánh sáng trị liệu hỗ trợ thư giãn, giảm khó chịu trong giai đoạn hồi phục.",
    description: "Phương pháp bổ trợ nhẹ nhàng được điều chỉnh theo tình trạng và mục tiêu phục hồi của từng khách hàng.",
    duration: "30 phút",
    image: "/images/Exercise.jpg",
    benefits: ["Thư giãn", "Hỗ trợ giảm khó chịu", "Phục hồi có kiểm soát"],
  },
  {
    slug: "cold-plunge",
    title: "Cold Plunge",
    shortDescription: "Phục hồi sau vận động bằng liệu pháp lạnh có hướng dẫn.",
    description: "Phiên trị liệu lạnh được thiết kế với thời lượng phù hợp, ưu tiên an toàn và đáp ứng thực tế của cơ thể.",
    duration: "15–20 phút",
    image: "/images/Athlete.png",
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
    excerpt: "Kết hợp giấc ngủ, dinh dưỡng, vận động nhẹ và trị liệu phù hợp để giữ nhịp tập ổn định.",
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

export const testimonials: Testimonial[] = [
  {
    quote: "Mình chọn Holistic ở đây có tất cả những thứ mình cần, không cần tốn công tốn tiền đi nhiều chỗ khác nhau. Mình được tư vấn kĩ lưỡng từ đầu, và theo sát trong cả quá trình trị liệu lẫn tập luyện lâu dài nên thấy rất an tâm.",
    context: "Nhân viên văn phòng, 26 tuổi",
    rating: 5,
  },
  {
    quote: "Mình chọn Holistic vì sự uy tín. Toàn bộ quá trình tư vấn, trị liệu và tập rất rõ ràng, chặt chẽ, giúp mình lạc quan hơn về việc hồi phục. Mình thấy sự cải thiện rõ rệt chỉ sau vài tuần rehab.",
    context: "Vận động viên phong trào, 30 tuổi",
    rating: 5,
  },
  {
    quote: "Mình thấy rất tiện vì Holistic ở ngay trung tâm, có nhiều phương pháp trị liệu chuyên sâu hiệu quả, giá cả lại hợp lý nữa.",
    context: "Vận động viên chuyên nghiệp",
    rating: 5,
  },
];

export function getTreatment(slug: string) {
  return treatments.find(item => item.slug === slug);
}

export function getPost(slug: string) {
  return posts.find(item => item.slug === slug);
}
