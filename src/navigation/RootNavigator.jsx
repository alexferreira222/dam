import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '@/lib/AuthContext';
import { Home, Heart, Trophy, User, Shield } from 'lucide-react-native';

// Páginas - Importar versões nativas
import Login from '@/firebase-export/Login.native';
import Dashboard from '@/firebase-export/Dashboard.native';
import Perfil from '@/firebase-export/Perfil.native';
import Ranking from '@/firebase-export/Ranking.native';
import Favoritos from '@/firebase-export/Favoritos.native';
import VenueDetail from '@/firebase-export/VenueDetail.native';
import Admin from '@/firebase-export/Admin.native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="DashboardHome"
        component={Dashboard}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen
        name="VenueDetail"
        component={VenueDetail}
        options={{ title: 'Detalhes do Local' }}
      />
    </Stack.Navigator>
  );
}

function PerfilStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="PerfilHome"
        component={Perfil}
        options={{ title: 'Meu Perfil' }}
      />
    </Stack.Navigator>
  );
}

function FavoritosStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="FavoritosHome"
        component={Favoritos}
        options={{ title: 'Favoritos' }}
      />
    </Stack.Navigator>
  );
}

function RankingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="RankingHome"
        component={Ranking}
        options={{ title: 'Ranking' }}
      />
    </Stack.Navigator>
  );
}

function AdminStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="AdminHome"
        component={Admin}
        options={{ title: 'Administração' }}
      />
    </Stack.Navigator>
  );
}

function AuthTabNavigator() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        }
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Favoritos"
        component={FavoritosStack}
        options={{
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Ranking"
        component={RankingStack}
        options={{
          tabBarLabel: 'Ranking',
          tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilStack}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      {isAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminStack}
          options={{
            tabBarLabel: 'Admin',
            tabBarIcon: ({ color, size }) => <Shield color={color} size={size} />,
          }}
        />
      )}
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Ou um splash screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Auth" component={AuthTabNavigator} />
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
