import { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook'
import CharacterProfile from '../components/characterProfile';
import SearchBar, { searchBarValue } from '../components/searchBar';
import FoldableSection from '../components/foldableSection';
import QuerySelect from '../components/querySelect';
import MultiQuerySelect from '../components/multiQuerySelect';
import { NumberInput } from '../components/numberInput';

export interface characterType {
    id: number;
    // Basic Info
    name: string;
    race: string;
    class: string;
    level: number;
    background: string;
    alignment: string;
    origin: string;
    location: string;
  
    // Core Stats
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  
    // Combat Stats
    maxHp: number;
    currentHp: number;
    temporaryHp: number;
    armorClass: number;
    initiative: number;
    speed: number;
  
    // Additional Info
    proficiencyBonus: number;
    inspiration: boolean;
    savingThrows: string[];
    skills: string[];
    languages: string[];
    features: string[];
  
    // Equipment
    inventory: { key: string, value: number }[];
    equipment: { key: string, value: number }[];
    copper?: number;
    silver?: number;
    gold?: number;
    platinum?: number;
      
    // Spellcasting
    spellcastingClass?: string;
    spellcastingAbility?: string;
    spellSlots?: number[];
    spells?: string[];
  
    // Character Details
    personalityTraits: string;
    ideals: string;
    bonds: string;
    flaws: string;
    backstory: string;
}

export const emptyCharacter: characterType = {
    id: 0,
    // Basic Info
    name: "",
    race: "",
    class: "",
    level: 1,
    background: "",
    alignment: "",
    origin: "",
    location: "",

    // Core Stats
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,

    // Combat Stats
    maxHp: 0,
    currentHp: 0,
    temporaryHp: 0,
    armorClass: 0,
    initiative: 0,
    speed: 0,

    // Additional Info
    proficiencyBonus: 0,
    inspiration: false,
    savingThrows: [],
    skills: [],
    languages: [],
    features: [],

    // Equipment
    inventory: [],
    equipment: [],
    copper: 0,
    silver: 0,
    gold: 0,
    platinum: 0,

    // Spellcasting
    spellcastingClass: "",
    spellcastingAbility: "",
    spellSlots: [],
    spells: [],

    // Character Details
    personalityTraits: "",
    ideals: "",
    bonds: "",
    flaws: "",
    backstory: "",
};


function findParentWithClass(element: HTMLElement, className: string): HTMLElement | null {
    if (!element) return null; // Base case: no element (e.g., reached the root)
    if (element.classList && element.classList.contains(className)) {
      return element; // Found the parent with the class
    }
    return findParentWithClass(element.parentElement!, className); // Recurse up the tree
  }
  

export default function CharacterTracker()
{
    const db = useIndexedDB("characters");
    const [characters, setCharacters] = useState<Array<characterType>>([]);
    const [isCreatorOpen, setIsCreatorOpen] = useState(false);
    const [queriedData, setQueriedData] = useState<any>();
    const [activeCharacter, setActiveCharacter] = useState<characterType>(emptyCharacter);

    sessionStorage.setItem("openOverlay", JSON.stringify(isCreatorOpen));

    useEffect(() => {
        const queries = ["races", "classes", "backgrounds", "alignments", "equipment"];
        queries.forEach(query => {
            if (!window.sessionStorage.getItem(query)) {
                fetch(`https://www.dnd5eapi.co/api/${query}/`).then(res => res.json()).then(res => {
                    setQueriedData((data: any) => ({...data, [query]: res.results.map((r: any) => r.name)}));
                    window.sessionStorage.setItem(query, JSON.stringify(res.results.map((r: any) => r.name)));
                })
            } else {
                setQueriedData((data: any) => ({...data, [query]: JSON.parse(window.sessionStorage.getItem(query)!)}));
            }
        });
    }, [])

    useEffect(() => {
        db.getAll().then((res) => {
            setCharacters(res);
        })
    }, [db])

    return (
        <div id="character-container">
            <form id='character-creator' style={{marginBottom: isCreatorOpen ? "0" : "-200vh"}} onSubmit={(e) => {
                e.preventDefault();
                
                if (window.sessionStorage.getItem("newChar") === "true") {
                    const { id, ...newChar} = activeCharacter;
                    db.add(newChar).then(() => {
                        db.getAll().then((res) => {
                            setCharacters(res);
                        })
                    })
                } else {
                    db.update(activeCharacter).then(() => {
                        db.getAll().then((res) => {
                            setCharacters(res);
                        })
                    })
                }

                setIsCreatorOpen(false);
                // do magic ig

            }}>
                <FoldableSection title="Basics">
                    <section>
                        <input type="text" name='name' value={activeCharacter.name} onChange={(e) => setActiveCharacter(curr => ({...curr, name: e.target.value}))} required placeholder="Name" tabIndex={-1} />
                        <QuerySelect queriedData={queriedData} name="race" value={{get: activeCharacter, set: setActiveCharacter}}/>
                        <QuerySelect queriedData={queriedData} name="class" value={{get: activeCharacter, set: setActiveCharacter}} keyOverride="classes"/>
                        <NumberInput name='level' value={{ get: activeCharacter, set: setActiveCharacter }} />
                    </section>
                    <section>
                        <QuerySelect queriedData={queriedData} name="background" value={{get: activeCharacter, set: setActiveCharacter}}/>
                        <QuerySelect queriedData={queriedData} name="alignment" value={{get: activeCharacter, set: setActiveCharacter}}/>
                        <input type="text" name='origin' value={activeCharacter.origin} onChange={(e) => setActiveCharacter(curr => ({...curr, origin: e.target.value.toString()}))} placeholder="Origin" tabIndex={-1} />
                        <input type="text" name='location' value={activeCharacter.location} onChange={(e) => setActiveCharacter(curr => ({...curr, location: e.target.value.toString()}))} placeholder="Location" tabIndex={-1} />
                    </section>
                </FoldableSection>
                <FoldableSection title="Stats">
                    <section>
                        <NumberInput name='strength' value={{ get: activeCharacter, set: setActiveCharacter }} />
                        <NumberInput name='dexterity' value={{ get: activeCharacter, set: setActiveCharacter }} />
                        <NumberInput name='constitution' value={{ get: activeCharacter, set: setActiveCharacter }} />
                        <NumberInput name='intelligence' value={{ get: activeCharacter, set: setActiveCharacter }} />
                        <NumberInput name='wisdom' value={{ get: activeCharacter, set: setActiveCharacter }} />
                        <NumberInput name='charisma' value={{ get: activeCharacter, set: setActiveCharacter }} />
                    </section>
                    <section>
                        <NumberInput name='maxHp' value={{ get: activeCharacter, set: setActiveCharacter }} />
                        <NumberInput name='currentHp' value={{ get: activeCharacter, set: setActiveCharacter }} />
                        <NumberInput name='temporaryHp' value={{ get: activeCharacter, set: setActiveCharacter }} />
                        <NumberInput name='armorClass' value={{ get: activeCharacter, set: setActiveCharacter }} />
                        <NumberInput name='initiative' value={{ get: activeCharacter, set: setActiveCharacter }} />
                        <NumberInput name='speed' value={{ get: activeCharacter, set: setActiveCharacter }} />
                    </section>
                </FoldableSection>
                <FoldableSection title="Proficiency">
                    <section>
                    <NumberInput name='proficiencyBonus' value={{ get: activeCharacter, set: setActiveCharacter }} />
                        <input type="checkbox" name='inspiration' checked={activeCharacter.inspiration} onChange={(e) => setActiveCharacter(curr => ({...curr, inspiration: e.target.checked}))} tabIndex={-1} />
                    </section>
                    <section>
                        <textarea name='savingThrows' value={activeCharacter.savingThrows.join(',')} onChange={(e) => setActiveCharacter(curr => ({...curr, savingThrows: e.target.value.split(',')}))} placeholder='saving throws' tabIndex={-1} />
                        <textarea name='skills' value={activeCharacter.skills.join(',')} onChange={(e) => setActiveCharacter(curr => ({...curr, skills: e.target.value.split(',')}))} placeholder='skills' tabIndex={-1} />
                    </section>
                    <section>
                        <textarea name='languages' value={activeCharacter.languages.join(',')} onChange={(e) => setActiveCharacter(curr => ({...curr, languages: e.target.value.split(',')}))} placeholder='languages' tabIndex={-1} />
                        <textarea name='features' value={activeCharacter.features.join(',')} onChange={(e) => setActiveCharacter(curr => ({...curr, features: e.target.value.split(',')}))} placeholder='features' tabIndex={-1} />
                    </section>
                </FoldableSection>
                <FoldableSection title='Equipment'>
                    <section>
                        <MultiQuerySelect queriedData={queriedData} name={"inventory"} keyOverride={"equipment"} value={{get: activeCharacter, set: setActiveCharacter}}/>
                        <MultiQuerySelect queriedData={queriedData} name={"equipment"} value={{get: activeCharacter, set: setActiveCharacter}}/>
                    </section>
                    <section>
                        <NumberInput name='copper' value={{ get: activeCharacter, set: setActiveCharacter }} />
                        <NumberInput name='silver' value={{ get: activeCharacter, set: setActiveCharacter }} />
                        <NumberInput name='gold' value={{ get: activeCharacter, set: setActiveCharacter }} />
                        <NumberInput name='platinum' value={{ get: activeCharacter, set: setActiveCharacter }} />
                    </section>
                </FoldableSection>
                <FoldableSection title='Spells'>
                    <section>
                        <input type="text" name='spellcastingClass' value={activeCharacter.spellcastingClass} onChange={(e) => setActiveCharacter(curr => ({...curr, spellcastingClass: e.target.value}))} placeholder='spellcasting class' tabIndex={-1} />
                        <input type="text" name='spellcastingAbility' value={activeCharacter.spellcastingAbility} onChange={(e) => setActiveCharacter(curr => ({...curr, spellcastingAbility: e.target.value}))} placeholder='spellcasting ability' tabIndex={-1} />
                    </section>
                    <section>
                        <textarea name='spellSlots' value={activeCharacter.spellSlots?.join(',')} onChange={(e) => setActiveCharacter(curr => ({...curr, spellSlots: e.target.value.split(',').map(Number)}))} placeholder='spellslots' tabIndex={-1} />
                        <textarea name='spells' value={activeCharacter.spells?.join(',')} onChange={(e) => setActiveCharacter(curr => ({...curr, spells: e.target.value.split(',')}))} placeholder='spells' tabIndex={-1} />
                    </section>
                </FoldableSection>
                <FoldableSection title='Details'>
                    <section>
                        <input type="text" name='personalityTraits' value={activeCharacter.personalityTraits} onChange={(e) => setActiveCharacter(curr => ({...curr, personalityTraits: e.target.value}))} placeholder='personality' tabIndex={-1} />
                        <input type="text" name="ideals" value={activeCharacter.ideals} onChange={(e) => setActiveCharacter(curr => ({...curr, ideals: e.target.value}))} placeholder='ideals' tabIndex={-1} />
                        <input type="text" name="bonds" value={activeCharacter.bonds} onChange={(e) => setActiveCharacter(curr => ({...curr, bonds: e.target.value}))} placeholder='bonds' tabIndex={-1} />
                    </section>
                    <section>
                        <input type="text" name="flaws" value={activeCharacter.flaws} onChange={(e) => setActiveCharacter(curr => ({...curr, flaws: e.target.value}))} placeholder='flaws' tabIndex={-1} />
                        <input type="text" name="backstory" value={activeCharacter.backstory} onChange={(e) => setActiveCharacter(curr => ({...curr, backstory: e.target.value}))} placeholder='backstory' tabIndex={-1} />
                    </section>
                </FoldableSection>
                <section>                    <button type="submit" disabled={!isCreatorOpen} onClick={(e) => {
                        const form = (document.getElementById("character-creator") as HTMLFormElement);
                        for (let i = 0; i < form.elements.length; i++) {
                            if (["INPUT", "TEXTAREA"].includes(form.elements[i].nodeName) && !(form.elements[i] as HTMLInputElement).checkValidity())
                            {
                                findParentWithClass(form.elements[i] as HTMLElement, "compressed-section")!.className = "foldable-section-container"
                            }
                        }
                        window.blur();
                    }}>Done</button>
                    <button type="reset" disabled={!isCreatorOpen} onClick={() => {
                        setActiveCharacter(emptyCharacter)
                        setIsCreatorOpen(false);
                    }}>Cancel</button>
                </section>
            </form>
            <div id="character-menu-wrapper">
                <SearchBar placeholder={"Enter a name, or a filter like :level=5"} submit={(e: searchBarValue) => {
                    db.getAll().then((res) => {
                        let newCharacters = res;
                        e.filters.forEach(filter => {
                            newCharacters = newCharacters.filter(c => c[filter.key as keyof characterType].toString() === filter.value);
                        });

                        e.keys.forEach(key => {
                            newCharacters = newCharacters.filter(c => c.name.toLowerCase().includes(key.toLowerCase()));
                        })

                        setCharacters(newCharacters);
                    })
                }}/>

                <button disabled={isCreatorOpen} onClick={() => {
                    setActiveCharacter(emptyCharacter)
                    window.sessionStorage.setItem("newChar", "true");
                    setIsCreatorOpen(true);
                }}>
                    +
                </button>
            </div>
            <div id='character-content'>
                {characters.map(character => (
                    <CharacterProfile character={character} key={character.id} deleteFunction={() => {
                        db.deleteRecord(character.id).then(() => {
                            db.getAll().then((res) => {
                                setCharacters(res);
                            });
                        });
                    }} editFunction={(() => {
                        window.sessionStorage.setItem("newChar", "false");
                        setActiveCharacter(character);
                        setIsCreatorOpen(true);
                    })}/>
                ))}
            </div>
        </div>
    )
}
