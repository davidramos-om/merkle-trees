
import { formatUnits, TransactionResponse } from 'ethers'
import { useEffect, useState } from "react";
import { addressShortener, formatNumber } from "../utilities/helper";

type Props = {
    transactions: TransactionResponse[];
}

function SortIcon() {
    return (
        <a href="#"><svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 ml-1" aria-hidden="true" fill="currentColor" viewBox="0 0 320 512"><path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" /></svg></a>
    );
}

const paginationNavs = 3;
const rowsPerPage = 10;
export default function BlockTransactions({ transactions }: Props) {

    const [ page, setPage ] = useState(1);

    const totalPages = Math.ceil(transactions.length / rowsPerPage);


    useEffect(() => {
        setPage(1);
    }, [ transactions.at(0)?.hash ]);

    const handlePageChange = (page: number) => {

        if (page > 0 && page <= totalPages)
            setPage(page);
    }

    const handleNextPage = () => {

        if (page < totalPages)
            setPage(page + 1);
    }

    const handlePreviousPage = () => {

        if (page > 1)
            setPage(page - 1);
    }

    const handleLastPage = () => {
        setPage(totalPages);
    }

    const liToDisplay = Array.from({ length: totalPages > paginationNavs ? paginationNavs : totalPages }, (_, i) => i + page).filter((i) => i > 0 && i <= totalPages);
    const displayDots = totalPages > paginationNavs && page < totalPages - 2;
    const displayTransactions = transactions.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-6">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Hash
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <div className="flex items-center">
                                    Value
                                    <SortIcon />
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <div className="flex items-center">
                                    From
                                    <SortIcon />
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <div className="flex items-center">
                                    To
                                    <SortIcon />
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <div className="flex items-center">
                                    Nonce
                                    <SortIcon />
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <div className="flex items-center">
                                    Gas Price
                                    <SortIcon />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayTransactions.map((transaction, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <a
                                        href={`https://etherscan.io/tx/${transaction.hash}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {addressShortener(transaction.hash)}
                                    </a>
                                </th>
                                <td className="px-6 py-4">
                                    {(formatNumber(formatUnits(transaction.value, 'wei')))}
                                </td>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <a
                                        href={`https://etherscan.io/address/${transaction.from}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {addressShortener(transaction.from)}
                                    </a>
                                </th>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <a
                                        href={`https://etherscan.io/address/${transaction.to}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {addressShortener(transaction.to || 'Contract')}
                                    </a>
                                </th>
                                <td className="px-6 py-4">
                                    {transaction.nonce}
                                </td>
                                <td className="px-6 py-4">
                                    {(formatNumber(formatUnits(transaction.gasPrice, 'wei')))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>               
            </div>
            <nav className="flex items-center justify-between pt-4" aria-label="Table navigation">
                <span className="text-sm font-normal text-gray-100 dark:text-gray-400">
                    Showing
                    <span className="font-semibold text-gray-100 dark:text-white">
                        {` ${(page - 1) * rowsPerPage + 1} - ${(page - 1) * rowsPerPage + displayTransactions.length}`}
                    </span> of <span className="font-semibold text-gray-100 dark:text-white">
                        {transactions.length}
                    </span>
                </span>
                <ul className="inline-flex items-center -space-x-px">
                    <li>
                        <a
                            className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            aria-label="Previous"
                            onClick={handlePreviousPage}
                        >
                            <span className="sr-only">Previous</span>
                            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                        </a>
                    </li>

                    {liToDisplay.map((li) => {
                        return (
                            <li key={li}>
                                <a
                                    className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    onClick={() => handlePageChange(li)}
                                >
                                    {li}
                                </a>
                            </li>
                        )
                    })}

                    {displayDots && (
                        <li>
                            <a
                                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">...</a>
                        </li>
                    )}

                    <li>
                        <a
                            className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            aria-label="Next"
                            onClick={handleNextPage}
                        >
                            <span className="sr-only">Next</span>
                            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                        </a>
                    </li>
                </ul>
            </nav>
        </>
    );
}