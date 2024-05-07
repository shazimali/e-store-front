export interface IDiscount {
    invoice_id: string,
    store_id: number,
    branch_id: number,
    date: string,
    remarks: string,
    amount:number
}

export interface IDiscountList {
    roles : [IDiscount]
}

export interface InfInvoice {
    invoice_id: string
}
export interface InfInvoiceList {
    invoices : [InfInvoice]
}
