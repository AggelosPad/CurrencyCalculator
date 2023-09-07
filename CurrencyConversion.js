import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Image, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { evaluate } from 'mathjs';
import styles from '/src/components/CurrencyConversionStyles'

const CurrencyConversion = () => {
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [amount, setAmount] = useState('1');
    const [conversionRates, setConversionRates] = useState({});
    const [baseCurrencies, setBaseCurrencies] = useState([]);
    const [conversionResult, setConversionResult] = useState(null);
    const [lastUpdated, setLastUpdated] = useState('');
    const [calcInput, setCalcInput] = useState('');
    const [shouldClearInput, setShouldClearInput] = useState(false); 

    const fetchConversionRates = async (base = 'USD') => {
        try {
            const response = await axios.get(`https://v6.exchangerate-api.com/v6/API_KEY/latest/${base}`);
            if (response.data.result === 'success') {
                setConversionRates(response.data.conversion_rates);
                setBaseCurrencies(Object.keys(response.data.conversion_rates));
                
                // Check if the "toCurrency" exists in the new conversion rates
                if (!response.data.conversion_rates[toCurrency]) {
                    setToCurrency(Object.keys(response.data.conversion_rates)[0]);
                }
                
                return true;  // Return true to signify success
            } else {
                Alert.alert('Failed to fetch conversion rates');
                return false;  // Return false to signify failure
            }
        } catch (error) {
            Alert.alert('Failed to fetch conversion rates. Please try again later.');
            return false;
        }
    };

    useEffect(() => {
        
        fetchConversionRates();
    }, []);
    
    const handleFromCurrencyChange = async (currency) => {
        setFromCurrency(currency);
        
        // Use fetchConversionRates for updating conversion rates
        const success = await fetchConversionRates(currency);
        
        if (success) {
            setConversionResult(null);
        }
    };

    const convertCurrency = () => {
        if (conversionRates[toCurrency]) {
            const rate = conversionRates[toCurrency];
            const result = amount * rate;
            setConversionResult(result.toFixed(2));
        } else {
            Alert.alert('Invalid currency selected');
        }
    };

    const handleSwapCurrencies = async () => {
        const tempFromCurrency = fromCurrency;
        setFromCurrency(toCurrency);
        setToCurrency(tempFromCurrency);
        setConversionResult(null);
        
        fetchConversionRates(toCurrency);  
    };

    const handleCalcInput = (input) => {
        setCalcInput(prev => {
            const newInput = prev + input;
            try {
                const result = eval(newInput);
                setAmount(String(result));
                return newInput;
            } catch (error) {
                return newInput; // if the input isn't a valid expression yet, just return it as is
            }
        });
    };
    const calculateExpression = () => {
        try {
            const result = eval(calcInput);
            const resultStr = String(result);
            setAmount(resultStr);
            setCalcInput(resultStr);  // Displaying the result in the input
            Currconvertency();        // Convert the calculated amount
        } catch (error) {
            setCalcInput('Error');
        }
    };
    
    const evaluateExpression = () => {
        try {
            const result = evaluate(calcInput);
            setCalcInput(String(result));
        } catch (error) {
            console.error("Failed to evaluate expression:", error);
            // Handle the error, maybe set an error message, or reset the input
            setCalcInput('Error');
        }
    };

    const handleSpecialKeys = (key) => {
        switch(key) {
            case 'C':
                // Clear the expression
                setCalcInput('');
                break;
            case '←':
                // Remove the last character
                setCalcInput(prev => prev.slice(0, -1));
                break;
            case '↑ ↓':
                // Swap currencies
                handleSwapCurrencies();
                break;
            case 'x':
                // Add multiplication to expression
                setCalcInput(prev => `${prev}*`);
                break;
            case '%':
                // Convert the current number to a percentage
                setCalcInput(prev => `${parseFloat(prev) / 100}`);
                break;
            case '=':
                    // Evaluate the expression
                evaluateExpression();
                convertCurrency();
                
                break;
            default:
                // Add the key to the expression
                setCalcInput(prev => `${prev}${key}`);
        }
    }
    

    const handleBackspace = () => {
        setCalcInput(prev => prev.slice(0, -1)); // remove the last character from the input
    };
    
    return (
        <View style={styles.appContainer}>
          <View style={styles.rectangle}>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={fromCurrency}
                onValueChange={handleFromCurrencyChange}
                style={{ ...styles.picker, color: "#333" }}
              >
                {baseCurrencies.map((currency) => (
                  <Picker.Item key={currency} label={currency} value={currency} />
                ))}
              </Picker>
              <Text style={styles.overlayText}>{fromCurrency}</Text>
            </View>
            <TextInput
              value={calcInput}
              onChangeText={setCalcInput}
              placeholder=""
              style={styles.input}
            />
          </View>
      
          <View style={styles.rectangle}>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={toCurrency}
                onValueChange={(value) => {
                  setToCurrency(value);
                  setConversionResult(null);
                }}
                style={{ ...styles.picker, color: "#333" }}
              >
                {Object.keys(conversionRates).map((currency) => (
                  <Picker.Item key={currency} label={currency} value={currency} />
                ))}
              </Picker>
              <Text style={styles.overlayText}>{toCurrency}</Text>
            </View>
            <Text style={styles.resultText}>{conversionResult}</Text>
          </View>
      
          {/* Calculator Keyboard */}
          <View style={styles.keyboard}>
            {["C", "←", "↑ ↓", "/"].map((key) => (
              <TouchableOpacity
                key={key}
                style={styles.key}
                onPress={() => handleSpecialKeys(key)}
              >
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            ))}
            {["7", "8", "9", "x"].map((key) => (
              <TouchableOpacity
                key={key}
                style={styles.key}
                onPress={() => handleCalcInput(key)}
              >
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            ))}
            {["4", "5", "6", "-"].map((key) => (
              <TouchableOpacity
                key={key}
                style={styles.key}
                onPress={() => handleCalcInput(key)}
              >
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            ))}
            {["1", "2", "3", "+"].map((key) => (
              <TouchableOpacity
                key={key}
                style={styles.key}
                onPress={() => handleCalcInput(key)}
              >
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            ))}
            {["0", ".", "%", "="].map((key) => (
              <TouchableOpacity
                key={key}
                style={styles.key}
                onPress={() => handleSpecialKeys(key)}
              >
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
      
};


export default CurrencyConversion; 
