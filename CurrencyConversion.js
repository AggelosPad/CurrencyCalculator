import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, TextInput,StyleSheet,TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { evaluate } from 'mathjs';

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
    const [lastKey, setLastKey] = useState('');

    useEffect(() => {
      setAmount(calcInput);
    }, [calcInput]);

    
    const fetchConversionRates = async (base = 'USD') => {
        try {
            const response = await axios.get(`https://v6.exchangerate-api.com/v6/2d556f07b8c8e774d720bb99/latest/${base}`);
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

    const convertCurrency = (amt) => {
      if (conversionRates[toCurrency]) {
          const rate = conversionRates[toCurrency];
          let result = amt * rate;
          if (hasDecimals(result)) {
              result = result.toFixed(4);
          }
          setConversionResult(String(result));
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
      // If the last key was '=' and the new input is a number, append.
     if (input === "x") {
            return;
        }
      if (lastKey === '=' && !isNaN(input)) {
          setCalcInput(prev => prev + input);
      }
      // If the last key was '=' and the new input is an operator, append.
      else if (lastKey === '=' && ['+', '-', '*', '/'].includes(input)) {
          setCalcInput(prev => prev + input);
      } 
      // If the last key pressed was '=' and new input is not an operator, reset the input.
      else if (lastKey === '=' && !['+', '-', '*', '/'].includes(input)) {
          setCalcInput(input);
      } 
      else {
          setCalcInput(prev => prev + input);
      }
      setLastKey(input); // Store the current pressed key
  };
  


  const setErrorAndReset = () => {
    setCalcInput('Error');
    setTimeout(() => {
        // Reset calculator to starting state
        setCalcInput('');
        setConversionResult(null);
        setFromCurrency('USD');
        setToCurrency('EUR');
        // Any other state resets if required
    }, 500);  // 500 ms = 0.5 seconds
};
    
const evaluateExpression = () => {
  try {
      console.log("Evaluating expression:", calcInput);
      let result = evaluate(calcInput);
      if (!isNaN(result)) {
          if (hasDecimals(result)) {
              result = result.toFixed(4);
          }
          setCalcInput(String(result));
          convertCurrency(String(result));
      } else {
          setErrorAndReset();
      }
  } catch (error) {
      console.error("Failed to evaluate expression:", error);
      setErrorAndReset();
  }
};


const hasDecimals = (num) => {
  return num % 1 !== 0;
};

    const handleSpecialKeys = (key) => {
      if (key === '=' && lastKey === '=') {
        return;  // If '=' is pressed twice, do nothing.
      }
      setLastKey(key);  
      
      switch(key) {
            case 'C':
              case 'C':
                // Clear the expression and conversion result
                setCalcInput('');
                setConversionResult(null); 
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
              handleCalcInput("*");
              break;
            case '%':
                // Convert the current number to a percentage
                setCalcInput(prev => `${parseFloat(prev) / 100}`);
                break;
                case '=':
                try {
                    console.log("Evaluating expression:", calcInput);
                    let result = evaluate(calcInput);
                    if (!isNaN(result)) {
                      if (hasDecimals(result)) {
                        result = result.toFixed(4);
                        }

                        setCalcInput(String(result));
                        convertCurrency(String(result));

                    } else {
                        setErrorAndReset();
                    }
                } catch (error) {
                    console.error("Failed to evaluate expression:", error);
                    setErrorAndReset();
                }
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
      <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={{ flex: 1 }}
      >
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
              editable={false}

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
            <Text style={styles.resultText}>{!isNaN(conversionResult) && conversionResult}</Text>
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
            {["7", "8", "9"].map((key) => (
    <TouchableOpacity
        key={key}
        style={styles.key}
        onPress={() => handleCalcInput(key)}
    >
        <Text style={styles.keyText}>{key}</Text>
    </TouchableOpacity>
))}
<TouchableOpacity
    style={styles.key}
    onPress={() => handleSpecialKeys("x")}
>
    <Text style={styles.keyText}>x</Text>
</TouchableOpacity>

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
        </KeyboardAvoidingView>
        </SafeAreaView>
      );
      
};

const styles = StyleSheet.create({
   
    app: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#121212",
        padding: 20,
    },

    rectangle: {
        flex: 2,  
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#333',
        borderRadius: 0,
        paddingHorizontal: 10,
        marginBottom: 0,
        width: '100%',
        height: 80,
    },
    titleText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 30,
        marginTop: 60,
        textAlign: 'center'
    },
      logo: { width: 565, height: 225, marginBottom: 20 },
     

    pickerWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#333",  
    },
    overlayText: {
        position: 'absolute',
        color: "#E0E0E0", 
        left: 10, 
        fontSize: 25
    },
    picker: {
        flex: 1,
        height: '100%',
        backgroundColor: "#333",
        color: "#E0E0E0",
        marginRight: 10

    },
      pickersContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        backgroundColor: "#212121",
        marginBottom: 20, 
    },

    button: {
        width: "100%",
        padding: 10,
        backgroundColor: "#1E88E5",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        marginBottom: 3, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.32,
        shadowRadius: 2,
        elevation: 5,
    },
      buttonText: { fontSize: 18, fontWeight: "500", color: "#FFFFFF" },
      
      resultBox: {
        marginTop: 0,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: "#1E88E5",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.32,
        shadowRadius: 2,
        elevation: 5,
      },
      resultText: {
        flex: 2,
        color: '#E0E0E0',
        fontSize: 35,
        padding: 10,
        textAlign: 'right',
    },

      
      
    appContainer: {
        flex: 1,
        backgroundColor: "#121212",
        padding: 0,
        justifyContent: 'space-between', // to distribute space equally
    },

    topHalf: {
        flex: 0.5, // Allocate half the screen height
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    bottomHalf: {
        flex: 0.5, 
        alignItems: "center",
        justifyContent: "flex-start", 
        padding: 20,
    },
    swapButton: {
        width: 50,
        height: 50,
        borderRadius: 25, // half of width/height to make it circular
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1E88E5",
        marginVertical: 20,  // give space above and below
    },
      swapButtonText: {
          fontSize: 18,
          fontWeight: "500",
          color: "#FFFFFF",
      },
  
      container: {
        flex: 1,
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        flex: 2,
        height: '100%',
        backgroundColor: "#333",
        color: "#E0E0E0",
        padding: 10,
        fontSize: 35,
        textAlign: 'right',
    },

    scrollViewContent: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "flex-start", 
        backgroundColor: "#121212",
        padding: 20,
    },
    keyboard: {
        flex: 6, // 60% height
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    key: {
        width: '25%', 
        height: '21%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#444',
        marginBottom: 0
    },
    keyText: {
        fontSize: 20,
        color: '#FFF',
        
    }
  
});

export default CurrencyConversion; 
