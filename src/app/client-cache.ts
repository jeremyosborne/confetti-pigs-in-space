/**
 * Typed access to client side caching, backed by local storage.
 */
export class ClientCacheLocalStorage<TMemoryCache> {
    key: string;
    memoryCache: TMemoryCache;

    constructor(key: string, memoryCacheInit: TMemoryCache) {
        this.key = key;
        this.memoryCache = memoryCacheInit;
    }

    get<TKey extends keyof TMemoryCache>(key: TKey): TMemoryCache[TKey] {
        return this.memoryCache[key];
    }

    set<TKey extends keyof TMemoryCache>(key: TKey, value: TMemoryCache[TKey]) {
        this.memoryCache[key] = value;
        this.write();
    }

    async write() {
        localStorage.setItem(this.key, JSON.stringify(this.memoryCache));
    }

    async read() {
        const fromDisk = localStorage.getItem(this.key);
        if (fromDisk) {
            try {
                const diskCache = JSON.parse(fromDisk);
                // Lightweight validation on a read.
                for (const [key, value] of Object.entries(this.memoryCache)) {
                    if (
                        typeof value === typeof diskCache[key] &&
                        diskCache[key] !== null
                    ) {
                        this.memoryCache[key] = diskCache[key];
                    } else {
                        throw new Error(
                            `validation failed for localStorage cache key ${key}, from localStorage[${
                                this.key
                            }], value: ${JSON.stringify(diskCache)}`,
                        );
                    }
                }
            } catch (error) {
                console.error("Error reading data from disk cache:", error);
                console.error("Removing malformed disk cache.");
                localStorage.removeItem(this.key);
            }
        }
    }
}

export const clientCache = new ClientCacheLocalStorage(
    "confetti-pigs-in-space",
    {
        score: 0,
        highScore: 0,
    },
);
