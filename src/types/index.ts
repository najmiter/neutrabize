export interface ThemeData {
  name: string;
  classes: {
    date: string[];
    time: string[];
  };
  bg: string;
  kind: 'img' | 'vid';
  displayName: string;
}

export interface ThemesData {
  [key: string]: ThemeData;
}
