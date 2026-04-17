export const normalizeValue = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') return value;

  const asString = String(value).trim();
  const numeric = Number(asString.replace(/[^0-9.-]/g, ''));

  if (!Number.isNaN(numeric) && /\d/.test(asString)) {
    return numeric;
  }

  const timestamp = Date.parse(asString);
  if (!Number.isNaN(timestamp)) {
    return timestamp;
  }

  return asString.toLowerCase();
};

export const sortRows = (rows, sortConfig) => {
  if (!sortConfig?.key) return rows;

  const direction = sortConfig.direction === 'asc' ? 1 : -1;

  return [...rows].sort((left, right) => {
    const leftValue = normalizeValue(left[sortConfig.key]);
    const rightValue = normalizeValue(right[sortConfig.key]);

    if (leftValue < rightValue) return -1 * direction;
    if (leftValue > rightValue) return 1 * direction;
    return 0;
  });
};

export const paginateRows = (rows, page = 1, pageSize = 10) => {
  const safePage = Math.max(page, 1);
  const safePageSize = Math.max(pageSize, 1);
  const start = (safePage - 1) * safePageSize;
  const end = start + safePageSize;

  return rows.slice(start, end);
};

export const computePageCount = (totalRows, pageSize = 10) => {
  return Math.max(1, Math.ceil(totalRows / Math.max(pageSize, 1)));
};
