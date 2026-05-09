import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import NewRdvScreen from '../screens/NewRdvScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RdvDetailScreen from '../screens/RdvDetailScreen';
import AdminServicesScreen from '../screens/AdminServicesScreen';
import AdminRdvsScreen from '../screens/AdminRdvsScreen';
import AdminUsersScreen from '../screens/AdminUsersScreen';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ClientTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#2563EB', headerShown: false }}>
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#2563EB', headerShown: false }}>
      <Tab.Screen name="Services" component={AdminServicesScreen} />
      <Tab.Screen name="RDV" component={AdminRdvsScreen} />
      <Tab.Screen name="Utilisateurs" component={AdminUsersScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;

  const isAdmin = user?.role === 'admin';

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={isAdmin ? AdminTabs : ClientTabs} />
            {!isAdmin && (
              <Stack.Screen name="NewRdv" component={NewRdvScreen}
                options={{ headerShown: true, title: 'Nouveau RDV', headerTintColor: '#2563EB' }} />
            )}
            <Stack.Screen name="RdvDetail" component={RdvDetailScreen}
              options={{ headerShown: true, title: 'Détail RDV', headerTintColor: '#2563EB' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}