import { useRef } from 'react';

type Props = {
    onSubmit: (bloc: number, provider: string) => void;
}

const DEFAULT_PROVIDER = 'https://rpc.ankr.com/eth';
export default function BlockForm({ onSubmit }: Props) {

    const ref = useRef<HTMLInputElement>(null);
    const refProvider = useRef<HTMLSelectElement>(null);

    return (
        <form
            onSubmit={e => {

                e.preventDefault();

                const bloc = parseInt(ref.current?.value || '0');
                if (bloc <= 0)
                    return;

                const prv = refProvider.current?.value || DEFAULT_PROVIDER;
                onSubmit(bloc, prv);
            }}
        >
            <div className="mb-6">
                <br />
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select a Provider</label>
                <select
                    ref={refProvider}
                    id="providers"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    <option value={DEFAULT_PROVIDER}>
                        ankr
                    </option>
                    <option value="https://eth.llamarpc.com">llamarpc</option>
                    <option value="https://eth-rpc.gateway.pokt.network">gateway pokt</option>
                    <option value="https://rpc.payload.de">payload</option>
                    <option value="https://1rpc.io/eth">1rpc</option>
                </select>
                <br />
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Block Number</label>
                <input
                    ref={ref}
                    defaultValue="16681545"
                    type="text"
                    id="block-number-input"
                    className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
            </div>

            <button
                type="submit"
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500
            text-white font-bold py-2 px-4 rounded shadow-lg no-underline
            ">
                Get Block Details
            </button>
        </form>
    );
}