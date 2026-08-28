// ==================================================
// TƯƠNG TÁC TỰ CHỌN
// SAO CHÉP EMAIL HỖ TRỢ
// ==================================================

export function initExtra() {
  const buttons =
    document.querySelectorAll(
      "[data-copy-email]"
    );


  if (buttons.length === 0) {
    return;
  }


  buttons.forEach((button) => {

    const root =
      button.closest("[data-copy-root]");


    if (!root) {
      return;
    }


    const status =
      root.querySelector(
        "[data-copy-status]"
      );


    const email =
      button.dataset.copyValue;


    if (!email) {
      return;
    }


    const originalText =
      button.textContent.trim();



    // ==============================================
    // HÀM COPY
    // ==============================================

    async function copyText(text) {

      // Trình duyệt hỗ trợ Clipboard API
      // và đang chạy trong secure context.
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {

        await navigator.clipboard.writeText(
          text
        );

        return;
      }


      // Fallback để có thể thử ở môi trường local.
      const textarea =
        document.createElement(
          "textarea"
        );


      textarea.value = text;

      textarea.setAttribute(
        "readonly",
        ""
      );


      textarea.className =
        "fixed left-0 top-0 opacity-0";


      document.body.appendChild(
        textarea
      );


      textarea.select();


      const success =
        document.execCommand("copy");


      textarea.remove();


      if (!success) {
        throw new Error(
          "Không thể sao chép"
        );
      }
    }



    // ==============================================
    // CLICK
    // ==============================================

    button.addEventListener(
      "click",
      async () => {

        try {

          await copyText(email);


          button.textContent =
            "Đã sao chép";


          if (status) {

            status.textContent =
              `Đã sao chép ${email}`;

          }


          setTimeout(() => {

            button.textContent =
              originalText;


            if (status) {
              status.textContent = "";
            }

          }, 2500);

        }
        catch {

          if (status) {

            status.textContent =
              "Không thể sao chép. Hãy sao chép email thủ công.";

          }

        }

      }
    );

  });
}