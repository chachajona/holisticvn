import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { createMetadata } from "@/lib/seo";
import { getPosts } from "@/lib/sanity";

export const metadata = createMetadata({ title: "Góc nhìn", description: "Kiến thức và góc nhìn về vận động, phục hồi và chăm sóc cơ thể.", path: "/blog" });
export const revalidate = 3600;
export default async function BlogPage() { const posts = await getPosts(); return <main id="main"><PageHero eyebrow="Góc nhìn" title="Khi bạn hiểu cơ thể, mọi lựa chọn đều rõ hơn." description="Những bài viết ngắn, thực tế về vận động, phục hồi và cách sống cùng một cơ thể khỏe mạnh." image="/images/Exercise.jpg" /><section className="section"><div className="shell blog-grid">{posts.map((post, index) => <article className={index === 0 ? "post-card post-card--featured" : "post-card"} key={post.slug}><span>{post.category} · {new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(new Date(post.publishedAt))}</span><h2 className="display">{post.title}</h2><p>{post.excerpt}</p><Link href={`/blog/${post.slug}`} className="text-link">Đọc bài viết <span>→</span></Link></article>)}</div></section></main>; }
