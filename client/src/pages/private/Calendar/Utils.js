export const formatDate_OLD = (date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

export const generateDaysInMonth_OLD = (date, appointments) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const days = [];

  const startDay = startOfMonth.getDay();

  for (let i = startDay - 1; i >= 0; i--) {
    const day = new Date(date.getFullYear(), date.getMonth(), -i);
    days.push({ day: day.getDate(), prevMonth: true, date: day });
  }

  for (let i = 1; i <= endOfMonth.getDate(); i++) {
    const currentDay = new Date(date.getFullYear(), date.getMonth(), i);
    const formattedDate = formatDate(currentDay);
    days.push({
      day: i,
      prevMonth: false,
      date: currentDay,
      appointments: appointments[formattedDate] || [],
    });
  }

  const nextMonthStartDay = (startDay + endOfMonth.getDate()) % 7;
  for (let i = 0; nextMonthStartDay + i < 6; i++) {
    const day = new Date(date.getFullYear(), date.getMonth() + 1, i + 1);
    days.push({ day: day.getDate(), prevMonth: true, date: day });
  }

  return days;
};

export const formatDate = (date) => {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Date";

    // Timezone-safe formatting
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().split("T")[0];
  } catch {
    return "Invalid Date";
  }
};

export const generateDaysInMonth = (date, appointments = {}, holidays = []) => {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstWeekday = firstDay.getDay(); // 0 (Sun) - 6 (Sat)

  const days = [];

  // Previous month filler
  for (let i = firstWeekday - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({
      day: d.getDate(),
      date: d,
      prevMonth: true,
      appointments: [],
      isHoliday: false,
    });
  }

  // Current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month, i);
    const key = formatDate(d);
    days.push({
      day: i,
      date: d,
      prevMonth: false,
      appointments: appointments[key] || [],
      isHoliday: holidays.includes(key),
    });
  }

  // Next month filler to reach 42 cells
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    days.push({
      day: d.getDate(),
      date: d,
      prevMonth: true,
      appointments: [],
      isHoliday: false,
    });
  }

  return days;
};
