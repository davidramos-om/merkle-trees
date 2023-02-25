import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import type MerkleTree from "merkletreejs";
import { Tree } from 'react-organizational-chart';
import Swal from "sweetalert2";
import html2canvas from "html2canvas";

import { buildChartForRendering, generateMerkleTree, generateMerkleTree_Demo, txsData } from "../../api/MerkleProof-Lib";
import { ChartProps } from "../../types";
import { StyledNode } from "./StyledNode";
import { List } from "./List";
import { getThemeMode } from "../ThemeMode";


type MerkleTreeProps = {
    transactions: ethers.TransactionResponse[];
}

type ItemProps = {
    name: string;
    hash: string;
    children?: any;
}

export type SubListProps = {
    txsData: txsData[];
    data: ItemProps[];
    depth: number;
}

export type ListProps = {
    txsData: txsData[];
    data: ItemProps;
    depth: number;
}


export default function MerkleTreeChart({ transactions }: MerkleTreeProps) {

    const [ mTree, setMtree ] = useState<MerkleTree | null>(null);
    const [ data, setData ] = useState<ChartProps | null>(null);
    const [ txData, setTxData ] = useState<txsData[] | null>(null);
    const divRef = useRef<HTMLDivElement>(null);

    const [ treeSource, setTreeSource ] = useState<'block' | 'demo'>('block');

    useEffect(() => {

        if (treeSource === 'block' && transactions.length === 0)
            return;

        let active = true;

        const { tree, txsData } = treeSource === 'block' ? generateMerkleTree(transactions) : generateMerkleTree_Demo([ 'T1', 'T2', 'T3', 'T4', 'T5' ]);
        const nestedJsonArray = tree.getLayersAsObject();
        const data = buildChartForRendering(nestedJsonArray, 0);

        if (active) {
            setData(data);
            setMtree(tree);
            setTxData(txsData);
        }

        return () => {
            active = false;
        }
    }, [ transactions, treeSource ]);

    useEffect(() => {


        if (divRef.current) {

            divRef.current.scrollTop = 0;
            divRef.current.scrollLeft = divRef.current.scrollWidth / 2;
        }

    }, [ divRef.current ]);

    const handleSaveDivAsImage = () => {

        try {
            const el = document.getElementById('merkle-tree-container');
            if (!el)
                return;

            const theme = getThemeMode();
            console.log(`🐛  -> 🔥 :  handleSaveDivAsImage 🔥 :  theme:`, theme);


            html2canvas(el, {
                backgroundColor: theme === 'dark' ? '#1d2532' : '#ff47b2',
                scale: 2,
                ignoreElements: (el) => {

                    if (el.textContent === '...')
                        return true;

                    return false;
                }
            }).then(canvas => {


                const a = document.createElement("a");
                a.download = "merkle-tree.png";
                a.href = canvas.toDataURL("image/png");
                a.click();

            });
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: error.message || 'Please try again later.'
            })
        }
    }

    return (
        <>
            <h3 className="text-2xl font-bold text-gray-300 dark:text-white mb-6">
                Visualization of Merkle Tree
            </h3>
            <h5 className="text-lg font-bold text-gray-300 dark:text-white mb-6">
                The root hash won't match the one on the blockchain because the data to be hashed differs.
            </h5>
            <span className="bg-purple-100 text-purple-800 text-xs font-medium rounded dark:bg-purple-900 dark:text-purple-300 p-2 font-bold">
                Nonce and tx receipt root are not included in the merkle tree.
            </span>
            <br />
            <div className="flex items-center justify-between mt-6">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-100 dark:text-white">Build tree from :</label>
                    <select
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onChange={(e) => setTreeSource(e.target.value as any)}
                    >
                        <option value="block">Block</option>
                        <option value="demo">Demo</option>
                    </select>
                </div>
                <button
                    className="bg-purple-600 text-white font-bold py-2 px-4 rounded-full hover:bg-purple-700 focus:outline-none focus:shadow-outline"
                    onClick={handleSaveDivAsImage}
                >
                    Save as Image
                </button>
            </div>
            <br />
            <div
                id="merkle-tree-container"
                ref={divRef}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-scroll border border-gray-300 dark:border-gray-700 rounded-md p-2 mb-6"
            >
                <Tree
                    lineWidth="1.5px"
                    nodePadding="2px"
                    lineBorderRadius="30px"
                    lineColor={'green'}
                    label={
                        <StyledNode>
                            <p className="text-sm font-bold text-gray-300 dark:text-white">
                                Top Hash (Root)
                            </p>
                            <br />
                            <p className="text-sm font-bold text-gray-300 dark:text-white">
                                {mTree ? mTree.getRoot().toString('hex') : '...'}
                            </p>
                        </StyledNode>}
                >
                    {data?.children.map((list) => (
                        <List
                            key={list.name}
                            depth={1}
                            data={list}
                            txsData={txData ? txData : []}
                        />
                    ))}
                </Tree>
            </div>
        </>
    );
}
