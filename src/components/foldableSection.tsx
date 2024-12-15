import { useState } from "react"

export default function FoldableSection({ title, children }: { title?: string, children?: React.ReactNode })
{
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={"foldable-section-container" + (isOpen ? "" : " compressed-section")}>
            {title !== "" && <p style={{margin: isOpen ? "" : "0"}} onClick={() => {
                setIsOpen(curr => !curr);
            }}>{title}</p>}
            {children}
        </div>
    )
}