const STORAGE_KEY =
  "hptime-attendance-v1";


const state = {
  records: [],
  query: "",
  department: "all",
  status: "all",
  sort: "date-desc",
  loading: true,
  error: null
};


const statusLabels = {
  "dung-gio": "Đúng giờ",
  "di-tre": "Đi trễ",
  "nghi-phep": "Nghỉ phép"
};


const sorters = {
  "date-desc": (a, b) =>
    b.date.localeCompare(a.date),

  "date-asc": (a, b) =>
    a.date.localeCompare(b.date),

  "hours-desc": (a, b) =>
    b.hours - a.hours,

  "hours-asc": (a, b) =>
    a.hours - b.hours,

  "employee-asc": (a, b) =>
    a.employee.localeCompare(
      b.employee,
      "vi"
    )
};


// ==================================================
// DEBOUNCE
// ==================================================

function debounce(
  fn,
  delay = 300
) {
  let id;

  return (...args) => {
    clearTimeout(id);

    id = setTimeout(
      () => {
        fn(...args);
      },
      delay
    );
  };
}


// ==================================================
// LOCAL STORAGE
// ==================================================

function saveRecords(records) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(records)
    );
  }
  catch {
    // Nếu localStorage bị chặn
    // thì trang vẫn hoạt động
    // trong phiên hiện tại.
  }
}


function readStoredRecords() {
  try {
    const raw =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!raw) {
      return null;
    }

    const parsed =
      JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed;
  }
  catch {
    try {
      localStorage.removeItem(
        STORAGE_KEY
      );
    }
    catch {
      // Không làm gì.
    }

    return null;
  }
}


// ==================================================
// FETCH JSON
// ==================================================

async function fetchSampleRecords() {
  const response =
    await fetch(
      "./data/records.json"
    );

  if (!response.ok) {
    throw new Error(
      `Máy chủ trả về ${response.status}`
    );
  }

  const records =
    await response.json();

  if (!Array.isArray(records)) {
    throw new Error(
      "Dữ liệu không đúng định dạng"
    );
  }

  return records;
}


async function loadRecords() {
  const stored =
    readStoredRecords();

  if (stored !== null) {
    return stored;
  }

  const records =
    await fetchSampleRecords();

  saveRecords(records);

  return records;
}


// ==================================================
// LỌC + TÌM KIẾM + SẮP XẾP
// ==================================================

function visibleRecords() {
  const q =
    state.query
      .trim()
      .toLowerCase();

  return state.records

    .filter(
      (record) =>
        state.department === "all" ||
        record.department ===
          state.department
    )

    .filter(
      (record) =>
        state.status === "all" ||
        record.status ===
          state.status
    )

    .filter(
      (record) =>
        !q ||

        record.employee
          .toLowerCase()
          .includes(q) ||

        record.id
          .toLowerCase()
          .includes(q)
    )

    .sort(
      sorters[state.sort]
    );
}


// ==================================================
// FORMAT
// ==================================================

function formatDate(date) {
  const parts =
    date.split("-");

  if (parts.length !== 3) {
    return date;
  }

  return (
    `${parts[2]}/` +
    `${parts[1]}/` +
    `${parts[0]}`
  );
}


function createRecordId() {
  return (
    "CC-" +
    Date.now()
      .toString()
      .slice(-9)
  );
}


// ==================================================
// INIT
// ==================================================

