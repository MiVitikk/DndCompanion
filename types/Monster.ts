export type Monster = {
    index: string;
    name: string;
    url: string;
}

export type MonsterDetails = {
    name: string;
    index: string;
    size: string;
    type: string;
    image: string;
    alignment: string;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    charisma: number;
    wisdom: number;
    armor_class: Array<{ type: string; value: number }>;
    hit_points: number;
    speed: {
        walk: string;
        swim?: string;
        fly?: string;
    };
    savingThrows?: Array<{
        value: number;
        proficiency: {
            name: string;
        }
    }>;
    damage_immunities: string[];
    damage_vulnerabilities: string[];
    damage_resistances: string[];
    condition_immunities?: Array<{
        index: string;
        name: string;
        url: string;
    }>;
    senses: {
        passive_perception: number;
        blindsight?: string;
        truesight?: string;
        darkvision?: string;
    };
    special_abilities?: Array<{
        name: string;
        desc: string;
    }>;
    actions?: Array<{
        name: string;
        desc: string;
    }>;
    legendary_actions?: Array<{
        name: string;
        desc: string;
    }>;



}

export type MonsterImage = {
    imageUrl: string;
};