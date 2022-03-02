import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo('en-US');

export default function formatTime(time: string): string {
  const thisTime = new Date(time);
  const formattedTime = timeAgo.format(thisTime, 'round');
  return formattedTime as string;
}
