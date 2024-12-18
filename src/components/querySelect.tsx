export interface QuerySelectData {
    queriedData: any;
    name: string;
    value: {get: any, set: Function};
    keyOverride?: string;
}

export default function QuerySelect({ queriedData, name, keyOverride, value } : QuerySelectData)
{
    return (
        <select name={name} key={name} tabIndex={-1} value={value.get[name]} onChange={(e) => value.set((curr: any) => ({...curr, [name]: e.target.value}))}>
            { queriedData && queriedData[keyOverride ? keyOverride : (name + "s")] && 
                queriedData[keyOverride ? keyOverride : (name + "s")].map((r: string) => (
                    <option value={r.toLowerCase()} key={r}>{r}</option>
                ))
            }
        </select>
    )
}