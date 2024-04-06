import { InfInvoice } from "@/interfaces/InfInvoice"
import axios from "axios"

export const fetchInvoices = async (current_page :number,item_per_page :number,search: string) => {
    return await axios.get('/invoices?page='+current_page+'&item_per_page='+item_per_page+'&search='+search)  
}

export const fetchStoresAndCompany = async () => {
    return await axios.get('/invoices/create')
}

export const fetchBranchesAndProductsByStoreID = async (id:number) => {
    return await axios.get('/invoices/store-branches-products/'+id)
}

export const fetchInvoiceByIDForPrint = async (id:number) => {
    return await axios.get('/invoices/fetch-invoice-for-print/'+id)
}
export const saveInvoice = async (params:InfInvoice) => {
    return await axios.post('/invoices/store',{...params})
}

// export const fetchInvoiceByID = async (id:number) => {
//     return await axios.get('/invoices/edit/'+id)
// }

// export  const updateDeliverable = async (id:number,params: IDeliverableEdit) => {
//     return await  axios.put("/deliverables/update/"+id, {...params})
// }
