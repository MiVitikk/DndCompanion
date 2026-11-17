import React, { useContext } from 'react';
import { Modal, View, Text, Image, Button, ScrollView, ActivityIndicator } from 'react-native';
import { styles } from './Styles';
import { MonsterDetails, Monster, MonsterModalProps } from '../types/Monster';


export function MonsterModal({ selectedMonster, setSelectedMonster, monsterDetails, loading }: MonsterModalProps) {

    

    return ( <Modal
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
                </Modal>)
}