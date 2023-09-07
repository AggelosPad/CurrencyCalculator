import { StyleSheet } from 'react-native';

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


export default styles;