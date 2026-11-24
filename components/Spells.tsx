import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Modal, FlatList, Button, ActivityIndicator, Image, ImageBackground, Dimensions, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';

import { fetchSpells } from '../api/SpellAPI';
import { Spell, SpellDetails } from '../types/Spell';
import { styles } from './Styles';

const { width, height } = Dimensions.get('window');

export default function Spells() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false)

  const [spells, setSpells] = useState<Spell[]>([])
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null)
  const [spellDetails, setSpellDetails] = useState<SpellDetails | null>(null)
  const [index, setIndex] = useState('')
  const [keyword, setKeyword] = useState('')


  //Fetches all spells
  const loadSpells = async () => {
    setLoading(true);
    const spells = await fetchSpells();
    setSpells(spells);
    setSpells(spells.slice().sort((a, b) => a.level - b.level));
    setLoading(false);
  }

  // Fetches details for the selected spell
  const fetchSpellDetails = async (index: string) => {
    setLoading(true)
    try {
      const response = await fetch(`https://www.dnd5eapi.co/api/2014/spells/${index}`)
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      const data: SpellDetails = await response.json();
      setSpellDetails(data)
      console.log('Fetched spell details: ' + data)
    } catch (error) {
      console.error('Error fetching spell details: ' + error)
    }
    setLoading(false)
  }
  // Filters the list of spells based on the search keyword
  const handleSearch = async (keyword: string) => {
    const spells = await fetchSpells();
    const filteredSpells = spells.filter(spell =>
      spell.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setKeyword('');
    setSpells(filteredSpells);
    
  }

  useEffect(() => { loadSpells(); }, []);

  return (
    <ImageBackground source={{uri:`https://www.dnd5eapi.co/api/images/monsters/mummy-lord.png`}} resizeMode="cover" style={styles.imageBackground}>
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10, marginTop: 10, gap: 15 }}>
                          <TextInput
                              value={keyword}
                              style={styles.textInput}
                              placeholder="Search spells..."
                              placeholderTextColor="#fcfcfc"
                              onChangeText={text => setKeyword(text)}
                          />
      
                          <Button color={styles.button.color} title="Search" onPress={() => handleSearch(keyword)} />
                            <Button color={styles.button.color} title="Reset" onPress={() => { setKeyword(''); loadSpells(); }} />
                        </View>
      {loading ? <ActivityIndicator size="large" color="#ff0000" /> :
      
        <FlatList
          data={spells}
          style={styles.list}
          keyExtractor={(item) => item.index}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.name}</Text>
              {item.level ? <Text style={styles.itemText}>Level: {item.level}</Text> : <Text style={styles.itemText}>Level: Cantrip</Text>}
              <Button title="View Details" color={styles.button.color} onPress={() => {
                setSelectedSpell(item);
                setIndex(item.index)
                fetchSpellDetails(item.index);
              }} />
            </View>
          )}

        />}
      <Modal
        animationType='slide'
        style={styles.modal}
        backdropColor='#f7e7d1'
        visible={selectedSpell != null}
        onRequestClose={() => setSelectedSpell(null)}
      >
        {spellDetails && (
          <ScrollView>
            <View style={styles.modalContent}>
              {loading ? <ActivityIndicator size="large" color="#ff0000" /> :
                <View>
                  <Text style={styles.modalHeader}>{spellDetails.name}</Text>
                  <Text style={{ fontStyle: 'italic', paddingBottom: 10 }}>Level {spellDetails.level} {spellDetails.school.name}</Text>
                  <Text> Casting Time: {spellDetails.casting_time}</Text>
                  <Text> Range: {spellDetails.range}</Text>
                  <Text> Components: {spellDetails.components.join(', ')}</Text>
                  <Text> Duration: {spellDetails.duration}</Text>
                  {spellDetails.concentration && <Text> Concentration: Yes</Text>}
                  {spellDetails.ritual && <Text> Ritual: Yes</Text>}
                  {spellDetails.material && <Text> Material Components: {spellDetails.material}</Text>}
                  <View style={styles.separator} />
                  <Text>{spellDetails.desc}</Text>
                  <Text> {spellDetails.higher_level && <Text>{spellDetails.higher_level}</Text>}</Text>
                </View>
              }
              <Button title="Close" color={styles.button.color} onPress={() => setSelectedSpell(null)} />
            </View>
          </ScrollView>
        )

        }

      </Modal>


    </View>
    </ImageBackground>
  );
}

