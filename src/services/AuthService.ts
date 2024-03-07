import { ILogin } from "@/interfaces/ILogin"
import axios from "axios"
export const   doLogin = async (data: ILogin) => {
    return await axios.post('/token',{email: data.email, password: data.password})  
}

export const   doLogOut = async (id: number) => {
    return await axios.post('/logout',{id: id})  
}
