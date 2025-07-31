// src/features/payment-links/screens/CreatePaymentLinkScreen.tsx
import { Stack, useRouter } from 'expo-router';
import { Barcode, Check, CreditCard, PencilSimple, QrCode, UploadSimple, X } from 'phosphor-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ColorPicker, { HueSlider, Panel1, Preview } from 'reanimated-color-picker';
import { Button } from '../../../components/common/Button';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { colors } from '../../../theme/colors';

const paymentMethods = [
  { id: 'credit_card', name: 'Cartão de crédito', icon: <CreditCard size={24} color={colors.textSecondary}/> },
  { id: 'pix', name: 'Pix', icon: <QrCode size={24} color={colors.textSecondary}/> },
  { id: 'boleto', name: 'Boleto bancário', icon: <Barcode size={24} color={colors.textSecondary}/> },
];

const colorSwatches = ['#E53935', '#FFB300', '#FDD835', '#43A047', '#26A69A', '#3949AB', '#D81B60', '#E57373', '#F48FB1', '#81C784', '#64B5F6', '#9575CD', '#795548', '#0D05CC', '#212121', '#9E9E9E'];

export default function CreatePaymentLinkScreen() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [selectedColor, setSelectedColor] = useState('#E53935');

    const toggleMethod = (id: string) => {
        setSelectedMethods(prev => 
            prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
        );
    };

    const onSelectColor = ({ hex }: { hex: string }) => {
      setSelectedColor(hex);
    };

    const Step1 = () => (
        <>
            <Text style={styles.title}>Preencha os campos abaixo para criar seu link de pagamento</Text>
            
            <TextInput placeholder="Nome do produto ou serviço" style={styles.input} />
            <TextInput placeholder="Valor" style={styles.input} keyboardType="numeric" />
            <TextInput placeholder="Descrição da cobrança" style={[styles.input, styles.textArea]} multiline />

            <Text style={styles.subtitle}>Selecione as formas de pagamento</Text>
            <View style={styles.methodsContainer}>
                {paymentMethods.map(method => (
                    <TouchableOpacity 
                        key={method.id} 
                        style={[styles.methodButton, selectedMethods.includes(method.id) && styles.methodButtonSelected]}
                        onPress={() => toggleMethod(method.id)}
                    >
                        {method.icon}
                        <Text style={styles.methodText}>{method.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.checkboxRow}>
                <Text style={styles.checkboxLabel}>Solicitar endereço no checkout</Text>
                <TouchableOpacity style={styles.checkbox}>
                    <Check size={18} color={colors.white} weight='bold' />
                </TouchableOpacity>
            </View>

            <View style={styles.footerButtons}>
                <TouchableOpacity style={styles.navButton} disabled>
                    <Text style={[styles.navButtonText, { color: colors.textSecondary }]}>Anterior</Text>
                </TouchableOpacity>
                <Button title="Avançar" onPress={() => setStep(2)} icon="arrow" />
            </View>
        </>
    );

    const Step2 = () => (
        <>
            <Text style={styles.title}>Estamos quase lá! Vamos <Text style={{color: colors.primary}}>personalizar seu link de pagamento.</Text></Text>

            <TouchableOpacity style={styles.uploadBox}>
                <UploadSimple size={32} color={colors.primary} />
                <Text style={styles.uploadText}>Envie seu logotipo aqui</Text>
                <Text style={styles.uploadLink}>Pesquisar</Text>
            </TouchableOpacity>

            <Text style={styles.subtitle}>Escolha a cor do seu link</Text>
            
            <TouchableOpacity style={styles.colorSelector} onPress={() => setShowColorPicker(true)}>
                <View style={[styles.colorPreview, { backgroundColor: selectedColor }]} />
                <Text style={styles.colorSelectorText}>Selecione a cor</Text>
                <PencilSimple size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <View style={styles.swatchGrid}>
                {colorSwatches.map(color => (
                    <TouchableOpacity key={color} onPress={() => setSelectedColor(color)} style={[styles.swatch, { backgroundColor: color }]}>
                        {selectedColor === color && <Check size={18} color={colors.white} />}
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.footerButtons}>
                <TouchableOpacity style={styles.navButton} onPress={() => setStep(1)}>
                    <Text style={styles.navButtonText}>Anterior</Text>
                </TouchableOpacity>
                <Button title="Criar link" onPress={() => { /* Lógica de criação */ router.back()}} icon="check"/>
            </View>
        </>
    );
    
    // Modal de Color Picker
    if (showColorPicker) {
        return (
            <View style={styles.colorPickerContainer}>
                <Stack.Screen options={{ title: 'Escolher cor' }} />
                <TouchableOpacity onPress={() => setShowColorPicker(false)} style={styles.closeButton}><X size={24} color={colors.text} /></TouchableOpacity>
                <ColorPicker style={{ width: '90%' }} value={selectedColor} onComplete={onSelectColor}>
                    <Preview style={[styles.preview, {borderColor: colors.lightGray, borderWidth: 1}]} />
                    <Panel1 style={styles.panel} />
                    <HueSlider style={styles.slider} />
                </ColorPicker>
                <Button title="Confirmar" onPress={() => setShowColorPicker(false)} />
            </View>
        );
    }

    return (
        <ScreenContainer scrollable>
            <Stack.Screen options={{ title: 'Criar link de pagamento', headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false }} />
            <View style={styles.progressContainer}>
                <View style={[styles.progressStep, step >= 1 && styles.progressStepActive]} />
                <View style={[styles.progressStep, step >= 2 && styles.progressStepActive]} />
            </View>
            {step === 1 ? <Step1 /> : <Step2 />}
        </ScreenContainer>
    );
}

// Estilos gigantescos para replicar o Figma
const styles = StyleSheet.create({
    progressContainer: { flexDirection: 'row', gap: 8, marginTop: 16, marginBottom: 24 },
    progressStep: { flex: 1, height: 4, backgroundColor: colors.lightGray, borderRadius: 2 },
    progressStepActive: { backgroundColor: colors.primary },
    title: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 24 },
    subtitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginVertical: 24 },
    input: { height: 56, backgroundColor: colors.white, borderRadius: 8, paddingHorizontal: 16, fontSize: 16, borderWidth: 1, borderColor: colors.lightGray, marginBottom: 16 },
    textArea: { height: 100, textAlignVertical: 'top', paddingTop: 16 },
    methodsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    methodButton: { width: '48%', height: 70, backgroundColor: colors.lightGray2, borderRadius: 8, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'transparent' },
    methodButtonSelected: { borderColor: colors.primary, backgroundColor: colors.white },
    methodText: { marginLeft: 12, color: colors.text, fontSize: 14, fontWeight: '600' },
    checkboxRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 24 },
    checkboxLabel: { fontSize: 16, color: colors.text },
    checkbox: { width: 24, height: 24, borderRadius: 4, backgroundColor: colors.primaryDark, justifyContent: 'center', alignItems: 'center' },
    footerButtons: { flexDirection: 'row', alignItems: 'center', marginTop: 32, gap: 16 },
    navButton: { height: 56, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
    navButtonText: { color: colors.primaryDark, fontSize: 16, fontWeight: 'bold' },
    uploadBox: { height: 150, borderRadius: 8, borderStyle: 'dashed', borderWidth: 2, borderColor: colors.lightGray, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white },
    uploadText: { marginTop: 8, fontSize: 16, color: colors.textSecondary },
    uploadLink: { marginTop: 4, fontSize: 16, color: colors.primary, fontWeight: 'bold', textDecorationLine: 'underline' },
    colorSelector: { flexDirection: 'row', alignItems: 'center', height: 56, backgroundColor: colors.lightGray2, borderRadius: 8, paddingHorizontal: 16, borderWidth: 1, borderColor: 'transparent' },
    colorPreview: { width: 24, height: 24, borderRadius: 12, marginRight: 12, borderWidth: 1, borderColor: colors.lightGray },
    colorSelectorText: { flex: 1, fontSize: 16, color: colors.text },
    swatchGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 16 },
    swatch: { width: '15%', aspectRatio: 1, borderRadius: 8, margin: '1%', justifyContent: 'center', alignItems: 'center' },
    colorPickerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white, padding: 20 },
    panel: { width: '100%', height: 250, borderRadius: 12, marginTop: 20 },
    slider: { borderRadius: 12, height: 40, marginTop: 20 },
    preview: { width: '100%', height: 60, borderRadius: 12 },
    closeButton: { position: 'absolute', top: 50, right: 20, zIndex: 1 },
});
