export class LocalStorage {
  private static readonly keyPrefix = 'neutrabize_';

  static setItem(key: string, value: string) {
    window.localStorage.setItem(this.keyPrefix + key, value);
  }

  /** Return value for key or default if provided */
  static getItem(key: string, defaultVal: string | null = null): string | null {
    return window.localStorage.getItem(this.keyPrefix + key) ?? defaultVal;
  }

  static removeItem(key: string) {
    window.localStorage.removeItem(this.keyPrefix + key);
  }
}
