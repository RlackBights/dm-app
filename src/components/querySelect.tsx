export interface QuerySelectData {
    queriedData: any;
    name: string;
    keyOverride?: string; 
}

export default function QuerySelect({ queriedData, name, keyOverride } : QuerySelectData)
{
    return (
        <select name={name} key={name} tabIndex={-1}>
            { queriedData && queriedData[keyOverride ? keyOverride : (name + "s")] && 
                queriedData[keyOverride ? keyOverride : (name + "s")].map((r: string) => (
                    <option value={r.toLowerCase()} key={r}>{r}</option>
                ))
            }
        </select>
    )
}