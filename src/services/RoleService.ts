import axios from "axios"

export const  fetchRoles = async () => {
    return await axios.get('/roles')  
}

export const  fetchPermissions = async () => {
    return await axios.get('/roles/create')  
}

export const saveRole = async (data : IRole) => {
    return await axios.post('/roles/store',{ name:data.name, permissions: data.permissions })
}

export const fetchRoleByID = async (id :number) => {
    return await axios.get('/roles/edit/'+id)
}

export const updateRole = async  (id : number , data : IRole )=>{
    return await axios.put('/roles/update/'+id,{...data})
}

export const deleteRole = async  (id : number)=>{
    return await axios.delete('/roles/delete/'+id)
}
