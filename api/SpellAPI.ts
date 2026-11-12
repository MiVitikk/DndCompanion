import type { Spell, SpellDetails } from '../types/Spell';

const API_BASE_URL = 'https://www.dnd5eapi.co/api/2014/spells';

export async function fetchSpells(): Promise<Spell[]> {
    try{
        const response = await fetch(API_BASE_URL);
        if(!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }
        const data: { results: Spell[] } = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching spells: ', error);
        return [];
    }
}