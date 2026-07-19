import axios from 'axios'
import type { InfInvoice } from '@/interfaces/InfInvoice'

export const fetchInvoices = async (current_page: number, item_per_page: number, search: string, store_id: number | string, branch_id: number | string) => {
  return await axios.get(`/invoices?page=${current_page}&item_per_page=${item_per_page}&search=${search}&store_id=${store_id}&branch_id=${branch_id}`)
}

export const fetchStoresAndCompany = async () => {
  return await axios.get('/invoices/create')
}

export const fetchBranchesByStoreID = async (id: number | string) => {
  return await axios.get(`/invoices/fetch-store-branches/${id}`)
}

export const fetchProductsByBranchID = async (id: number | string) => {
  return await axios.get(`/invoices/fetch-branch-products/${id}`)
}
export const fetchEditProductsByBranchID = async (branch_id: number | string, invoice_id: number | string) => {
  return await axios.get(`/invoices/edit/fetch-branch-products/${branch_id}/${invoice_id}`)
}

export const fetchInvoiceByIDForPrint = async (id: number | string) => {
  return await axios.get(`/invoices/fetch-invoice-for-print/${id}`)
}
export const saveInvoice = async (params: InfInvoice) => {
  return await axios.post('/invoices/store', { ...params })
}

export const fetchInvoiceByID = async (id: number) => {
  return await axios.get(`/invoices/edit/${id}`)
}

export const updateInvoice = async (id: number, params: InfInvoice) => {
  return await axios.post(`/invoices/update/${id}`, { ...params })
}

export const cancelInvoice = async (id: number) => {
  return await axios.delete(`/invoices/delete/${id}`)
}
