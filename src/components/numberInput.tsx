import { characterType } from "../pages/characterTracker";
import { capitalize } from "./multiQuerySelect";

export function NumberInput({ name, value } : { name: string, value: { get: characterType, set: Function } })
{
    return (
        <div className="number-input-container">
            <p>{capitalize(name)}</p>
            <input type="number" name={name} value={Number(value.get[name as keyof characterType])} onChange={(e) => value.set((curr: characterType) => ({...curr, [name]: Number(e.target.value)}))} tabIndex={-1} />
        </div>
    )
}