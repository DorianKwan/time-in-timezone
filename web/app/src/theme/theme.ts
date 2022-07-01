export interface Theme {
  readonly colors: typeof colors;
}

export const colors = {
  ash: '#949ea6',
  blue: '#53DDFF',
  red: '#fe6666',
  darkRed: '#ff3e3e',
  green: '#51fa14',
  darkGreen: '#4fed15',
};

const theme: Theme = {
  colors,
};

export default theme;
