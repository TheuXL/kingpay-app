import React from 'react';
import { TouchableOpacity as RNTouchableOpacity, Text } from 'react-native';

// Tenta extrair um texto de dentro dos children de um componente
const extractText = (children) => {
    if (typeof children === 'string') {
        return children;
    }
    if (Array.isArray(children)) {
        return children.map(extractText).join('');
    }
    if (React.isValidElement(children) && children.props.children) {
        if (children.type === Text) {
            return extractText(children.props.children);
        }
        return extractText(children.props.children);
    }
    return null;
};

export const TouchableOpacity = (props) => {
  const handlePress = (e) => {
    const textLabel = extractText(props.children);

    console.log(`\n--- 👇 [User Click] 👇 ---`);
    console.log(`Component: TouchableOpacity`);
    if (textLabel) {
        console.log(`Label: "${textLabel.trim()}"`);
    }
    console.log(`-----------------------\n`);

    if (props.onPress) {
      props.onPress(e);
    }
  };

  return <RNTouchableOpacity {...props} onPress={handlePress} />;
}; 