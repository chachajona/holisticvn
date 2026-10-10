import Image from "next/image";
import { getInstagramPosts } from "@/lib/instagram";
import styles from "@/app/page.module.css";

export function InstagramFallback({ images }: { images: string[] }) {
  return (
    <div className={styles.igGrid}>
      {images.map((src, i) => (
        <div className={styles.igItem} key={src + i}>
          <Image src={src} alt="" fill sizes="(max-width: 700px) 45vw, 250px" />
        </div>
      ))}
    </div>
  );
}

// This server component suspends independently of the homepage's main content.
export async function InstagramFeed({ fallbackImages }: { fallbackImages: string[] }) {
  const posts = await getInstagramPosts();
  if (posts === null) return <InstagramFallback images={fallbackImages} />;
  return (
    <div className={styles.igGrid}>
      {posts.map((post) => (
        <a
          className={styles.igItem}
          key={post.id}
          href={post.href}
          aria-label={`Xem bài Instagram ngày ${new Date(post.timestamp).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}`}
        >
          <Image src={post.image} alt="" fill sizes="(max-width: 700px) 45vw, 250px" />
        </a>
      ))}
    </div>
  );
}
