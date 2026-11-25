import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./SpaceIntro.css";

const VID_W = 1664;
const VID_H = 560;
const BTN = { x: 0.5, y: 0.8625, w: 0.26, h: 0.125 };
const SEAM = 0.373;
const SEAM_FROM = 17.6;
const READY_AT = 20.6;

export default function SpaceIntro({
  src = "/srujan-intro.mp4",
  poster = "/srujan-intro-poster.jpg",
  href = "#",
  onEnter,
  onFinish,
  fixed = true,
  className = "",
}) {
  const wrapRef = useRef(null);
  const vidRef = useRef(null);
  const [box, setBox] = useState(null);
  const [t, setT] = useState(0);
  const [muted, setMuted] = useState(true);
  const [ended, setEnded] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [contain, setContain] = useState(false);

  const layout = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const W = el.clientWidth, H = el.clientHeight;
    const useContain = W / H < 1.5;
    const scale = useContain ? Math.max((W / VID_W) * 1.7, 0) : Math.max(W / VID_W, H / VID_H);
    const w = VID_W * scale, h = VID_H * scale;
    setContain(useContain);
    setBox({ x: (W - w) / 2, y: (H - h) / 2, w, h });
  }, []);

  useLayoutEffect(() => {
    layout();
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(layout);
    ro.observe(el);
    return () => ro.disconnect();
  }, [layout]);

  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    const p = v.play();
    if (p?.catch) p.catch(() => setNeedsTap(true));
  }, []);

  const onMeta = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const v = vidRef.current;
      v.currentTime = Math.max(0, v.duration - 0.05);
    }
  };
  const toggleSound = () => {
    const v = vidRef.current;
    v.muted = !v.muted;
    setMuted(v.muted);
  };
  const skip = () => {
    const v = vidRef.current;
    v.currentTime = Math.max(0, v.duration - 0.05);
    v.play().catch(() => {});
  };
  const replay = () => {
    const v = vidRef.current;
    v.currentTime = 0;
    setEnded(false);
    v.play().catch(() => setNeedsTap(true));
  };
  const tapToPlay = () => {
    setNeedsTap(false);
    vidRef.current.play().catch(() => {});
  };

  const ready = ended || t >= READY_AT;
  const btnStyle = box && {
    left: box.x + box.w * (BTN.x - BTN.w / 2),
    top: box.y + box.h * (BTN.y - BTN.h / 2),
    width: box.w * BTN.w,
    height: box.h * BTN.h,
  };
  const clickEnter = (e) => {
    if (onEnter) {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <section
      ref={wrapRef}
      className={`si ${fixed ? "si--fixed" : ""} ${contain ? "si--contain" : ""} ${className}`}
      aria-label="Intro animation"
    >
      <video
        ref={vidRef}
        className="si__video"
        style={box ? { left: box.x, top: box.y, width: box.w, height: box.h } : undefined}
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={onMeta}
        onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
        onEnded={() => {
          setEnded(true);
          onFinish?.();
        }}
      />
      {box && (
        <div
          className={`si__seam ${t >= SEAM_FROM || ended ? "is-on" : ""}`}
          style={{ top: box.y + box.h * SEAM - box.h * 0.05, height: box.h * 0.1 }}
        />
      )}
      {box && (
        <a
          className={`si__cta ${ready ? "is-ready" : ""}`}
          style={btnStyle}
          href={href}
          onClick={clickEnter}
          tabIndex={ready ? 0 : -1}
          aria-label="Enter my portfolio"
        />
      )}
      {needsTap && <button className="si__tap" onClick={tapToPlay} aria-label="Play intro">▶</button>}
      <div className="si__ctl">
        {!ended && <button onClick={toggleSound}>{muted ? "SOUND ON" : "SOUND OFF"}</button>}
        {!ended && t < 20 && <button onClick={skip}>SKIP</button>}
        {ended && <button onClick={replay}>REPLAY</button>}
      </div>
    </section>
  );
}
