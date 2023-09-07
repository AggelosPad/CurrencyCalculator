import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,Image,Dimensions } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';
import {Picker} from '@react-native-picker/picker';

 

const HistoricalData = () => {
    const [baseCurrency, setBaseCurrency] = useState(null);
    const [targetCurrency, setTargetCurrency] = useState(null);
    const [historicalRates, setHistoricalRates] = useState([]);
    const [availableCurrencies, setAvailableCurrencies] = useState([]);
    const [isChartVisible, setIsChartVisible] = useState(false);

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const response = await axios.get('https://api.exchangerate.host/latest');
                if (response.data.success) {
                    setAvailableCurrencies(Object.keys(response.data.rates));
                }
            } catch (error) {
                console.log("Failed to fetch currencies");
            }
        };
        fetchCurrencies();
    }, []);

    const fetchHistoricalData = async (base, target) => {
        let date = new Date();
        let fetchedRates = [];

        for (let i = 0; i < 5; i++) {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');

            try {
                const response = await axios.get(`https://api.exchangerate.host/${year}-${month}-${day}?base=${base}`);
                if (response.data.rates) {
                    fetchedRates.push({
                        date: `${year}-${month}-${day}`,
                        rate: response.data.rates[target]
                    });
                }
            } catch (error) {
                console.log("Failed to fetch historical data for", year, month, day);
            }

            date.setDate(date.getDate() - 1);
        }
        setHistoricalRates(fetchedRates);
        setIsChartVisible(true);
    };

    return (
        <View style={styles.container}>
        <Text style={styles.mainTitle}>Historical Conversion Rates</Text>
        <Picker
            selectedValue={baseCurrency}
            onValueChange={(itemValue) => {
                setBaseCurrency(itemValue);
                if (itemValue && targetCurrency) {
                    fetchHistoricalData(itemValue, targetCurrency);
                } else {
                    setIsChartVisible(false);
                }
            }}
            style={styles.picker}
        >
            {availableCurrencies.map(currency =>
                <Picker.Item key={currency} label={currency} value={currency} />
            )}
        </Picker>

        <Picker
            selectedValue={targetCurrency}
            onValueChange={(itemValue) => {
                setTargetCurrency(itemValue);
                if (baseCurrency && itemValue) {
                    fetchHistoricalData(baseCurrency, itemValue);
                } else {
                    setIsChartVisible(false);
                }
            }}
            style={styles.picker}
        >
            {availableCurrencies.map(currency =>
                <Picker.Item key={currency} label={currency} value={currency} />
            )}
        </Picker>

        {isChartVisible && (
            <>
                <Text style={styles.title}>Historical Rates for {baseCurrency} to {targetCurrency} (Last 5 Days)</Text>
                <LineChart
                        data={{
                            labels: [...historicalRates].reverse().map(item => item.date),
                            datasets: [{
                                data: [...historicalRates].reverse().map(item => item.rate)
                            }]
                            
                        }}
                        width={Dimensions.get("window").width - 20}
                        height={220}
                        yAxisLabel="$"
                        chartConfig={{
                            backgroundColor: "#e26a00",
                            backgroundGradientFrom: "#121212",
                            backgroundGradientTo: "#121212",
                            decimalPlaces: 5,
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "#ffa726"
                            }
                        }}
                        formatLabel={() => ''}  
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16
                        }}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#121212',
        padding: 20,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#E0E0E0',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#E0E0E0',
    },
    picker: {
        width: '100%',
        height: 60,
        marginBottom: 10,
        backgroundColor: '#212121',
        color: '#E0E0E0',
        marginBottom: 10,
        marginTop:10,
    },
    logo: {
        marginBottom: 20
    },
    chart: {
        flex: 0.6,
        marginBottom: 20,
        borderRadius: 16,
    }
});

export default HistoricalData;
