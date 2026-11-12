import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Modal, FlatList, Button, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { fetchSpells } from '../api/SpellAPI';

type Spell = {
  index: string;
  name: string;
  level: number;
  url: string;
}

type SpellDetails = {
  name: string;
  level: number;
  school: {
    name: string;
  };
  desc: string[];
  higher_level: string[];
  components: string[];
  range: string;
  duration: string;
  casting_time: string;
  concentration?: boolean;
  ritual?: boolean;
  material?: string;
}


export default function Spells() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false)

  const [spells, setSpells] = useState<Spell[]>([])
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null)
  const [spellDetails, setSpellDetails] = useState<SpellDetails | null>(null)
  const [index, setIndex] = useState('')


  /* const fetchSpells = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://www.dnd5eapi.co/api/2014/spells')
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status)
      }
      const data: { results: Spell[] } = await response.json();
      setSpells(data.results)
    } catch (error) {
      console.error('Error fetching spells: ' + error)
    }
    console.log('Fetched spells: ', spells)
    setSpells(spells.slice().sort((a, b) => a.level - b.level))
    setLoading(false)
  };
 */

  const loadSpells = async () => {
    setLoading(true);
    const spells = await fetchSpells();
    setSpells(spells);
    setSpells(spells.slice().sort((a, b) => a.level - b.level));
    setLoading(false);
  }
  const fetchSpellDetails = async (index: string) => {
    setLoading(true)
    try {
      const response = await fetch(`https://www.dnd5eapi.co/api/2014/spells/${index}`)
      if(!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      const data: SpellDetails = await response.json();
      setSpellDetails(data)
      console.log('Fetched spell details: ' + data)
    } catch (error) {
      console.error ('Error fetching spell details: ' + error)
    }
    setLoading(false)
  }

  useEffect(() => { loadSpells(); }, []);

  return (
    <View style={styles.container}>
      <Text>Spells</Text>
      <StatusBar style="auto" />
      {loading ? <ActivityIndicator size="large" color="#ff0000" /> :
      <FlatList
        data={spells}
        style={styles.list}
        keyExtractor={(item) => item.index}
        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <Text>{item.name}</Text>
                                {item.level ? <Text>Level: {item.level}</Text> : <Text>Level: Cantrip</Text>}
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
  item: {
        backgroundColor: '#f7e7d1',
        padding: 5,
        marginVertical: 8,
        marginHorizontal: 16,
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
});