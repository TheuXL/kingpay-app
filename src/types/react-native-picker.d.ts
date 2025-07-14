declare module '@react-native-picker/picker' {
  import * as React from 'react';
    import { StyleProp, TextStyle, ViewStyle } from 'react-native';

  export interface PickerItemProps {
    label: string;
    value: any;
    color?: string;
    fontFamily?: string;
    testID?: string;
    enabled?: boolean;
    style?: StyleProp<TextStyle>;
  }

  export interface PickerProps {
    style?: StyleProp<ViewStyle>;
    selectedValue?: any;
    onValueChange?: (itemValue: any, itemIndex: number) => void;
    enabled?: boolean;
    mode?: 'dialog' | 'dropdown';
    itemStyle?: StyleProp<TextStyle>;
    prompt?: string;
    testID?: string;
    dropdownIconColor?: string;
    numberOfLines?: number;
    children?: React.ReactNode;
  }

  export class Picker extends React.Component<PickerProps> {
    static Item: React.ComponentClass<PickerItemProps>;
  }

  export class PickerIOS extends React.Component<PickerProps> {
    static Item: React.ComponentClass<PickerItemProps>;
  }

  export class PickerAndroid extends React.Component<PickerProps> {
    static Item: React.ComponentClass<PickerItemProps>;
  }
} 