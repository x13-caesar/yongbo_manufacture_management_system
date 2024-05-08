export function yesterday(): Date {
  let yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday
}


export function oneMonthAgo(): Date {
  let today = new Date();
  let lastMonth = new Date(today)
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  return lastMonth
}


export function lastMonthBeginning(): Date {
  let today = new Date();
  let lastMonth = new Date(today)
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  lastMonth.setDate(1)
  return lastMonth
}


export function yearBeginning(): Date {
  let yb = new Date();
  yb.setMonth(0);
  yb.setDate(1);
  return yb
}


export function oneYearAgo(): Date {
  let lastYear = new Date();
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  return lastYear
}


export function asISODate(date: Date): string {
  return date.toISOString().slice(0, 10)
}
