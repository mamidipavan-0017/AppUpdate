import React, {useEffect, useState} from 'react';
import {View, Text, Alert, Platform, Linking, AppState} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const App = () => {
  const [appVersion, setAppVersion] = useState('');
  const [storeVersion, setStoreVersion] = useState('1.1.2');
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);

  useEffect(() => {
    const getAppVersion = async () => {
      try {
        const version = await DeviceInfo.getVersion();
        setAppVersion(version);
      } catch (error) {
        console.error('Error fetching app version:', error);
      }
    };

    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'active') {
        getAppVersion();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (appVersion && storeVersion !== appVersion) {
      setShowUpdateAlert(true);
    } else {
      setShowUpdateAlert(false);
    }
  }, [storeVersion, appVersion]);

  const handleUpdate = async () => {
    let storeUrl;
    if (Platform.OS === 'android') {
      storeUrl = 'market://details?id=com.cricbuzz.app'; // Replace with your Android package name
    } else if (Platform.OS === 'ios') {
      storeUrl = 'itms-apps://apps.apple.com/app/your-app-id'; // Replace with your iOS App Store ID
    }

    try {
      await Linking.openURL(storeUrl);
    } catch (error) {
      // console.error('Error opening store:', error);
      Alert.alert('Error', 'Could not open store.');
    }
  };

  const onClose = () => {
    setShowUpdateAlert(false);
  };

  useEffect(() => {
    if (showUpdateAlert) {
      Alert.alert(
        'Update Available',
        'A new version of the app is available. Please update to continue using the app.',
        [
          {
            text: 'Update',
            onPress: handleUpdate,
          },
          {
            text: 'Skip',
            onPress: onClose,
          },
        ],
        {cancelable: false},
      );
    }
  }, [showUpdateAlert]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Welcome to My App</Text>
    </View>
  );
};

export default App;
