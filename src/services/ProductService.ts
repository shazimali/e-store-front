import { IProduct } from '@/interfaces/IProduct'
import axios from "axios"
export const   fetchProducts = async (current_page :number,item_per_page :number,search: string,store_id:string) => {
    return await axios.get('/products?page='+current_page+'&item_per_page='+item_per_page+'&search='+search+'&store_id='+store_id)  
}
export const fetchStores = async () => {
    return await axios.get('/products/create')
}

export const saveProduct = async (params:IProduct) => {
    return await axios.post('/products/store',{...params})
}

export const fetchProductByID = async (id:number) => {
    return await axios.get('/products/edit/'+id)
}

export  const updateProduct = async (id:number,params: IProduct) => {
    return await  axios.post("/products/update/"+id, {...params})
}

export const updateSalePrice = async (params:any) => {
    return await  axios.put("/products/update/sale-price/"+params.id, {'sale_price':params.sale_price})
}
