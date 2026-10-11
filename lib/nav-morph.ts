// Desktop nav bar → pill morph, scrubbed by scroll. 0 = full-width bar, 1 = pill, smoothstepped so
// both ends settle softly. With reduced motion it snaps at the midpoint instead of animating.
export function navMorphProgress(
  scrollY: number,
  start: number,
  range: number,
  reduceMotion: boolean,
) {
  const t = Math.min(1, Math.max(0, (scrollY - start) / range));
  return reduceMotion ? Math.round(t) : t * t * (3 - 2 * t);
}
