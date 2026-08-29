const state = {
  records: [],
  loading: true,
  error: null
};

const statusLabels = {
  "dung-gio": "Đúng giờ",
  "di-tre": "Đi trễ",
  "nghi-phep": "Nghỉ phép"
};

function formatDate(date) {
  const parts = date.split("-");

  if (parts.length !== 3) {
    return date;
  }

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

async function loadRecords() {
  const response =
    await fetch("./data/records.json");

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

export function initAttendance() {
  const root =
    document.querySelector(
      "[data-attendance-app]"
    );

  if (!root) {
    return;
  }

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
      statusLabels[record.status]
      || record.status;

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
      formatDate(record.date);

    return row;
  }

  function render() {
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
      state.records.length > 0
    );

    tableState.classList.toggle(
      "hidden",
      state.loading ||
      Boolean(state.error) ||
      state.records.length === 0
    );

    if (state.loading) {
      count.textContent =
        "Đang tải dữ liệu...";
    }
    else {
      count.textContent =
        `${state.records.length} bản ghi`;
    }

    errorMessage.textContent =
      state.error || "";

    if (
      state.loading ||
      state.error ||
      state.records.length === 0
    ) {
      body.replaceChildren();
      return;
    }

    const rows =
      state.records.map(
        buildRow
      );

    body.replaceChildren(
      ...rows
    );
  }

  render();

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