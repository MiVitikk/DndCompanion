import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button, Modal, Image, ActivityIndicator, ScrollView, TextInput, ImageBackground, Dimensions, useWindowDimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';

import { styles } from './Styles';
import { Weapon, WeaponDetails , Armor, ArmorDetails } from '../types/Equipment';




export default function Equipment() {

    const [loading, setLoading] = useState(false);
    const [index, setIndex] = useState('');
    const [keyword, setKeyword] = useState('');
    const [weapons, setWeapons] = useState<Weapon[]>([]);
    const [armor, setArmor] = useState<Armor[]>([]);
    const [weaponDetails, setWeaponDetails] = useState<WeaponDetails | null>(null);
    const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
    const [selectedArmor, setSelectedArmor] = useState<Armor | null>(null);
    const [armorDetails, setArmorDetails] = useState<ArmorDetails | null>(null);
    const { width, height } = useWindowDimensions();

    const [routes] = useState([
        { key: 'armor', title: 'Armor' },
        { key: 'weapons', title: 'Weapons' },
    ]);


    const [indexTab, setIndexTab] = useState(0);

    const fetchEquipment = async () => {
        setLoading(true);
        fetchWeapons();
        fetchArmor();
        setLoading(false);
    }

    const fetchWeapons = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://www.dnd5eapi.co/api/2014/equipment-categories/weapon');
            const data = await response.json();
            setWeapons(data.equipment);
            console.log('Fetched weapons: ', data);
        } catch (error) {
            console.error('Error fetching weapons:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchArmor = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://www.dnd5eapi.co/api/2014/equipment-categories/armor');
            const data = await response.json();
            setArmor(data.equipment);
        } catch (error) {
            console.error('Error fetching armor:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWeaponDetails = async (weapon: Weapon) => {
        setLoading(true);
        const endpoint = weapon.url
        console.log(endpoint);
        try {
            const response = await fetch(`https://www.dnd5eapi.co${endpoint}`);
            if (!response.ok) {        
                throw new Error('HTTP error ' + response.status);
            }
            const data = await response.json();
            setWeaponDetails(data);
        } catch (error) {
            console.error('Error fetching weapon details:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchArmorDetails = async (armor: Armor) => {
        setLoading(true);
        const endpoint = armor.url
        console.log(endpoint);
        try {
            const response = await fetch(`https://www.dnd5eapi.co${endpoint}`);
            if (!response.ok) {        
                throw new Error('HTTP error ' + response.status);
            }
            const data = await response.json();
            setArmorDetails(data);
        } catch (error) {
            console.error('Error fetching armor details:', error);
        } finally {
            setLoading(false);
        }
    };

    const WeaponsRoute = () => (
        <ImageBackground source={{ uri: `https://www.dnd5eapi.co/api/images/monsters/bandit.png` }} resizeMode="cover" style={styles.imageBackground}>
            <View style={styles.container}>
                <Text>Weapons</Text>

                <FlatList
                    data={weapons}
                    style={styles.list}
                    keyExtractor={(item) => item.index}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.itemText}>{item.name}</Text>
                            <Button title="View Details" color={styles.button.color} onPress={() => {
                                setSelectedWeapon(item);
                                setIndex(item.index)
                                fetchWeaponDetails(item)
                            }} />
                        </View>
                    )}
                />
                <Modal
                    animationType="slide"
                    style={styles.modal}
                    backdropColor='#f7e7d1'
                    visible={selectedWeapon !== null}
                    onRequestClose={() => setSelectedWeapon(null)}>
                        {weaponDetails && (
                            <ScrollView >
                                <View style={styles.modalContent}>
                                <Text style={styles.modalHeader}>{weaponDetails.name}</Text>
                                {weaponDetails.weapon_category && weaponDetails.weapon_range && (
                                    <Text>{weaponDetails.weapon_category} {weaponDetails.weapon_range} weapon</Text>
                                )}
                                {weaponDetails.damage && (
                                    <Text>Damage: {weaponDetails.damage.damage_dice} {weaponDetails.damage.damage_type.name}</Text>
                                )}
                                {weaponDetails.properties && (
                                    <Text>Properties: {weaponDetails.properties.map(prop => prop.name).join(', ')}</Text>
                                )}
                                {weaponDetails.desc && (
                                    <View>
                                        {weaponDetails.desc.map((desc, index) => (
                                            <Text key={index}>{desc}</Text>
                                        ))}
                                    </View>
                                )}
                                <Button title="Close" color={styles.button.color} onPress={() => setSelectedWeapon(null)} />
                                </View>
                            </ScrollView>
                        )}
                </Modal>
            </View>

        </ImageBackground>
    );

    const ArmorRoute = () => (
        <ImageBackground source={{ uri: `https://www.dnd5eapi.co/api/images/monsters/knight.png` }} resizeMode="cover" style={styles.imageBackground}>
            <View style={styles.container}>
                <Text>Armor</Text>

                <FlatList
                    data={armor}
                    style={styles.list}
                    keyExtractor={(item) => item.index}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.itemText}>{item.name}</Text>
                            <Button title="View Details" color={styles.button.color} onPress={() => {
                                setSelectedArmor(item);
                                setIndex(item.index)
                                fetchArmorDetails(item)
                            }} />
                        </View>
                    )}
                />
                <Modal
                    animationType="slide"
                    style={styles.modal}
                    backdropColor='#f7e7d1'
                    visible={selectedArmor !== null}
                    onRequestClose={() => setSelectedArmor(null)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>{armorDetails?.name}</Text>
                        {armorDetails?.armor_category && (
                            <Text>{armorDetails.armor_category}</Text>
                        )}
                        {armorDetails?.armor_class && (
                            <Text>Armor Class: {armorDetails.armor_class.base}</Text>
                        )}
                        {armorDetails?.stealth_disadvantage !== undefined && (
                            <Text>Stealth Disadvantage: {armorDetails.stealth_disadvantage ? 'Yes' : 'No'}</Text>
                        )}
                        {armorDetails?.desc && (
                            <View>
                                {armorDetails.desc.map((desc, index) => (
                                    <Text key={index}>{desc}</Text>
                                ))}
                            </View>
                        )}
                        <Button title="Close" color={styles.button.color} onPress={() => setSelectedArmor(null)} />
                    </View>
                </Modal>
            </View>

        </ImageBackground>
    );
    const renderScene = SceneMap({
        armor: ArmorRoute,
        weapons: WeaponsRoute,
    });

    useEffect(() => {
        fetchEquipment();
    }, []);



    return (
        <ImageBackground source={{ uri: `https://www.dnd5eapi.co/api/images/monsters/knight.png` }} resizeMode="cover" style={styles.imageBackground}>
            <View style={styles.container}>
                <TabView
                    navigationState={{ index: indexTab, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndexTab}
                    initialLayout={{ width, height }}
                    style={{ backgroundColor: '#ffffff' }}
                    renderTabBar={props => <TabBar {...props} style={{ backgroundColor: '#7a0800' }} />}
                />
                <StatusBar style="auto" />
            </View>
        </ImageBackground>
    )


}