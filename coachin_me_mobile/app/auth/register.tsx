import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import TextInput from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import Colors from '@/constants/colors';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { register } from '@/store/slices/authSlice';
import { User } from '@/types';
import { Camera, UserCircle } from 'lucide-react-native';

const genderOptions = [
  { label: 'Homme', value: 'homme' },
  { label: 'Femme', value: 'femme' },
  { label: 'Autre', value: 'autre' },
];

const famillialSituations = [
  { label: 'Célibataire', value: 'célibataire' },
  { label: 'Marié(e)', value: 'marié(e)' },
  { label: 'Divorcé(e)', value: 'divorcé(e)' },
  { label: 'Veuf/Veuve', value: 'veuf/veuve' },
];

const initialFormData: Omit<User, 'id'> = {
  nom: '',
  prenom: '',
  email: '',
  dateNaissance: '',
  telephone: '',
  adresse: '',
  genre: 'homme',
  photo: '',
  statut: 'Actif',
  situation_familliale: 'célibataire',
  role: 'coache',
};

const Register = () => {
  const [formData, setFormData] = useState<Omit<User, 'id'>>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const [selectedGender, setSelectedGender] = useState('homme');
  const [selectedFamilialSituation, setSelectedFamilialSituation] = useState('célibataire');

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const updateFormData = (key: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [key]: value });
    // Clear error for this field if exists
    if (errors[key]) {
      setErrors({ ...errors, [key]: '' });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nom) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom) newErrors.prenom = 'Le prénom est requis';
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.dateNaissance) {
      newErrors.dateNaissance = 'La date de naissance est requise';
    } else {
      // Basic date validation (YYYY-MM-DD)
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(formData.dateNaissance)) {
        newErrors.dateNaissance = 'Format de date invalide (YYYY-MM-DD)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.telephone) {
      newErrors.telephone = 'Le numéro de téléphone est requis';
    }
    
    if (!formData.adresse) {
      newErrors.adresse = 'L\'adresse est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleRegister = async () => {
    // Update with selected gender and situation
    const finalFormData = {
      ...formData,
      genre: selectedGender as 'homme' | 'femme' | 'autre',
      situation_familliale: selectedFamilialSituation
    };
    
    try {
      const resultAction = await dispatch(register(finalFormData));
      if (register.fulfilled.match(resultAction)) {
        router.replace('/(app)');
      }
    } catch (error) {
      console.error('Failed to register:', error);
    }
  };

  const navigateToLogin = () => {
    router.push('/auth/login');
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Nous avons besoin des permissions de la galerie pour importer une photo');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      updateFormData('photo', result.assets[0].uri);
    }
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicator}>
        <View style={[styles.stepDot, step >= 1 && styles.activeStepDot]} />
        <View style={styles.stepLine} />
        <View style={[styles.stepDot, step >= 2 && styles.activeStepDot]} />
        <View style={styles.stepLine} />
        <View style={[styles.stepDot, step >= 3 && styles.activeStepDot]} />
      </View>
    );
  };

  const renderStep1 = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Informations personnelles</Text>
        
        <TextInput
          label="Nom"
          value={formData.nom}
          onChangeText={(text) => updateFormData('nom', text)}
          placeholder="Votre nom"
          error={errors.nom}
        />
        
        <TextInput
          label="Prénom"
          value={formData.prenom}
          onChangeText={(text) => updateFormData('prenom', text)}
          placeholder="Votre prénom"
          error={errors.prenom}
        />
        
        <TextInput
          label="Email"
          value={formData.email}
          onChangeText={(text) => updateFormData('email', text)}
          placeholder="Votre email"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />
        
        <TextInput
          label="Date de naissance (YYYY-MM-DD)"
          value={formData.dateNaissance}
          onChangeText={(text) => updateFormData('dateNaissance', text)}
          placeholder="1990-01-01"
          error={errors.dateNaissance}
        />
        
        <View style={styles.buttonContainer}>
          <Button
            title="Suivant"
            onPress={handleNextStep}
            style={styles.button}
          />
        </View>
      </View>
    );
  };

  const renderStep2 = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Contact et adresse</Text>
        
        <TextInput
          label="Téléphone"
          value={formData.telephone}
          onChangeText={(text) => updateFormData('telephone', text)}
          placeholder="Votre numéro de téléphone"
          keyboardType="phone-pad"
          error={errors.telephone}
        />
        
        <TextInput
          label="Adresse"
          value={formData.adresse}
          onChangeText={(text) => updateFormData('adresse', text)}
          placeholder="Votre adresse complète"
          multiline
          numberOfLines={3}
          error={errors.adresse}
        />
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Genre</Text>
          <View style={styles.genderOptions}>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.radioButton,
                  selectedGender === option.value && styles.radioButtonSelected,
                ]}
                onPress={() => {
                  setSelectedGender(option.value);
                  updateFormData('genre', option.value as any);
                }}
              >
                <Text
                  style={[
                    styles.radioButtonText,
                    selectedGender === option.value && styles.radioButtonTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Précédent"
            onPress={handlePrevStep}
            type="outline"
            style={[styles.button, styles.buttonMarginRight]}
          />
          <Button
            title="Suivant"
            onPress={handleNextStep}
            style={styles.button}
          />
        </View>
      </View>
    );
  };

  const renderStep3 = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Finalisez votre profil</Text>
        
        <View style={styles.photoContainer}>
          <TouchableOpacity style={styles.photoUpload} onPress={pickImage}>
            {formData.photo ? (
              <Image source={{ uri: formData.photo }} style={styles.userPhoto} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <UserCircle size={60} color={Colors.textSecondary} />
                <Camera size={24} color={Colors.white} style={styles.cameraIcon} />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.photoText}>Ajoutez une photo de profil</Text>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Situation familiale</Text>
          <View style={styles.situationContainer}>
            {famillialSituations.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.situationOption,
                  selectedFamilialSituation === option.value &&
                    styles.situationOptionSelected,
                ]}
                onPress={() => {
                  setSelectedFamilialSituation(option.value);
                  updateFormData('situation_familliale', option.value);
                }}
              >
                <Text
                  style={[
                    styles.situationText,
                    selectedFamilialSituation === option.value &&
                      styles.situationTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        <View style={styles.buttonContainer}>
          <Button
            title="Précédent"
            onPress={handlePrevStep}
            type="outline"
            style={[styles.button, styles.buttonMarginRight]}
          />
          <Button
            title="S'inscrire"
            onPress={handleRegister}
            loading={isLoading}
            style={styles.button}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Créez votre compte</Text>
            <Text style={styles.subtitle}>
              Rejoignez Coache et commencez votre parcours de développement personnel
            </Text>
            {renderStepIndicator()}
          </View>

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Vous avez déjà un compte ?</Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginText}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: Colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.border,
  },
  activeStepDot: {
    backgroundColor: Colors.primary,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  stepContainer: {
    marginBottom: 24,
  },
  stepTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  button: {
    flex: 1,
  },
  buttonMarginRight: {
    marginRight: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 16,
  },
  footerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loginText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginBottom: 8,
    color: Colors.text,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '20',
  },
  radioButtonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  radioButtonTextSelected: {
    fontFamily: 'Poppins-Medium',
    color: Colors.primary,
  },
  situationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  situationOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  situationOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '20',
  },
  situationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  situationTextSelected: {
    fontFamily: 'Poppins-Medium',
    color: Colors.primary,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoUpload: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 12,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  userPhoto: {
    width: '100%',
    height: '100%',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 4,
  },
  photoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    color: Colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default Register;