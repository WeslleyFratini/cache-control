import { CacheStore } from '@/data/protocols/cache'

export class LocalSavePurchase {

    constructor(private readonly cacheStore: CacheStore) { }
    async save(): Promise<void> {
        this.cacheStore.delete('purchases')

    }

}
