const THUMBNAIL_CACHE_KEY_PREFIX = '@neutrabize:thumbnail_';
const DB_NAME = '@neutrabize:NeutrabizeWallpapers';
const DB_VERSION = 1;
const STORE_NAME = '@neutrabize:wallpapers';

interface CachedWallpaper {
  id: string;
  blob: Blob;
  timestamp: number;
}

class WallpaperManager {
  private db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  async isWallpaperCached(id: string): Promise<boolean> {
    if (!this.db) await this.initDB();
    return new Promise((resolve) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => {
        const result = request.result as CachedWallpaper | undefined;
        resolve(!!result);
      };
      request.onerror = () => resolve(false);
    });
  }

  async getCachedWallpaper(id: string): Promise<Blob | null> {
    if (!this.db) await this.initDB();
    return new Promise((resolve) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => {
        const result = request.result as CachedWallpaper | undefined;
        resolve(result ? result.blob : null);
      };
      request.onerror = () => resolve(null);
    });
  }

  async cacheWallpaper(id: string, blob: Blob): Promise<void> {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({ id, blob, timestamp: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async downloadAndCache(url: string, id: string): Promise<Blob | null> {
    try {
      const cached = await this.getCachedWallpaper(id);
      if (cached) return cached;
      // doesn't handle race conditions, but then again, WHO CARES!
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to download');
      const blob = await response.blob();
      await this.cacheWallpaper(id, blob);
      return blob;
    } catch (error) {
      // console.error('Failed to download wallpaper:', error);
      return null;
    }
  }

  getCachedThumbnailSrc(url: string): string | null {
    const key = THUMBNAIL_CACHE_KEY_PREFIX + btoa(url);
    return localStorage.getItem(key);
  }

  async cacheThumbnail(url: string): Promise<string> {
    try {
      const cached = this.getCachedThumbnailSrc(url);
      if (cached) return cached;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to download thumbnail');
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          const key = THUMBNAIL_CACHE_KEY_PREFIX + btoa(url);
          localStorage.setItem(key, base64);
          resolve(base64);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      // console.error('Failed to cache thumbnail:', error);
      throw error;
    }
  }

  async getWallpaperSrc(themeName: string, url: string): Promise<string | null> {
    try {
      const blob = await this.downloadAndCache(url, themeName);
      if (blob) return URL.createObjectURL(blob);
      return null;
    } catch (error) {
      // console.error('Failed to get wallpaper src:', error);
      return null;
    }
  }

  async getCachedWallpaperUrl(themeName: string): Promise<string | null> {
    try {
      const blob = await this.getCachedWallpaper(themeName);
      if (blob) {
        return URL.createObjectURL(blob);
      }
      return null;
    } catch (error) {
      // console.error('Failed to get cached wallpaper URL:', error);
      return null;
    }
  }

  async getThumbnailSrc(url: string): Promise<string> {
    try {
      return await this.cacheThumbnail(url);
    } catch (error) {
      // console.error('Failed to get thumbnail src:', error);
      return url;
    }
  }
}

export const wallpaperManager = new WallpaperManager();
