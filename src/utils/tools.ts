export function getType(data: any) {
  const [, type] = /\[object (\S*)\]/.exec(Object.prototype.toString.call(data)) || [];
  return type;
}