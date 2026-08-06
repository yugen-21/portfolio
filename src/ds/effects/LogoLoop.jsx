import React from "react";

const SMOOTH_TAU = 0.25;
const MIN_COPIES = 2;
const COPY_HEADROOM = 2;

const toCssLength = (v) => (typeof v === "number" ? `${v}px` : v ?? undefined);

export function LogoLoop({
  logos = [],
  speed = 120,
  direction = "left",
  width = "100%",
  logoHeight = 28,
  gap = 32,
  pauseOnHover,
  hoverSpeed,
  fadeOut = false,
  fadeOutColor = "var(--void)",
  scaleOnHover = false,
  labelOnHover = false,
  renderItem,
  ariaLabel = "Partner logos",
  className,
  style,
}) {
  const containerRef = React.useRef(null);
  const trackRef = React.useRef(null);
  const seqRef = React.useRef(null);

  const [seqWidth, setSeqWidth] = React.useState(0);
  const [seqHeight, setSeqHeight] = React.useState(0);
  const [copyCount, setCopyCount] = React.useState(MIN_COPIES);
  const [isHovered, setIsHovered] = React.useState(false);

  const effectiveHoverSpeed = React.useMemo(() => {
    if (hoverSpeed !== undefined) return hoverSpeed;
    if (pauseOnHover === true) return 0;
    if (pauseOnHover === false) return undefined;
    return 0;
  }, [hoverSpeed, pauseOnHover]);

  const isVertical = direction === "up" || direction === "down";

  const targetVelocity = React.useMemo(() => {
    const magnitude = Math.abs(speed);
    const dirMul = isVertical ? (direction === "up" ? 1 : -1) : direction === "left" ? 1 : -1;
    const speedMul = speed < 0 ? -1 : 1;
    return magnitude * dirMul * speedMul;
  }, [speed, direction, isVertical]);

  const updateDimensions = React.useCallback(() => {
    const containerWidth = containerRef.current ? containerRef.current.clientWidth : 0;
    const rect = seqRef.current && seqRef.current.getBoundingClientRect ? seqRef.current.getBoundingClientRect() : null;
    const sequenceWidth = rect ? rect.width : 0;
    const sequenceHeight = rect ? rect.height : 0;
    if (isVertical) {
      const parentHeight = containerRef.current && containerRef.current.parentElement ? containerRef.current.parentElement.clientHeight : 0;
      if (containerRef.current && parentHeight > 0) {
        const target = Math.ceil(parentHeight) + "px";
        if (containerRef.current.style.height !== target) containerRef.current.style.height = target;
      }
      if (sequenceHeight > 0) {
        setSeqHeight(Math.ceil(sequenceHeight));
        const viewport = (containerRef.current ? containerRef.current.clientHeight : 0) || parentHeight || sequenceHeight;
        setCopyCount(Math.max(MIN_COPIES, Math.ceil(viewport / sequenceHeight) + COPY_HEADROOM));
      }
    } else if (sequenceWidth > 0) {
      setSeqWidth(Math.ceil(sequenceWidth));
      setCopyCount(Math.max(MIN_COPIES, Math.ceil(containerWidth / sequenceWidth) + COPY_HEADROOM));
    }
  }, [isVertical]);

  React.useEffect(() => {
    if (!window.ResizeObserver) {
      const onResize = () => updateDimensions();
      window.addEventListener("resize", onResize);
      updateDimensions();
      return () => window.removeEventListener("resize", onResize);
    }
    const observers = [containerRef, seqRef].map((ref) => {
      if (!ref.current) return null;
      const o = new ResizeObserver(updateDimensions);
      o.observe(ref.current);
      return o;
    });
    updateDimensions();
    return () => observers.forEach((o) => o && o.disconnect());
  }, [updateDimensions, logos, gap, logoHeight, isVertical]);

  React.useEffect(() => {
    const images = seqRef.current ? seqRef.current.querySelectorAll("img") : [];
    if (!images.length) { updateDimensions(); return undefined; }
    let remaining = images.length;
    const onLoad = () => { remaining -= 1; if (remaining === 0) updateDimensions(); };
    images.forEach((img) => {
      if (img.complete) onLoad();
      else {
        img.addEventListener("load", onLoad, { once: true });
        img.addEventListener("error", onLoad, { once: true });
      }
    });
    return () => images.forEach((img) => { img.removeEventListener("load", onLoad); img.removeEventListener("error", onLoad); });
  }, [updateDimensions, logos, gap, logoHeight, isVertical]);

  const rafRef = React.useRef(null);
  const lastRef = React.useRef(null);
  const offsetRef = React.useRef(0);
  const velocityRef = React.useRef(0);

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seqSize = isVertical ? seqHeight : seqWidth;

    if (seqSize > 0) {
      offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize;
      track.style.transform = isVertical
        ? `translate3d(0, ${-offsetRef.current}px, 0)`
        : `translate3d(${-offsetRef.current}px, 0, 0)`;
    }
    if (prefersReduced) {
      track.style.transform = "translate3d(0, 0, 0)";
      return () => { lastRef.current = null; };
    }

    const animate = (t) => {
      if (lastRef.current === null) lastRef.current = t;
      const dt = Math.max(0, t - lastRef.current) / 1000;
      lastRef.current = t;
      const target = isHovered && effectiveHoverSpeed !== undefined ? effectiveHoverSpeed : targetVelocity;
      velocityRef.current += (target - velocityRef.current) * (1 - Math.exp(-dt / SMOOTH_TAU));
      if (seqSize > 0) {
        let next = offsetRef.current + velocityRef.current * dt;
        next = ((next % seqSize) + seqSize) % seqSize;
        offsetRef.current = next;
        track.style.transform = isVertical
          ? `translate3d(0, ${-next}px, 0)`
          : `translate3d(${-next}px, 0, 0)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastRef.current = null;
    };
  }, [targetVelocity, seqWidth, seqHeight, isHovered, effectiveHoverSpeed, isVertical]);

  const onEnter = () => { if (effectiveHoverSpeed !== undefined) setIsHovered(true); };
  const onLeave = () => { if (effectiveHoverSpeed !== undefined) setIsHovered(false); };

  const itemStyle = {
    flex: "none",
    fontSize: logoHeight + "px",
    lineHeight: 1,
    listStyle: "none",
    marginRight: isVertical ? 0 : gap + "px",
    marginBottom: isVertical ? gap + "px" : 0,
    overflow: scaleOnHover ? "visible" : undefined,
  };
  const mediaStyle = {
    height: logoHeight + "px",
    width: "auto",
    display: "block",
    objectFit: "contain",
    pointerEvents: "none",
    transition: scaleOnHover ? "transform 300ms cubic-bezier(0.4,0,0.2,1)" : undefined,
  };

  const LogoItem = ({ item }) => {
    const [hover, setHover] = React.useState(false);
    const scale = scaleOnHover && hover ? "scale(1.2)" : "scale(1)";
    const isNode = "node" in item;
    const content = isNode ? (
      <span style={{ display: "inline-flex", alignItems: "center", transform: scale, transition: mediaStyle.transition }} aria-hidden={!!item.href && !item.ariaLabel}>
        {item.node}
      </span>
    ) : (
      <img
        style={{ ...mediaStyle, transform: scale, filter: item.filter }}
        src={item.src} srcSet={item.srcSet} sizes={item.sizes}
        width={item.width} height={item.height}
        alt={item.alt || ""} title={labelOnHover ? undefined : item.title}
        loading="lazy" decoding="async" draggable={false}
      />
    );
    const label = isNode ? item.ariaLabel || item.title : item.alt || item.title;
    const inner = item.href ? (
      <a style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", opacity: hover ? 0.8 : 1, transition: "opacity 200ms linear" }}
        href={item.href} aria-label={label || "logo link"} target="_blank" rel="noreferrer noopener">{content}</a>
    ) : content;
    return (
      <li style={{ ...itemStyle, position: labelOnHover ? "relative" : undefined }} role="listitem" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        {inner}
        {labelOnHover && label && (
          <span aria-hidden="true" style={{
            position: "absolute", left: "50%", top: "calc(100% + 12px)", transform: `translateX(-50%) translateY(${hover ? "0" : "-4px"})`,
            whiteSpace: "nowrap", fontSize: "12px", fontWeight: 500, letterSpacing: "var(--track-neat)",
            color: "var(--text-accent)", opacity: hover ? 1 : 0, pointerEvents: "none",
            transition: "opacity 180ms ease, transform 180ms ease",
          }}>{label}</span>
        )}
      </li>
    );
  };

  const lists = Array.from({ length: copyCount }, (_, copyIndex) => (
    <ul
      key={"copy-" + copyIndex}
      role="list"
      aria-hidden={copyIndex > 0}
      ref={copyIndex === 0 ? seqRef : undefined}
      style={{ display: "flex", alignItems: "center", flexDirection: isVertical ? "column" : "row", margin: 0, padding: 0 }}
    >
      {logos.map((item, i) =>
        renderItem
          ? <li key={copyIndex + "-" + i} style={itemStyle} role="listitem">{renderItem(item, copyIndex + "-" + i)}</li>
          : <LogoItem key={copyIndex + "-" + i} item={item} />
      )}
    </ul>
  ));

  const fadeEdge = (side) => (
    <div aria-hidden="true" style={{
      pointerEvents: "none", position: "absolute", zIndex: 10,
      ...(isVertical
        ? { left: 0, right: 0, height: "clamp(24px,8%,120px)", [side]: 0,
            background: `linear-gradient(to ${side === "top" ? "bottom" : "top"}, ${fadeOutColor} 0%, rgba(0,0,0,0) 100%)` }
        : { top: 0, bottom: 0, width: "clamp(40px,10%,180px)", [side]: 0,
            background: `linear-gradient(to ${side === "left" ? "right" : "left"}, ${fadeOutColor} 0%, rgba(0,0,0,0) 100%)` }),
    }}></div>
  );

  return (
    <div
      ref={containerRef}
      className={className}
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: "relative",
        overflowX: isVertical ? undefined : "hidden",
        overflow: isVertical ? "hidden" : undefined,
        height: isVertical ? "100%" : undefined,
        display: isVertical ? "inline-block" : undefined,
        padding: labelOnHover ? `${logoHeight * 0.1}px 0 32px` : scaleOnHover ? `${logoHeight * 0.1}px 0` : undefined,
        width: isVertical ? (toCssLength(width) === "100%" ? undefined : toCssLength(width)) : toCssLength(width) || "100%",
        ...style,
      }}
    >
      {fadeOut && fadeEdge(isVertical ? "top" : "left")}
      {fadeOut && fadeEdge(isVertical ? "bottom" : "right")}
      <div
        ref={trackRef}
        style={{
          display: "flex", willChange: "transform", userSelect: "none", position: "relative", zIndex: 0,
          flexDirection: isVertical ? "column" : "row",
          width: isVertical ? "100%" : "max-content",
          height: isVertical ? "max-content" : undefined,
        }}
      >
        {lists}
      </div>
    </div>
  );
}
