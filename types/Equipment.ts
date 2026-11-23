export type Weapon = {
  index: string;
  name: string;
  url: string;
}  

export type Armor = {
  index: string;
  name: string;
  url: string;
}

export type WeaponDetails = {
    name: string;
    weapon_category?: string;
    weapon_range?: string;
    damage?: {
        damage_dice: string;
        damage_type: {
            name: string;
        };
    };
    properties?: {
        name: string;
    }[];
    desc?: string[];
}

export type ArmorDetails = {
    name: string;
    armor_category?: string;
    armor_class?: {
        base: number;
        dex_bonus: boolean;
        max_bonus?: number;
    }
    stealth_disadvantage?: boolean;
    desc?: string[];
}