import classNames from "classnames";
import { ReactNode } from "react";
type Tags = 'success' | 'danger' | 'warn'
type Set = { [key in Tags]: boolean }
type Props = {
    set: Partial<Set>,
    children: ReactNode
}
const Tag = (props: Props) => {
    return (
        <span className={classNames('inline-flex ml-2 text-xs font-medium rounded px-1.5 py-0.5 shadow-md', {
            'text-white bg-green-700 shadow-green-600/50': props.set.success,
            'text-white bg-red-700 shadow-red-600/50': props.set.danger,
            'text-white bg-orange-500  shadow-orange-600/50': props.set.warn,
        })}>{props.children}</span>
    );
};

export default Tag;