import { characterType } from "../pages/characterTracker";

export default function CharacterProfile({character, deleteFunction, editFunction}: {character: characterType, deleteFunction: Function, editFunction: Function})
{
    return (
        <div className="character-profile-card">
            <p>{character.name}</p>
            <button onClick={() => deleteFunction()}>delete</button>
            <button onClick={() => editFunction()}>edit</button>
        </div>
    )
}