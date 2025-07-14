import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  useColorScheme
} from 'react-native';
import { customTheme } from '../../theme/theme';

export interface AppListItemProps {
  title: string;
  description?: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  // Add left and right as alternative prop names for leftContent and rightContent
  left?: (props: any) => React.ReactNode;
  right?: (props: any) => React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  disabled?: boolean;
}

interface IconProps {
  name: string;
  color?: string;
  size?: number;
}

// Extendendo o tipo para incluir o subcomponente Icon
export interface AppListItemComponent extends React.FC<AppListItemProps> {
  Icon: React.FC<IconProps>;
}

// Create the base component
const BaseAppListItem: React.FC<AppListItemProps> = ({
  title,
  description,
  leftContent,
  rightContent,
  left,
  right,
  onPress,
  style,
  titleStyle,
  descriptionStyle,
  disabled = false,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Use either leftContent or left prop
  const finalLeftContent = leftContent || (left && left({}));
  // Use either rightContent or right prop
  const finalRightContent = rightContent || (right && right({}));

  const renderContent = () => (
    <>
      {finalLeftContent && <View style={styles.leftContent}>{finalLeftContent}</View>}
      
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            {
              color: isDark 
                ? customTheme.colors.text.primary.dark 
                : customTheme.colors.text.primary.light,
            },
            titleStyle,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        
        {description && (
          <Text
            style={[
              styles.description,
              {
                color: isDark
                  ? customTheme.colors.text.secondary.dark
                  : customTheme.colors.text.secondary.light,
              },
              descriptionStyle,
            ]}
            numberOfLines={2}
          >
            {description}
          </Text>
        )}
      </View>
      
      {finalRightContent && <View style={styles.rightContent}>{finalRightContent}</View>}
    </>
  );

  const containerStyles = [
    styles.container,
    {
      backgroundColor: isDark ? customTheme.colors.card.dark : customTheme.colors.card.light,
      borderBottomColor: isDark ? customTheme.colors.border.dark : customTheme.colors.border.light,
    },
    style,
  ];

  // Renderizar como TouchableOpacity ou View dependendo se há onPress
  if (onPress) {
    return (
      <TouchableOpacity
        style={containerStyles}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyles}>{renderContent()}</View>;
};

// Create the component with the Icon subcomponent
export const AppListItem = BaseAppListItem as AppListItemComponent;

// Add static property for the Icon component reference
AppListItem.Icon = ({ name, color, size = 24 }: IconProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = color || (isDark ? customTheme.colors.text.primary.dark : customTheme.colors.text.primary.light);
  
  // Converta a string name para o tipo esperado pelo MaterialCommunityIcons
  return <MaterialCommunityIcons name={name as any} size={size} color={iconColor} />;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  leftContent: {
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
  },
  rightContent: {
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 