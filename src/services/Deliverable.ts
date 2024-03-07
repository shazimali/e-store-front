import { IDeliverable } from "@/interfaces/IDeliverable"
import axios from "axios"

export const fetchDeliverables = async (current_page :number,item_per_page :number,search: string) => {
    return await axios.get('/deliverables?page='+current_page+'&item_per_page='+item_per_page+'&search='+search)  
}

export const fetchProductsAndStores = async () => {
    return await axios.get('/deliverables/create')
}
export const saveDeliverable = async (params:IDeliverable) => {
    return await axios.post('/deliverables/store',{...params})
}

export const fetchDeliverableByID = async (id:number) => {
    return await axios.get('/deliverables/edit/'+id)
}

export  const updateDeliverable = async (id:number,params: IDeliverable) => {
    return await  axios.put("/deliverables/update/"+id, {...params})
}
