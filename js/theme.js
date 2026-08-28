// ==================================================
// DARK MODE
// ==================================================

export function initTheme() {
  const toggle =
    document.querySelector("[data-theme-toggle]");


  if (!toggle) {
    return;
  }


  const icon =
    toggle.querySelector("[data-theme-icon]");


  function updateButton(dark) {
    toggle.setAttribute(
      "aria-checked",
      String(dark)
    );

    toggle.setAttribute(
      "aria-label",
      dark
        ? "Chuyển sang chế độ sáng"
        : "Chuyển sang chế độ tối"
    );


    if (icon) {
      icon.textContent =
        dark ? "☀" : "☾";
    }
  }


  function setTheme(dark) {
    document.documentElement.classList.toggle(
      "dark",
      dark
    );


    try {
      localStorage.setItem(
        "theme",
        dark ? "dark" : "light"
      );
    }
    catch {
      // Trình duyệt chặn localStorage
      // thì giao diện vẫn đổi bình thường.
    }


    updateButton(dark);
  }


  // Theme ban đầu đã được script trong <head> xử lý.
  const initialDark =
    document.documentElement.classList.contains(
      "dark"
    );


  updateButton(initialDark);


  toggle.addEventListener("click", () => {
    const currentlyDark =
      document.documentElement.classList.contains(
        "dark"
      );


    setTheme(!currentlyDark);
  });
}