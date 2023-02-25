import { List } from "./List";
import { SubListProps } from "./index";


export function SubList({ data, txsData, depth }: SubListProps) {

    return (
        <>
            {data.map((list) => (
                <List key={list.name} data={list} depth={depth + 1} txsData={txsData} />
            ))}
        </>
    );
}
