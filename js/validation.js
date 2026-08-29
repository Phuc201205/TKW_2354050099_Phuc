// ==================================================
// CONTACT FORM VALIDATION
// ==================================================

function messageFor(field) {
  const validity =
    field.validity;


  if (validity.valueMissing) {

    if (
      field.type === "checkbox"
    ) {
      return (
        "Vui lòng đồng ý với nội dung này " +
        "trước khi gửi."
      );
    }

    if (
      field.tagName === "SELECT"
    ) {
      return (
        "Vui lòng chọn một giá trị."
      );
    }

    return (
      "Vui lòng điền mục này."
    );
  }


  if (
    validity.typeMismatch
  ) {
    return (
      "Email chưa đúng dạng. " +
      "Ví dụ: chuvua@gmail.com"
    );
  }


  if (
    validity.patternMismatch
  ) {
    return (
      "Nhập 10 chữ số, bắt đầu bằng 0. " +
      "Ví dụ: 0912345678"
    );
  }


  if (
    validity.tooShort
  ) {
    return (
      `Nội dung cần ít nhất ` +
      `${field.minLength} ký tự.`
    );
  }


  if (
    validity.tooLong
  ) {
    return (
      `Nội dung không được vượt quá ` +
      `${field.maxLength} ký tự.`
    );
  }


  return (
    "Dữ liệu chưa hợp lệ. " +
    "Vui lòng kiểm tra lại."
  );
}


// ==================================================
// SHOW ERROR
// ==================================================

function showError(
  field,
  errorBox
) {
  field.setAttribute(
    "aria-invalid",
    "true"
  );

  errorBox.textContent =
    messageFor(field);
}


// ==================================================
// CLEAR ERROR
// ==================================================

function clearError(
  field,
  errorBox
) {
  field.removeAttribute(
    "aria-invalid"
  );

  errorBox.textContent = "";
}


// ==================================================
// VALIDATE ONE FIELD
// ==================================================

function validateField(
  field,
  errorBox
) {
  if (
    field.checkValidity()
  ) {
    clearError(
      field,
      errorBox
    );

    return true;
  }


  showError(
    field,
    errorBox
  );

  return false;
}


// ==================================================
// INIT
// ==================================================

export function initContactValidation() {
  const form =
    document.querySelector(
      "[data-contact-form]"
    );


  if (!form) {
    return;
  }


  form.setAttribute(
    "novalidate",
    ""
  );


  const summary =
    form.querySelector(
      "[data-form-summary]"
    );


  const toast =
    document.querySelector(
      "[data-form-toast]"
    );


  const fields =
    Array.from(
      form.querySelectorAll(
        "[data-validate]"
      )
    );


  if (
    !summary ||
    fields.length === 0
  ) {
    return;
  }


  // ==================================================
  // LẤY ERROR BOX CỦA TỪNG FIELD
  // ==================================================

  const fieldData =
    fields.map(
      (field) => {

        const errorId =
          field.dataset.errorId;


        const errorBox =
          document.getElementById(
            errorId
          );


        return {
          field,
          errorBox
        };
      }
    )
    .filter(
      (item) =>
        item.errorBox
    );


  // ==================================================
  // VALIDATE KHI RỜI KHỎI Ô
  // ==================================================

  fieldData.forEach(
    ({
      field,
      errorBox
    }) => {

      field.addEventListener(
        "blur",
        () => {
          validateField(
            field,
            errorBox
          );
        }
      );


      const eventName =
        field.tagName === "SELECT" ||
        field.type === "checkbox"
          ? "change"
          : "input";


      field.addEventListener(
        eventName,
        () => {

          if (
            field.hasAttribute(
              "aria-invalid"
            )
          ) {
            validateField(
              field,
              errorBox
            );
          }
        }
      );
    }
  );


  // ==================================================
  // SUBMIT
  // ==================================================

  form.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      const invalidFields = [];


      fieldData.forEach(
        ({
          field,
          errorBox
        }) => {

          const valid =
            validateField(
              field,
              errorBox
            );


          if (!valid) {
            invalidFields.push(
              field
            );
          }
        }
      );


      // ==================================================
      // CÓ LỖI
      // ==================================================

      if (
        invalidFields.length > 0
      ) {

        summary.hidden = false;

        summary.textContent =
          `Biểu mẫu còn ` +
          `${invalidFields.length} mục ` +
          `chưa hợp lệ. ` +
          `Vui lòng kiểm tra các mục ` +
          `được đánh dấu bên dưới.`;


        invalidFields[0]
          .focus();


        return;
      }


      // ==================================================
      // THÀNH CÔNG
      // ==================================================

      summary.hidden = true;
      summary.textContent = "";


      form.reset();


      fieldData.forEach(
        ({
          field,
          errorBox
        }) => {

          clearError(
            field,
            errorBox
          );
        }
      );


      if (toast) {

        toast.hidden = false;

        toast.textContent =
          "Gửi yêu cầu thành công. " +
          "HPTime sẽ liên hệ với bạn sớm.";


        window.setTimeout(
          () => {
            toast.hidden = true;
          },
          3500
        );
      }
    }
  );
}