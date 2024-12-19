import { useEffect, useState } from "react";
import { QuerySelectData } from "./querySelect";

export function capitalize(str: string): string
{
    return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, s => s.toUpperCase());
}

export default function MultiQuerySelect({ queriedData, name, keyOverride, value } : QuerySelectData)
{
    const [content, setContent] = useState<Array<string>>([]);
    const [lastUpdated, setLastUpdated] = useState("");
    const [inputVal, setInputVal] = useState("");

    useEffect(() => {
        if (queriedData && queriedData[keyOverride ? keyOverride : name]) {
            setContent(queriedData[keyOverride ? keyOverride : name])
        }
    }, [queriedData])

    useEffect(() => {
        value.get[name].forEach((item: any) => {
            if (item.value <= 0) {
                value.set((curr: any) => ({...curr, [name]: curr[name].filter((i: any) => i.key != item.key)}));
            }
        });
    }, [value.get[name]])

    return (
        <div className="multi-query-container">
            <p>{capitalize(name)}</p>
            <div className="multi-query-header">
                <input type="text" name="multiQuerySearch" placeholder="Search" tabIndex={-1} value={inputVal} onChange={(e) => {
                    setInputVal(e.target.value);
                }}/>
                <select name={`multiQueryData-${name}`} value={lastUpdated} onChange={(e) => setLastUpdated(e.target.value)}>
                    {value.get[name].map((item: any) => (
                        <option value={item.key.toLowerCase()} key={item.key}>{item.key} - {item.value}</option>
                    ))}
                </select>
                <div>
                    <button type="button" onClick={(e) => {
                        if (value.get[name].length < 1) return;
                        const val = ((e.target as HTMLElement).parentElement?.previousSibling as HTMLSelectElement).value;
                        let items = value.get[name];
                        items.find((v: any) => v.key === val)!.value++;
                        value.set((curr: any) => ({...curr, [name]: items}));
                    }}>+</button>
                    <button type="button" onClick={(e) => {
                        if (value.get[name].length < 1) return;
                        const val = ((e.target as HTMLElement).parentElement?.previousSibling as HTMLSelectElement).value;
                        let items = value.get[name];
                        if (items.find((v: any) => v.key === val)!.value > 1) {
                            items.find((v: any) => v.key === val)!.value--;   
                        } else {
                            items = items.filter((i: any) => i.key !== val);
                        }
                        value.set((curr: any) => ({...curr, [name]: items}));
                    }}>-</button>
                </div>
            </div>
            <select name="multiQuerySelect" multiple onClick={(e) => {
                const val = e.currentTarget.value;
                let items = value.get[name];
                if (items.find((v: any) => v.key === val)) {
                    items.find((v: any) => v.key === val)!.value++;
                } else
                {
                    items.push({ key: val, value: 1});
                }
                value.set((curr: any) => ({...curr, [name]: items}));
                setLastUpdated(val);
                console.log(val);
                setInputVal("");
            }}>
                {content.filter(c => c.toLowerCase().includes(inputVal.toLowerCase())).map(c => (
                    <option value={c.toLowerCase()} key={c}>{c}</option>
                ))}
            </select>
        </div>
    )
}