import axios from "axios"
export const   fetchStores = async () => {
    return await axios.get('/stocks')  
}

export const   fetchBranchesAndStock = async (id:number) => {
        return await axios.get('/stocks/fetch-branches/'+id)  
}

export const   fetchStockByBranchID = async (id:number) => {
    return await axios.get('/stocks/fetch-branch-stock/'+id)  
}
