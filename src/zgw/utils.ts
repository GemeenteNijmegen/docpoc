export function getFileSizeForBase64String(base64string: string) {
  const len = base64string.length;
  const potentialPadding = base64string.substring(len, len - 2);
  const y = (potentialPadding.match(/=/g)||[]).length;
  return (len * (3 / 4)) - y;
}
