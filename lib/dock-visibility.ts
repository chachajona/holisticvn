// The bottom dock appears once the quick-facts strip has scrolled off the top, and goes away for
// good as the booking panel comes into reach (spec 4.3).
export function dockVisible({
  markerBottom,
  panelTop,
  viewportHeight,
}: {
  markerBottom: number;
  panelTop: number;
  viewportHeight: number;
}) {
  return markerBottom < 0 && panelTop > viewportHeight - 40;
}
