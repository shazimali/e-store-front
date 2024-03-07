import { IStore } from '@/interfaces/IStore'
import axios from "axios"
export const   fetchStores = async (current_page :number,item_per_page :number,search: string) => {
    return await axios.get('/stores?page='+current_page+'&item_per_page='+item_per_page+'&search='+search)  
}

export const fetchCities = async () => {
    return await axios.get('/stores/create')
}
export const saveStore = async (params:IStore) => {
    return await axios.post('/stores/save',{...params})
}

export const fetchStoreByID = async (id:number) => {
    return await axios.get('/stores/edit/'+id)
}

export  const updateStore = async (id:number,params: IStore) => {
    return await  axios.put("/stores/update/"+id, {...params})
}
