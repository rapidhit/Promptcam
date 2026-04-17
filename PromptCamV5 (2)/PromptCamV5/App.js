import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';
import { useState, createContext, useContext } from 'react';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import SeeAllScreen from './screens/SeeAllScreen';
import TemplateDetailScreen from './screens/TemplateDetailScreen';
import { FavoritesProvider } from './context/FavoritesContext';

export const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabIcon({ icon, focused }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.35 }}>{icon}</Text>
    </View>
  );
}

function TabNavigator() {
  const { isDark } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
          borderTopColor: isDark ? '#2a2a4e' : '#efefef',
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
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} /> }} />
      <Tab.Screen name="Search" component={SearchScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🔍" focused={focused} /> }} />
      <Tab.Screen name="Categories" component={CategoriesScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="⊞" focused={focused} /> }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🤍" focused={focused} /> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark(p => !p) }}>
      <SafeAreaProvider>
        <FavoritesProvider>
          <NavigationContainer>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { flex: 1 } }}>
              <Stack.Screen name="Main" component={TabNavigator} />
              <Stack.Screen name="TemplateDetail" component={TemplateDetailScreen} />
              <Stack.Screen name="SeeAll" component={SeeAllScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </FavoritesProvider>
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
}
