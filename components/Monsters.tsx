import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button, Modal, Image, ActivityIndicator, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { fetchMonsters } from '../api/MonsterAPI';

type Monster = {
    index: string;
    name: string;
    url: string;
}

type MonsterDetails = {
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



}


export default function Monsters() {
    const [monsters, setMonsters] = useState<Monster[]>([]);
    const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
    const [monsterDetails, setMonsterDetails] = useState<MonsterDetails | null>(null);
    const [index, setIndex] = useState('')
    const [loading, setLoading] = useState(false)

    // Fetches the list of monsters from the API
    const loadMonsters = async () => {
        setLoading(true);
        const fetchedMonsters = await fetchMonsters();
        setMonsters(fetchedMonsters);
        setLoading(false);
    }
    /* const fetchMonsters = async () => {
        try {
            const response = await fetch('https://www.dnd5eapi.co/api/2014/monsters');
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            const data: { results: Monster[] } = await response.json();
            setMonsters(data.results);
        } catch (error) {
            console.error('Error fetching monsters: ', error);
        }
    }; */
    // Fetches monster details from the API
    const fetchMonsterDetails = async (index: string) => {
        setLoading(true);
        try {
            const response = await fetch(`https://www.dnd5eapi.co/api/2014/monsters/${index}`);
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            const data: MonsterDetails = await response.json();
            setMonsterDetails(data);
            console.log('Fetched monster details: ', data);
            console.log('Monster image URL: ', data.image);
        } catch (error) {
            console.error('Error fetching monster details: ', error);
        }
        setLoading(false);
    }

    useEffect(() => {
        loadMonsters();
    }, []);

    return (
        <View style={styles.container}>
            <Text>Here be monsters!</Text>
            <FlatList
                data={monsters}
                style={styles.list}
                keyExtractor={(item) => item.index}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>{item.name}</Text>
                        <Button title="View Details" color={styles.button.color} onPress={() => {
                            setSelectedMonster(item);
                            setIndex(item.index);
                            fetchMonsterDetails(item.index);
                        }} />
                    </View>
                )}
            />
            <Modal
                animationType="slide"
                backdropColor='#f7e7d1'
                visible={selectedMonster !== null}
                onRequestClose={() => setSelectedMonster(null)}
            >
                <View style={styles.modalContent}>
                    {monsterDetails && (
                        <ScrollView>
                            <View>
                                {loading ? <ActivityIndicator size="large" color="#ff0000" /> :
                                    <Image source={{ uri: `https://www.dnd5eapi.co${monsterDetails.image}` }} style={{ width: 400, height: 200 }} />
                                }
                                <Text style={styles.modalHeader}>{monsterDetails.name}</Text>
                                <Text style={{ fontStyle: 'italic' }}>{monsterDetails.size} {monsterDetails.type}, {monsterDetails.alignment}</Text>
                                <View>
                                    <View style={styles.separator} />
                                    <Text>Armor Class: {monsterDetails.armor_class[0].value} {"\n"}
                                        Hit Points: {monsterDetails.hit_points}{"\n"}
                                        {monsterDetails.speed.walk || monsterDetails.speed.swim || monsterDetails.speed.fly ? (
                                            <Text>Speed: {monsterDetails.speed.walk}{monsterDetails.speed.swim ? `, Swim: ${monsterDetails.speed.swim}` : ''}{monsterDetails.speed.fly ? `, Fly: ${monsterDetails.speed.fly}` : ''}</Text>
                                        ) : (
                                            <Text>Speed: {monsterDetails.speed.walk}</Text>
                                        )}
                                    </Text>
                                    <View style={styles.separator} />
                                </View>
                                <View style={styles.statisticsContainer}>
                                    <Text>STR</Text>
                                    <Text>DEX</Text>
                                    <Text>CON</Text>
                                    <Text>INT</Text>
                                    <Text>WIS</Text>
                                    <Text>CHA</Text>
                                </View>
                                <View style={styles.statisticsContainer}>
                                    <Text>{monsterDetails.strength}</Text>
                                    <Text>{monsterDetails.dexterity}</Text>
                                    <Text>{monsterDetails.constitution}</Text>
                                    <Text>{monsterDetails.intelligence}</Text>
                                    <Text>{monsterDetails.wisdom}</Text>
                                    <Text>{monsterDetails.charisma}</Text>
                                </View>

                                <View style={styles.modalText}>
                                    <View style={styles.separator} />

                                    {monsterDetails.damage_immunities?.length > 0 ? (<Text >Damage Immunities: {monsterDetails.damage_immunities?.join(', ')}</Text>) : (<Text >Damage Immunities: None</Text>)}
                                    {monsterDetails.damage_vulnerabilities?.length > 0 ? (<Text >Damage Vulnerabilities: {monsterDetails.damage_vulnerabilities?.join(', ')}</Text>) : (<Text >Damage Vulnerabilities: None</Text>)}
                                    {monsterDetails.damage_resistances?.length > 0 ? (<Text >Damage Resistances: {monsterDetails.damage_resistances?.join(', ')}</Text>) : (<Text >Damage Resistances: None</Text>)}
                                    {monsterDetails.condition_immunities && monsterDetails.condition_immunities.length > 0 ? (
                                        <Text>Condition Immunities: {monsterDetails.condition_immunities.map(condition => condition.name).join(', ')}</Text>
                                    ) : (<Text>Condition Immunities: None</Text>)}
                                   
                                    {monsterDetails.senses.blindsight || monsterDetails.senses.truesight || monsterDetails.senses.darkvision || monsterDetails.senses.passive_perception ? (
                                        <Text>Senses: Passive Perception:{monsterDetails.senses.passive_perception} {monsterDetails.senses.blindsight ? `Blindsight: ${monsterDetails.senses.blindsight}, ` : ''}{monsterDetails.senses.truesight ? `Truesight: ${monsterDetails.senses.truesight}, ` : ''}{monsterDetails.senses.darkvision ? `Darkvision: ${monsterDetails.senses.darkvision}` : ''}</Text>
                                    ) : (
                                        <Text>Senses: None</Text>
                                    )}
                                </View>
                            </View>
                        </ScrollView>

                    )}
                    <Button title="Close" color={styles.button.color} onPress={() => setSelectedMonster(null)} />
                </View>
            </Modal>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7e7d1',
        alignItems: 'stretch',
    },
    list: {
        flex: 1,
    },
    button: {
        color: '#7a0800',
    },
    modalContent: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        color: '#7a0800',
    },
    item: {
        backgroundColor: '#f7e7d1',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,


    },
    modalHeader: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 0,
        color: '#7a0800',
    },
    separator: {
        height: 7,
        width: "100%",
        backgroundColor: "#7a0800",
        borderRadius: 5,



    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#7a0800',
    },
    statisticsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 5,
        color: '#7a0800',

    },
});