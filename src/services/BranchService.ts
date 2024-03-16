import { IBranch } from "@/interfaces/IBranch";
import axios from "axios";
export const   fetchBranches = async (current_page :number,item_per_page :number,search: string,store_id:number) => {
    return await axios.get('/branches?page='+current_page+'&item_per_page='+item_per_page+'&search='+search+'&store_id='+store_id)  
}

export const fetchCitiesAndStores = async () => {
    return await axios.get('/branches/create')
}
export const saveBranch = async (params:IBranch) => {
    return await axios.post('/branches/save',{...params})
}

export const fetchBranchByID = async (id:number) => {
    return await axios.get('/branches/edit/'+id)
}

export  const updateBranch = async (id:number,params: IBranch) => {
    return await  axios.put("/branches/update/"+id, {...params})
}
