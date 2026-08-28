// ==================================================
// CÔNG TẮC GIÁ THÁNG / NĂM
// ==================================================

export function initPricing() {
  const roots =
    document.querySelectorAll("[data-pricing-toggle]");


  if (roots.length === 0) {
    return;
  }


  const dong =
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0
    });


  roots.forEach((root) => {

    const toggle =
      root.querySelector("[data-billing-switch]");

    const prices =
      root.querySelectorAll("[data-price]");

    const monthLabel =
      root.querySelector("[data-month-label]");

    const yearLabel =
      root.querySelector("[data-year-label]");


    if (!toggle || prices.length === 0) {
      return;
    }


    function updatePrices(yearly) {

      prices.forEach((price) => {

        const value = yearly
          ? price.dataset.yearly
          : price.dataset.monthly;


        if (value === undefined) {
          return;
        }


        price.textContent =
          dong.format(Number(value));
      });


      toggle.setAttribute(
        "aria-checked",
        String(yearly)
      );


      toggle.setAttribute(
        "aria-label",
        yearly
          ? "Chuyển sang thanh toán theo tháng"
          : "Chuyển sang thanh toán theo năm"
      );


      if (monthLabel) {
        monthLabel.classList.toggle(
          "text-accent-500",
          !yearly
        );

        monthLabel.classList.toggle(
          "font-semibold",
          !yearly
        );
      }


      if (yearLabel) {
        yearLabel.classList.toggle(
          "text-accent-500",
          yearly
        );

        yearLabel.classList.toggle(
          "font-semibold",
          yearly
        );
      }


      const suffixes =
        root.querySelectorAll("[data-price-suffix]");


      suffixes.forEach((suffix) => {
        suffix.textContent =
          yearly ? "/ năm" : "/ tháng";
      });
    }


    toggle.addEventListener("click", () => {

      const yearly =
        toggle.getAttribute("aria-checked")
          !== "true";


      updatePrices(yearly);
    });


    updatePrices(false);
  });
}