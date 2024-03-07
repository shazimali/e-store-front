export interface IStore {
    name: string,
    status: string,
    city_id: number|string ,
    email: string,
    phone: number|string ,
    code:string
}

export interface IStoreList {
    roles : [IStore]
}
