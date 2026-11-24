import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, Button, Modal, FlatList, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

import { Monster } from '../types/Monster';
import { useState } from 'react';
import Monsters from '../components/Monsters';
import { fetchMonsters } from '../api/MonsterAPI';


import { styles } from '../components/Styles';


type EncounterMonster = {
  monster: Monster;
  quantity: number;
};

type Encounter = {
  name: string;
  monsters: EncounterMonster[];
};

const db = SQLite.openDatabaseSync('coursedb');

export default function Encounters() {
  //WORK IN PROGRESS! NOT FUNCTIONAL!
  const [selectedEncounter, setSelectedEncounter] = useState<Encounter | null>(null);
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [monsterModalVisible, setMonsterModalVisible] = useState(false);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [encounterMonster, setEncounterMonster] = useState<EncounterMonster | null>(null);

  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('')

  const navigation = useNavigation();

  const initializeDatabase = async () => {
    try {
      await db.execAsync(`
      CREATE TABLE IF NOT EXISTS encounters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS encounter_monsters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        encounter_id INTEGER NOT NULL,
        monster_index TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,

        FOREIGN KEY (encounter_id)
        REFERENCES encounters(id)
        ON DELETE CASCADE,

        UNIQUE(encounter_id, monster_index)
      );
    `);
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  };

  const handleFetch = async () => {
    try {
      const list = await db.getAllAsync('SELECT * FROM encounters')
      setEncounters(list as Encounter[])
    } catch (error) {
      console.error('Could not get encounters', error)
    }
  }

  const loadMonsters = async () => {
    setLoading(true);
    const monsters = await fetchMonsters();
    setMonsters(monsters);
    setLoading(false);
  }





  const handleSearch = async (keyword: string) => {
    const monsters = await fetchMonsters();
    const filteredMonsters = monsters.filter(monster =>
      monster.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setMonsters(filteredMonsters);
    setKeyword('');

  }

  const addEncounter = () => {
    setEncounter({ name: 'New Encounter', monsters: [] });
    console.log('Add Encounter button pressed');
  }

  return (
    <ImageBackground source={{ uri: `https://www.dnd5eapi.co/api/images/monsters/ogre.png` }} resizeMode="cover" style={styles.imageBackground}>
      <View style={styles.container}>
        <Text>Encounters</Text>
        <Button title="Add Encounter" onPress={addEncounter} />
        <Modal
          animationType='slide'
          style={styles.modal}
          backdropColor='#f7e7d1'
          visible={encounter != null}
          onRequestClose={() => setEncounter(null)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>New Encounter</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter encounter name..."
              value={encounter?.name ?? ''}
              onChangeText={(text) => {
                setEncounter(prev =>
                  prev ? { ...prev, name: text } : null
                );
              }}
            />
            <Button title="Add Monster" onPress={() => {
              {
                setMonsterModalVisible(true)
                loadMonsters()
              };
            }} />
            <Text style={styles.modalHeader}>Selected Monsters</Text>

            <FlatList
              data={encounter?.monsters}
              keyExtractor={(item) => item.monster.index}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.modalText}>
                    {item.monster.name} x {item.quantity}
                  </Text>
                </View>
              )}
            />
            <Modal
              animationType='slide'
              style={styles.modal}
              backdropColor='#f7e7d1'
              visible={monsterModalVisible}
              onRequestClose={() => setMonsterModalVisible(false)}>
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
                    <Text style={styles.modalText}>{item.name}</Text>
                    <Button title="Add Monster" color={styles.button.color}  />
                  </View>

                )}

              />
              <Button color={styles.button.color} title="Close" onPress={() => setMonsterModalVisible(false)} />

            </Modal>
            <Button title="Close" onPress={() => setEncounter(null)} />
          </View>

        </Modal>
        <StatusBar style="auto" />
      </View>
    </ImageBackground>

  );
}

