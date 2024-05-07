export interface IVoucher {
    invoice_id: string,
    store_id: number,
    branch_id: number,
    date: string,
    remarks: string,
    amount:number
}

export interface IVoucherList {
    roles : [IVoucher]
}
