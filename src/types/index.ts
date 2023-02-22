export type BlockModel = {
    hash: string;
    height: number;
    chain: string;
    total: number;
    fees: number;
    size: number;
    vsize: number;
    ver: number;
    time: Date;
    received_time: Date;
    relayed_by: string;
    bits: number;
    nonce: number;
    n_tx: number;
    prev_block: string;
    mrkl_root: string;
    txids: string[];
    depth: number;
}


export type TransactionModel = {
    hash: string;
    total: number;
    size: number;
    vsize: number;
    preference: string;
    relayed_by: string;
    confirmed: Date,
    received: Date,
    ver: number;
    double_spend: boolean;
    vin_sz: number;
    vout_sz: number;
    confirmations: number;
    confidence: number;
    fees: number;
    value_btc: number;
    from: string;
    to: string;
}
