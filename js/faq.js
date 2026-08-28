// ==================================================
// ACCORDION FAQ
// ==================================================

export function initFaq() {
  const roots =
    document.querySelectorAll("[data-faq]");


  if (roots.length === 0) {
    return;
  }


  roots.forEach((root) => {

    const triggers =
      root.querySelectorAll("[data-faq-trigger]");


    function setOpen(trigger, open) {
      const panelId =
        trigger.getAttribute("aria-controls");


      if (!panelId) {
        return;
      }


      const panel =
        document.getElementById(panelId);


      if (!panel) {
        return;
      }


      trigger.setAttribute(
        "aria-expanded",
        String(open)
      );


      panel.classList.toggle(
        "hidden",
        !open
      );


      const icon =
        trigger.querySelector("[data-faq-icon]");


      if (icon) {
        icon.textContent =
          open ? "−" : "+";
      }
    }


    // Event delegation:
    // chỉ một listener cho cả nhóm FAQ.
    root.addEventListener("click", (event) => {

      const trigger =
        event.target.closest("[data-faq-trigger]");


      if (!trigger) {
        return;
      }


      if (!root.contains(trigger)) {
        return;
      }


      const willOpen =
        trigger.getAttribute("aria-expanded")
          !== "true";


      // Đóng tất cả
      triggers.forEach((item) => {
        setOpen(item, false);
      });


      // Sau đó mở đúng mục vừa bấm
      if (willOpen) {
        setOpen(trigger, true);
      }
    });

  });
}