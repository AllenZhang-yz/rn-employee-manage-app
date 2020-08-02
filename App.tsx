import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home, { IItem } from './Screens/Home';
import CreateEmployee from './Screens/CreateEmployee';
import Profile from './Screens/Profile';

export type ModalStackParamList = {
  Home: undefined;
  CreateEmployee:
    | {
        id: string;
        name: string;
        picture: string;
        phone: string;
        salary: string;
        email: string;
        position: string;
      }
    | undefined;
  Profile: {
    item: IItem;
  };
};

const Stack = createStackNavigator<ModalStackParamList>();

export interface IModalStackNavigation
  extends StackNavigationProp<ModalStackParamList> {}

const myScreenOptions = {
  headerTintColor: 'white',
  headerStyle: {
    backgroundColor: '#006aff',
  },
};

const App = () => {
  return (
    <View style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={myScreenOptions} />
        <Stack.Screen
          name="CreateEmployee"
          component={CreateEmployee}
          options={{ ...myScreenOptions, title: 'Create Person' }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={myScreenOptions}
        />
      </Stack.Navigator>
    </View>
  );
};

export default () => {
  return (
    <NavigationContainer>
      <App />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    // marginTop: Constants.statusBarHeight,
  },
});
