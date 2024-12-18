import { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook'
import CharacterProfile from '../components/characterProfile';
import SearchBar, { searchBarValue } from '../components/searchBar';
import FoldableSection from '../components/foldableSection';
import QuerySelect from '../components/querySelect';
import MultiQuerySelect from '../components/multiQuerySelect';

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
                
                const elemList = (e.target as HTMLFormElement).elements;
                let outObj = {};
                for (let i = 0; i < elemList.length; i++)
                {
                    if (findParentWithClass(elemList[i] as HTMLElement, "multi-query-container") && elemList[i].nodeName == "SELECT" && (elemList[i] as HTMLSelectElement).name.includes("multiQueryData")) {
                        const val = JSON.parse(window.sessionStorage.getItem(`multi-select-${(elemList[i] as HTMLSelectElement).name.split('-')[1]}`)!);
                        const nice = Object.keys(val).map(k => ({ key: k, value: val[k]}));
                        console.log(nice);
                        outObj = {...outObj, [(elemList[i] as HTMLSelectElement).name.split('-')[1]]: nice}
                        
                    } else {
                        switch (elemList[i].nodeName) {
                            case "INPUT":
                                switch (elemList[i].getAttribute("type")) {
                                    case "text":
                                        outObj = {...outObj, [elemList[i].getAttribute("name")!.toString()]: (elemList[i] as HTMLInputElement).value};
                                        (elemList[i] as HTMLInputElement).value = "";
                                        break;
                                    case "number":
                                        outObj = {...outObj, [elemList[i].getAttribute("name")!.toString()]: Number((elemList[i] as HTMLInputElement).value)};
                                        (elemList[i] as HTMLInputElement).value = "";
                                        break;
                                    case "checkbox":
                                        outObj = {...outObj, [elemList[i].getAttribute("name")!.toString()]: Boolean((elemList[i] as HTMLInputElement).checked)};
                                        (elemList[i] as HTMLInputElement).value = "";
                                        break;
                                }
                                break;
                            case "TEXTAREA":
                                outObj = {...outObj, [elemList[i].getAttribute("name")!.toString()]: (elemList[i] as HTMLTextAreaElement).value.split('\n')};
                                (elemList[i] as HTMLTextAreaElement).value = "";
                                break;
                            case "SELECT":
                                outObj = {...outObj, [elemList[i].getAttribute("name")!.toString()]: (elemList[i] as HTMLSelectElement).value};
                                (elemList[i] as HTMLSelectElement).value = "";
                            default:
                                break;
                        }
                    }
                }

                if (window.sessionStorage.getItem("charID") !== "-1") {
                    db.update({id: Number(window.sessionStorage.getItem("charID")), ...outObj}).then(() => {
                        db.getAll().then((res) => {
                            setCharacters(res);
                            setIsCreatorOpen(false);
                            window.sessionStorage.setItem("charID", "-1");
                        })
                    })
                } else
                {
                    db.add(outObj).then(() => {
                        db.getAll().then((res) => {
                            setCharacters(res);
                            setIsCreatorOpen(false);
                        })
                    })
                }

            }}>
                <FoldableSection title="Basics">
                    <section>
                        <input type="text" name='name' placeholder="Name" tabIndex={-1} />
                        <QuerySelect queriedData={queriedData} name="race"/>
                        <QuerySelect queriedData={queriedData} name="class" keyOverride="classes"/>
                        <input type="number" name="level" placeholder='LVL' tabIndex={-1} />
                    </section>
                    <section>
                        <QuerySelect queriedData={queriedData} name="background"/>
                        <QuerySelect queriedData={queriedData} name="alignment"/>
                        <input type="text" name='origin' placeholder="Origin" tabIndex={-1} />
                        <input type="text" name='location' placeholder="Location" tabIndex={-1} />
                    </section>
                </FoldableSection>
                <FoldableSection title="Stats">
                    <section>
                        <input type="number" name='strength' placeholder='STR' tabIndex={-1} />
                        <input type="number" name='dexterity' placeholder='DEX' tabIndex={-1} />
                        <input type="number" name='constitution' placeholder='CON' tabIndex={-1} />
                        <input type="number" name='intelligence' placeholder='INT' tabIndex={-1} />
                        <input type="number" name='wisdom' placeholder='WIS' tabIndex={-1} />
                        <input type="number" name='charisma' placeholder='CHA' tabIndex={-1} />
                    </section>
                    <section>
                        <input type="number" name='maxHp' placeholder='MHP' tabIndex={-1} /> 
                        <input type="number" name='currentHp' placeholder='HP' tabIndex={-1} />
                        <input type="number" name='temporaryHp' placeholder='THP' tabIndex={-1} />
                        <input type="number" name='armorClass' placeholder='AC' tabIndex={-1} />
                        <input type="number" name='initiative' placeholder='INI' tabIndex={-1} />
                        <input type="number" name='speed' placeholder='SPD' tabIndex={-1} />
                    </section>
                </FoldableSection>
                <FoldableSection title="Proficiency">
                    <section>
                        <input type="number" name='proficiencyBonus' placeholder='PRF' tabIndex={-1} />
                        <input type="checkbox" name='inspiration' tabIndex={-1} />
                    </section>
                    <section>
                        <textarea name='savingThrows' placeholder='saving throws' tabIndex={-1} />
                        <textarea name='skills' placeholder='skills' tabIndex={-1} />
                    </section>
                    <section>
                        <textarea name='languages' placeholder='languages' tabIndex={-1} />
                        <textarea name='features' placeholder='features' tabIndex={-1} />
                    </section>
                </FoldableSection>
                <FoldableSection title='Equipment'>
                    <section>
                        <MultiQuerySelect queriedData={queriedData} name={"inventory"} keyOverride={"equipment"}/>
                        <MultiQuerySelect queriedData={queriedData} name={"equipment"}/>
                    </section>
                    <section>
                        <input type="number" name='copper' placeholder='Cu' tabIndex={-1} />
                        <input type="number" name='silver' placeholder='Ag' tabIndex={-1} />
                        <input type="number" name='gold' placeholder='Au' tabIndex={-1} />
                        <input type="number" name='platinum' placeholder='Pt' tabIndex={-1} />
                    </section>
                </FoldableSection>
                <FoldableSection title='Spells'>
                    <section>
                        <input type="text" name='spellcastingClass' placeholder='spellcasting class' tabIndex={-1} />
                        <input type="text" name='spellcastingAbility' placeholder='spellcasting ability' tabIndex={-1} />
                    </section>
                    <section>
                        <textarea name='spellslots' placeholder='spellslots' tabIndex={-1} />
                        <textarea name='spells' placeholder='spells' tabIndex={-1} />
                    </section>
                </FoldableSection>
                <FoldableSection title='Details'>
                    <section>
                        <input type="text" name='personalityTraits' placeholder='personality' tabIndex={-1} />
                        <input type="text" name="ideals" placeholder='ideals' tabIndex={-1} />
                        <input type="text" name="bonds" placeholder='bonds' tabIndex={-1} />
                    </section>
                    <section>
                        <input type="text" name="flaws" placeholder='flaws' tabIndex={-1} />
                        <input type="text" name="backstory" placeholder='backstory' tabIndex={-1} />
                    </section>
                </FoldableSection>
                <section>
                    <button type="submit" disabled={!isCreatorOpen} onClick={(e) => {
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
                        setIsCreatorOpen(false);
                        window.sessionStorage.setItem("charID", "-1");
                        window.blur();
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
                    setIsCreatorOpen(curr => !curr);
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
                        window.sessionStorage.setItem("charID", character.id.toString());
                        const elemList = (document.getElementById("character-creator") as HTMLFormElement).elements;
                        for (let i = 0; i < elemList.length; i++)
                        {
                            switch (elemList[i].nodeName) {
                                case "INPUT":
                                    switch (elemList[i].getAttribute("type")) {
                                        case "text":
                                            (elemList[i] as HTMLInputElement).value = character[elemList[i].getAttribute("name")! as keyof characterType]!.toString();
                                            break;
                                        case "number":
                                            (elemList[i] as HTMLInputElement).valueAsNumber = Number(character[elemList[i].getAttribute("name")! as keyof characterType]!);
                                            break;
                                        case "checkbox":
                                            (elemList[i] as HTMLInputElement).value = character[elemList[i].getAttribute("name")! as keyof characterType]!.toString();
                                            break;
                                    }
                                    break;
                                case "TEXTAREA":
                                    (elemList[i] as HTMLTextAreaElement).value = (character[elemList[i].getAttribute("name")! as keyof characterType]! as string[]).join('\n');
                                    break;
                                case "SELECT":
                                    if (!findParentWithClass(elemList[i] as HTMLElement, "multi-query-container")) (elemList[i] as HTMLSelectElement).value = character[elemList[i].getAttribute("name")! as keyof characterType]!.toString();
                                    else if ((elemList[i] as HTMLSelectElement).name.includes("multiQueryData")) 
                                    {
                                        const dbValues = character[elemList[i].getAttribute("name")!.split('-')[1] as keyof characterType];
                                        let valObj = {};
                                        (dbValues as any).forEach((val: any) => {
                                            valObj = {...valObj, [val.key]: val.value};
                                        });
                                        
                                        window.sessionStorage.setItem(`multi-select-${(elemList[i] as HTMLSelectElement).name.split('-')[1]}`, JSON.stringify(valObj));
                                    }
                                default:
                                    break;
                            }
                        }

                        setIsCreatorOpen(true);
                    })}/>
                ))}
            </div>
        </div>
    )
}
