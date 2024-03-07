import { IPurchase } from "@/interfaces/IPurchase"
import axios from "axios"

export const fetchPurchases = async (current_page :number,item_per_page :number,search: string) => {
    return await axios.get('/purchases?page='+current_page+'&item_per_page='+item_per_page+'&search='+search)  
}

export const fetchProducts = async () => {
    return await axios.get('/purchases/create')
}
export const savePurchase = async (params:IPurchase) => {
    return await axios.post('/purchases/store',{...params})
}

export const fetchPurchaseByID = async (id:number) => {
    return await axios.get('/purchases/edit/'+id)
}

export  const updatePurchase = async (id:number,params: IPurchase) => {
    return await  axios.put("/purchases/update/"+id, {...params})
}
