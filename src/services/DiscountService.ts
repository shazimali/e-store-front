import { IDiscount } from "@/interfaces/IDiscount";
import axios from "axios";

export const fetchDiscounts = async (current_page :number,item_per_page :number,search: string) => {
    return await axios.get('/discounts?page='+current_page+'&item_per_page='+item_per_page+'&search='+search)  
}

export const fetchStores = async () => {
    return await axios.get('/discounts/fetch-stores');
}

export const fetchBranchByStoreID = async (id:number) => {
    return await axios.get('/discounts/fetch-store-branches/' + id); 
}

export const fetchBalanceAndInvoicesByBranchID = async (id:number) => {
    return await axios.get('/discounts/fetch-branch-balance-and-invoices/' + id); 
}

export const saveDiscount = async (params: IDiscount) => {
    return await axios.post('/discounts/store',{...params}); 
}

export const editDiscount = async (id:number) => {
    return await axios.get('/discounts/edit/'+id)
}

export  const updateDiscount = async (id:number,params: IDiscount) => {
    return await  axios.put("/discounts/update/"+id, {...params})
}
