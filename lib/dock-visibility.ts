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

// Once the visitor has reached the form the dock stays away for the rest of the page's life, so
// scrolling back up does not bring it back. A page that loads already past the form counts too.
export function nextDockState(input: {
  reached: boolean;
  markerBottom: number;
  panelTop: number;
  viewportHeight: number;
}) {
  const reached = input.reached || input.panelTop <= input.viewportHeight - 40;
  return { reached, visible: !reached && dockVisible(input) };
}
