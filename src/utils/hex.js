export default function getHex(str) {
  if (!str) return false;

  str = str.toLowerCase().trim();
  if (str[0] === '#')
    str = str.substr(1);

  if (![3, 6].includes(str.length)) return false;

  const validChars = '01234567890abcdef';

  for (let ch of str)
    if (!validChars.includes(ch)) return false;

  return str;
}