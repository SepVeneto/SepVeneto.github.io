export function getType(data: unknown): string {
  const [, type] = /\[object (\S*)\]/.exec(Object.prototype.toString.call(data)) || [];
  return type;
}

function addZero(number: number): string {
  if (number > 9) {
    return String(number);
  } else {
    return `0${number}`
  }
}

export function formatTime(time: string | number): string {
  const stamp = new Date(time);
  const year = stamp.getFullYear();
  const month = stamp.getMonth() + 1;
  const day = stamp.getDate();
  const hour = stamp.getHours();
  const minute = stamp.getMinutes();
  const second = stamp.getSeconds();
  return `${year}-${addZero(month)}-${addZero(day)} ${addZero(hour)}:${addZero(minute)}:${addZero(second)}`;
}
