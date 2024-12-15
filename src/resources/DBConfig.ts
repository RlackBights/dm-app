export const DBConfig = {
  name: "DMDB",
  version: 1,
  objectStoresMeta: [
    {
      store: "characters",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        // Basic Info
        { name: "name", keypath: "name", options: { unique: false } },
        { name: "race", keypath: "race", options: { unique: false } },
        { name: "class", keypath: "class", options: { unique: false } },
        { name: "level", keypath: "level", options: { unique: false } },
        { name: "background", keypath: "background", options: { unique: false } },
        { name: "alignment", keypath: "alignment", options: { unique: false } },
        { name: "origin", keypath: "origin", options: { unique: false } },
        { name: "location", keypath: "location", options: { unique: false }},
        
        // Core Stats
        { name: "strength", keypath: "strength", options: { unique: false } },
        { name: "dexterity", keypath: "dexterity", options: { unique: false } },
        { name: "constitution", keypath: "constitution", options: { unique: false } },
        { name: "intelligence", keypath: "intelligence", options: { unique: false } },
        { name: "wisdom", keypath: "wisdom", options: { unique: false } },
        { name: "charisma", keypath: "charisma", options: { unique: false } },
        
        // Combat Stats
        { name: "maxHp", keypath: "maxHp", options: { unique: false } },
        { name: "currentHp", keypath: "currentHp", options: { unique: false } },
        { name: "temporaryHp", keypath: "temporaryHp", options: { unique: false } },
        { name: "armorClass", keypath: "armorClass", options: { unique: false } },
        { name: "initiative", keypath: "initiative", options: { unique: false } },
        { name: "speed", keypath: "speed", options: { unique: false } },
        
        // Additional Info
        { name: "proficiencyBonus", keypath: "proficiencyBonus", options: { unique: false } },
        { name: "inspiration", keypath: "inspiration", options: { unique: false } },
        { name: "savingThrows", keypath: "savingThrows", options: { unique: false } },
        { name: "skills", keypath: "skills", options: { unique: false } },
        { name: "languages", keypath: "languages", options: { unique: false } },
        { name: "features", keypath: "features", options: { unique: false } },
        
        // Equipment
        { name: "inventory", keypath: "inventory", options: { unique: false } },
        { name: "equipment", keypath: "equipment", options: { unique: false } },
        { name: "copper", keypath: "copper", options: { unique: false } },
        { name: "silver", keypath: "silver", options: { unique: false } },
        { name: "gold", keypath: "gold", options: { unique: false } },
        { name: "platinum", keypath: "platinum", options: { unique: false } },
        
        // Spellcasting
        { name: "spellcastingClass", keypath: "spellcastingClass", options: { unique: false } },
        { name: "spellcastingAbility", keypath: "spellcastingAbility", options: { unique: false } },
        { name: "spellSlots", keypath: "spellSlots", options: { unique: false } },
        { name: "spells", keypath: "spells", options: { unique: false } },
        
        // Character Details
        { name: "personalityTraits", keypath: "personalityTraits", options: { unique: false } },
        { name: "ideals", keypath: "ideals", options: { unique: false } },
        { name: "bonds", keypath: "bonds", options: { unique: false } },
        { name: "flaws", keypath: "flaws", options: { unique: false } },
        { name: "backstory", keypath: "backstory", options: { unique: false } }
      ],
    },
  ],
};