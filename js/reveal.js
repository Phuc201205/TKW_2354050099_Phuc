// ==================================================
// HIỆU ỨNG LỘ DẦN KHI CUỘN
// ==================================================

export function initReveal() {
  const items =
    document.querySelectorAll("[data-reveal]");


  if (items.length === 0) {
    return;
  }


  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  // Người dùng không muốn animation
  // thì hiển thị nội dung ngay lập tức.
  if (reduceMotion) {

    items.forEach((item) => {
      item.classList.add("is-visible");
    });

    return;
  }


  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }


          entry.target.classList.add(
            "is-visible"
          );


          // Chỉ animate một lần.
          observer.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: 0.15
      }
    );


  items.forEach((item) => {
    observer.observe(item);
  });
}