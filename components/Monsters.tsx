import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button, Modal, Image, ActivityIndicator, ScrollView, TextInput, ImageBackground, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { fetchMonsters } from '../api/MonsterAPI';
import { Monster, MonsterDetails, MonsterImage, MonsterModalProps } from '../types/Monster';
import { MonsterModal } from './MonsterModal';
import { styles } from './Styles';

const { width, height } = Dimensions.get('window');


export default function Monsters() {
    const navigation = useNavigation();
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

