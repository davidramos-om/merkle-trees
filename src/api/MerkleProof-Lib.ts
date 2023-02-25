import { ethers } from "ethers";
import MerkleTree from "merkletreejs";

import { getAlphaLetterIndex, getMerkleableData, hashValue, nSubscript } from "../utilities/helper";
import { ChartProps, ItemProps } from "../types";


export type txsData = {
    txid: string,
    txIndex: string,
    merkleable: string,
    hash: string
}

export function generateMerkleTree(txs: ethers.TransactionResponse[]) {


    const txsData = txs.map((t, idx) => {

        const merkleable = getMerkleableData(t);
        const _d: txsData = {
            txid: t.hash,
            txIndex: getAlphaLetterIndex(idx),
            merkleable: merkleable,
            hash: hashValue(merkleable),
        }
        return _d;
    });

    const leaves = txsData.map(t => t.hash);
    const tree = new MerkleTree(leaves, hashValue, {
        duplicateOdd: true
    });

    return { tree, txsData };
}

export function generateMerkleTree_Demo(txs: string[]) {

    const txsData = txs.map((t, idx) => {

        const merkleable = t;
        const _d: txsData = {
            txid: t,
            txIndex: getAlphaLetterIndex(idx),
            merkleable: merkleable,
            hash: hashValue(merkleable),
        }

        return _d;
    });

    const leaves = txsData.map(t => t.hash);
    const tree = new MerkleTree(leaves, hashValue, { duplicateOdd: true });

    return { tree, txsData };
}

export function verifyMerkleProof(tree: MerkleTree, compresedtxData: string): boolean {

    const leaf = hashValue(compresedtxData);
    const proof = tree.getProof(leaf);
    const root = tree.getRoot().toString('hex')

    return tree.verify(proof, leaf, root);
}

export function visualizeMerkleTree_TreeJs(tree: MerkleTree) {
    console.log(tree.toString());
}


let track = 0;
export function buildChartForRendering(nestedObject: any, d: number): ChartProps {

    if (d === 0)
        track = 1;

    const chartProps: ChartProps = {
        name: "",
        hash: "",
        children: []
    };

    const keys = Object.keys(nestedObject);

    for (let i = 0; i < keys.length; i++) {


        const key = keys[ i ];
        const value = nestedObject[ key ];

        const letter = getAlphaLetterIndex(track);
        const itemProps: ItemProps = {
            name: `H ${(letter)}${nSubscript(i)}`,
            hash: key,
            index: `${letter}${i}`,
            children: []
        };

        if (value) {

            const children = buildChartForRendering(value, track++);
            // const left = (children?.children[ 0 ]?.index || '');
            // const right = children?.children[ 1 ]?.index || '';
            // itemProps.name = `H (${left + "," + right})`;

            const left = (children?.children[ 0 ]?.name || '').replace("H ", "");
            const right = (children?.children[ 1 ]?.name || '').replace("H ", "");
            itemProps.name = `H (${left + "," + right})`
            itemProps.children = [ children ];
        }

        chartProps.children.push(itemProps);
    }

    return chartProps;
}
