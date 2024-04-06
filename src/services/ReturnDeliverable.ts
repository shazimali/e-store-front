import { IReturnDeliverable, IReturnDeliverableEdit } from "@/interfaces/IReturnDeliverable"
import axios from "axios"

export const fetchReturnDeliverables = async (current_page :number,item_per_page :number,search: string) => {
    return await axios.get('/return-deliverables?page='+current_page+'&item_per_page='+item_per_page+'&search='+search)  
}

export const fetchStores = async () => {
    return await axios.get('/return-deliverables/create')
}

export const fetchBranchesByStoreID = async (id:number) => {
    return await axios.get('/return-deliverables/store-branches/'+id)
}

export const fetchProductsByBranchID = async (id:number) => {
    return await axios.get('/return-deliverables/branch-products/'+id)
}

export const fetchReturnDeliverableByIDForPrint = async (id:number) => {
    return await axios.get('/return-deliverables/fetch-deliverable-for-print/'+id)
}
export const saveReturnDeliverable = async (params:IReturnDeliverable) => {
    return await axios.post('/return-deliverables/store',{...params})
}

export const fetchReturnDeliverableByID = async (id:number) => {
    return await axios.get('/return-deliverables/edit/'+id)
}

export  const updateReturnDeliverable = async (id:number,params: IReturnDeliverableEdit) => {
    return await  axios.put("/return-deliverables/update/"+id, {...params})
}
