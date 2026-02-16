export function getViewportSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function getDocumentSize() {
  return {
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  };
}

export function getScrollPosition() {
  return {
    x: window.scrollX || document.documentElement.scrollLeft,
    y: window.scrollY || document.documentElement.scrollTop,
  };
}

export function toViewportPercent(x) {
  return (x / window.innerWidth) * 100;
}

export function toPixelPosition(x) {
  return (x / 100) * window.innerWidth;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function isElementVisible(element) {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);

  return (
    rect.width > 0 &&
    rect.height > 0 &&
    style.visibility !== "hidden" &&
    style.display !== "none" &&
    style.opacity !== "0"
  );
}

export function isElementInViewport(element) {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  const viewport = getViewportSize();

  return (
    rect.top < viewport.height &&
    rect.bottom > 0 &&
    rect.left < viewport.width &&
    rect.right > 0
  );
}

export function createOverlay() {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999998;
    pointer-events: none;
  `;
  return overlay;
}

export function pauseAnimations() {
  const style = document.createElement("style");
  style.id = "vue-agentation-pause-animations";
  style.textContent = `
    *, *::before, *::after {
      animation-play-state: paused !important;
      transition-duration: 0s !important;
    }
  `;
  document.head.appendChild(style);

  document.querySelectorAll("video, audio").forEach((el) => {
    try {
      if (typeof el.pause === "function") {
        el.dataset.agentationPaused = "true";
        el.pause();
      }
    } catch {
      // Ignore errors from unsupported media types
    }
  });
}

export function resumeAnimations() {
  const style = document.getElementById("vue-agentation-pause-animations");
  if (style) {
    style.remove();
  }

  document.querySelectorAll("[data-agentation-paused]").forEach((el) => {
    el.play();
    delete el.dataset.agentationPaused;
  });
}

export function isInIframe() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function preventDefault(e) {
  e.preventDefault();
  e.stopPropagation();
}

export function getRelativePosition(element, event) {
  const rect = element.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}
