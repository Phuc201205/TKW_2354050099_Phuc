// ==================================================
// SLIDER CẢM NHẬN KHÁCH HÀNG
// ==================================================

export function initSlider() {
  const root =
    document.querySelector("[data-slider]");


  if (!root) {
    return;
  }


  const track =
    root.querySelector("[data-slider-track]");

  const slides =
    Array.from(
      root.querySelectorAll("[data-slide]")
    );

  const prevButton =
    root.querySelector("[data-slider-prev]");

  const nextButton =
    root.querySelector("[data-slider-next]");

  const dotsContainer =
    root.querySelector("[data-slider-dots]");


  if (
    !track ||
    slides.length === 0 ||
    !prevButton ||
    !nextButton ||
    !dotsContainer
  ) {
    return;
  }


  let index = 0;
  let timer = null;

  const dots = [];


  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;



  // ==================================================
  // TẠO DOT TỰ ĐỘNG
  // ==================================================

  slides.forEach((slide, slideIndex) => {

    const dot =
      document.createElement("button");


    dot.type = "button";

    dot.className =
      "slider-dot";


    dot.setAttribute(
      "aria-label",
      `Đi đến cảm nhận ${slideIndex + 1}`
    );


    dot.addEventListener("click", () => {
      go(slideIndex);
    });


    dotsContainer.appendChild(dot);

    dots.push(dot);
  });



  // ==================================================
  // CHUYỂN SLIDE
  // ==================================================

  function go(next) {

    index =
      (next + slides.length)
      % slides.length;


    track.style.transform =
      `translateX(-${index * 100}%)`;


    slides.forEach((slide, slideIndex) => {

      const hidden =
        slideIndex !== index;


      // Slide ẩn không được nhận focus bằng Tab.
      slide.toggleAttribute(
        "inert",
        hidden
      );


      slide.setAttribute(
        "aria-hidden",
        String(hidden)
      );
    });


    dots.forEach((dot, dotIndex) => {

      const active =
        dotIndex === index;


      dot.classList.toggle(
        "is-active",
        active
      );


      dot.setAttribute(
        "aria-current",
        active ? "true" : "false"
      );
    });
  }



  // ==================================================
  // AUTOPLAY
  // ==================================================

  function stop() {

    if (timer !== null) {
      clearInterval(timer);

      timer = null;
    }
  }


  function start() {

    // Luôn clear timer cũ trước.
    stop();


    if (
      reduceMotion ||
      slides.length <= 1 ||
      document.hidden
    ) {
      return;
    }


    timer =
      setInterval(() => {
        go(index + 1);
      }, 5000);
  }



  // ==================================================
  // BUTTON
  // ==================================================

  prevButton.addEventListener("click", () => {
    go(index - 1);
  });


  nextButton.addEventListener("click", () => {
    go(index + 1);
  });



  // ==================================================
  // DỪNG KHI NGƯỜI DÙNG ĐANG XEM
  // ==================================================

  root.addEventListener(
    "mouseenter",
    stop
  );


  root.addEventListener(
    "mouseleave",
    start
  );


  root.addEventListener(
    "focusin",
    stop
  );


  root.addEventListener(
    "focusout",
    (event) => {

      // Chỉ chạy lại khi focus
      // đã rời khỏi toàn bộ slider.
      if (
        !root.contains(
          event.relatedTarget
        )
      ) {
        start();
      }

    }
  );



  // ==================================================
  // TAB BROWSER BỊ ẨN
  // ==================================================

  document.addEventListener(
    "visibilitychange",
    () => {

      if (document.hidden) {
        stop();
      }
      else {
        start();
      }

    }
  );



  // ==================================================
  // KHỞI TẠO
  // ==================================================

  go(0);

  start();
}