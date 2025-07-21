import React, { ReactNode } from 'react';
import { Text, View, ViewProps } from 'react-native';

/**
 * 🛡️ TEXT VALIDATION UTILITIES
 * ============================
 * 
 * Utilitários para prevenir erros "Unexpected text node" no React Native
 * que ocorrem quando texto é renderizado diretamente em Views
 */

/**
 * 🔍 VERIFICAR SE UM VALOR É TEXTO
 */
export const isTextNode = (child: ReactNode): boolean => {
  return typeof child === 'string' || typeof child === 'number';
};

/**
 * 🛡️ SAFE VIEW COMPONENT
 * =====================
 * 
 * View que automaticamente envolve texto solto em componentes Text
 */
export interface SafeViewProps extends ViewProps {
  children: ReactNode;
  textStyle?: any;
  wrapTextNodes?: boolean;
}

export const SafeView: React.FC<SafeViewProps> = ({ 
  children, 
  textStyle, 
  wrapTextNodes = true,
  ...viewProps 
}) => {
  const safeChildren = React.Children.map(children, (child, index) => {
    // Se for texto solto e wrapTextNodes estiver habilitado
    if (wrapTextNodes && isTextNode(child)) {
      // Filtrar pontos isolados ou strings vazias
      const childString = String(child).trim();
      if (childString === '' || childString === '.') {
        // Retornar null para não renderizar
        return null;
      }
      
      // Envolver em Text component
      return (
        <Text key={index} style={textStyle}>
          {child}
        </Text>
      );
    }
    
    return child;
  });

  return <View {...viewProps}>{safeChildren}</View>;
};

/**
 * 🔧 SAFE TEXT RENDERER
 * =====================
 * 
 * Função para renderizar texto de forma segura
 */
export const safeText = (
  value: any, 
  fallback: string = '',
  style?: any
): React.ReactElement => {
  const textValue = String(value || fallback).trim();
  
  // Não renderizar se for vazio ou apenas ponto
  if (textValue === '' || textValue === '.') {
    return <Text style={style} />;
  }
  
  return <Text style={style}>{textValue}</Text>;
};

/**
 * 🧹 CLEAN TEXT VALUE
 * ===================
 * 
 * Limpa valores que podem causar problemas
 */
export const cleanTextValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  const textValue = String(value).trim();
  
  // Filtrar caracteres problemáticos isolados
  if (textValue === '.' || textValue === ',' || textValue === ';') {
    return '';
  }
  
  return textValue;
};

/**
 * 🔍 VALIDATION HELPERS
 * =====================
 */
export const validateTextInView = (children: ReactNode): void => {
  if (process.env.NODE_ENV !== 'production') {
    React.Children.forEach(children, (child) => {
      if (isTextNode(child)) {
        const textValue = String(child).trim();
        if (textValue !== '') {
          console.warn(
            `⚠️ Text node detected in View: "${textValue}". ` +
            'Wrap text in <Text> component or use SafeView.'
          );
        }
      }
    });
  }
};

/**
 * 🛡️ ENHANCED SAFE VIEW WITH VALIDATION
 * =====================================
 */
export const ValidatedView: React.FC<SafeViewProps> = ({ children, ...props }) => {
  // Em desenvolvimento, validar se há texto solto
  if (process.env.NODE_ENV !== 'production') {
    validateTextInView(children);
  }
  
  return <SafeView {...props}>{children}</SafeView>;
};

/**
 * 📝 SAFE INTERPOLATION HELPER
 * ============================
 * 
 * Para usar em templates quando não temos certeza do valor
 */
export const safeInterpolation = (value: any, wrapper: 'text' | 'none' = 'text') => {
  const cleanValue = cleanTextValue(value);
  
  if (cleanValue === '') {
    return null;
  }
  
  if (wrapper === 'text') {
    return <Text>{cleanValue}</Text>;
  }
  
  return cleanValue;
};

/**
 * 📋 EXAMPLES OF USAGE
 * ===================
 * 
 * // Instead of:
 * <View>
 *   {someValue}
 * </View>
 * 
 * // Use:
 * <SafeView>
 *   {someValue}
 * </SafeView>
 * 
 * // Or:
 * <View>
 *   {safeInterpolation(someValue)}
 * </View>
 * 
 * // Or:
 * <View>
 *   {safeText(someValue, 'Default text')}
 * </View>
 */ 