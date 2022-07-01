export interface Theme {
  readonly colors: typeof colors;
}

export const colors = {
  ash: '#3f4c6b',
  pink: '#f8cdda',
  red: '#fe6666',
  darkRed: '#ff3e3e',
  green: '#51fa14',
  darkGreen: '#4fed15',
  purple: '#8f94fb',
};

const theme: Theme = {
  colors,
};

export default theme;
