import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button, Modal } from 'react-native';
import { useEffect, useState } from 'react';

type Monster = {
    index: string;
    name: string;
    url: string;
}

export default function Monsters() {
    const [monsters, setMonsters] = useState<Monster[]>([]);
    const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);

    const fetchMonsters = async () => {
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
    };

    useEffect(() => {
        fetchMonsters();
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
                        <Button title="View Details" onPress={() => setSelectedMonster(item)} />
                    </View>
                )}
            />
            <Modal
                animationType="slide"
                visible={selectedMonster !== null}
                onRequestClose={() => setSelectedMonster(null)}
            >
                <View style={styles.modalContent}>
                    {selectedMonster && <Text>{selectedMonster.name}</Text>}
                    <Button title="Close" onPress={() => setSelectedMonster(null)} />
                </View>
            </Modal>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'stretch',
    },
    list: {
        flex: 1,
    },
    modalContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
});