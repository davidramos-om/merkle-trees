import { TreeNode } from 'react-organizational-chart';
import { addressShortener } from "../../utilities/helper";
import Swal from "sweetalert2";

import { StyledNode } from "./StyledNode";
import { ListProps } from "./index";
import { SubList } from "./SubList";

export function List({ data, txsData, depth }: ListProps) {

    const hasChild = data.children && !!data.children;
    const tx = txsData.find((tx) => tx.hash === data.hash);

    const handleShowInfo = () => {

        if (!tx)
            return;

        Swal.fire({
            title: 'Transaction Info for hashing',
            text: tx.merkleable,
            width: 600,
            scrollbarPadding: true,
            padding: '3em',
            color: '#716add',
            background: '#fff url(https://sweetalert2.github.io/images/trees.png)',
            backdrop: `
              rgba(0,0,123,0.4)
              url("https://sweetalert2.github.io/images/nyan-cat.gif")
              left top
              no-repeat
            `
        });
    };

    return (
        <TreeNode
            label={<StyledNode>
                <div className="">
                    <p className="text-sm font-bold text-gray-300 dark:text-white">
                        {`${data.name}`}
                    </p>
                    {tx && <div>
                        <a
                            href={`https://etherscan.io/tx/${tx.txid}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold text-gray-300 dark:text-white cursor-pointer"
                        >
                            {` [T-${tx.txIndex}]`}
                        </a>
                        <br />
                        <button
                            type="button"
                            onClick={handleShowInfo}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g id="evaBookOpenFill0"><g id="evaBookOpenFill1"><path id="evaBookOpenFill2" fill="currentColor" d="M21 4.34a1.24 1.24 0 0 0-1.08-.23L13 5.89v14.27l7.56-1.94A1.25 1.25 0 0 0 21.5 17V5.32a1.25 1.25 0 0 0-.5-.98ZM11 5.89L4.06 4.11A1.27 1.27 0 0 0 3 4.34a1.25 1.25 0 0 0-.48 1V17a1.25 1.25 0 0 0 .94 1.21L11 20.16Z" /></g></g></svg>
                        </button>
                    </div>}
                </div>
                <br />
                <p className="text-sm font-bold text-gray-300 dark:text-white">
                    {addressShortener(data.hash)}
                </p>
            </StyledNode>}>
            {hasChild && <SubList data={data.children} depth={depth} txsData={txsData} />}
        </TreeNode>
    );
}
