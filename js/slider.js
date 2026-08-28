// ==================================================
// SLIDER CẢM NHẬN KHÁCH HÀNG
// ==================================================

export function initSlider() {
  const root =
    document.querySelector("[data-slider]");


  // Trang hiện tại không có slider
  // thì thoát luôn, không gây lỗi.
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


  // Kiểm tra các thành phần bắt buộc.
  if (
    !track ||
    slides.length === 0 ||
    !prevButton ||
    !nextButton ||
    !dotsContainer
  ) {
    return;
  }



  // ==================================================
  // BIẾN TRẠNG THÁI
  // ==================================================

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



  // Thiết lập thông tin cho từng slide.
  slides.forEach(
    (slide, slideIndex) => {

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

    }
  );



  // ==================================================
  // LIVE REGION
  // ==================================================
  //
  // Dùng để báo cho trình đọc màn hình
  // khi NGƯỜI DÙNG chủ động đổi slide.
  //
  // Autoplay sẽ không tự đọc liên tục.

  const liveRegion =
    document.createElement("p");


  liveRegion.className =
    "sr-only";


  liveRegion.setAttribute(
    "aria-live",
    "polite"
  );


  liveRegion.setAttribute(
    "aria-atomic",
    "true"
  );


  root.appendChild(
    liveRegion
  );



  // ==================================================
  // TẠO DOT TỰ ĐỘNG
  // ==================================================

  slides.forEach(
    (slide, slideIndex) => {

      const dot =
        document.createElement(
          "button"
        );


      dot.type =
        "button";


      dot.className =
        "slider-dot";


      dot.setAttribute(
        "aria-label",
        `Đi đến cảm nhận ${slideIndex + 1}`
      );


      // Khi người dùng bấm dot
      // thì cần thông báo cho screen reader.
      dot.addEventListener(
        "click",
        () => {

          go(
            slideIndex,
            true
          );

        }
      );


      dotsContainer.appendChild(
        dot
      );


      dots.push(
        dot
      );

    }
  );



  // ==================================================
  // CHUYỂN SLIDE
  // ==================================================
  //
  // announce = true:
  // người dùng chủ động đổi slide
  // → screen reader sẽ được thông báo.
  //
  // announce = false:
  // autoplay hoặc khởi tạo
  // → không đọc thông báo.

  function go(
    next,
    announce = false
  ) {

    // Công thức giúp slider chạy vòng tròn.
    //
    // Ví dụ:
    // slide 0 bấm lùi:
    //
    // (-1 + 3) % 3 = 2
    //
    // → chuyển về slide cuối.
    index =
      (
        next +
        slides.length
      ) %
      slides.length;



    // Di chuyển cả track sang trái.
    track.style.transform =
      `translateX(-${index * 100}%)`;



    // ==================================================
    // CẬP NHẬT TRẠNG THÁI SLIDE
    // ==================================================

    slides.forEach(
      (
        slide,
        slideIndex
      ) => {

        const hidden =
          slideIndex !== index;


        // Slide đang ẩn sẽ có inert.
        //
        // Điều này giúp người dùng
        // bàn phím không Tab vào
        // nội dung nằm ngoài màn hình.
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



    // ==================================================
    // CẬP NHẬT DOT
    // ==================================================

    dots.forEach(
      (
        dot,
        dotIndex
      ) => {

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



    // ==================================================
    // THÔNG BÁO CHO SCREEN READER
    // ==================================================
    //
    // Chỉ thông báo nếu người dùng
    // chủ động điều khiển slider.
    //
    // Không thông báo khi autoplay
    // để tránh screen reader tự đọc
    // cứ mỗi 5 giây.

    if (announce) {

      liveRegion.textContent =
        `Đang hiển thị cảm nhận ${index + 1} trên ${slides.length}`;

    }
  }



  // ==================================================
  // DỪNG AUTOPLAY
  // ==================================================

  function stop() {

    if (timer !== null) {

      clearInterval(
        timer
      );


      timer = null;

    }

  }



  // ==================================================
  // BẮT ĐẦU AUTOPLAY
  // ==================================================

  function start() {

    // Luôn xóa timer cũ
    // trước khi tạo timer mới.
    //
    // Tránh trường hợp nhiều
    // setInterval chạy chồng lên nhau.
    stop();


    // Không autoplay khi:
    //
    // - Người dùng muốn giảm chuyển động.
    // - Slider chỉ có 1 slide.
    // - Tab trình duyệt đang bị ẩn.
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

          // Autoplay không announce.
          go(
            index + 1
          );

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

      go(
        index - 1,
        true
      );

    }
  );



  // ==================================================
  // NÚT NEXT
  // ==================================================

  nextButton.addEventListener(
    "click",
    () => {

      go(
        index + 1,
        true
      );

    }
  );



  // ==================================================
  // ĐIỀU KHIỂN BẰNG BÀN PHÍM
  // ==================================================
  //
  // ArrowLeft  → slide trước
  // ArrowRight → slide tiếp
  // Home       → slide đầu
  // End        → slide cuối

  root.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key ===
        "ArrowLeft"
      ) {

        event.preventDefault();


        go(
          index - 1,
          true
        );


        return;
      }



      if (
        event.key ===
        "ArrowRight"
      ) {

        event.preventDefault();


        go(
          index + 1,
          true
        );


        return;
      }



      if (
        event.key ===
        "Home"
      ) {

        event.preventDefault();


        go(
          0,
          true
        );


        return;
      }



      if (
        event.key ===
        "End"
      ) {

        event.preventDefault();


        go(
          slides.length - 1,
          true
        );

      }

    }
  );



  // ==================================================
  // DỪNG KHI NGƯỜI DÙNG HOVER
  // ==================================================

  root.addEventListener(
    "mouseenter",
    stop
  );


  root.addEventListener(
    "mouseleave",
    start
  );



  // ==================================================
  // DỪNG KHI NGƯỜI DÙNG DÙNG BÀN PHÍM
  // ==================================================
  //
  // focusin:
  // một phần tử bên trong slider
  // đang được focus.
  //
  // → dừng autoplay.

  root.addEventListener(
    "focusin",
    stop
  );




  root.addEventListener(
    "focusout",
    (event) => {

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

      if (
        document.hidden
      ) {

        stop();

      }
      else {

        start();

      }

    }
  );



  // ==================================================
  // KHỞI TẠO SLIDER
  // ==================================================


  go(
    0
  );


  // Bắt đầu autoplay.
  start();
}