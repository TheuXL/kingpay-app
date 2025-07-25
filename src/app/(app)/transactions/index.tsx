import TransactionList from "@/features/financial/components/TransactionList";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function TransactionsScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Transações</Text>
            </View>
            {/* <TransactionList />  // Componente será usado aqui */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        padding: 16
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    }
}); 