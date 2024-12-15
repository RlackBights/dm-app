import { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook'
import CharacterProfile from '../components/characterProfile';
import SearchBar, { searchBarValue } from '../components/searchBar';
import FoldableSection from '../components/foldableSection';

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
    inventory: string[];
    equipment: string[];
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

export default function CharacterTracker()
{
    const db = useIndexedDB("characters");
    const [characters, setCharacters] = useState<Array<characterType>>([]);
    const [isCreatorOpen, setIsCreatorOpen] = useState(false);
    sessionStorage.setItem("openOverlay", JSON.stringify(isCreatorOpen));

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
                            (elemList[i] as HTMLInputElement).value = "";
                            break;
                        default:
                            break;
                    }
                }

                db.add(outObj).then(() => {
                    db.getAll().then((res) => {
                        setCharacters(res);
                        setIsCreatorOpen(false);
                    })
                })
            }}>
                <FoldableSection title="Basics">
                    <section>
                        <input type="text" name='name' placeholder="Name" />
                        <input type="text" name='race' placeholder="Race" />
                        <input type="text" name='class' placeholder="Class"/>
                        <input type="number" name="level" placeholder='LVL' />
                    </section>
                    <section>
                        <input type="text" name='background' placeholder="Background" />
                        <input type="text" name='alignment' placeholder="Alignment" />
                        <input type="text" name='origin' placeholder="Origin" />
                        <input type="text" name='location' placeholder="Location" />
                    </section>
                </FoldableSection>
                <FoldableSection title="Stats">
                    <section>
                        <input type="number" name='strength' placeholder='STR' />
                        <input type="number" name='dexterity' placeholder='DEX' />
                        <input type="number" name='constitution' placeholder='CON' />
                        <input type="number" name='intelligence' placeholder='INT' />
                        <input type="number" name='wisdom' placeholder='WIS' />
                        <input type="number" name='charisma' placeholder='CHA' />
                    </section>
                    <section>
                        <input type="number" name='maxHp' placeholder='MHP' /> 
                        <input type="number" name='currentHp' placeholder='HP' />
                        <input type="number" name='temporaryHp' placeholder='THP' />
                        <input type="number" name='armorClass' placeholder='AC' />
                        <input type="number" name='initiative' placeholder='INI' />
                        <input type="number" name='speed' placeholder='SPD' />
                    </section>
                </FoldableSection>
                <FoldableSection title="Proficiency">
                    <section>
                        <input type="number" name='proficiencyBonus' placeholder='PRF' />
                        <input type="checkbox" name='inspiration' />
                    </section>
                    <section>
                        <textarea name='savingThrows' placeholder='saving throws' />
                        <textarea name='skills' placeholder='skills' />
                    </section>
                    <section>
                        <textarea name='languages' placeholder='languages' />
                        <textarea name='features' placeholder='features' />
                    </section>
                </FoldableSection>
                <FoldableSection title='Equipment'>
                    <section>
                        <textarea name='inventory' placeholder='inventory' />
                        <textarea name='equipment' placeholder='equipment' />
                    </section>
                    <section>
                        <input type="number" name='copper' placeholder='Cu' />
                        <input type="number" name='silver' placeholder='Ag' />
                        <input type="number" name='gold' placeholder='Au' />
                        <input type="number" name='platinum' placeholder='Pt' />
                    </section>
                </FoldableSection>
                <FoldableSection title='Spells'>
                    <section>
                        <input type="text" name='spellcastingClass' placeholder='spellcasting class' />
                        <input type="text" name='spellcastingAbility' placeholder='spellcasting ability' />
                    </section>
                    <section>
                        <textarea name='spellslots' placeholder='spellslots' />
                        <textarea name='spells' placeholder='spells' />
                    </section>
                </FoldableSection>
                <FoldableSection title='Details'>
                    <section>
                        <input type="text" name='personalityTraits' placeholder='personality' />
                        <input type="text" name="ideals" placeholder='ideals' />
                        <input type="text" name="bonds" placeholder='bonds' />
                    </section>
                    <section>
                        <input type="text" name="flaws" placeholder='flaws' />
                        <input type="text" name="backstory" placeholder='backstory' />
                    </section>
                </FoldableSection>
                <section>
                    <button type="submit">Done</button>
                    <button type="reset" onClick={() => {
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
                    setIsCreatorOpen(curr => !curr);
                    // db.add({
                    //     name: "Thorin Ironforge",
                    //     race: "Dwarf",
                    //     class: "Fighter",
                    //     level: 5,
                    //     background: "Soldier",
                    //     alignment: "Lawful Good",
                    //     origin: "Origin City",
                    //     location: "Location City",
                        
                    //     // Core Stats
                    //     strength: 16,
                    //     dexterity: 12,
                    //     constitution: 18,
                    //     intelligence: 10,
                    //     wisdom: 14,
                    //     charisma: 8,
                        
                    //     // Combat Stats
                    //     maxHp: 47,
                    //     currentHp: 47,
                    //     temporaryHp: 0,
                    //     armorClass: 18,
                    //     initiative: 1,
                    //     speed: 25,
                        
                    //     // Additional Info
                    //     proficiencyBonus: 3,
                    //     inspiration: false,
                    //     savingThrows: ["strength", "constitution"],
                    //     skills: ["athletics", "intimidation", "survival"],
                    //     languages: ["Common", "Dwarvish"],
                    //     features: ["Second Wind", "Action Surge", "Extra Attack"],
                        
                    //     // Equipment
                    //     inventory: ["Backpack", "Bedroll", "Waterskin"],
                    //     equipment: ["Plate Armor", "Battleaxe", "Shield"],
                    //     money: {
                    //         copper: 50,
                    //         silver: 100,
                    //         gold: 75,
                    //         platinum: 0
                    //     },
                        
                    //     // Spellcasting (empty since Fighter)
                    //     spellcastingClass: null,
                    //     spellcastingAbility: null,
                    //     spellSlots: {},
                    //     spells: [],
                        
                    //     // Character Details
                    //     personalityTraits: "Never backs down from a challenge",
                    //     ideals: "Honor and duty above all",
                    //     bonds: "Sworn to protect my clan",
                    //     flaws: "Too stubborn for my own good",
                    //     backstory: "Born into the proud Ironforge clan..."
                    // }).then(() => {
                    //     db.getAll().then((res) => {
                    //         setCharacters(res);
                    //     });
                    // })
                }}>
                    +
                </button>
            </div>
            <div id='character-content'>
                {characters.map(character => (
                    <CharacterProfile character={character} deleteFunction={() => {
                        db.deleteRecord(character.id).then(() => {
                            db.getAll().then((res) => {
                                setCharacters(res);
                            });
                        });
                    }}/>
                ))}
            </div>
        </div>
    )
}
