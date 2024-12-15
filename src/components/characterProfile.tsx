import { characterType } from "../pages/characterTracker";

export default function CharacterProfile({character, deleteFunction}: {character: characterType, deleteFunction: Function})
{
    return (
        <div className="character-profile-card">
            <p>{character.name}</p>
            <button onClick={() => deleteFunction()}>delete</button>
        </div>
    )
}