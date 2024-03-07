export interface IRole {
    name: string,
    permissions: []
}

export interface IRoleList {
    roles : [IRole]
}
