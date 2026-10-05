import Image from "next/image";

export type QuickLinkIllustrationType = "services" | "methods" | "about";

// Original editorial illustrations generated for HolisticVN. Prompts and
// visual references are recorded in docs/quick-link-illustrations-v3.md.
export function QuickLinkIllustration({ type }: { type: QuickLinkIllustrationType }) {
  return (
    <Image
      src={`/images/quick-links/${type}-editorial-v3.webp`}
      alt=""
      width={512}
      height={512}
      sizes="(max-width: 980px) 64px, 72px"
    />
  );
}
