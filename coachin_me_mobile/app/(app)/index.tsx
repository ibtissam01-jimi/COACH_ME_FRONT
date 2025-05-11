import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useAppSelector } from '@/hooks';

export default function Home() {
  const { user } = useAppSelector((state) => state.auth);
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Bonjour, {user?.prenom} 👋</Text>
          <Text style={styles.subGreeting}>Bienvenue sur Coache</Text>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title}>Développement personnel et coaching de vie</Text>
          
          <Text style={styles.paragraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, 
            nunc in aliquet facilisis, nisi arcu faucibus elit, eu placerat nisl 
            magna sit amet risus. Morbi vel malesuada libero.
          </Text>
          
          <Text style={styles.paragraph}>
            Proin sit amet tortor vel ipsum tempor ultrices vitae id dolor. 
            Aenean tempor quis erat non finibus. Phasellus dignissim turpis ut 
            sapien tincidunt, ut finibus libero posuere. In hac habitasse platea 
            dictumst. Quisque vitae nulla quis turpis lobortis aliquam.
          </Text>
          
          <Text style={styles.paragraph}>
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices 
            posuere cubilia curae; Nullam iaculis velit vitae massa volutpat 
            dapibus. Phasellus faucibus eros in augue condimentum, eu posuere 
            augue faucibus. Praesent ut cursus erat, quis tempor metus.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: Colors.text,
    marginBottom: 4,
  },
  subGreeting: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
  },
  content: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 16,
  },
  paragraph: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
});