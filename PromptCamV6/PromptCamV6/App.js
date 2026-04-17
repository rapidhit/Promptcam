import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, View, Animated } from 'react-native';
import { useState, createContext, useContext, useRef } from 'react';
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

function TabIcon({ icon, focused, color }) {
  const scaleAnim = useRef(new Animated.Value(focused ? 1.15 : 1)).current;

  if (focused) {
    Animated.spring(scaleAnim, {
      toValue: 1.15, friction: 4, tension: 100, useNativeDriver: true,
    }).start();
  } else {
    Animated.spring(scaleAnim, {
      toValue: 1, friction: 4, tension: 100, useNativeDriver: true,
    }).start();
  }

  return (
    <Animated.View style={{
      transform: [{ scale: scaleAnim }],
      alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.35 }}>{icon}</Text>
    </Animated.View>
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
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 16,
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

// Smooth slide + fade transition config
const smoothTransition = {
  gestureEnabled: true,
  cardStyleInterpolator: ({ current, next, layouts }) => {
    return {
      cardStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.8, 1],
        }),
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [40, 0],
            }),
          },
          {
            scale: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.96, 1],
            }),
          },
        ],
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.3],
        }),
      },
    };
  },
  transitionSpec: {
    open: { animation: 'timing', config: { duration: 320 } },
    close: { animation: 'timing', config: { duration: 260 } },
  },
};

const slideFromRight = {
  gestureEnabled: true,
  cardStyleInterpolator: ({ current, next, layouts }) => ({
    cardStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1], outputRange: [0, 1],
      }),
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width * 0.4, 0],
          }),
        },
      ],
    },
  }),
  transitionSpec: {
    open: { animation: 'timing', config: { duration: 300 } },
    close: { animation: 'timing', config: { duration: 250 } },
  },
};

export default function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark(p => !p) }}>
      <SafeAreaProvider>
        <FavoritesProvider>
          <NavigationContainer>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                cardStyle: { flex: 1 },
                ...smoothTransition,
              }}
            >
              <Stack.Screen name="Main" component={TabNavigator}
                options={{ cardStyleInterpolator: undefined }} />
              <Stack.Screen name="TemplateDetail" component={TemplateDetailScreen}
                options={{ ...smoothTransition }} />
              <Stack.Screen name="SeeAll" component={SeeAllScreen}
                options={{ ...slideFromRight }} />
            </Stack.Navigator>
          </NavigationContainer>
        </FavoritesProvider>
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
}
