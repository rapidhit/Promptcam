import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';
import BrowseScreen from './screens/BrowseScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import { FavoritesProvider } from './context/FavoritesContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: '#ffffff',
                borderTopColor: '#f0ece4',
                borderTopWidth: 1.5,
                height: 72,
                paddingBottom: 14,
                paddingTop: 10,
                shadowColor: '#c8b89a',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 12,
              },
              tabBarActiveTintColor: '#d4622a',
              tabBarInactiveTintColor: '#c4b5a0',
              tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '700',
                letterSpacing: 0.8,
                textTransform: 'uppercase',
              },
            }}
          >
            <Tab.Screen
              name="Browse"
              component={BrowseScreen}
              options={{
                tabBarLabel: 'Explore',
                tabBarIcon: ({ color, focused }) => (
                  <View style={{
                    width: 32, height: 32,
                    borderRadius: 10,
                    backgroundColor: focused ? '#fff3ee' : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 18 }}>✦</Text>
                  </View>
                ),
              }}
            />
            <Tab.Screen
              name="Favorites"
              component={FavoritesScreen}
              options={{
                tabBarLabel: 'Saved',
                tabBarIcon: ({ color, focused }) => (
                  <View style={{
                    width: 32, height: 32,
                    borderRadius: 10,
                    backgroundColor: focused ? '#fff3ee' : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 18 }}>♥</Text>
                  </View>
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}
