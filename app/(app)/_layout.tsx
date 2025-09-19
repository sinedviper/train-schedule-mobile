import { useSelector } from 'react-redux';
import { getAuth } from '@/store/auth/select';
import { Tabs } from 'expo-router';
import { Cuboid, Home, ShieldUser, Star, User } from 'lucide-react-native';
import React from 'react';

export default function Layout() {
  const { user } = useSelector(getAuth);
  const isAdmin = user?.role === 'ADMIN';

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'index') {
            return <Home size={size} color={color} />;
          } else if (route.name === 'favorites') {
            return <Star size={size} color={color} />;
          } else if (route.name === 'profile') {
            return <User size={size} color={color} />;
          } else if (route.name === 'admin/index') {
            return <ShieldUser size={size} color={color} />;
          }

          return <Cuboid size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tabs.Screen
        name={'index'}
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name={'favorites'}
        options={{
          title: 'Favorites',
        }}
      />
      <Tabs.Screen
        name="admin/index"
        options={{
          tabBarItemStyle: { display: isAdmin ? 'flex' : 'none' },
          title: 'Admin',
        }}
      />
      <Tabs.Screen
        name={'profile'}
        options={{
          title: 'Profile',
        }}
      />
      <Tabs.Screen
        name={'admin/schedules/create'}
        options={{ tabBarItemStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name={'admin/schedules/edit/[schedulesId]'}
        options={{ tabBarItemStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name={'admin/schedules/[schedulesId]'}
        options={{ tabBarItemStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name={'admin/place/index'}
        options={{ tabBarItemStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name={'admin/place/create'}
        options={{ tabBarItemStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name={'admin/place/[placeId]'}
        options={{ tabBarItemStyle: { display: 'none' } }}
      />
    </Tabs>
  );
}
