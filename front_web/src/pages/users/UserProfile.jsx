import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from '@/redux/slices/authSlice';
import { updateUser } from '@/redux/slices/userSlice';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Camera } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const genreOptions = [
  { value: 'Homme', label: 'Homme' },
  { value: 'Femme', label: 'Femme' },
];

const situationOptions = [
  { value: 'Célibataire', label: 'Célibataire' },
  { value: 'Marié', label: 'Marié' },
  { value: 'Divorcé', label: 'Divorcé' },
];

const statutOptions = [
  { value: 'Actif', label: 'Actif' },
  { value: 'Inactif', label: 'Inactif' },
];

const roleOptions = [
  { value: 'admin', label: 'Administrateur' },
  { value: 'coach', label: 'Coach' },
  { value: 'coache', label: 'Coache' },
];

export default function UserProfile() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    dateNaissance: '',
    genre: 'Homme',
    situation_familliale: 'Célibataire',
    biographie: '',
    role: '',
    statut: 'Actif',
    date_debut: '', // For coache
    dateEmbauche: '', // For admin and coach
    specialite: '', // For coach
  });
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      // Format dates for input fields
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      // Get role-specific data
      const roleData = {
        admin: user.administrateurs?.[0],
        coach: user.coaches?.[0],
        coache: user.coachees?.[0]
      };
      console.log("roleData", roleData);

      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || '',
        adresse: user.adresse || '',
        dateNaissance: formatDate(user.dateNaissance) || '',
        genre: user.genre || 'Homme',
        situation_familliale: user.situation_familliale || 'Célibataire',
        biographie: roleData.coach?.biographie || '',
        role: user.role || '',
        statut: user.statut || 'Actif',
        date_debut: formatDate(roleData.coache?.date_debut) || '',
        dateEmbauche: formatDate(roleData.admin?.dateEmbauche || roleData.coach?.dateEmbauche) || '',
        specialite: roleData.coach?.specialite || '',
      });

      // Set the photo URL if it exists
      if (user.photo) {
        const photoUrl = `${import.meta.env.VITE_API_URL}storage/profile_picture/${user.photo}`;
        setPreviewUrl(photoUrl);
      } else {
        setPreviewUrl(null);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Erreur",
          description: "Le fichier doit être une image (jpeg, png, jpg, gif)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "L'image ne doit pas dépasser 2MB",
          variant: "destructive",
        });
        return;
      }

      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create FormData object
      const formDataToSend = new FormData();

      // Add all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formDataToSend.append(key, value);
        }
      });

      // Add photo if it exists
      if (photo) {
        formDataToSend.append('photo', photo);
      }

      // Log the FormData contents for debugging
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }

      // Dispatch the updateUser action
      const resultAction = await dispatch(updateUser({
        id: user.id,
        formData: formDataToSend
      }));

      if (updateUser.fulfilled.match(resultAction)) {
        toast({
          title: "Succès",
          description: "Profil mis à jour avec succès",
          variant: "success",
        });
        // Refresh user data after successful update
        dispatch(fetchMe());
      } else {
        const errorMessage = resultAction.payload?.message || 'Erreur lors de la mise à jour du profil';
        const validationErrors = resultAction.payload?.error;
        
        if (validationErrors) {
          // Handle validation errors
          Object.entries(validationErrors).forEach(([field, message]) => {
            console.error(`${field}: ${message}`);
          });
          toast({
            title: "Erreur de validation",
            description: "Veuillez corriger les erreurs de validation",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erreur",
            description: errorMessage,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: error.message || 'Erreur lors de la mise à jour du profil',
        variant: "destructive",
      });
    }
  };

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'admin':
        return (
          <div className="space-y-2">
            <Label htmlFor="dateEmbauche">Date d'embauche</Label>
            <Input
              id="dateEmbauche"
              name="dateEmbauche"
              type="date"
              value={formData.dateEmbauche}
              onChange={handleChange}
            />
          </div>
        );
      case 'coach':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="dateEmbauche">Date d'embauche</Label>
              <Input
                id="dateEmbauche"
                name="dateEmbauche"
                type="date"
                value={formData.dateEmbauche}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialite">Spécialité</Label>
              <Input
                id="specialite"
                name="specialite"
                value={formData.specialite}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="biographie">Biographie</Label>
              <Textarea
                id="biographie"
                name="biographie"
                value={formData.biographie}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </>
        );
      case 'coache':
        return (
          <div className="space-y-2">
            <Label htmlFor="date_debut">Date de début</Label>
            <Input
              id="date_debut"
              name="date_debut"
              type="date"
              value={formData.date_debut}
              onChange={handleChange}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full ml-32 bg-slate-50">
        <Sidebar />
        <main className="flex-1 w-full px-8 py-10">
          <div>Chargement...</div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen w-full ml-32 bg-slate-50">
        <Sidebar />
        <main className="flex-1 w-full px-8 py-10">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen w-full ml-32 bg-slate-50">
        <Sidebar />
        <main className="flex-1 w-full px-8 py-10">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>Aucune information utilisateur disponible.</AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full ml-32 bg-slate-50">
      <Sidebar />
      <main className="flex-1 w-full px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Mon Profil</h1>
            <p className="text-slate-500 mt-2">Gérez vos informations personnelles et professionnelles</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Photo and Basic Info */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer" onClick={() => document.getElementById('photo-upload').click()}>
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/20 flex items-center justify-center">
                          <Camera className="w-12 h-12 text-white" />
                        </div>
                      )}
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </div>
                    <div className="text-center">
                      <h2 className="text-xl font-semibold text-white">{formData.prenom} {formData.nom}</h2>
                      <p className="text-blue-100 mt-1">{formData.role === 'admin' ? 'Administrateur' : 
                        formData.role === 'coach' ? 'Coach' : 'Coache'}</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-500">Email</Label>
                      <Input
                        value={formData.email}
                        onChange={handleChange}
                        name="email"
                        className="text-slate-800 mt-1 bg-white"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-500">Téléphone</Label>
                      <Input
                        value={formData.telephone}
                        onChange={handleChange}
                        name="telephone"
                        className="text-slate-800 mt-1 bg-white"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-500">Statut</Label>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          formData.statut === 'Actif' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {formData.statut}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="text-xl font-semibold text-slate-800">Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="nom" className="text-sm font-medium">Nom</Label>
                        <Input
                          id="nom"
                          name="nom"
                          value={formData.nom}
                          onChange={handleChange}
                          className="bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prenom" className="text-sm font-medium">Prénom</Label>
                        <Input
                          id="prenom"
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleChange}
                          className="bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateNaissance" className="text-sm font-medium">Date de naissance</Label>
                        <Input
                          id="dateNaissance"
                          name="dateNaissance"
                          type="date"
                          value={formData.dateNaissance}
                          onChange={handleChange}
                          className="bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="genre" className="text-sm font-medium">Genre</Label>
                        <Select
                          value={formData.genre}
                          onValueChange={(value) => handleSelectChange('genre', value)}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Sélectionner un genre" />
                          </SelectTrigger>
                          <SelectContent className="z-[100] bg-white shadow-lg rounded-md border border-slate-200">
                            {genreOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="situation_familliale" className="text-sm font-medium">Situation familiale</Label>
                        <Select
                          value={formData.situation_familliale}
                          onValueChange={(value) => handleSelectChange('situation_familliale', value)}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Sélectionner une situation" />
                          </SelectTrigger>
                          <SelectContent className="z-[100] bg-white shadow-lg rounded-md border border-slate-200">
                            {situationOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
      
{/* Role Field */}
<div className="space-y-2">
  <Label htmlFor="role" className="text-sm font-medium">Rôle</Label>
  {isAdmin ? (
    <Select
      value={formData.role}
      onValueChange={(value) => handleSelectChange('role', value)}
    >
      <SelectTrigger className="bg-white">
        <SelectValue placeholder="Sélectionner un rôle" />
      </SelectTrigger>
      <SelectContent className="z-[100] bg-white shadow-lg rounded-md border border-slate-200">
        {roleOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ) : (
    <div className="p-2 bg-gray-50 rounded border border-gray-200">
      {roleOptions.find(option => option.value === formData.role)?.label || formData.role}
    </div>
  )}
</div>

                      </div>
                  

                    <div className="space-y-2">
                      <Label htmlFor="adresse" className="text-sm font-medium">Adresse</Label>
                      <Input
                        id="adresse"
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleChange}
                        className="bg-white"
                      />
                    </div>

                    {/* Role-specific fields */}
                    <div className="border-t border-slate-200 pt-6">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">
                        {formData.role === 'admin' ? 'Informations administratives' :
                         formData.role === 'coach' ? 'Informations professionnelles' :
                         'Informations de coaching'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderRoleSpecificFields()}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
                      <Button 
                        type="submit" 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                      >
                        Enregistrer les modifications
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 