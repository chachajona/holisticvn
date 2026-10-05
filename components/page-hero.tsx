import Image from "next/image";

export function PageHero({ eyebrow, title, description, image }: { eyebrow: string; title: string; description: string; image?: string }) {
  return <section className="page-hero"><div className="shell page-hero__grid"><div><p className="eyebrow">{eyebrow}</p><h1 className="display">{title}</h1><p>{description}</p></div>{image ? <div className="page-hero__image"><Image src={image} alt="" fill priority sizes="(max-width: 760px) 100vw, 45vw" /></div> : null}</div></section>;
}
