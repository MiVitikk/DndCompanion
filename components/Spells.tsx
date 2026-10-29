import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Modal, FlatList, Button, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';

type Spell = {
  index: string;
  name: string;
  level: number;
  url: string;
}

export default function Spells() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false)

  const [spells, setSpells] = useState<Spell[]>([])

  const fetchSpells = async () => {
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

  useEffect(() => { fetchSpells(); }, []);

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
                                    
                                }} />
                            </View>
                        )}
      
      />}

      
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
});