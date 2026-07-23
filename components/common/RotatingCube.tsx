/**
 * A continuously tumbling 3D cube built from plain CSS 3D transforms
 * (no images/GIFs, so it costs ~nothing to load and never gets pixelated).
 * Colored with the site's own emerald / gold / violet palette so it reads as
 * a brand mark rather than a generic stock animation.
 */
export function RotatingCube() {
  return (
    <div className="hero-cube-scene" aria-hidden>
      <div className="hero-cube">
        <div className="hero-cube-face hero-cube-face--front" />
        <div className="hero-cube-face hero-cube-face--back" />
        <div className="hero-cube-face hero-cube-face--right" />
        <div className="hero-cube-face hero-cube-face--left" />
        <div className="hero-cube-face hero-cube-face--top" />
        <div className="hero-cube-face hero-cube-face--bottom" />
      </div>
    </div>
  );
}
