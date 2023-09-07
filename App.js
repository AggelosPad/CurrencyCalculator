import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text } from 'react-native';
import HistoricalData from './HistoricalData'; 
import CurrencyConversion from './CurrencyConversion';  // 1. Import the CurrencyConversion component

const Tab = createMaterialTopTabNavigator();

const PlaceholderScreen = ({ title }) => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{title}</Text>
    </View>
);

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName="Currency Conversion">
                <Tab.Screen 
                    name="Currency Conversion" 
                    component={CurrencyConversion}  
                />
                <Tab.Screen 
                    name="Historical Data" 
                    component={HistoricalData}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

