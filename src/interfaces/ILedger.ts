export interface ILedger {
    invoice_id: string,
    amount: number,
    date: string,
    remaining: number,
}

export interface IProfitLoss {
    name: string,
    purchase: number,
    sale: string,
    diff: number,
}

export interface IProfitLossList {
    ProfitLoss : [IProfitLoss]
}

export interface ILedgerList {
    stocks : [ILedger]
}

export interface ILedgerForm {
    store_id: string | number,
    branch_id: string | number,
    from_date: string,
    to_date: string,
}

export interface IProfitLossForm {
    store_id: string | number,
    branch_id: string | number,
    item_per_page: string | number,
    page: string | number,
}
