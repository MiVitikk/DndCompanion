import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import Monsters from './components/Monsters';
import Spells from './components/Spells';
import Encounters from './components/Encounters';
import Equipment from './components/Equipment';

const Drawer = createDrawerNavigator();

const MyTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: "#7a0800",
    primary: "#d3bab9",
    card: "#7a0800",
    text: "#fff",
    
  },
};

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Drawer.Navigator >
        <Drawer.Screen name="Monsters" component={Monsters} />
        <Drawer.Screen name="Spells" component={Spells} />   
        <Drawer.Screen name="Equipment" component={Equipment} />
        <Drawer.Screen name="Encounters" component={Encounters} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
