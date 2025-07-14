import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { DashboardDateRange } from '../../types';

interface DateRangePickerProps {
  dateRange: DashboardDateRange;
  onDateRangeChange: (dateRange: DashboardDateRange) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  dateRange,
  onDateRangeChange,
}) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      onDateRangeChange({
        ...dateRange,
        start_date: formattedDate,
      });
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      onDateRangeChange({
        ...dateRange,
        end_date: formattedDate,
      });
    }
  };

  // Funções para definir períodos predefinidos
  const setLastWeek = () => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    
    onDateRangeChange({
      start_date: lastWeek.toISOString().split('T')[0],
      end_date: today.toISOString().split('T')[0],
    });
  };

  const setLastMonth = () => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 30);
    
    onDateRangeChange({
      start_date: lastMonth.toISOString().split('T')[0],
      end_date: today.toISOString().split('T')[0],
    });
  };

  const setLastYear = () => {
    const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);
    
    onDateRangeChange({
      start_date: lastYear.toISOString().split('T')[0],
      end_date: today.toISOString().split('T')[0],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Período:</Text>
      <View style={styles.buttonsContainer}>
        <Button mode="outlined" onPress={setLastWeek} style={styles.button}>
          Última semana
        </Button>
        <Button mode="outlined" onPress={setLastMonth} style={styles.button}>
          Último mês
        </Button>
        <Button mode="outlined" onPress={setLastYear} style={styles.button}>
          Último ano
        </Button>
      </View>
      
      <View style={styles.dateContainer}>
        <View style={styles.datePickerContainer}>
          <Text>De:</Text>
          <Button
            mode="outlined"
            onPress={() => setShowStartPicker(true)}
            style={styles.dateButton}
          >
            {dateRange.start_date}
          </Button>
        </View>
        
        <View style={styles.datePickerContainer}>
          <Text>Até:</Text>
          <Button
            mode="outlined"
            onPress={() => setShowEndPicker(true)}
            style={styles.dateButton}
          >
            {dateRange.end_date}
          </Button>
        </View>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={new Date(dateRange.start_date)}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}
      
      {showEndPicker && (
        <DateTimePicker
          value={new Date(dateRange.end_date)}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  button: {
    marginRight: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButton: {
    marginLeft: 8,
  },
}); 