/**
 * Typed access to client side caching, backed by local storage.
 *
 * All objects are stored in one JSON-ifiable object and stored in
 * one key-value location of the browser's localStorage.
 *
 * Use when you know your cache size will remain relatively
 * and all objects that need to be stored are JSON friendly.
 */
export class ClientCacheLocalStorage<TMemoryCache> {
    /** Provide a unique key where the objects can be stored. */
    key: string;
    /** Data cached in memory. */
    memoryCache: TMemoryCache;
    /** Time in ms that we throttle writes to localStorage. */
    _writeDelay: number;
    /** If a write is enqueued, this will be populated with the timeout id. */
    _writeEnqueued: ReturnType<typeof setTimeout> | null = null;

    /**
     * @param key provide a key unique to the keys currently used
     * in the localStorage.
     * @param memoryCacheInit you must provide a default value for
     * your memory cache. This value will be used in case the localStorage
     * cache is found to be corrupt, or if it does not exist.
     * @param writeDelay modify the throttling of writing to localStorage (in ms).
     */
    constructor(key: string, memoryCacheInit: TMemoryCache, writeDelay = 1500) {
        this.key = key;
        this.memoryCache = memoryCacheInit;
        this._writeDelay = writeDelay;
    }

    /**
     * Get a single value of our cached data.
     */
    get<TKey extends keyof TMemoryCache>(key: TKey): TMemoryCache[TKey] {
        return this.memoryCache[key];
    }

    /**
     * Set a single value in our memory cache, which will also queue up
     * a write to disk.
     */
    set<TKey extends keyof TMemoryCache>(key: TKey, value: TMemoryCache[TKey]) {
        this.memoryCache[key] = value;
        this.writeEnqueue();
    }

    /**
     * Queue up a throttled write to localStorage of our memoryCache.
     */
    writeEnqueue() {
        if (!this._writeEnqueued) {
            this._writeEnqueued = setTimeout(() => {
                this.write();
            }, this._writeDelay);
        }
    }

    /**
     * Force a write of the memoryCache to disk, which will also clear
     * any write previously enqueued.
     */
    write() {
        if (this._writeEnqueued) {
            clearTimeout(this._writeEnqueued);
            this._writeEnqueued = null;
        }
        localStorage.setItem(this.key, JSON.stringify(this.memoryCache));
    }

    /**
     * Force a read from disk into the memoryCache, with light weight
     * validation.
     */
    read() {
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
