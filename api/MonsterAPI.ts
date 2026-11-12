import type { Monster, MonsterDetails } from '../types/Monster';

const API_BASE_URL = 'https://www.dnd5eapi.co/api/2014/monsters';

export async function fetchMonsters(): Promise<Monster[]> {
    try{
        const response = await fetch(API_BASE_URL);
        if(!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }
        const data: { results: Monster[] } = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching monsters: ', error);
        return [];
    }
}