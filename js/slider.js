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
  // ACCESSIBILITY CHO SLIDER
  // ==================================================

  root.setAttribute(
    "role",
    "region"
  );


  root.setAttribute(
    "aria-roledescription",
    "carousel"
  );


  root.setAttribute(
    "aria-label",
    "Cảm nhận của khách hàng"
  );


  slides.forEach((slide, slideIndex) => {

    slide.setAttribute(
      "role",
      "group"
    );


    slide.setAttribute(
      "aria-roledescription",
      "slide"
    );


    slide.setAttribute(
      "aria-label",
      `${slideIndex + 1} trên ${slides.length}`
    );

  });



  // ==================================================
  // VÙNG THÔNG BÁO CHO TRÌNH ĐỌC MÀN HÌNH
  // ==================================================

  const liveRegion =
    document.createElement("p");


  liveRegion.className = "sr-only";

  liveRegion.setAttribute(
    "aria-live",
    "polite"
  );


  liveRegion.setAttribute(
    "aria-atomic",
    "true"
  );


  root.appendChild(liveRegion);



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


    dot.addEventListener(
      "click",
      () => {

        go(slideIndex);

      }
    );


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


    slides.forEach(
      (slide, slideIndex) => {

        const hidden =
          slideIndex !== index;


        // Slide ẩn không được nhận focus
        // bằng bàn phím.
        slide.toggleAttribute(
          "inert",
          hidden
        );


        slide.setAttribute(
          "aria-hidden",
          String(hidden)
        );

      }
    );


    dots.forEach(
      (dot, dotIndex) => {

        const active =
          dotIndex === index;


        dot.classList.toggle(
          "is-active",
          active
        );


        if (active) {

          dot.setAttribute(
            "aria-current",
            "true"
          );

        }
        else {

          dot.removeAttribute(
            "aria-current"
          );

        }

      }
    );


    // Báo cho trình đọc màn hình
    // biết người dùng đang ở slide nào.
    liveRegion.textContent =
      `Đang hiển thị cảm nhận ${index + 1} trên ${slides.length}`;
  }



  // ==================================================
  // DỪNG AUTOPLAY
  // ==================================================

  function stop() {

    if (timer !== null) {

      clearInterval(timer);

      timer = null;

    }

  }



  // ==================================================
  // BẮT ĐẦU AUTOPLAY
  // ==================================================

  function start() {

    // Tránh tạo nhiều setInterval chồng nhau.
    stop();


    if (
      reduceMotion ||
      slides.length <= 1 ||
      document.hidden
    ) {
      return;
    }


    timer =
      setInterval(
        () => {

          go(index + 1);

        },
        5000
      );
  }



  // ==================================================
  // NÚT PREVIOUS
  // ==================================================

  prevButton.addEventListener(
    "click",
    () => {

      go(index - 1);

    }
  );



  // ==================================================
  // NÚT NEXT
  // ==================================================

  nextButton.addEventListener(
    "click",
    () => {

      go(index + 1);

    }
  );



  // ==================================================
  // ĐIỀU KHIỂN BẰNG BÀN PHÍM
  // ==================================================

  root.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "ArrowLeft") {

        event.preventDefault();

        go(index - 1);

        return;
      }


      if (event.key === "ArrowRight") {

        event.preventDefault();

        go(index + 1);

        return;
      }


      if (event.key === "Home") {

        event.preventDefault();

        go(0);

        return;
      }


      if (event.key === "End") {

        event.preventDefault();

        go(slides.length - 1);

      }

    }
  );



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

      // Chỉ chạy lại khi focus đã rời
      // khỏi toàn bộ slider.
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
  // TAB TRÌNH DUYỆT BỊ ẨN
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