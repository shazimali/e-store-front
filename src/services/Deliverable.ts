import { IDeliverable, IDeliverableEdit } from "@/interfaces/IDeliverable"
import axios from "axios"

export const fetchDeliverables = async (current_page :number,item_per_page :number,search: string, store_id: number, branch_id: number) => {
    return await axios.get('/deliverables?page='+current_page+'&item_per_page='+item_per_page+'&search='+search+'&store_id='+store_id+'&branch_id='+branch_id)  
}

export const fetchStores = async () => {
    return await axios.get('/deliverables/create')
}

export const fetchBranchesAndProductsByStoreID = async (id:number) => {
    return await axios.get('/deliverables/store-branches-products/'+id)
}

export const fetchBranchesAndProductsByStoreIDEdit = async (store_id:number, deliverable_id:number) => {
    return await axios.get('/deliverables/store-branches-products-edit/'+store_id+'/'+deliverable_id)
}

export const fetchDeliverableByIDForPrint = async (id:number) => {
    return await axios.get('/deliverables/fetch-deliverable-for-print/'+id)
}
export const saveDeliverable = async (params:IDeliverable) => {
    return await axios.post('/deliverables/store',{...params})
}

export const fetchDeliverableByID = async (id:number) => {
    return await axios.get('/deliverables/edit/'+id)
}

export  const updateDeliverable = async (id:number,params: IDeliverableEdit) => {
    return await  axios.put("/deliverables/update/"+id, {...params})
}
