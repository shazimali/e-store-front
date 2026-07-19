import axios from 'axios'
import type { IBranch } from '@/interfaces/IBranch'

export const fetchBranches = async (current_page: number, item_per_page: number, search: string, store_id: number | string | null) => {
  const s_id = store_id ? Number(store_id) : ''

  return await axios.get(`/branches?page=${current_page}&item_per_page=${item_per_page}&search=${search}&store_id=${s_id}`)
}

export const fetchCitiesAndStores = async () => {
  return await axios.get('/branches/create')
}
export const saveBranch = async (params: any) => {
  return await axios.post('/branches/save', { ...params })
}

export const fetchBranchByID = async (id: number | string) => {
  return await axios.get(`/branches/edit/${Number(id)}`)
}

export const updateBranch = async (id: number | string, params: any) => {
  return await axios.put(`/branches/update/${Number(id)}`, { ...params })
}
