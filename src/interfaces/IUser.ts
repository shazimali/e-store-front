export interface IUser {
    name: string,
    email: string,
    password: string|number,
    assigned_roles: [],
}

export interface IUserForm {
    name: string,
    email: string,
    password: string|number,
    password_confirmation: string|number,
    roles:[]
}

export interface IUserList{
    users: [IUser]
}
