import React, { useEffect } from 'react';
import { router, useSegments } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import Loader from '@/components/common/Loader';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { checkAuth } from '@/store/slices/authSlice';

export default function Index() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const segments = useSegments();

  useEffect(() => {
    const checkUserAuth = async () => {
      await dispatch(checkAuth());
      
      if (isAuthenticated) {
        router.replace('/(app)');
      } else {
        router.replace('/onboarding');
      }
    };

    checkUserAuth();
  }, [dispatch, isAuthenticated]);
  
  return (
    <View style={styles.container}>
      <Loader text="Chargement..." />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});