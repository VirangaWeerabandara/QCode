import {ReactNode} from "react"


interface Props {
    children:ReactNode | ReactNode []
}


export default function BaseLayout({children }: Props) {
    return (
    <div className = "layout">
        
        {children}
        </div>
    );
}