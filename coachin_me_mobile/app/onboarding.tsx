import React, { useRef, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import OnboardingItem from '@/components/onboarding/OnboardingItem';
import Button from '@/components/common/Button';
import Colors from '@/constants/colors';
import { SlidingDot } from 'react-native-animated-pagination-dots';
import Animated, { 
  useAnimatedRef, 
  useAnimatedScrollHandler, 
  useSharedValue
} from 'react-native-reanimated';
import { Animated as RNAnimated } from 'react-native';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Bienvenue sur Coache',
    description: 'Votre compagnon de développement personnel et de vie.',
    image: require('../assets/images/onboarding1.png'),
  },
  {
    id: '2',
    title: 'Fixez vos objectifs',
    description: 'Définissez vos objectifs et laissez-nous vous aider à les atteindre.',
    image: require('../assets/images/onboarding2.png'),
  },
  {
    id: '3',
    title: 'Suivez vos progrès',
    description: 'Visualisez votre progression et célébrez chaque victoire sur votre parcours.',
    image: require('../assets/images/onboarding3.png'),
  },
];

const Onboarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = new RNAnimated.Value(0);
  const reanimatedScrollX = useSharedValue(0);
  const flatListRef = useAnimatedRef<FlatList>();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      reanimatedScrollX.value = event.contentOffset.x;
      scrollX.setValue(event.contentOffset.x);
    },
  });

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.replace('/auth/login');
    }
  };

  const handleSkip = () => {
    router.replace('/auth/login');
  };

  const handleViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged: handleViewableItemsChanged },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.skipContainer}>
        <Button
          title="Passer"
          type="text"
          onPress={handleSkip}
          style={styles.skipButton}
          textStyle={styles.skipButtonText}
        />
      </View>
      
      <Animated.FlatList
        data={onboardingData}
        renderItem={({ item }) => <OnboardingItem item={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        ref={flatListRef as any}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />

      <View style={styles.bottomContainer}>
        <View style={styles.paginationContainer}>
          <SlidingDot
            data={onboardingData}
            scrollX={scrollX}
            dotSize={10}
            dotStyle={styles.dot}
            slidingIndicatorStyle={styles.slidingDot}
            containerStyle={styles.dotsContainer}
          />
        </View>

        <Button
          title={currentIndex === onboardingData.length - 1 ? "Commencer" : "Suivant"}
          onPress={handleNext}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  skipContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipButtonText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  button: {
    marginBottom: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dotsContainer: {
    paddingVertical: 16,
  },
  dot: {
    backgroundColor: Colors.border,
  },
  slidingDot: {
    backgroundColor: Colors.primary,
  },
});

export default Onboarding;