export interface IRole {
  id?: number
  name: string
  permissions: []
}

export interface IRoleList {
  roles: [IRole]
}
