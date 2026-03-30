import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    const scrollEl = document.scrollingElement ?? document.documentElement;

    // 1) Immediate (covers most cases)
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    scrollEl.scrollTop = 0;

    // 2) Next frame (covers route transitions / late layout)
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      scrollEl.scrollTop = 0;
    });

    // 3) Microtask + small delay (covers async renders / images popping in)
    queueMicrotask(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      scrollEl.scrollTop = 0;
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        scrollEl.scrollTop = 0;
      }, 50);
    });
  }, [location.pathname, location.search, location.hash]);

  return null;
}

