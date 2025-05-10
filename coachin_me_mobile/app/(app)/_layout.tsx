import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { checkAuth } from '@/store/slices/authSlice';
import { router } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import Colors from '@/constants/colors';
import {
  Home,
  MessageSquare,
  Medal,
  UserCircle,
  Calendar,
} from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export default function AppLayout() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const checkUserAuth = async () => {
      const result = await dispatch(checkAuth());
      
      if (!checkAuth.fulfilled.match(result)) {
        router.replace('/auth/login');
      }
    };

    checkUserAuth();
  }, [dispatch]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon={Home} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon={MessageSquare} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progrès',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon={Medal} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon={Calendar} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon={UserCircle} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

interface TabBarIconProps {
  icon: any;
  color: string;
  focused: boolean;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ icon: Icon, color, focused }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(focused ? 1.2 : 1, {
            damping: 10,
            stiffness: 100,
          }),
        },
      ],
      opacity: withTiming(focused ? 1 : 0.8, { duration: 200 }),
    };
  });

  return (
    <View style={styles.tabIconContainer}>
      <Animated.View style={[styles.tabIcon, animatedStyle]}>
        <Icon size={22} color={color} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 0,
    elevation: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    height: Platform.OS === 'ios' ? 88 : 70,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    paddingTop: 12,
  },
  tabBarLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    paddingTop: 4,
  },
  tabBarIcon: {
    marginTop: 4,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});