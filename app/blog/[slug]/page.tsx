import Link from "next/link";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import { getPosts } from "@/lib/sanity";

export async function generateStaticParams() {
  return (await getPosts()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = (await getPosts()).find((item) => item.slug === slug);
  return post
    ? createMetadata({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}` })
    : {};
}
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = (await getPosts()).find((item) => item.slug === slug);
  if (!post) notFound();
  return (
    <main id="main">
      <article className="article">
        <div className="shell article__head">
          <Link className="back-link back-link--dark" href="/blog">
            ← Góc nhìn
          </Link>
          <p className="eyebrow">{post.category}</p>
          <h1 className="display">{post.title}</h1>
          <p>{post.excerpt}</p>
          <time dateTime={post.publishedAt}>
            {new Intl.DateTimeFormat("vi-VN", { dateStyle: "long" }).format(
              new Date(post.publishedAt),
            )}
          </time>
        </div>
        <div className="article__body">
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <aside>
            Thông tin trong bài viết mang tính tham khảo, không thay thế cho tư vấn y tế cá nhân.
          </aside>
          <Link href="/booking" className="button">
            Trao đổi cùng HolisticVN <span>→</span>
          </Link>
        </div>
      </article>
    </main>
  );
}
