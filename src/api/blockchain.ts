import { ethers } from 'ethers';
import { BlockModel, TransactionModel } from '../types/';

const SATOSHIS_PER_BTC = 100000000;
const PROVIDER_INSTANCES: { [ key: string ]: ethers.JsonRpcProvider } = {};

function getProviderInstance(providerRpc: string) {

    if (!PROVIDER_INSTANCES[ providerRpc ])
        PROVIDER_INSTANCES[ providerRpc ] = new ethers.JsonRpcProvider(providerRpc);

    return PROVIDER_INSTANCES[ providerRpc ];
}

function setProviderInstance(providerRpc: string, instance: ethers.JsonRpcProvider) {

    if (PROVIDER_INSTANCES[ providerRpc ])
        return;

    PROVIDER_INSTANCES[ providerRpc ] = instance;
}

export async function getEthBlock(blockNumber: number, providerRpc: string) {

    const PROVIDER = getProviderInstance(providerRpc);
    setProviderInstance(providerRpc, PROVIDER);
    const block = await PROVIDER.getBlock(blockNumber, true);
    if (!block)
        return null;

    const txs = await Promise.all(block.transactions.map(hash => block.getPrefetchedTransaction(hash)));
    return {
        block,
        transactions: txs,
    };
}

export function totalGwei(transaction: ethers.Block) {

    const gasPrice = transaction.gasUsed;
    const gasLimit = transaction.gasLimit;
    const totalGwei = gasPrice * gasLimit;
    return totalGwei;
}

export function calculateBurnFee(transaction: ethers.Block) {

    const _totalGwei = totalGwei(transaction)
    const _totalEth = parseFloat(ethers.formatEther(_totalGwei));
    const _totalBurnFee = _totalEth * 0.1;
    return _totalBurnFee;
}

export function getEnsName(address: string, providerRpc: string) {

    setProviderInstance(providerRpc, getProviderInstance(providerRpc));
    const PROVIDER = getProviderInstance(providerRpc);
    return PROVIDER.lookupAddress(address);
}

export function MapToBlockData(block: any): BlockModel {
    return {
        hash: block.hash || '',
        height: block.height || 0,
        chain: block.chain || '',
        total: block.total || 0,
        fees: block.fees || 0,
        size: block.size || 0,
        vsize: block.vsize || 0,
        ver: block.ver || 0,
        time: block.time ? new Date(block.time) : new Date(0),
        received_time: block.received_time ? new Date(block.received_time) : new Date(0),
        relayed_by: block.relayed_by || '',
        bits: block.bits || 0,
        nonce: block.nonce || 0,
        n_tx: block.n_tx || 0,
        prev_block: block.prev_block || '',
        mrkl_root: block.mrkl_root || '',
        txids: block.txids || [],
        depth: 0,
    }
}

export function MapTransactionData(tx: any): TransactionModel {
    return {
        hash: tx.hash || '',
        total: tx.total || 0,
        from: tx.addresses?.[ 0 ] || '',
        to: tx.addresses?.[ 1 ] || '',
        fees: tx.fees || 0,
        size: tx.size || 0,
        vsize: tx.vsize || 0,
        preference: tx.preference || '',
        relayed_by: tx.relayed_by || '',
        confirmed: tx.confirmed ? new Date(tx.confirmed) : new Date(0),
        received: tx.received ? new Date(tx.received) : new Date(0),
        ver: tx.ver || 0,
        double_spend: tx.double_spend || false,
        vin_sz: tx.vin_sz || 0,
        vout_sz: tx.vout_sz || 0,
        confirmations: tx.confirmations || 0,
        confidence: tx.confidence || 0,
        value_btc: (tx.ttotal || 0) / SATOSHIS_PER_BTC,
    };
}

export const getBlockData = async (block: number) => {

    const response = await fetch(`https://api.blockcypher.com/v1/btc/main/blocks/${block}`);
    const data = await response.json();
    console.log(data);
    return MapToBlockData(data);
}

export async function getTrasactionDetails(txIDs: string[]) {

    if (!Array.isArray(txIDs))
        return [];

    const promises = txIDs.map(async (txID) => {

        //execute the request every 100ms to avoid rate limiting

        try {

            await new Promise(resolve => setTimeout(resolve, 1000));
            console.info('getting tx : ' + txID)
            const response = await fetch(`https://api.blockcypher.com/v1/btc/main/txs/${txID}`);
            const data = await response.json();
            return data;

        } catch (error) {

            console.error(error);
            return null;
        }

    });



    const result = await Promise.all(promises);

    if (Array.isArray(result))
        return result.map(MapTransactionData);

    return [];
}



