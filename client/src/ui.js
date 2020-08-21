const themes = {
  'Light': {
    '--bg-color': '#ffffff',
    '--outline-color': '#000000',
    '--text-color': '#000000',
    '--info-text-color': '#7777aa',
    '--fill-color': '#eeeeee',
    '--fill-color-light': '#f4f4f4',
    '--link-color': '#0000ee',
    '--error-color': '#f03636',
    '--slider-focus-bg-color': '#e0e0e0',
    '--slider-thumb-color': '#909090',

    '--btn-bg-on': '#eeeeee',
    '--btn-bg-hover': '#f9f9f9',
    '--btn-bg-active': '#cccccc',
    '--btn-outline-hover': '#222222',
    '--btn-outline-active': '#222222',
    '--btn-outline-disabled': '#555555',
  },
  'Dark': {
    '--bg-color': '#181818',
    '--outline-color': '#dddddd',
    '--text-color': '#eeeeee',
    '--info-text-color': '#aaaaff',
    '--fill-color': '#555555',
    '--fill-color-light': '#333333',
    '--link-color': '#81c2ff',
    '--error-color': '#f03636',
    '--slider-focus-bg-color': '#707070',
    '--slider-thumb-color': '#909090',

    '--btn-bg-on': '#111111',
    '--btn-bg-hover': '#222222',
    '--btn-bg-active': '#1e1e1e',
    '--btn-outline-hover': '#cccccc',
    '--btn-outline-active': '#aaaaaa',
    '--btn-outline-disabled': '#555555',
  },
};

const applyTheme = (theme) => {
  // Sets theme colors.
  for (const i in themes[theme]) {
    document.documentElement.style.setProperty(i, themes[theme][i]);
  }
}

const loadTheme = () => {
  const theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'Dark' : 'Light';
  console.log(theme);
  applyTheme(theme);
}

loadTheme();