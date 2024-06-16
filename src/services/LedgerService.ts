import axios from "axios"
export const   fetchStores = async () => {
    return await axios.get('/ledgers/fetch-stores')  
}

export const   fetchBranchesByStoreID = async (id:number) => {
    return await axios.get('/ledgers/fetch-store-branches/'+id)  
}

export const   fetchLedger = async (params:any) => {
    console.log(params);
    return await axios.get('/ledgers?'+params) ; 
}

export const   fetchProfitLoss = async (params:any) => {
    return await axios.get('/ledgers/profit-loss?'+params) ; 
}
