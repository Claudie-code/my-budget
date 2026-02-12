export function getMonthDateRange(monthQuery?: string) {
  const now = new Date();

  let year = now.getFullYear();
  let month = now.getMonth() + 1;

  if (monthQuery) {
    const parts = monthQuery.split("-").map(Number);

    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      year = parts[0];
      month = parts[1];
    }
  }

  if (month < 1 || month > 12) {
    throw new Error("Invalid month value");
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  return {
    year,
    month,
    startDate,
    endDate,
  };
}
