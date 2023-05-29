export function init(...callbacks: any[]) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      callbacks.forEach((callback) => callback);
    });
  } else {
    callbacks.forEach((callback) => callback);
  }
}
