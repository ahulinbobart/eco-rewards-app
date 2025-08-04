/**
 * ECO-Rewards, Team HDRREL
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import HomeScreen from './screens/HomeScreen.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchScreen from './screens/SearchScreen';
import TutorialScreen from './screens/Tutorial';
import QRScreen from './screens/QRScreen';
import ProductDetails from './screens/ProductDetails';
import LoginScreen from './screens/LoginScreen';
import ShoppingListScreen from './screens/ShoppingList.js';
import HistoryScreen from './screens/HistoryScreen.js';
import storeReducer from './components/AppState.js';
import Axios from 'axios';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Button,
    Text,
    useColorScheme,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { thisExpression } from '@babel/types';
import { ClipPath } from 'react-native-svg';

const ShoppingListStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const ScannerStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const store = createStore(storeReducer);
const Stack = createNativeStackNavigator();

function LogoTitle() {
  return (
    <Image
      source={require('./components/icons/logo_1.png')}
    />
  );
}

//Entry point for the app
const App: () => Node = () => {
  const shoppingListItems = [];
  const userID = -1;
    
	//App screens must be inside Provider tag to allow access to store data
	//All screens are contained in a NavigationContainer to allow them to access each other
    return (
    <Provider store={store}>
        <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
            <Stack.Screen name="Home" component={MyTabs} options={{headerShown:false}}/>
            <Stack.Screen name="Tut" component={TutorialScreen} options={{headerShown:false}} />
            <Stack.Screen name="History" component={HistoryScreen} options={{headerShown:false}} />
        </Stack.Navigator>
        </NavigationContainer>
    </Provider>
	);
};


//Returns the Tab.Navigator component which navigates between the Stack.Navigator components for each screen
function MyTabs({ navigation }) {

	return (

			<Tab.Navigator
        initialRouteName="ProfileScreen"
        screenOptions={{
            headerShown: true,
            headerTitle: (props) => <LogoTitle {...props} />,

            headerTitleAlign: "center",
            headerRight: () => (
                <View style={{flexDirection: "row",justifyContent: "flex-end",paddingRight:10,width: 120}}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Tut")}
                    >
                    <MaterialCommunityIcons name="help-circle-outline" color="green" size={40}/>
                    </TouchableOpacity>
                </View>
            ),

        }}>
        <Tab.Screen
            name="ProfileScreen"
            component={ProfileStackScreens}
            options={{
                title: 'Your Profile',
                tabBarLabel: 'Home',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="home" color={'green'} size={26} />
                ),
            }}
        />
        <Tab.Screen
          name="SearchScreen"
          component={SearchStackScreens}
          options={{
            title: 'Search',
            tabBarLabel: 'Search',
            tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="magnify" color={'green'} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="ScannerScreen"
          component={ScannerStackScreens}
            options={{
                title: 'Scan QR Code',
                tabBarLabel: 'Scan',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="qrcode-scan" color={'green'} size={26} />
            ),
        }}
        />

        <Tab.Screen
            name="ShoppingListScreen"
            component={ShoppingListStackScreens}
            options={{
                title: 'Shopping List',
                tabBarLabel: 'Cart',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="cart" color={'green'} size={26} />
                ),
            }}
        />
			</Tab.Navigator>

	);
};

//Stack navigator for the shopping list screen
function ShoppingListStackScreens() {
    return (
        <ShoppingListStack.Navigator>
            <ShoppingListStack.Screen name="Shopping List" component={ShoppingListScreen} initialParams={{listId: 0}}/>
            <ShoppingListStack.Screen name="Details" component={ProductDetails} />
        </ShoppingListStack.Navigator>
    );
}

//Stack navigator for the QR Scanner, with product details linked when scanned
function ScannerStackScreens() {
    return (
        <ScannerStack.Navigator>
            <ScannerStack.Screen name="Scan QR Code" component={QRScreen} />
            <ScannerStack.Screen name="Details" component={ProductDetails} />
        </ScannerStack.Navigator>
    );
}

function ProfileStackScreens() {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen name="Your Profile" component={HomeScreen} />
            {/* <ProfileStack.Screen name="Shopping History" component={HistoryScreen} /> */}
        </ProfileStack.Navigator>
    );
}

//A stack for the search screen tab, allowing access to the details page for any searched products
function SearchStackScreens() {
    return (
        <SearchStack.Navigator>
            <SearchStack.Screen name="Product Search" component={SearchScreen} />
            <ScannerStack.Screen name="Details" component={ProductDetails} />
        </SearchStack.Navigator>
    );
}

const styles = StyleSheet.create({
    appHeader: {
        backgroundColor: 'white',
    },
    highlight: {
        fontWeight: '700',
    },
    help: {

    },
});

export default App;
