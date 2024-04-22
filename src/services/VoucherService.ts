import { IVoucher } from "@/interfaces/IVoucher";
import axios from "axios";

export const fetchVouchers = async (current_page :number,item_per_page :number,search: string) => {
    return await axios.get('/vouchers?page='+current_page+'&item_per_page='+item_per_page+'&search='+search)  
}

export const fetchStores = async () => {
    return await axios.get('/vouchers/fetch-stores');
}

export const fetchBranchByStoreID = async (id:number) => {
    return await axios.get('/vouchers/fetch-store-branches/' + id); 
}

export const fetchBranchBalanceByBranchID = async (id:number) => {
    return await axios.get('/vouchers/fetch-branch-balance/' + id); 
}

export const saveVoucher = async (params: IVoucher) => {
    return await axios.post('/vouchers/store',{...params}); 
}

export const editVoucher = async (id:number) => {
    return await axios.get('/vouchers/edit/'+id)
}

export const fetchVoucherByID = async (id:number) => {
    return await axios.get('/vouchers/fetch-voucher/'+id)
}

export  const updateVoucher = async (id:number,params: IVoucher) => {
    return await  axios.put("/vouchers/update/"+id, {...params})
}
