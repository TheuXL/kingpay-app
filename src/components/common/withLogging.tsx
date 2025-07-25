import React from 'react';

export const withLogging = (WrappedComponent) => {
  return (props) => {
    const handlePress = (e) => {
      console.log(`\n--- 👇 [User Click] 👇 ---`);
      console.log(`Component: ${WrappedComponent.displayName || WrappedComponent.name || 'Unknown'}`);
      if (props.logLabel) {
          console.log(`Label: ${props.logLabel}`);
      }
      console.log(`-----------------------\n`);

      if (props.onPress) {
        props.onPress(e);
      }
    };

    return <WrappedComponent {...props} onPress={handlePress} />;
  };
}; 