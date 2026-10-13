"use client";

import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import type { MethodGroup } from "@/lib/content";
import { matchesMethodTags, methodTagLabel, methodTags, type MethodTagId } from "@/lib/method-tags";
import styles from "./treatments.module.css";

type TagCategory = (typeof methodTags)[number]["category"];
type Choice = Partial<Record<TagCategory, MethodTagId>>;

const categoryOf = (id: MethodTagId) => methodTags.find((tag) => tag.id === id)!.category;
// One choice per category (a select each); a tag in either slot counts, so results are the union.
const toggled = (choice: Choice, id: MethodTagId): Choice => ({
  ...choice,
  [categoryOf(id)]: choice[categoryOf(id)] === id ? undefined : id,
});

const FilterContext = createContext<{
  choice: Choice;
  toggle: (id: MethodTagId) => void;
  revealed: string | null;
}>({ choice: {}, toggle: () => {}, revealed: null });

function SelectionMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={styles.selectionMark}>
      <path
        d="m3 8 3 3 7-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const tagRows = [
  { category: "condition", label: "Khi bạn gặp" },
  { category: "goal", label: "Khi bạn muốn" },
] as const;

export function MethodTags({ ids }: { ids: MethodTagId[] }) {
  const { choice, toggle } = useContext(FilterContext);
  return ids.length ? (
    <div className={styles.methodTags}>
      {tagRows.map(({ category, label }) => {
        const rowIds = ids.filter((id) => categoryOf(id) === category);
        return rowIds.length ? (
          <div key={category} className={styles.tagRow} role="group" aria-label={label}>
            <span className={styles.tagRowLabel} aria-hidden="true">
              {label}
            </span>
            <div className={styles.tagPills}>
              {rowIds.map((id) => (
                <button
                  type="button"
                  key={id}
                  aria-pressed={choice[category] === id}
                  onClick={() => {
                    const next = Object.values(toggled(choice, id));
                    toggle(id);
                    // If this section disappears, keep keyboard focus on the corresponding filter.
                    if (!matchesMethodTags(ids, next))
                      document
                        .getElementById(`method-filter-${category}`)
                        ?.focus({ preventScroll: true });
                  }}
                >
                  <SelectionMark />
                  {methodTagLabel(id)}
                </button>
              ))}
            </div>
          </div>
        ) : null;
      })}
    </div>
  ) : null;
}

// On narrow screens a method is a collapsed row (thumbnail, title, subtitle) that opens on demand;
// from 701px up the CSS ignores the state and shows everything.
export function MethodArticle({
  id,
  title,
  media,
  head,
  children,
}: {
  id: string;
  title: string;
  media: ReactNode;
  head: ReactNode;
  children: ReactNode;
}) {
  const { choice, revealed } = useContext(FilterContext);
  const selection = Object.values(choice).join();
  const [toggledOpen, setToggledOpen] = useState<{ selection: string; open: boolean } | null>(null);
  // An active filter or a footer link opens its rows; a tap on the row always wins afterwards.
  const open =
    toggledOpen?.selection === selection ? toggledOpen.open : Boolean(selection) || revealed === id;
  return (
    <article className={styles.method} id={id} tabIndex={-1} data-open={open || undefined}>
      {media}
      <div className={styles.methodHead}>{head}</div>
      <button
        type="button"
        className={styles.methodToggle}
        aria-expanded={open}
        aria-controls={`${id}-body`}
        aria-label={title}
        onClick={() => setToggledOpen({ selection, open: !open })}
      />
      <div className={styles.methodBody} id={`${id}-body`}>
        <div className={styles.methodBodyInner}>{children}</div>
      </div>
    </article>
  );
}

type ExplorerItem = {
  group: MethodGroup;
  stage: string;
  anchor: string;
  filterTags: MethodTagId[];
  content: ReactNode;
};

