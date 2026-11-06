import { useEffect, useRef, useState } from "react";
export default function Video({ videoId, children }) {
  const frame = useRef(null),
    [enabled, setEnabled] = useState(false),
    [paused, setPaused] = useState(false),
    [muted, setMuted] = useState(true);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  function command(func) {
    frame.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "https://www.youtube.com",
    );
  }
  return (
    <section className="video-hero">
      {enabled && /^[\w-]{11}$/.test(videoId) && (
        <iframe
          ref={frame}
          title="Nekosero venue video"
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}`}
          allow="autoplay; encrypted-media"
          tabIndex={-1}
        />
      )}
      {children}
      {enabled && (
        <div className="video-controls">
          <button
            className="button"
            onClick={() => {
              command(paused ? "playVideo" : "pauseVideo");
              setPaused(!paused);
            }}
          >
            {paused ? "Play" : "Pause"} video
          </button>
          <button
            className="button"
            onClick={() => {
              command(muted ? "unMute" : "mute");
              setMuted(!muted);
            }}
          >
            {muted ? "Unmute" : "Mute"}
          </button>
        </div>
      )}
    </section>
  );
}
