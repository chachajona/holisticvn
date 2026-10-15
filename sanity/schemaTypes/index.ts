import { defineArrayMember, defineField, defineType } from "sanity";
import { methodGroups, serviceGroups, type MethodGroup, type ServiceGroup } from "@/lib/content";
import { methodTags } from "@/lib/method-tags";
import { leadSchema } from "@/lib/validation";
import { validateMethodGroups, validateServiceGroups } from "@/sanity/serviceGroups";

const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "SEO title",
      type: "string",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "description",
      title: "SEO description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(160),
    }),
    defineField({ name: "ogImage", title: "OG image", type: "image", options: { hotspot: true } }),
  ],
});
const image = defineField({
  name: "image",
  title: "Ảnh",
  type: "image",
  options: { hotspot: true },
  fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
});
const protocolStep = defineType({
  name: "protocolStep",
  title: "Bước quy trình",
  type: "object",
  fields: [
    defineField({
      name: "step",
      title: "Thứ tự",
      type: "number",
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: "title",
      title: "Tiêu đề bước",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", title: "Mô tả", type: "text", rows: 3 }),
  ],
  preview: {
    select: { step: "step", title: "title" },
    prepare: ({ step, title }) => ({ title: `${step}. ${title}` }),
  },
});
const location = defineType({
  name: "location",
  title: "Cơ sở",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Tên cơ sở",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "address",
      title: "Địa chỉ",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "mapUrl", title: "Link Google Maps", type: "url" }),
    defineField({ name: "isPrimary", title: "Cơ sở chính", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "name", subtitle: "address" } },
});
const serviceGroupTitles: Record<ServiceGroup, string> = {
  therapy: "Trị liệu",
  training: "Tập luyện",
  recovery: "Thư giãn & hồi phục",
};
const serviceGroup = defineType({
  name: "serviceGroup",
  title: "Nhóm dịch vụ",
  type: "object",
  fields: [
    defineField({
      name: "group",
      title: "Nhóm",
      description: "Cố định sau khi tạo. Quyết định mục neo và ngữ cảnh khi khách bấm Đặt lịch.",
      type: "string",
      options: {
        list: serviceGroups.map((value) => ({ value, title: serviceGroupTitles[value] })),
        layout: "radio",
      },
      readOnly: ({ value }) => Boolean(value),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Tên dịch vụ",
      type: "string",
      validation: (rule) => [
        rule.required().error("Cần tên dịch vụ."),
        // Reuse the booking limit, including its Unicode counting and whitespace trimming.
        rule.custom((value) =>
          leadSchema.shape.treatment.safeParse(value).success
            ? true
            : "Tên dịch vụ không được dài quá 120 ký tự.",
        ),
      ],
    }),
    defineField({
      name: "shortTitle",
      title: "Tên ngắn trên thẻ chọn nhóm",
      description: "Bỏ trống để dùng tên dịch vụ.",
      type: "string",
    }),
    defineField({
      name: "summary",
      title: "Mô tả ngắn trên thẻ chọn nhóm",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().error("Cần mô tả ngắn trên thẻ chọn nhóm."),
    }),
    defineField({
      name: "body",
      title: "Nội dung",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required().error("Cần nội dung dịch vụ."),
    }),
    defineField({
      name: "bullets",
      title: "Ý chính",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "image",
      title: "Ảnh",
      description: "Bỏ trống để dùng ảnh mặc định của nhóm. Ảnh không được lộ mặt người.",
      type: "image",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) =>
            rule.custom((value, context) =>
              (context.parent as { asset?: unknown } | undefined)?.asset && !value
                ? "Cần alt text khi có ảnh."
                : true,
            ),
        }),
      ],
    }),
    defineField({
      name: "treatments",
      title: "Liệu pháp liên quan",
      description: "Hiện thành liên kết tới trang liệu pháp. Chỉ chọn được liệu pháp có slug.",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "treatment" }],
          options: { filter: "defined(slug.current)", disableNew: true },
        }),
      ],
      validation: (rule) => rule.unique().error("Không chọn cùng một liệu pháp nhiều lần."),
    }),
  ],
  preview: {
    select: { title: "title", group: "group", media: "image" },
    prepare: ({ title, group, media }) => ({
      title,
      subtitle: serviceGroupTitles[group as ServiceGroup],
      media,
    }),
  },
});
const servicesPage = defineType({
  name: "servicesPage",
  title: "Trang Dịch vụ",
  type: "document",
  fields: [
    defineField({
      name: "groups",
      title: "Ba nhóm dịch vụ",
      description:
        "Kéo để đổi thứ tự hiển thị. Phải đủ trị liệu, tập luyện, thư giãn, mỗi nhóm một lần.",
      type: "array",
      of: [defineArrayMember({ type: "serviceGroup" })],
      options: { disableActions: ["add", "addBefore", "addAfter", "remove", "duplicate"] },
      initialValue: serviceGroups.map((group) => ({ _type: "serviceGroup", group })),
      validation: (rule) =>
        rule.required().custom<Array<{ _key?: string; group?: string }>>(validateServiceGroups),
    }),
  ],
  preview: { prepare: () => ({ title: "Trang Dịch vụ" }) },
});
const methodGroupTitles: Record<MethodGroup, string> = {
  manual: "Trị liệu thủ công",
  electro: "Trị liệu bằng thiết bị",
  rehab: "Tập luyện phục hồi & tăng cường",
  cold: "Ngâm lạnh",
  infrared: "Đèn hồng ngoại",
};
const methodGroup = defineType({
  name: "methodGroup",
  title: "Nhóm phương pháp",
  type: "object",
  fields: [
    defineField({
      name: "group",
      title: "Nhóm",
      description: "Cố định sau khi tạo. Quyết định mục neo trên trang và liên kết ở chân trang.",
      type: "string",
      options: {
        list: methodGroups.map((value) => ({ value, title: methodGroupTitles[value] })),
        layout: "radio",
      },
      readOnly: ({ value }) => Boolean(value),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Tên phương pháp",
      type: "string",
      validation: (rule) => rule.required().error("Cần tên phương pháp."),
    }),
    defineField({
      name: "indexSubtitle",
      title: "Dòng phụ trên thẻ chọn nhóm",
      description: "Ví dụ: tình trạng thường gặp. Bỏ trống để ẩn dòng này.",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Nội dung",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required().error("Cần nội dung phương pháp."),
    }),
    defineField({
      name: "tags",
      title: "Nhãn tương thích giao diện cũ",
      description:
        "Nhãn tại lần chuyển sang bộ lọc, dành cho bản website cũ. Website hiện tại dùng Nhãn bộ lọc bên dưới; chỉnh bộ lọc không thay đổi trường lịch sử này.",
      readOnly: true,
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => [
        rule.max(5).error("Tối đa 5 nhãn."),
        rule.unique().error("Không lặp nhãn."),
        rule.custom((tags) =>
          (tags ?? []).every((t) => typeof t === "string" && t.trim() && t.trim().length <= 40)
            ? true
            : "Mỗi nhãn dài 1 đến 40 ký tự.",
        ),
      ],
    }),
    defineField({
      name: "filterTags",
      title: "Nhãn bộ lọc",
      description:
        "Chọn tình trạng hoặc mục tiêu liên quan đến nội dung nhóm. Không phải chỉ định điều trị. Nhãn chưa gắn vào nhóm nào sẽ chưa xuất hiện trong bộ lọc website.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { list: methodTags.map((tag) => ({ value: tag.id, title: tag.label })) },
      validation: (rule) => [
        rule.unique().error("Không lặp nhãn bộ lọc."),
        rule.max(methodTags.length).error(`Tối đa ${methodTags.length} nhãn bộ lọc.`),
        rule.custom(
          (values) =>
            (values ?? []).every((value) => methodTags.some((tag) => tag.id === value)) ||
            "Chọn nhãn từ danh mục bộ lọc.",
        ),
      ],
    }),
    defineField({
      name: "image",
      title: "Ảnh",
      description: "Bỏ trống để dùng ảnh mặc định của nhóm. Ảnh không được lộ mặt người.",
      type: "image",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) =>
            rule.custom((value, context) =>
              (context.parent as { asset?: unknown } | undefined)?.asset && !value
                ? "Cần alt text khi có ảnh."
                : true,
            ),
        }),
      ],
    }),
    defineField({
      name: "treatments",
      title: "Liệu pháp liên quan",
      description:
        "Hiện thành liên kết tới trang liệu pháp. Chỉ chọn được liệu pháp có slug. Một liệu pháp có thể xuất hiện ở hai nhóm khác nhau.",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "treatment" }],
          options: { filter: "defined(slug.current)", disableNew: true },
        }),
      ],
      validation: (rule) => rule.unique().error("Không chọn cùng một liệu pháp nhiều lần."),
    }),
  ],
  preview: {
    select: { title: "title", group: "group", media: "image" },
    prepare: ({ title, group, media }) => ({
      title,
      subtitle: methodGroupTitles[group as MethodGroup],
      media,
    }),
  },
});
const methodsPage = defineType({
  name: "methodsPage",
  title: "Trang Phương pháp",
  type: "document",
  fields: [
    defineField({
      name: "groups",
      title: "Năm nhóm phương pháp",
      description:
        "Thứ tự hiển thị cố định. Phải đủ trị liệu thủ công, trị liệu bằng thiết bị, tập luyện phục hồi & tăng cường, ngâm lạnh, đèn hồng ngoại, mỗi nhóm một lần.",
      type: "array",
      of: [defineArrayMember({ type: "methodGroup" })],
      options: {
        sortable: false,
        disableActions: ["add", "addBefore", "addAfter", "remove", "duplicate"],
      },
      initialValue: methodGroups.map((group) => ({ _type: "methodGroup", group })),
      validation: (rule) =>
        rule.required().custom<Array<{ _key?: string; group?: string }>>(validateMethodGroups),
    }),
  ],
  preview: { prepare: () => ({ title: "Trang Phương pháp" }) },
});
const treatment = defineType({
  name: "treatment",
  title: "Liệu pháp",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tên liệu pháp",
      type: "string",
      validation: (rule) => [
        rule.required(),
        // Reuse the booking limit: the title travels with the callback request.
        rule.custom((value) =>
          leadSchema.shape.treatment.safeParse(value).success
            ? true
            : "Tên liệu pháp không được dài quá 120 ký tự.",
        ),
      ],
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "shortDescription", title: "Mô tả ngắn", type: "text", rows: 3 }),
    defineField({ name: "description", title: "Mô tả chi tiết", type: "text", rows: 5 }),
    defineField({ name: "duration", title: "Thời lượng", type: "string" }),
    defineField({
      name: "price",
      title: "Giá (VNĐ)",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "isPopular",
      title: "Liệu pháp phổ biến",
      type: "boolean",
      initialValue: false,
    }),
    image,
    defineField({
      name: "benefits",
      title: "Lợi ích",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "protocols",
      title: "Quy trình thực hiện",
      type: "array",
      of: [defineArrayMember({ type: "protocolStep" })],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "shortDescription", media: "image" } },
});
const post = defineType({
  name: "post",
  title: "Bài viết",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tiêu đề",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "excerpt", title: "Tóm tắt", type: "text", rows: 3 }),
    defineField({ name: "category", title: "Chuyên mục", type: "string" }),
    defineField({ name: "publishedAt", title: "Ngày xuất bản", type: "datetime" }),
    image,
    defineField({ name: "body", title: "Nội dung", type: "text", rows: 10 }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "category", media: "image" } },
});
const testimonial = defineType({
  name: "testimonial",
  title: "Cảm nhận khách hàng",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Trích dẫn",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "context",
      title: "Bối cảnh khách hàng",
      description: "Ví dụ: “Vận động viên chuyên nghiệp”, hoặc mô tả ngắn về khách hàng",
      type: "string",
    }),
    defineField({
      name: "avatar",
      title: "Ảnh đại diện",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "rating",
      title: "Đánh giá (1-5 sao)",
      type: "number",
      validation: (rule) => rule.integer().min(1).max(5),
    }),
  ],
  preview: { select: { title: "context", subtitle: "quote", media: "avatar" } },
});
const faq = defineType({
  name: "faq",
  title: "Câu hỏi thường gặp",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Câu hỏi",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "answer", title: "Trả lời", type: "text", rows: 4 }),
    defineField({ name: "order", title: "Thứ tự", type: "number" }),
  ],
  orderings: [
    { name: "orderAsc", title: "Thứ tự hiển thị", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "question", subtitle: "order" } },
});
const siteSettings = defineType({
  name: "siteSettings",
  title: "Thiết lập website",
  type: "document",
  fields: [
    defineField({ name: "siteUrl", title: "Website URL", type: "url" }),
    defineField({ name: "contactPhone", title: "Số điện thoại", type: "string" }),
    defineField({ name: "contactEmail", title: "Email", type: "string" }),
    defineField({
      name: "locations",
      title: "Cơ sở",
      type: "array",
      of: [defineArrayMember({ type: "location" })],
    }),
    defineField({
      name: "socialMedia",
      title: "Mạng xã hội",
      type: "object",
      fields: [
        defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
        defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
        defineField({ name: "zalo", title: "Zalo ID", type: "string" }),
      ],
    }),
    defineField({ name: "seo", title: "SEO mặc định", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Thiết lập website" }) },
});

export const schemaTypes = [
  seo,
  protocolStep,
  location,
  siteSettings,
  serviceGroup,
  servicesPage,
  methodGroup,
  methodsPage,
  treatment,
  post,
  testimonial,
  faq,
];