export function MethodsExplorer({
  items,
  stages,
}: {
  items: ExplorerItem[];
  stages: { id: string; title: string }[];
}) {
  const [choice, setChoiceState] = useState<Choice>({});
  // Results only animate in after the visitor has changed the filter, never on first paint.
  const [touched, setTouched] = useState(false);
  const setChoice = useCallback((next: Choice | ((current: Choice) => Choice)) => {
    setTouched(true);
    setChoiceState(next);
  }, []);
  const selected = useMemo(
    () => Object.values(choice).filter((id): id is MethodTagId => Boolean(id)),
    [choice],
  );
  const toggle = useCallback(
    (id: MethodTagId) => setChoice((current) => toggled(current, id)),
    [setChoice],
  );
  const stagesRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState<string | null>(null);
  const context = useMemo(() => ({ choice, toggle, revealed }), [choice, toggle, revealed]);
  const availableTags = methodTags.filter((tag) =>
    items.some((item) => item.filterTags.includes(tag.id)),
  );
  const visible = items.filter((item) => matchesMethodTags(item.filterTags, selected));
  const statusText = selected.length
    ? `${visible.length} phương pháp`
    : `Đang hiển thị ${visible.length} phương pháp`;

  const reveal = useCallback(
    (anchor: string) => {
      // Rows that close as the filter clears must not animate under the scroll: it would stop short.
      stagesRef.current?.setAttribute("data-jump", "");
      setChoice({});
      setRevealed(anchor);
      requestAnimationFrame(() => {
        const target = document.getElementById(anchor);
        target?.scrollIntoView();
        target?.focus({ preventScroll: true });
        // Arrival cue (CSS, motion-safe only); removing it first replays it on a repeat visit.
        target?.removeAttribute("data-arrived");
        void target?.offsetWidth;
        target?.setAttribute("data-arrived", "");
        requestAnimationFrame(() => stagesRef.current?.removeAttribute("data-jump"));
      });
    },
    [setChoice],
  );

  const revealHash = useCallback(() => {
    const item = items.find((item) => `#${item.anchor}` === window.location.hash);
    if (item) reveal(item.anchor);
  }, [items, reveal]);

  // Arriving with a #mtd-… already in the URL (a footer link from another page) opens and marks
  // that method too; the listeners below only see jumps made while the page is already open.
  const arrivedByHash = useRef(false);
  useEffect(() => {
    if (arrivedByHash.current) return;
    arrivedByHash.current = true;
    revealHash();
  }, [revealHash]);

  useEffect(() => {
    const onHashChange = revealHash;
    const onAnchorClick = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      )
        return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        url.search !== window.location.search
      )
        return;
      const item = items.find((item) => `#${item.anchor}` === url.hash);
      if (!item) return;
      event.preventDefault();
      if (window.location.hash !== url.hash) window.history.pushState(null, "", url.hash);
      reveal(item.anchor);
    };
    window.addEventListener("hashchange", onHashChange);
    // Capture before Next Link handles footer fragments, including the same current hash.
    document.addEventListener("click", onAnchorClick, true);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onAnchorClick, true);
    };
  }, [items, reveal, revealHash]);

  return (
    <FilterContext value={context}>
      <section className={styles.finder} aria-label="Lọc phương pháp">
        <p className={styles.sentence}>
          {(["condition", "goal"] as const).map((category) => {
            const tags = availableTags.filter((tag) => tag.category === category);
            return tags.length ? (
              <Fragment key={category}>
                {category === "condition" ? "Tôi đang gặp " : " và\u00a0muốn "}
                <span className={styles.field}>
                  <select
                    id={`method-filter-${category}`}
                    aria-label={
                      category === "condition" ? "Tình trạng của bạn" : "Mục tiêu của bạn"
                    }
                    data-empty={!choice[category] || undefined}
                    value={choice[category] ?? ""}
                    onChange={(event) =>
                      setChoice((current) => ({
                        ...current,
                        [category]: event.target.value || undefined,
                      }))
                    }
                  >
                    <option value="">
                      {category === "condition" ? "vấn đề nào" : "cải thiện điều gì"}
                    </option>
                    {tags.map((tag) => (
                      <option key={tag.id} value={tag.id}>
                        {tag.label.toLocaleLowerCase("vi")}
                      </option>
                    ))}
                  </select>
                  {choice[category] ? (
                    <button
                      type="button"
                      className={styles.clearValue}
                      aria-label={`Bỏ ${methodTagLabel(choice[category]!).toLocaleLowerCase("vi")}`}
                      onClick={() => {
                        setChoice((current) => ({ ...current, [category]: undefined }));
                        // The button unmounts; keep keyboard focus on its select.
                        document.getElementById(`method-filter-${category}`)?.focus();
                      }}
                    >
                      <svg aria-hidden="true" viewBox="0 0 16 16">
                        <path
                          d="m4.5 4.5 7 7m0-7-7 7"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  ) : null}
                </span>
              </Fragment>
            ) : null;
          })}
        </p>
        <div className={styles.finderStatus}>
          <p
            role="status"
            aria-live="polite"
            aria-atomic="true"
            data-idle={!selected.length || undefined}
          >
            {/* The span is keyed on its text so a changed count replays status-in; the live region itself stays mounted. */}
            <span key={statusText}>{statusText}</span>
          </p>
        </div>
      </section>

      <div ref={stagesRef} className={styles.stages} data-touched={touched || undefined}>
        {stages.map((stage) => {
          const stageItems = items.filter((item) => item.stage === stage.id);
          return (
            <section
              key={stage.id}
              className={styles.stage}
              aria-labelledby={`stage-${stage.id}`}
              hidden={!stageItems.some((item) => matchesMethodTags(item.filterTags, selected))}
            >
              <h2 id={`stage-${stage.id}`}>{stage.title}</h2>
              <div className={styles.stageMethods}>
                {stageItems.map((item) => (
                  <div
                    key={item.group}
                    hidden={!matchesMethodTags(item.filterTags, selected)}
                    className={styles.filteredMethod}
                  >
                    {item.content}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
        {!visible.length ? (
          <div className={styles.emptyResults}>
            <h2>Chưa có phương pháp được gắn với lựa chọn này.</h2>
            <p>Bạn có thể xóa bộ lọc hoặc đặt buổi đánh giá để trao đổi với Holistic.</p>
            <button type="button" onClick={() => setChoice({})} className={styles.primaryButton}>
              Xóa bộ lọc
            </button>
            <Link href="/booking" className={styles.outlineButton}>
              Đặt lịch đánh giá ban đầu
            </Link>
          </div>
        ) : null}
      </div>
    </FilterContext>
  );
}
