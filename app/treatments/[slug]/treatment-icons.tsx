import styles from "./treatment-page.module.css";

const outline = {
  className: styles.icon,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function ArrowIcon() {
  return (
    <svg {...outline}>
      <path d="M4 12h15m-6-6 6 6-6 6" />
    </svg>
  );
}

export function ChevronIcon() {
  return (
    <svg {...outline}>
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg {...outline}>
      <path d="m7 3 3 5-2 2a13 13 0 0 0 6 6l2-2 5 3-1 4C10 23 1 14 3 4Z" />
    </svg>
  );
}
