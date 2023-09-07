import { StyleSheet } from 'react-native';

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
    
    logo: { 
        width: 565, 
        height: 225, 
        marginBottom: 20 
    },
     
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

export default styles;
