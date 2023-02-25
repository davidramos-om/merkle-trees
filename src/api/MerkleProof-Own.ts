import { ethers } from 'ethers';

import { hashValue } from "../utilities/helper";


//* This is a very simple implementation of a merkle tree, there are many more efficient ways to do this
//* Since here I just want to know how it works, I will not use any library for this
//* There are better implementations out there, the ones that have been audited and tested, use for production and by large companies

type MerkleProof = {
    txid: string;
    path: string[];
    merkleRoot: string;
};

export function buildMerkleTree(items: string[]): any {

    if (items.length === 1)
        return items;

    const newItems: string[] = [];

    for (let i = 0; i < items.length; i += 2) {

        const left = items[ i ];
        const pRight = items[ i + 1 ];
        const right = pRight ? pRight : left;
        const _hash = hashValue(left + right);
        newItems.push(_hash);
    }

    return buildMerkleTree(newItems);
}

export function getMerkleRoot(txids: string[]): string {

    const tree = buildMerkleTree(txids);

    return tree[ 0 ];
}

export function getMerklePath(txids: string[], txid: string): string[] {

    const tree = buildMerkleTree(txids);
    const path: string[] = [];

    if (tree.length === 1)
        return path;

    let index = tree.indexOf(txid);
    let siblingIndex = index % 2 === 0 ? index + 1 : index - 1;

    while (index > 0) {

        const sibling = tree[ siblingIndex ];
        path.push(sibling);
        index = Math.floor(index / 2);
        siblingIndex = index % 2 === 0 ? index + 1 : index - 1;
    }

    return path;
}

export function getMerkleProof(txids: string[], txid: string): MerkleProof {

    const path = getMerklePath(txids, txid);
    const root = getMerkleRoot(txids);
    return {
        txid,
        path,
        merkleRoot: root,
    };
}

export function getMerkleProofFromBlock(block: ethers.Block, txid: string): MerkleProof {


    const txids = block.transactions.map(t => t);
    const proof = getMerkleProof(txids, txid);
    return proof;
}


export function verifyMerkleProof(proof: MerkleProof): boolean {

    let hash = proof.txid;

    for (const p of proof.path) {

        if (p < hash)
            hash = hashValue(p + hash);
        else
            hash = hashValue(hash + p);
    }

    return hash === proof.merkleRoot;
}
