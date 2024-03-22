import { ICompany } from "@/interfaces/ICompany";
import axios from "axios";
export const   fetchCompanyDetail = async () => {
    return await axios.get('/company-detail')  
}

export const updateCompanyDetail =async (params:ICompany) => {
    return await axios.post('/company-detail/update',{
        'ntn':params.ntn,
        'address':params.address,
        'strn':params.strn,
        'phone':params.phone,
        'del_px':params.del_px
    })  
}
