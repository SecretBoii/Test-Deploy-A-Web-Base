export interface ThaiDateTimeParts {
  hours: number;
  dayOfWeek: number; // 0 = อาทิตย์, 1 = จันทร์, ...
  dayOfMonth: number; // วันที่ 1 - 31
  month: number; // เดือน 0 (ม.ค.) - 11 (ธ.ค.)
  year: number;
}

export interface DateRangeBoundary {
  start: Date | undefined;
  end: Date | undefined;
}

const MS_7_HOURS = 7 * 60 * 60 * 1000;

export function getThaiDateTime(date: Date | string): ThaiDateTimeParts {
  const d = new Date(date);
  const thaiTime = new Date(d.getTime() + MS_7_HOURS);
  return {
    hours: thaiTime.getUTCHours(),
    dayOfWeek: thaiTime.getUTCDay(),
    dayOfMonth: thaiTime.getUTCDate(),
    month: thaiTime.getUTCMonth(),
    year: thaiTime.getUTCFullYear(),
  };
}

export function getTimeRangeDates(
  timeRange?: string,
  startDate?: string,
  endDate?: string,
): DateRangeBoundary {
  if (startDate || endDate) {
    let start: Date | undefined = undefined;
    let end: Date | undefined = undefined;

    if (startDate) {
      const parts = startDate.split('-').map(Number);
      if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
        start = new Date(
          Date.UTC(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0) - MS_7_HOURS,
        );
      } else {
        start = new Date(startDate);
      }
    }

    if (endDate) {
      const parts = endDate.split('-').map(Number);
      if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
        end = new Date(
          Date.UTC(parts[0], parts[1] - 1, parts[2], 23, 59, 59, 999) -
            MS_7_HOURS,
        );
      } else {
        const ed = new Date(endDate);
        ed.setHours(23, 59, 59, 999);
        end = ed;
      }
    }

    return { start, end };
  }

  if (!timeRange) return { start: undefined, end: undefined };

  // คำนวณวันปัจจุบันตามเวลาประเทศไทย (UTC+7)
  const nowUtc = new Date();
  const nowThai = new Date(nowUtc.getTime() + MS_7_HOURS);
  const year = nowThai.getUTCFullYear();
  const month = nowThai.getUTCMonth();
  const date = nowThai.getUTCDate();
  const day = nowThai.getUTCDay();

  if (timeRange === 'daily') {
    // เวลาไทย 00:00:00.000 ถึง 23:59:59.999 ของวันนี้
    const start = new Date(
      Date.UTC(year, month, date, 0, 0, 0, 0) - MS_7_HOURS,
    );
    const end = new Date(
      Date.UTC(year, month, date, 23, 59, 59, 999) - MS_7_HOURS,
    );
    return { start, end };
  } else if (timeRange === 'weekly') {
    // วันจันทร์ (00:00:00) ถึงวันอาทิตย์ (23:59:59) ของสัปดาห์ปัจจุบันในไทย
    const diffToMon = day === 0 ? -6 : 1 - day;
    const mondayDate = date + diffToMon;
    const start = new Date(
      Date.UTC(year, month, mondayDate, 0, 0, 0, 0) - MS_7_HOURS,
    );
    const end = new Date(
      Date.UTC(year, month, mondayDate + 6, 23, 59, 59, 999) - MS_7_HOURS,
    );
    return { start, end };
  } else if (timeRange === 'monthly') {
    // วันที่ 1 ถึงวันสิ้นเดือนของเดือนปัจจุบันในไทย
    const start = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0) - MS_7_HOURS);
    const end = new Date(
      Date.UTC(year, month + 1, 0, 23, 59, 59, 999) - MS_7_HOURS,
    );
    return { start, end };
  } else if (timeRange === 'yearly') {
    // วันที่ 1 ม.ค. ถึง 31 ธ.ค. ของปีปัจจุบันในไทย
    const start = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0) - MS_7_HOURS);
    const end = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999) - MS_7_HOURS);
    return { start, end };
  }

  return { start: undefined, end: undefined };
}
