import { useEffect, useState } from "react";
import { formatDistanceToNow, format } from 'date-fns';
import { Block, formatUnits } from 'ethers';

import { getEnsName } from "../api/blockchain";
import { addressShortener, formatNumber } from "../utilities/helper";
import { MagicIcon } from "./MagicIcon";

type Props = {
    blockData: Block;
    rpcProvider: string;
    onBlockChange: (block: number) => void;
}

export default function BlockData({ blockData, rpcProvider, onBlockChange }: Props) {

    return (
        <>
            <div className="px-8 py-32">
                <div className="grid gap-8 items-start justify-center">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                        <button className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600">
                            <span className="flex items-center space-x-5">
                                <MagicIcon />
                                <span className="pr-6 text-gray-100"> Block Height is {blockData.number}</span>
                            </span>
                            <span
                                className="pl-6 text-indigo-400 group-hover:text-gray-100 transition duration-200"
                                onClick={() => {
                                    if (blockData.number > 0)
                                        onBlockChange(blockData.number + 1);
                                }}
                            >
                                Next Block &rarr;
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <BlockDataDetails blockData={blockData} rpcProvider={rpcProvider} />
        </>
    );
}

function BlockDataDetails({ blockData, rpcProvider }: { blockData: Block, rpcProvider: string; }) {

    const [ ensName, setEnsName ] = useState<string | null>(null);

    useEffect(() => {

        let active = true;

        const cb = async () => {

            const ens = await getEnsName(blockData.miner, rpcProvider);
            if (ens)
                setEnsName(ens);
        }

        cb();

        return () => {
            active = false;
        }

    }, [ rpcProvider, blockData.miner ]);

    return (
        <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <div className="relative flex flex-col min-w-0 break-words rounded-lg mb-6 xl:mb-0 shadow-lg border-2 border-thin">
                    <div className="flex-auto p-4">
                        <div className="flex flex-wrap">
                            <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                                <h5 className="text-blueGray-100 uppercase font-bold text-xs">Status</h5>
                                <span
                                    className={`font-bold text-xl ${blockData.number > 0 ? "text-green-500" : "text-red-500"}`}
                                >
                                    {blockData.number > 0 ? "Success" : "Failed"}
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-emerald-100 mt-4">
                            <span className="mr-2">
                                Timestamp
                            </span>
                            <span className="whitespace-nowrap">
                                {` ${formatDistanceToNow(blockData.timestamp * 1000)}`}
                                <span className="font-bold">
                                    {` (${format(blockData.timestamp * 1000, 'dd-MM-yy HH:mm')})`}
                                </span>
                            </span>
                        </p>
                        <p className="text-sm text-emerald-100 mt-4">
                            <span className="mr-2">
                                Transactions:
                            </span>
                            <span className="whitespace-nowrap">
                                {blockData.transactions.length}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <div className="relative flex flex-col min-w-0 break-words rounded-lg mb-6 xl:mb-0 shadow-lg border-2 border-thin">
                    <div className="flex-auto p-4">
                        <div className="flex flex-wrap">
                            <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                                <h5 className="text-blueGray-100 uppercase font-bold text-xs">Fee Recipient:</h5>
                                <span>
                                    <a
                                        href={`https://etherscan.io/address/${blockData.miner}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`font-bold text-xl ${blockData.number > 0 ? "text-green-500" : "text-red-500"}`}
                                    >
                                        {ensName ? ensName : addressShortener(blockData.miner || "Pending")}
                                    </a>
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-emerald-100 mt-4">
                            <span className="mr-2">
                                Gas Used:
                            </span>
                            <span className="whitespace-nowrap">
                                {formatNumber(formatUnits(blockData.gasUsed, 'wei'))}
                            </span>
                        </p>
                        <p className="text-sm text-emerald-100 mt-2">
                            <span className="mr-2">
                                Gas Limit:
                            </span>
                            <span className="whitespace-nowrap">
                                {formatNumber(formatUnits(blockData.gasLimit, 'wei'))}
                            </span>
                        </p>
                        <p className="text-sm text-emerald-100 mt-2">
                            <span className="mr-2">
                                Base Fee Per Gas:
                            </span>
                            <span className="whitespace-nowrap">
                                {blockData.baseFeePerGas ? formatNumber(formatUnits(blockData.baseFeePerGas, 'wei')) : "N/A"}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <div className="relative flex flex-col min-w-0 break-words rounded-lg mb-6 xl:mb-0 shadow-lg border-2 border-thin">
                    <div className="flex-auto p-4">
                        <div className="flex flex-wrap">
                            <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                                <h5 className="text-blueGray-100 uppercase font-bold text-xs">Hash</h5>
                                <span>
                                    <a
                                        href={`https://etherscan.io/block/${blockData.hash}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`font-bold text-xl text-emerald-900`}
                                    >
                                        {blockData.hash ? addressShortener(blockData.hash) : "Pending"}
                                    </a>
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-emerald-100 mt-4">
                            <span className="mr-2">
                                Parent Hash:
                            </span>
                            <span className="whitespace-nowrap">
                                <a
                                    href={`https://etherscan.io/block/${blockData.parentHash}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`font-bold text-xl text-emerald-900`}
                                >
                                    {blockData.parentHash ? addressShortener(blockData.parentHash) : "Pending"}
                                </a>
                            </span>
                        </p>
                        <p className="text-sm text-emerald-100 mt-2">
                            <span className="mr-2">
                                Nonce:
                            </span>
                            <span className="whitespace-nowrap">
                                {blockData.nonce}
                            </span>
                        </p>                        
                    </div>
                </div>
            </div>
        </div>
    );
}