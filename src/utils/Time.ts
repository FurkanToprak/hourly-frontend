import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo('en-US');

export function toShortTimeString(time: Date) {
  return `${time.getMonth()}/${time.getDay()}/${time.getFullYear()}`;
}
export default function formatTime(time: string): string {
  const thisTime = new Date(time);
  const formattedTime = timeAgo.format(thisTime, 'round');
  return formattedTime as string;
}

export const daysPerMonth = new Map<number, number>();
daysPerMonth.set(1, 31);
daysPerMonth.set(2, 28);
daysPerMonth.set(3, 31);
daysPerMonth.set(4, 30);
daysPerMonth.set(5, 31);
daysPerMonth.set(6, 30);
daysPerMonth.set(7, 31);
daysPerMonth.set(8, 31);
daysPerMonth.set(9, 30);
daysPerMonth.set(10, 31);
daysPerMonth.set(11, 30);
daysPerMonth.set(12, 31);

export const currentDate = new Date();
export const currentDay = currentDate.getDay();
export const currentMonth = currentDate.getMonth();
export const currentYear = currentDate.getFullYear();
