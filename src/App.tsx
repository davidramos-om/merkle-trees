import './App.css'
import { useEffect, useState } from "react";
import { Block, TransactionResponse } from 'ethers';

import { ThemeMode } from './components/ThemeMode';
import BlockForm from './components/BlockForm';
import BlockTransactions from "./components/BlockTransactions";
import BlockData from "./components/BlockData";
import { getEthBlock } from './api/blockchain';

function App() {

  const [ blockData, setBlockData ] = useState<Block | null>(null);
  const [ transactions, setTransactions ] = useState<TransactionResponse[]>([]);
  const [ params, setParams ] = useState<{ block: number, provider: string }>({ block: 0, provider: '' });

  useEffect(() => {

    let active = true;

    const cb = async () => {

      if (!params.block || !params.provider)
        return;

      const data = await getEthBlock(params.block, params.provider);
      if (!data)
        return;

      if (active)
        setBlockData(data.block);

      if (active)
        setTransactions(data.transactions);
    }

    cb();

    return () => {
      active = false;
    }
  }, [ params.block, params.provider ]);


  const handleSubmit = (block: number, prov: string) => {

    // if (block !== params.block && prov !== params.provider)
    setParams({ block, provider: prov });
  }

  const handleSetBlock = (block: number) => {
    setParams({ ...params, block });
  }

  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">

      <ThemeMode />
      <div className="flex flex-row items-center justify-center text-gray-600" >
        <img
          src="/merkle-tree-logo.png"
          alt="logo"
          width={280}
          height={180}
        />
      </div>
      <div className="flex flex-row items-center justify-center text-gray-600" >
        <div className="max-w-screen-md mb-8 mt-8 lg:mb-16 lg:mt-16">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            What is
          </h2>
          <h1
            className="
            font-extrabold text-transparent text-5xl lg:text-8xl bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 bg-gradient-to-b from-gray-900 via-purple-900 to-violet-600 dark:from-green-900 via-blue-900  dark:to-orange-900"
          >
            Merkle Tree?
          </h1>
          <p className="text-gray-200 sm:text-xl dark:text-gray-400">
            It is a binary tree in which every leaf node is labelled with the hash of a data block and every non-leaf node is labelled with the cryptographic hash of the labels of its child nodes. The root of the tree, labelled with the hash of all the data in the tree, can be used to verify the contents of any leaf node in the tree without having to reveal the contents of that node or the entire tree.
          </p>
        </div>

        <div className="bg-transparent shadow-lg rounded-lg p-6 border-b-2 border-t-2 border-r-1 border-l-1.5 ">
          <BlockForm onSubmit={handleSubmit} />
        </div>
      </div>
      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

      {blockData && (
        <BlockData
          blockData={blockData}
          rpcProvider={params.provider}
          onBlockChange={handleSetBlock}
        />
      )}

      <div className="bg-transparent shadow-lg rounded-lg p-6 border-1 ">
        <BlockTransactions
          transactions={transactions}
        />
      </div>
    </div>
  );
}

export default App;