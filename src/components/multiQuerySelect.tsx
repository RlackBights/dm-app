import { useEffect, useState } from "react";
import { QuerySelectData } from "./querySelect";

export default function MultiQuerySelect({ queriedData, name, keyOverride, value } : QuerySelectData)
{
    const [content, setContent] = useState<Array<string>>([]);
    const [selected, setSelected] = useState({});
    const [inputVal, setInputVal] = useState("");

    useEffect(() => {
        if (queriedData && queriedData[keyOverride ? keyOverride : name]) {
            setContent(queriedData[keyOverride ? keyOverride : name])
        }
    }, [queriedData])

    useEffect(() => {
        console.log(window.sessionStorage.getItem(`multi-select-${name}`)!);
        (Object.keys(selected)).forEach(key => {
            if (isNaN(selected[key as keyof typeof selected])) {
                let newObj = selected;
                delete newObj[key as keyof typeof newObj]
                setSelected(newObj);
            }
        });

        window.sessionStorage.setItem(`multi-select-${name}`, JSON.stringify(selected));
    }, [selected])

    return (
        <div className="multi-query-container">
            <div className="multi-query-header">
                <input type="text" name="multiQuerySearch" placeholder="Search" tabIndex={-1} value={inputVal} onChange={(e) => {
                    setInputVal(e.target.value);
                }}/>
                <select name={`multiQueryData-${name}`}>
                    {Object.keys(selected).filter(s => selected[s as keyof typeof selected]).map(s => (
                        <option value={s.toLowerCase()}>{s} - {selected[s as keyof typeof selected]}</option>
                    ))}
                </select>
                <div>
                    <button type="button" onClick={(e) => {
                        const val = ((e.target as HTMLElement).parentElement?.previousSibling as HTMLSelectElement).value;
                        setSelected(curr => ({...curr, [val as keyof typeof selected]: selected[val as keyof typeof selected] + 1}));
                    }}>+</button>
                    <button type="button" onClick={(e) => {
                        const val = ((e.target as HTMLElement).parentElement?.previousSibling as HTMLSelectElement).value;
                        setSelected(curr => ({...curr, [val as keyof typeof selected]: selected[val as keyof typeof selected] - 1}));
                    }}>-</button>
                </div>
            </div>
            <select name="multiQuerySelect" multiple onClick={(e) => {
                const val = e.currentTarget.value;
                setSelected(curr => ({...curr, [val]: (isNaN(curr[val as keyof typeof selected]) ? 1 : curr[val as keyof typeof selected] + 1)}));
                setInputVal("");
            }}>
                {content.filter(c => c.toLowerCase().includes(inputVal.toLowerCase())).map(c => (
                    <option value={c.toLowerCase()} key={c}>{c}</option>
                ))}
            </select>
        </div>
    )
}