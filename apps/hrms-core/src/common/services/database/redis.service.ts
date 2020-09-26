import { Injectable } from '@nestjs/common';
import { createClient, RedisClient } from 'redis';
import { promisify } from 'util';

@Injectable()
export class RedisService {
    private _client: RedisClient;

    /**
     * Get redis client connection instance.
     *
     * `NOTE`: the client does not support promises,
     * Use `RedisService` methods instead.
     */
    get client(): RedisClient {
        if (!this._client) {
            this._client = createClient();
        }

        return this._client;
    }

    /**
     * Get the value of key. If the key does not exist `null` is returned.
     *
     * @param key redis key
     */
    get(key: string): Promise<any> {
        const get = this.promisifyCmd(this.client.get);
        return get(key);
    }

    /**
     * Set key to hold the string value. If key already holds a value,
     *  it is overwritten, regardless of its type.
     *
     * @param key redis key
     * @param value string value
     */
    set(key: string, value: string): Promise<any> {
        const set = this.promisifyCmd(this.client.set);
        return set(key, value);
    }

    /**
     * Increments the number stored at key by one.
     * If the key does not exist, it is set to 1 before performing the operation.
     *
     * @param key redis key
     */
    async incr(key: string): Promise<number> {
        const current = await this.get(key);

        if (!current) {
            await this.set(key, '1');
        } else {
            const incr = this.promisifyCmd(this.client.incr);
            await incr(key);
        }

        return this.get(key);
    }

    /**
     * Set a timeout on key. After the timeout has expired,
     * the key will automatically be deleted.
     *
     * @param key redis key
     * @param interval expiration interval in seconds
     */
    expire(key: string, interval: number): Promise<boolean> {
        const expire = this.promisifyCmd(this.client.expire);
        return expire(key, interval);
    }

    private promisifyCmd(cmd: any) {
        const promise = promisify(cmd).bind(this.client);
        return promise;
    }
}
