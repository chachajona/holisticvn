"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Link from "next/link";
import type { MethodGroup } from "@/lib/content";
import { matchesMethodTags, methodTagLabel, methodTags, type MethodTagId } from "@/lib/method-tags";
import styles from "./treatments.module.css";

const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;
const FilterContext = createContext<{
  selected: MethodTagId[];
  toggle: (id: MethodTagId) => void;
  recoverFocus: (id: string) => void;
  ready: boolean;
}>({ selected: [], toggle: () => {}, recoverFocus: () => {}, ready: false });

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

export function MethodTags({ ids }: { ids: MethodTagId[] }) {
  const { selected, toggle, recoverFocus, ready } = useContext(FilterContext);
  return ids.length ? (
    <div className={styles.methodTags}>
      {ids.map((id) => (
        <button
          type="button"
          disabled={!ready}
          key={id}
          aria-pressed={selected.includes(id)}
          onClick={() => {
            const next = selected.includes(id)
              ? selected.filter((value) => value !== id)
              : [...selected, id];
            toggle(id);
            // If this section disappears, keep keyboard focus on the corresponding filter.
            if (!matchesMethodTags(ids, next)) recoverFocus(`method-filter-${id}`);
          }}
        >
          <SelectionMark />
          {methodTagLabel(id)}
        </button>
      ))}
    </div>
  ) : null;
}

type ExplorerItem = {
  group: MethodGroup;
  anchor: string;
  title: string;
  indexSubtitle: string;
  filterTags: MethodTagId[];
  content: ReactNode;
};

export function MethodsExplorer({ items }: { items: ExplorerItem[] }) {
  const [selected, setSelected] = useState<MethodTagId[]>([]);
  const [destination, setDestination] = useState<{ anchor: string; center?: boolean } | null>(null);
  const recoverFocus = useCallback(
    (id: string) => setDestination({ anchor: id, center: true }),
    [],
  );
  const ready = useSyncExternalStore(subscribeToHydration, getClientSnapshot, getServerSnapshot);
  const toggle = useCallback(
    (id: MethodTagId) =>
      setSelected((current) =>
        current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
      ),
    [],
  );
  const context = useMemo(
    () => ({ selected, toggle, recoverFocus, ready }),
    [selected, toggle, recoverFocus, ready],
  );
  const availableTags = methodTags.filter((tag) =>
    items.some((item) => item.filterTags.includes(tag.id)),
  );
  const visible = items.filter((item) => matchesMethodTags(item.filterTags, selected));

  const reveal = useCallback((anchor: string) => {
    setSelected([]);
    setDestination({ anchor });
  }, []);

  // Visibility has committed before scrolling; no delayed callback can survive unmount.
  useLayoutEffect(() => {
    if (!destination) return;
    const target = document.getElementById(destination.anchor);
    target?.scrollIntoView(
      destination.center ? { block: "center", behavior: "instant" } : undefined,
    );
    target?.focus({ preventScroll: true });
  }, [destination]);

  useEffect(() => {
    const onHashChange = () => {
      const item = items.find((item) => `#${item.anchor}` === window.location.hash);
      if (item) reveal(item.anchor);
    };
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
  }, [items, reveal]);

  return (
    <FilterContext value={context}>
      <section className={styles.filters} aria-labelledby="method-filter-heading">
        <h2 id="method-filter-heading" tabIndex={-1}>
          {availableTags.length
            ? "Bạn đang gặp vấn đề gì hoặc muốn cải thiện điều gì?"
            : "Khám phá các phương pháp tại Holistic"}
        </h2>
        <p>
          {availableTags.length
            ? "Chọn một hoặc nhiều mục. Kết quả liên quan đến ít nhất một mục bạn chọn. Chuyên viên sẽ cùng bạn lựa chọn phương pháp qua buổi đánh giá."
            : "Bạn có thể xem các phương pháp bên dưới hoặc đặt lịch đánh giá ban đầu để trao đổi cùng chuyên viên."}
        </p>
        <div className={styles.filterCategories}>
          {(["condition", "goal"] as const).map((category) => {
            const tags = availableTags.filter((tag) => tag.category === category);
            return tags.length ? (
              <fieldset key={category} className={styles.filterCategory}>
                <legend>
                  {category === "condition" ? "Tình trạng của bạn" : "Mục tiêu của bạn"}
                </legend>
                <div className={styles.filterChoices}>
                  {tags.map((tag) => (
                    <button
                      type="button"
                      disabled={!ready}
                      key={tag.id}
                      id={`method-filter-${tag.id}`}
                      aria-pressed={selected.includes(tag.id)}
                      onClick={() => toggle(tag.id)}
                    >
                      <SelectionMark />
                      {tag.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : null;
          })}
        </div>
        <div className={styles.filterResult}>
          <p role="status" aria-live="polite" aria-atomic="true">
            Đang hiển thị {visible.length} phương pháp
          </p>
          {availableTags.length || selected.length ? (
            <button
              type="button"
              onClick={() => {
                if (!availableTags.length) recoverFocus("method-filter-heading");
                setSelected([]);
              }}
              disabled={!ready || !selected.length}
            >
              Xóa bộ lọc
            </button>
          ) : null}
        </div>
        {selected.length ? (
          <p className={styles.selectedFilters}>
            Đang chọn: {selected.map(methodTagLabel).join(" · ")}
          </p>
        ) : null}
      </section>

      <nav className={styles.index} aria-label="Các phương pháp">
        <div className={styles.indexHead}>
          <span>Các phương pháp</span>
          <i />
        </div>
        {selected.length ? (
          <p className={styles.indexHint}>
            Đây là mục lục đầy đủ. Chọn một nhóm để xóa bộ lọc và xem lại tất cả phương pháp.
          </p>
        ) : null}
        <div className={styles.indexGrid}>
          {items.map((item, i) => (
            <a href={`#${item.anchor}`} key={item.group} className={styles.indexCard}>
              <span className={styles.indexNumeral}>{String(i + 1).padStart(2, "0")}</span>
              <strong>{item.title}</strong>
              {item.indexSubtitle ? <span>{item.indexSubtitle}</span> : null}
            </a>
          ))}
        </div>
      </nav>

      <div className={styles.timeline}>
        {items.map((item) => (
          <div
            key={item.group}
            hidden={!matchesMethodTags(item.filterTags, selected)}
            className={styles.filteredMethod}
          >
            {item.content}
          </div>
        ))}
        {!visible.length ? (
          <div className={styles.emptyResults}>
            <h2>Chưa có phương pháp được gắn với lựa chọn này.</h2>
            <p>Bạn có thể xóa bộ lọc hoặc đặt buổi đánh giá để trao đổi với Holistic.</p>
            <button
              type="button"
              onClick={() => {
                recoverFocus("method-filter-heading");
                setSelected([]);
              }}
              className={styles.primaryButton}
            >
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
