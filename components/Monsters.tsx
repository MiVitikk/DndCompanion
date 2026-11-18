import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button, Modal, Image, ActivityIndicator, ScrollView, TextInput, ImageBackground, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';

import { fetchMonsters } from '../api/MonsterAPI';
import { Monster, MonsterDetails, MonsterImage, MonsterModalProps } from '../types/Monster';
import { MonsterModal } from './MonsterModal';

const { width, height } = Dimensions.get('window');


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
        const monsters = await fetchMonsters();
        setMonsters(monsters);
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

    // Filters the list of monsters based on the search keyword
    const handleSearch = async (keyword: string) => {
        const monsters = await fetchMonsters();
        const filteredMonsters = monsters.filter(monster =>
            monster.name.toLowerCase().includes(keyword.toLowerCase())
        );
        setMonsters(filteredMonsters);
        setKeyword('');

    }

    useEffect(() => {
        loadMonsters();
    }, []);

    return (
        <ImageBackground source={{ uri: `https://www.dnd5eapi.co/api/images/monsters/ancient-blue-dragon.png` }} resizeMode="cover" style={styles.imageBackground}>
            <View style={styles.container}>


                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10, marginTop: 10, gap: 15 }}>
                    <TextInput
                        value={keyword}
                        style={styles.textInput}
                        placeholder="Search monsters..."
                        placeholderTextColor="#fcfcfc"
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
                            <Text style={styles.itemText}>{item.name}</Text>
                            <Button title="View Details" color={styles.button.color} onPress={() => {
                                setSelectedMonster(item);
                                setIndex(item.index);
                                fetchMonsterDetails(item.index);
                            }} />
                        </View>
                    )}
                />
                <MonsterModal
                    selectedMonster={selectedMonster}
                    setSelectedMonster={setSelectedMonster}
                    monsterDetails={monsterDetails}
                    loading={loading}
                />

                <StatusBar style="auto" />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'stretch',
    },
    list: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    textInput: {
        height: 40,
        borderColor: '#7a0800',
        borderWidth: 1,
        paddingHorizontal: 10,
        color: '#fcfcfc',
    },
    button: {
        color: '#7a0800',
    },
    modal: {
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
        backgroundColor: 'transparent',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,


    },
    itemText: {
        color: '#ffffff',
        fontSize: 22,
        fontFamily: 'serif',
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

    },

    imageBackground: {
        flex: 1,
        justifyContent: 'center',
        height: height,
        width: width,
    },
});