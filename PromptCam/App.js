import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import BrowseScreen from './screens/BrowseScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import { FavoritesProvider } from './context/FavoritesContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: '#0d0d18',
                borderTopColor: '#1e1e32',
                borderTopWidth: 1,
                height: 70,
                paddingBottom: 12,
                paddingTop: 8,
              },
              tabBarActiveTintColor: '#a78bfa',
              tabBarInactiveTintColor: '#444466',
              tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '600',
                letterSpacing: 0.5,
              },
            }}
          >
            <Tab.Screen
              name="Browse"
              component={BrowseScreen}
              options={{
                tabBarLabel: 'Explore',
                tabBarIcon: ({ color }) => (
                  <Text style={{ fontSize: 20, color }}>✦</Text>
                ),
              }}
            />
            <Tab.Screen
              name="Favorites"
              component={FavoritesScreen}
              options={{
                tabBarLabel: 'Saved',
                tabBarIcon: ({ color }) => (
                  <Text style={{ fontSize: 20, color }}>♥</Text>
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}
