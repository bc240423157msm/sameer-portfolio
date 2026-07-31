// This runs before React hydrates, so the page never "flashes" the wrong
// theme. It reads the saved preference ("light" | "dark" | "auto") from
// localStorage and applies the correct data-theme attribute to <html>.
// "auto" follows the visitor's OS/browser preference.
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme') || 'dark';
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var resolved = stored === 'auto' ? (systemDark ? 'dark' : 'light') : stored;
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.setAttribute('data-theme-pref', stored);
  } catch (e) {}
})();
`;
