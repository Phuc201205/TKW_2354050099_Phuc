// ==================================================
// MENU MOBILE
// ==================================================

export function initNav() {
  const header = document.querySelector("[data-site-header]");

  if (!header) {
    return;
  }


  const toggle = header.querySelector("[data-nav-toggle]");
  const menu = header.querySelector("[data-mobile-menu]");

  if (!toggle || !menu) {
    return;
  }


  // Mở hoặc đóng menu mobile
  function setOpen(open) {
    menu.classList.toggle("hidden", !open);

    toggle.setAttribute(
      "aria-expanded",
      String(open)
    );

    toggle.setAttribute(
      "aria-label",
      open ? "Đóng menu" : "Mở menu"
    );

    document.body.classList.toggle(
      "overflow-hidden",
      open
    );
  }


  // Nhấn nút hamburger
  toggle.addEventListener("click", () => {
    const isOpen =
      toggle.getAttribute("aria-expanded") === "true";

    setOpen(!isOpen);
  });


  // Khi bấm vào một link trong menu thì đóng menu
  menu.addEventListener("click", (event) => {
    const link = event.target.closest("a");

    if (!link) {
      return;
    }

    setOpen(false);
  });


  // Nhấn ESC để đóng menu
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    const isOpen =
      toggle.getAttribute("aria-expanded") === "true";

    if (!isOpen) {
      return;
    }

    setOpen(false);

    // Trả focus về nút hamburger
    toggle.focus();
  });


  // Bấm ra ngoài header thì đóng menu
  document.addEventListener("click", (event) => {
    const isOpen =
      toggle.getAttribute("aria-expanded") === "true";

    if (!isOpen) {
      return;
    }

    if (!header.contains(event.target)) {
      setOpen(false);
    }
  });


  // Khi màn hình chuyển lên desktop thì đóng menu mobile
  const desktopMedia =
    window.matchMedia("(min-width: 1024px)");


  function handleDesktop(event) {
    if (event.matches) {
      setOpen(false);
    }
  }


  desktopMedia.addEventListener(
    "change",
    handleDesktop
  );
}



// ==================================================
// NAVBAR KHI CUỘN
// ==================================================

export function initHeaderOnScroll() {
  const header =
    document.querySelector("[data-site-header]");

  const sentinel =
    document.getElementById("nav-sentinel");


  if (!header || !sentinel) {
    return;
  }


  const observer =
    new IntersectionObserver(([entry]) => {
      const scrolled = !entry.isIntersecting;

      header.classList.toggle(
        "shadow-sm",
        scrolled
      );
    });


  observer.observe(sentinel);
}



// ==================================================
// NÚT LÊN ĐẦU TRANG
// ==================================================

export function initToTop() {
  const button =
    document.querySelector("[data-to-top]");


  if (!button) {
    return;
  }


  function updateButton() {
    const shouldShow =
      window.scrollY > 400;

    button.classList.toggle(
      "hidden",
      !shouldShow
    );
  }


  window.addEventListener(
    "scroll",
    updateButton,
    {
      passive: true
    }
  );


  button.addEventListener("click", () => {
    const reduceMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;


    window.scrollTo({
      top: 0,
      behavior: reduceMotion
        ? "auto"
        : "smooth"
    });
  });


  // Kiểm tra ngay khi tải trang
  updateButton();
}