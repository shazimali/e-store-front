import axios from "axios"
import { IUserForm } from '@/interfaces/IUser'
export const   fetchUsers = async () => {
    return await axios.get('/users')  
}

export const   fetchRoles = async () => {
    return await axios.get('/users/create')  
}

export const saveUser = async (params:IUserForm) => {
    return await axios.post('/users/store',{...params})
}

export const fetchUserByID = async (id:number) => {
    return await axios.get('/users/edit/'+id)
}

export  const updateUser= async (id:number,data: IUserForm) => {
    return await  axios.put("/users/update/"+id, {...data})
}

export const  deleteUser = async(id: number)=>{
     return await axios.delete('/users/delete/'+id) 
}
