import { ILogin } from "@/interfaces/ILogin"
import axios from "axios"

export const doLogin = async (data: ILogin) => {
    return await axios.post('/token', { email: data.email, password: data.password, recaptcha_token: data.recaptcha_token })  
}

export const doLogOut = async (id: number) => {
    return await axios.post('/logout', { id: id })  
}

export const doForgotPassword = async (data: { email: string; recaptcha_token: string }) => {
    return await axios.post('/forgot-password', data)
}

export const doResetPassword = async (data: any) => {
    return await axios.post('/reset-password', data)
}
