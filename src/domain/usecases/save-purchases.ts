import { PurchaseModel } from '@/domain/models'
export interface SavePurchases {
    save: (purchases: Array<SavePurchases.Params>) => Promise<void>;

}

export namespace SavePurchases {
    export type Params = {
        id: string
        date: Date
        value: number
    }
}
