import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

import React, { useState, useCallback } from 'react'
import { View, Text, Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Tab = createBottomTabNavigator();

// import Result from './Results/Result.jsx'
// import Setting from './Settings/Setting.jsx'
// import { Test } from './Test/Test.jsx';

import {
  TestIconInactive,
  TestIconActive,
  SettingsIconInactive,
  SettingsIconActive,
  ResultsIconInactive,
  ResultsIconActive,
  HomeIconInactive,
  HomeIconActive,
  MapIcon

} from './Vector.jsx';

import { NavigationContainer } from '@react-navigation/native';
// import dashboard from './dashboard/dashboard.jsx'
// import Dashboard from './dashboard/dashboard.jsx';
import Home from './Pages/Home/Home.jsx';
import Support from './Pages/Support/Support.jsx';
import Profile from './Pages/Profile/Profile.jsx';
import Ticket from './Pages/Ticket/Ticket.jsx';

const dashboardName = "Home";
const profileName = "Profile";
const ticketName = "Ticket";
const supportName = "Support";





export default function App() {

  // const [acres, setAcres] = useState(0);
  // const [season, setSeason] = useState('')
  // const [soil, setSoil] = useState('')

  // const [handle, setHandle] = useState('');
  // function handleState() {
  //   setHandle("Changed here from function");
  // }

  // const setAcresCallback = useCallback((value) => {
  //   console.log("Nav here, params called", value)
  //   setAcres(value);
  // }, [setAcres]);





  // const [sharedData, setSharedData] = useState(0);
  // const setSharedDataCallback = useCallback((value) => {
  //   console.log("Nav here, params called", value)
  //   setSharedData(value);
  // }, [setSharedData]);


  return (
    <NavigationContainer independent={true}>

        <Tab.Navigator screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 82
          },
          tabBarIcon: ({ size, focused, color }) => {

            if (route.name == dashboardName) {
              if (focused) {
                return (<HomeIconActive />)
              }
              else {
                return (<HomeIconInactive />)

              }

            }

            if (route.name == ticketName) {

              if (focused) {
                return (
                  <MapIcon />
                );

              }
              return (
                <ResultsIconInactive />
              );
            }
            if (route.name == supportName) {
              if (focused) {
                return (
                  <SettingsIconActive />
                );
              }
              return (
                <SettingsIconInactive />
              );
            }
            if (route.name == profileName) {
              if (focused) {
                return (
                  <TestIconActive />
                );
              }
              return (
                <TestIconInactive />
              );

            }

            return (

              <ResultsIconActive />
            );
          }
        })} >


          <Tab.Screen name={dashboardName} component={Home} />
          <Tab.Screen name={ticketName} component={Ticket} />
          <Tab.Screen name={supportName} component={Support} />
          <Tab.Screen name={profileName} component={Profile}/>


        </Tab.Navigator>
        
    </NavigationContainer >
  )
}




// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
