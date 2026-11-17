import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'stretch',
    },
    list: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    textInput: {
        height: 40,
        borderColor: '#7a0800',
        borderWidth: 1,
        paddingHorizontal: 10,
        color: '#fcfcfc',
    },
    button: {
        color: '#7a0800',
    },
    modal: {
        borderColor: '#7a0800',
        borderWidth: 4,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalContent: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        color: '#7a0800',

    },
    item: {
        backgroundColor: 'transparent',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,


    },
    itemText: {
        color: '#ffffff',
        fontSize: 22,
        fontFamily: 'serif',
    },
    image: {
        width: '100%',
        height: 400,
        borderColor: '#7a0800',
        borderWidth: 4,
        marginBottom: 10,
    },
    modalHeader: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 0,
        color: '#7a0800',
    },
    separator: {
        height: 7,
        width: "100%",
        backgroundColor: "#7a0800",
        borderRadius: 5,



    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#7a0800',
    },
    statisticsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 5,
        color: '#7a0800',

    },
    detailsContainer: {
        marginTop: 10,
        width: '100%',
    },
    actionsContainer: {
        marginTop: 10,
        width: '100%',

    },

    imageBackground: {
        flex: 1,
        justifyContent: 'center',
        height: height,
        width: width,
    },
});