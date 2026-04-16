import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import { FavoritesProvider } from './context/FavoritesContext';

const Tab = createBottomTabNavigator();

const TabIcon = ({ icon, label, focused }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.4 }}>{icon}</Text>
  </View>
);

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
                borderTopColor: '#efefef',
                borderTopWidth: 1,
                height: 70,
                paddingBottom: 10,
                paddingTop: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.06,
                shadowRadius: 10,
                elevation: 10,
              },
              tabBarActiveTintColor: '#f5a623',
              tabBarInactiveTintColor: '#b0b0b0',
              tabBarLabelStyle: {
                fontSize: 10,
                fontWeight: '600',
                marginTop: 2,
              },
              tabBarShowLabel: false,
            }}
          >
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
              }}
            />
            <Tab.Screen
              name="Search"
              component={SearchScreen}
              options={{
                tabBarIcon: ({ focused }) => <TabIcon icon="🔍" focused={focused} />,
              }}
            />
            <Tab.Screen
              name="Categories"
              component={CategoriesScreen}
              options={{
                tabBarIcon: ({ focused }) => <TabIcon icon="⊞" focused={focused} />,
              }}
            />
            <Tab.Screen
              name="Favorites"
              component={FavoritesScreen}
              options={{
                tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} />,
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}
