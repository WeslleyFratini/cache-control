import { LocalSavePurchase } from '@/data/usecases'
import { mockPurchases, CacheStoreSpy } from '@/data/tests'

type SutTypes = {
    sut: LocalSavePurchase
    cacheStore: CacheStoreSpy
}

const makeSut = (timestamp = new Date()): SutTypes => {
    const cacheStore = new CacheStoreSpy()
    const sut = new LocalSavePurchase(cacheStore, timestamp)
    return {
        sut,
        cacheStore
    }
}

describe('LocalSavePurchase', () => {
    test('Should not delete or insert cache on sut.init', () => {
        const { cacheStore } = makeSut()
        expect(cacheStore.actions).toEqual([])

    })

    test('Should not insert new Cache if delete fails', async () => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simulateDeleteError()
        const promise = sut.save(mockPurchases())
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete])
        await expect(promise).rejects.toThrow()
    })

    test('Should insert new Cache if delete succeds', async () => {
        const timestamp = new Date()
        const { cacheStore, sut } = makeSut(timestamp)
        const purchases = mockPurchases()
        const promise = sut.save(purchases)
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete, CacheStoreSpy.Action.insert])
        expect(cacheStore.insertKey).toBe('purchases')
        expect(cacheStore.deleteKey).toBe('purchases')
        expect(cacheStore.insertValues).toEqual({
            timestamp,
            value: purchases
        })
        await expect(promise).resolves.toBeFalsy()
    })

    test('Should throw if insert throw', async () => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simulateInsertError()
        const promise = sut.save(mockPurchases())
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete, CacheStoreSpy.Action.insert])
        await expect(promise).rejects.toThrow()
    })
})    