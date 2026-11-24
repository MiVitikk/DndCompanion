import { Weapon, Armor } from "../types/Equipment";

export async function  fetchWeapons(): Promise<Weapon[]> {
        
        try {
            const response = await fetch('https://www.dnd5eapi.co/api/2014/equipment-categories/weapon');
            const data: { equipment: Weapon[] } = await response.json();
            return data.equipment;
            console.log('Fetched weapons: ', data);
        } catch (error) {
            console.error('Error fetching weapons: ', error);
            return [];
        
    };
}

export async function  fetchArmors(): Promise<Armor[]> {
        
        try {
            const response = await fetch('https://www.dnd5eapi.co/api/2014/equipment-categories/armor');
            const data: { equipment: Armor[] } = await response.json();
            return data.equipment;
            console.log('Fetched armors: ', data);
        } catch (error) {
            console.error('Error fetching armors: ', error);
            return [];
        
    };
}