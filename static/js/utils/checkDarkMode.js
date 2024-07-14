
/**
 * ダークモードをチェックする関数。ダークモードモードの場合はtrueを返す。
 * @returns 
 */
export const checkDarkMode = () => {

  const mediaQueryObj = window.matchMedia('(prefers-color-scheme: dark)');
  const isDarkMode = mediaQueryObj.matches;

  console.log('Are you in dark mode? ', isDarkMode);

  return isDarkMode;
}
