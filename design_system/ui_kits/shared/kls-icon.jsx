// kls-icon.jsx — Single shared icon component for all Kilsar PNG icons.
// Uses CSS mask trick so token-color recoloring works on any glyph.
//
// Usage:
//   <KlsIcon name="bell" size={24} color="var(--kls-on-surface)" />
//   <KlsIcon name="tabs/home" size={32} color="var(--kls-on-surface)" />
//   <KlsIcon path="../../assets/icons/tabs/home.png" size={32} />     // explicit path
//
// `name` resolves to the project root: assets/icons/<name>.png
// `path` overrides with a literal URL (for nested calls / overrides)
//
// `rotate` accepts 0/90/180/270 — handy because we only ship chevronDown
// and chevronRight in the asset set.

const KLS_ICON_BASE = (typeof window !== "undefined" && window.KLS_ICON_BASE) || "/assets/icons";

function KlsIcon({ name, path, size = 24, color = "currentColor", rotate = 0, style = {} }) {
  const url = path || `${KLS_ICON_BASE}/${name}.png`;
  const transform = rotate ? `rotate(${rotate}deg)` : undefined;
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMask: `url("${url}") center/contain no-repeat`,
        mask: `url("${url}") center/contain no-repeat`,
        transform,
        flex: "none",
        ...style,
      }}
    />
  );
}

// also expose plain-image variant (when you need the original colored PNG, not a mask)
function KlsImage({ name, path, size, width, height, alt = "", style = {} }) {
  const url = path || `${KLS_ICON_BASE}/${name}.png`;
  return (
    <img
      src={url}
      alt={alt}
      style={{
        width: width || size,
        height: height || size,
        flex: "none",
        ...style,
      }}
    />
  );
}
