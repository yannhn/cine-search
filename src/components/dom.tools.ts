export function init(...callbacks: any[]) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      callbacks.forEach((callback) => callback);
    });
  } else {
    callbacks.forEach((callback) => callback);
  }
}

export function handleMobileMenu() {
  const hamburgerButton = document.querySelector(
    ".hamburger-button"
  ) as HTMLElement;
  const closeHamburgerMenu = document.querySelector(
    ".close-mobile-menu"
  ) as HTMLElement;
  const mobileMenu = document.querySelector(".mobile-menu") as HTMLElement;
  const header = document.querySelector("header") as HTMLElement;

  hamburgerButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    document.body.classList.add("h-full");
    document.body.classList.add("overflow-hidden");
    header.classList.remove("sticky");
    header.classList.remove("top-0");
  });

  closeHamburgerMenu.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    document.body.classList.remove("h-full");
    document.body.classList.remove("overflow-hidden");
    header.classList.add("sticky");
    header.classList.add("top-0");
  });
}
