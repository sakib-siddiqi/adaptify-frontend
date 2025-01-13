import { ReactNode } from "react";
import Header from "./header";

type Props = {
    children: ReactNode
}
export default function MainLayout(props: Props) {
    return (
        <>
            <Header />
            {props.children}
        </>
    )
}