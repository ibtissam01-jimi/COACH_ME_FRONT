import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { updateUserProfile, logout } from '@/store/slices/authSlice';
import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import { Camera, PencilLine, LogOut } from 'lucide-react-native';
import { User } from '@/types';

export default function Profile() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  const handleEditToggle = () => {
    if (editing) {
      // If we're currently editing, toggle back to view mode
      setFormData(user); // Reset to original data
    }
    setEditing(!editing);
  };

  const handleUpdateField = (field: keyof User, value: string) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSaveProfile = async () => {
    if (formData) {
      await dispatch(updateUserProfile(formData));
      setEditing(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          onPress: async () => {
            await dispatch(logout());
            router.replace('/auth/login');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const pickImage = async () => {
    if (!editing) return;
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Nous avons besoin des permissions de la galerie pour importer une photo');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0 && formData) {
      setFormData({ ...formData, photo: result.assets[0].uri });
    }
  };

  if (!user || !formData) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditToggle}
            >
              {editing ? (
                <Text style={styles.editButtonText}>Annuler</Text>
              ) : (
                <PencilLine size={20} color={Colors.primary} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <LogOut size={20} color={Colors.error} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileImageContainer}>
            <TouchableOpacity
              style={[styles.profileImage, editing && styles.profileImageEditing]}
              onPress={pickImage}
              disabled={!editing}
            >
              {formData.photo ? (
                <Image source={{ uri: formData.photo }} style={styles.userPhoto} />
              ) : (
                <View style={styles.photoPlaceholder} />
              )}
              
              {editing && (
                <View style={styles.cameraIconContainer}>
                  <Camera size={20} color={Colors.white} />
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          {!editing ? (
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {user.prenom} {user.nom}
              </Text>
              <Text style={styles.userRole}>{user.role}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.profileContent}>
          {editing ? (
            <View style={styles.form}>
              <View style={styles.formRow}>
                <TextInput
                  label="Prénom"
                  value={formData.prenom}
                  onChangeText={(text) => handleUpdateField('prenom', text)}
                  style={styles.formInput}
                />
                <TextInput
                  label="Nom"
                  value={formData.nom}
                  onChangeText={(text) => handleUpdateField('nom', text)}
                  style={styles.formInput}
                />
              </View>
              
              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(text) => handleUpdateField('email', text)}
                keyboardType="email-address"
              />
              
              <TextInput
                label="Téléphone"
                value={formData.telephone}
                onChangeText={(text) => handleUpdateField('telephone', text)}
                keyboardType="phone-pad"
              />
              
              <TextInput
                label="Adresse"
                value={formData.adresse}
                onChangeText={(text) => handleUpdateField('adresse', text)}
                multiline
                numberOfLines={3}
              />
              
              <TextInput
                label="Date de naissance"
                value={formData.dateNaissance}
                onChangeText={(text) => handleUpdateField('dateNaissance', text)}
              />
              
              <Button
                title="Enregistrer les modifications"
                onPress={handleSaveProfile}
                loading={isLoading}
                style={styles.saveButton}
              />
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <ProfileField label="Email" value={user.email} />
              <ProfileField label="Téléphone" value={user.telephone} />
              <ProfileField label="Adresse" value={user.adresse} />
              <ProfileField label="Date de naissance" value={user.dateNaissance} />
              <ProfileField label="Genre" value={user.genre} />
              <ProfileField label="Situation familiale" value={user.situation_familliale} />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface ProfileFieldProps {
  label: string;
  value: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value }) => {
  return (
    <View style={styles.profileField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    position: 'relative',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    color: Colors.white,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  logoutButton: {
    padding: 8,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.white,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  profileImageEditing: {
    borderColor: Colors.secondary,
  },
  userPhoto: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.backgroundSecondary,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    alignItems: 'center',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: Colors.white,
    marginBottom: 4,
  },
  userRole: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.white + 'CC',
    textTransform: 'capitalize',
  },
  profileContent: {
    marginTop: -24,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 32,
    flex: 1,
  },
  profileInfo: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  profileField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  fieldValue: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text,
  },
  form: {
    marginTop: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  saveButton: {
    marginTop: 24,
  },
});