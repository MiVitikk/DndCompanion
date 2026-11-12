import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button, Modal, Image, ActivityIndicator, ScrollView, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { fetchMonsters } from '../api/MonsterAPI';
import { Monster, MonsterDetails, MonsterImage } from '../types/Monster';



export default function Monsters() {
    const [monsters, setMonsters] = useState<Monster[]>([]);
    const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
    const [monsterDetails, setMonsterDetails] = useState<MonsterDetails | null>(null);
    const [index, setIndex] = useState('')
    const [loading, setLoading] = useState(false)
    const [keyword, setKeyword] = useState('')

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

    const handleSearch = (keyword: string) => {
        const filteredMonsters = monsters.filter(monster =>
            monster.name.toLowerCase().includes(keyword.toLowerCase())
        );
        setMonsters(filteredMonsters);

    }

    useEffect(() => {
        loadMonsters();
    }, []);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10, marginTop: 10, gap: 15 }}>
            <TextInput
                value={keyword}
                style={styles.textInput}
                placeholder="Search monsters..."
                onChangeText={text => setKeyword(text)}
            />
            
            <Button color={styles.button.color} title="Search" onPress={() => handleSearch(keyword)} />
            <Button color={styles.button.color} title="Reset" onPress={() => { setKeyword(''); loadMonsters(); }} />
            </View>
            
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
                style={styles.modal}
                backdropColor='#f7e7d1'
                visible={selectedMonster !== null}
                onRequestClose={() => setSelectedMonster(null)}
            >
                <View style={styles.modalContent}>
                    {monsterDetails && (
                        <ScrollView >
                            <View>
                                {loading ? <ActivityIndicator size="large" color="#ff0000" /> :
                                    <Image source={{ uri: `https://www.dnd5eapi.co${monsterDetails.image}` }} style={styles.image} />
                                }
                                <Text style={styles.modalHeader}>{monsterDetails.name}</Text>
                                <Text style={{ fontStyle: 'italic' }}>{monsterDetails.size} {monsterDetails.type}, {monsterDetails.alignment}</Text>
                                <View style={styles.detailsContainer}>
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

                                <View style={styles.detailsContainer}>
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
                                <View style={styles.actionsContainer}>
                                    <View style={styles.separator} />
                                    {monsterDetails.special_abilities && monsterDetails.special_abilities.length > 0 && (
                                        <View>
                                            {monsterDetails.special_abilities.map((ability, index) => (
                                                <View key={index}>
                                                    <Text style={{ fontWeight: 'bold' }}>{ability.name}</Text>
                                                    <Text>{ability.desc}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                                <View style={styles.actionsContainer}>
                                    <View style={styles.separator} />
                                    {monsterDetails.actions && monsterDetails.actions.length > 0 && (
                                        <View>
                                            <Text style={styles.modalHeader}>Actions</Text>
                                            {monsterDetails.actions.map((action, index) => (
                                                <View key={index}>
                                                    <Text style={{ fontWeight: 'bold' }}>{action.name}</Text>
                                                    <Text>{action.desc}</Text>
                                                </View>
                                            ))}
                                        </View>
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
    textInput: {
        height: 40,
        borderColor: '#7a0800',
        borderWidth: 1,
        paddingHorizontal: 10,
    },
    button: {
        color: '#7a0800',
    },
    modal:{
        borderColor: '#7a0800',
        borderWidth: 4,
        borderRadius: 10,
        alignItems: 'center',
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
    image: {
        width: '100%',
        height: 400,
        borderColor: '#7a0800',
        borderWidth: 4,
        marginBottom: 10,
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
    detailsContainer: {
        marginTop: 10,
        width: '100%',
    },
    actionsContainer: {
        marginTop: 10,
        width: '100%',
        
    }
});