export function initAttendance() {
  const root =
    document.querySelector(
      "[data-attendance-app]"
    );

  if (!root) {
    return;
  }


  // ==================================================
  // CONTROL
  // ==================================================

  const searchInput =
    root.querySelector(
      "[data-attendance-search]"
    );

  const departmentSelect =
    root.querySelector(
      "[data-attendance-department]"
    );

  const statusSelect =
    root.querySelector(
      "[data-attendance-status]"
    );

  const sortSelect =
    root.querySelector(
      "[data-attendance-sort]"
    );

  const restoreButtons =
    root.querySelectorAll(
      "[data-attendance-restore]"
    );


  // ==================================================
  // FORM
  // ==================================================

  const form =
    root.querySelector(
      "[data-attendance-form]"
    );

  const formStatus =
    root.querySelector(
      "[data-attendance-form-status]"
    );


  // ==================================================
  // STATE ELEMENT
  // ==================================================

  const loadingState =
    root.querySelector(
      "[data-attendance-loading]"
    );

  const errorState =
    root.querySelector(
      "[data-attendance-error-state]"
    );

  const errorMessage =
    root.querySelector(
      "[data-attendance-error]"
    );

  const emptyState =
    root.querySelector(
      "[data-attendance-empty]"
    );

  const emptyMessage =
    root.querySelector(
      "[data-attendance-empty-message]"
    );

  const tableState =
    root.querySelector(
      "[data-attendance-table]"
    );

  const body =
    root.querySelector(
      "[data-attendance-body]"
    );

  const count =
    root.querySelector(
      "[data-attendance-count]"
    );

  const template =
    document.getElementById(
      "attendance-row-template"
    );


  if (
    !searchInput ||
    !departmentSelect ||
    !statusSelect ||
    !sortSelect ||
    !form ||
    !loadingState ||
    !errorState ||
    !errorMessage ||
    !emptyState ||
    !tableState ||
    !body ||
    !count ||
    !template
  ) {
    return;
  }


  // ==================================================
  // BUILD ROW
  // ==================================================

  function buildRow(record) {
    const row =
      template.content
        .firstElementChild
        .cloneNode(true);


    row.querySelector(
      "[data-cell='id']"
    ).textContent =
      record.id;


    row.querySelector(
      "[data-cell='employee']"
    ).textContent =
      record.employee;


    row.querySelector(
      "[data-cell='department']"
    ).textContent =
      record.department;


    row.querySelector(
      "[data-cell='status']"
    ).textContent =
      statusLabels[
        record.status
      ] || record.status;


    row.querySelector(
      "[data-cell='check-in']"
    ).textContent =
      record.checkIn || "—";


    row.querySelector(
      "[data-cell='check-out']"
    ).textContent =
      record.checkOut || "—";


    row.querySelector(
      "[data-cell='hours']"
    ).textContent =
      `${record.hours} giờ`;


    row.querySelector(
      "[data-cell='date']"
    ).textContent =
      formatDate(
        record.date
      );


    const deleteButton =
      row.querySelector(
        "[data-delete-id]"
      );


    deleteButton.dataset.deleteId =
      record.id;


    deleteButton.setAttribute(
      "aria-label",
      `Xóa bản ghi ${record.id} của ${record.employee}`
    );


    return row;
  }


  // ==================================================
  // RENDER
  // ==================================================

  function render() {
    const list =
      visibleRecords();


    loadingState.classList.toggle(
      "hidden",
      !state.loading
    );


    errorState.classList.toggle(
      "hidden",
      state.loading ||
      !state.error
    );


    emptyState.classList.toggle(
      "hidden",
      state.loading ||
      Boolean(state.error) ||
      list.length > 0
    );


    tableState.classList.toggle(
      "hidden",
      state.loading ||
      Boolean(state.error) ||
      list.length === 0
    );


    errorMessage.textContent =
      state.error || "";


    if (state.loading) {
      count.textContent =
        "Đang tải dữ liệu...";
    }
    else {
      count.textContent =
        `${list.length} / ${state.records.length} bản ghi`;
    }


    if (
      !state.loading &&
      !state.error &&
      list.length === 0 &&
      emptyMessage
    ) {
      if (
        state.records.length === 0
      ) {
        emptyMessage.textContent =
          "Hiện chưa có bản ghi chấm công nào.";
      }
      else {
        emptyMessage.textContent =
          "Không tìm thấy bản ghi phù hợp với điều kiện hiện tại.";
      }
    }


    if (
      state.loading ||
      state.error ||
      list.length === 0
    ) {
      body.replaceChildren();
      return;
    }


    const rows =
      list.map(buildRow);


    body.replaceChildren(
      ...rows
    );
  }


  // ==================================================
  // KHÔI PHỤC DỮ LIỆU
  // ==================================================

  async function restoreSampleData() {
    state.loading = true;
    state.error = null;

    render();


    try {
      const records =
        await fetchSampleRecords();


      state.records =
        records;


      saveRecords(
        state.records
      );


      if (formStatus) {
        formStatus.textContent =
          "Đã khôi phục dữ liệu chấm công mẫu.";
      }
    }
    catch (error) {
      state.error =
        `Không tải được dữ liệu: ${error.message}`;
    }
    finally {
      state.loading = false;

      render();
    }
  }


  // ==================================================
  // SEARCH DEBOUNCE
  // ==================================================

  const handleSearch =
    debounce(
      (value) => {
        state.query =
          value;

        render();
      },
      300
    );


  searchInput.addEventListener(
    "input",
    (event) => {
      handleSearch(
        event.target.value
      );
    }
  );


  // ==================================================
  // FILTER PHÒNG BAN
  // ==================================================

  departmentSelect.addEventListener(
    "change",
    (event) => {
      state.department =
        event.target.value;

      render();
    }
  );


  // ==================================================
  // FILTER TRẠNG THÁI
  // ==================================================

  statusSelect.addEventListener(
    "change",
    (event) => {
      state.status =
        event.target.value;

      render();
    }
  );


  // ==================================================
  // SORT
  // ==================================================

  sortSelect.addEventListener(
    "change",
    (event) => {
      state.sort =
        event.target.value;

      render();
    }
  );


  // ==================================================
  // RESTORE
  // ==================================================

  restoreButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        restoreSampleData
      );
    }
  );


  // ==================================================
  // DELETE
  // ==================================================

  body.addEventListener(
    "click",
    (event) => {
      const button =
        event.target.closest(
          "[data-delete-id]"
        );


      if (!button) {
        return;
      }


      const id =
        button.dataset.deleteId;


      state.records =
        state.records.filter(
          (record) =>
            record.id !== id
        );


      saveRecords(
        state.records
      );


      render();


      if (formStatus) {
        formStatus.textContent =
          `Đã xóa bản ghi ${id}.`;
      }
    }
  );


  // ==================================================
  // ADD
  // ==================================================

  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();


      if (
        !form.checkValidity()
      ) {
        form.reportValidity();
        return;
      }


      const formData =
        new FormData(form);


      const record = {
        id:
          createRecordId(),

        employee:
          String(
            formData.get(
              "employee"
            ) || ""
          ).trim(),

        department:
          String(
            formData.get(
              "department"
            ) || ""
          ),

        status:
          String(
            formData.get(
              "status"
            ) || ""
          ),

        checkIn:
          String(
            formData.get(
              "checkIn"
            ) || ""
          ),

        checkOut:
          String(
            formData.get(
              "checkOut"
            ) || ""
          ),

        hours:
          Number(
            formData.get(
              "hours"
            )
          ),

        date:
          String(
            formData.get(
              "date"
            ) || ""
          )
      };


      state.records = [
        record,
        ...state.records
      ];


      saveRecords(
        state.records
      );


      form.reset();


      render();


      if (formStatus) {
        formStatus.textContent =
          `Đã thêm bản ghi ${record.id}.`;
      }
    }
  );


  // ==================================================
  // RENDER LOADING
  // ==================================================

  render();


  // ==================================================
  // LOAD DATA
  // ==================================================

  (async () => {
    try {
      state.records =
        await loadRecords();
    }
    catch (error) {
      state.error =
        `Không tải được dữ liệu: ${error.message}`;
    }
    finally {
      state.loading = false;

      render();
    }
  })();
}