import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, updateUser, clearValidationErrors } from '@/redux/slices/userSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statutOptions = [
  { value: 'Actif', label: 'Actif' },
  { value: 'Inactif', label: 'Inactif' },
];

const roleOptions = [
  { value: 'admin', label: 'Administrateur' },
  { value: 'coach', label: 'Coach' },
  { value: 'coache', label: 'Coache' },
];

const genreOptions = [
  { value: 'Homme', label: 'Homme' },
  { value: 'Femme', label: 'Femme' },
];

const situationOptions = [
  { value: 'Célibataire', label: 'Célibataire' },
  { value: 'Marié', label: 'Marié' },
  { value: 'Divorcé', label: 'Divorcé' },
];

const UserForm = ({ userId, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const isEditMode = Boolean(userId);
  const { users, isLoading, error, validationErrors } = useSelector((state) => state.users);

  const [formData, setFormData] = useState({
    id: '',
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    adresse: '',
    dateNaissance: '',
    genre: 'Homme',
    situation_familliale: 'Célibataire',
    statut: 'Actif',
    role: 'coache',
    date_debut: '', // For coache role
    biographie: '', // For coach role
    specialite: '', // For coach role
    dateEmbauche: '', // For admin and coach roles
  });

  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (isEditMode && userId) {
      const userToEdit = users.find(user => user.id === userId);
      if (userToEdit) {
        setFormData({
          id: userToEdit.id,
          nom: userToEdit.nom || '',
          prenom: userToEdit.prenom || '',
          email: userToEdit.email || '',
          password: '',
          telephone: userToEdit.telephone || '',
          adresse: userToEdit.adresse || '',
          dateNaissance: userToEdit.dateNaissance || '',
          genre: userToEdit.genre || 'Homme',
          situation_familliale: userToEdit.situation_familliale || 'Célibataire',
          statut: userToEdit.statut || 'Actif',
          role: userToEdit.role || 'coache',
          date_debut: userToEdit.date_debut || '',
          biographie: userToEdit.biographie || '',
          specialite: userToEdit.specialite || '',
          dateEmbauche: userToEdit.dateEmbauche || '',
        });

        // Set the photo URL if it exists
        if (userToEdit.photo) {
          const photoUrl = `${import.meta.env.VITE_API_URL}storage/profile_picture/${userToEdit.photo}`;
          setPreviewUrl(photoUrl);
        }
      }
    }
  }, [isEditMode, userId, users]);

  useEffect(() => {
    // Clear validation errors when component unmounts
    return () => {
      dispatch(clearValidationErrors());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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

      let result;
      if (isEditMode) {
        result = await dispatch(updateUser({ 
          id: userId, 
          formData: formDataToSend 
        })).unwrap();
      } else {
        result = await dispatch(createUser(formDataToSend)).unwrap();
      }

      if (result?.success) {
        toast({
          title: "Succès",
          description: result.message || (isEditMode ? "Utilisateur mis à jour avec succès" : "Utilisateur créé avec succès"),
          variant: "success",
        });
        onSuccess?.();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Handle validation errors
      if (error.error) {
        const errorMessages = Object.entries(error.error)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n');
        
        toast({
          title: "Erreur de validation",
          description: errorMessages,
          variant: "destructive",
        });
      } else {
        // Handle general errors
        toast({
          title: "Erreur",
          description: error.message || 'Une erreur est survenue lors de la mise à jour',
          variant: "destructive",
        });
      }
    }
  };

  const getFieldError = (fieldName) => {
    if (!validationErrors) return null;
    
    // Handle different error structures
    if (validationErrors.error) {
      return validationErrors.error[fieldName]?.[0];
    }
    if (validationErrors[fieldName]) {
      return validationErrors[fieldName][0];
    }
    return null;
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Photo Upload */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-slate-200 shadow-lg cursor-pointer" onClick={() => document.getElementById('photo-upload').click()}>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
              <Camera className="w-12 h-12 text-slate-400" />
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
        <p className="text-sm text-slate-500">Cliquez pour changer la photo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prénom */}
        <div>
          <Label htmlFor="prenom">Prénom</Label>
          <Input
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
            className={`mt-1 ${getFieldError('prenom') ? 'border-red-500' : ''}`}
          />
          {getFieldError('prenom') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('prenom')}</p>
          )}
        </div>

        {/* Nom */}
        <div>
          <Label htmlFor="nom">Nom</Label>
          <Input
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
            className={`mt-1 ${getFieldError('nom') ? 'border-red-500' : ''}`}
          />
          {getFieldError('nom') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('nom')}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`mt-1 ${getFieldError('email') ? 'border-red-500' : ''}`}
          />
          {getFieldError('email') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('email')}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required={!isEditMode}
            className={`mt-1 ${getFieldError('password') ? 'border-red-500' : ''}`}
          />
          {getFieldError('password') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('password')}</p>
          )}
        </div>

        {/* Téléphone */}
        <div>
          <Label htmlFor="telephone">Téléphone</Label>
          <Input
            id="telephone"
            name="telephone"
            type="tel"
            value={formData.telephone}
            onChange={handleChange}
            required
            className={`mt-1 ${getFieldError('telephone') ? 'border-red-500' : ''}`}
          />
          {getFieldError('telephone') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('telephone')}</p>
          )}
        </div>

        {/* Adresse */}
        <div>
          <Label htmlFor="adresse">Adresse</Label>
          <Input
            id="adresse"
            name="adresse"
            type="text"
            value={formData.adresse}
            onChange={handleChange}
            required
            className={`mt-1 ${getFieldError('adresse') ? 'border-red-500' : ''}`}
          />
          {getFieldError('adresse') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('adresse')}</p>
          )}
        </div>

        {/* Date de naissance */}
        <div>
          <Label htmlFor="dateNaissance">Date de naissance</Label>
          <Input
            id="dateNaissance"
            name="dateNaissance"
            type="date"
            value={formData.dateNaissance}
            onChange={handleChange}
            required
            className={`mt-1 ${getFieldError('dateNaissance') ? 'border-red-500' : ''}`}
          />
          {getFieldError('dateNaissance') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('dateNaissance')}</p>
          )}
        </div>

        {/* Genre */}
        <div>
          <Label htmlFor="genre">Genre</Label>
          <Select
            value={formData.genre}
            onValueChange={(value) => handleSelectChange('genre', value)}
          >
            <SelectTrigger className={`w-full mt-1 ${getFieldError('genre') ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Sélectionnez le genre" />
            </SelectTrigger>
            <SelectContent className="z-[100] bg-white shadow-lg rounded-md border border-slate-200">
              {genreOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getFieldError('genre') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('genre')}</p>
          )}
        </div>

        {/* Situation familiale */}
        <div>
          <Label htmlFor="situation_familliale">Situation familiale</Label>
          <Select
            value={formData.situation_familliale}
            onValueChange={(value) => handleSelectChange('situation_familliale', value)}
          >
            <SelectTrigger className={`w-full mt-1 ${getFieldError('situation_familliale') ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Sélectionnez la situation" />
            </SelectTrigger>
            <SelectContent>
              {situationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getFieldError('situation_familliale') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('situation_familliale')}</p>
          )}
        </div>

        {/* Statut */}
        <div>
          <Label htmlFor="statut">Statut</Label>
          <Select
            value={formData.statut}
            onValueChange={(value) => handleSelectChange('statut', value)}
          >
            <SelectTrigger className={`w-full mt-1 ${getFieldError('statut') ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Sélectionnez le statut" />
            </SelectTrigger>
            <SelectContent>
              {statutOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getFieldError('statut') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('statut')}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <Label htmlFor="role">Rôle</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => handleSelectChange('role', value)}
          >
            <SelectTrigger className={`w-full mt-1 ${getFieldError('role') ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Sélectionnez le rôle" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getFieldError('role') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('role')}</p>
          )}
        </div>

        {/* Date de début (for coache role) */}
        {formData.role === 'coache' && (
          <div>
            <Label htmlFor="date_debut">Date de début</Label>
            <Input
              id="date_debut"
              name="date_debut"
              type="date"
              value={formData.date_debut}
              onChange={handleChange}
              required
              className={`mt-1 ${getFieldError('date_debut') ? 'border-red-500' : ''}`}
            />
            {getFieldError('date_debut') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('date_debut')}</p>
            )}
          </div>
        )}

        {/* Date d'embauche (for admin and coach roles) */}
        {(formData.role === 'admin' || formData.role === 'coach') && (
          <div>
            <Label htmlFor="dateEmbauche">Date d'embauche</Label>
            <Input
              id="dateEmbauche"
              name="dateEmbauche"
              type="date"
              value={formData.dateEmbauche}
              onChange={handleChange}
              required
              className={`mt-1 ${getFieldError('dateEmbauche') ? 'border-red-500' : ''}`}
            />
            {getFieldError('dateEmbauche') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('dateEmbauche')}</p>
            )}
          </div>
        )}

        {/* Coach specific fields */}
        {formData.role === 'coach' && (
          <>
            <div className="md:col-span-2">
              <Label htmlFor="biographie">Biographie</Label>
              <Textarea
                id="biographie"
                name="biographie"
                value={formData.biographie}
                onChange={handleChange}
                required
                className={`mt-1 ${getFieldError('biographie') ? 'border-red-500' : ''}`}
                rows={4}
              />
              {getFieldError('biographie') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('biographie')}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="specialite">Spécialité</Label>
              <Textarea
                id="specialite"
                name="specialite"
                value={formData.specialite}
                onChange={handleChange}
                required
                className={`mt-1 ${getFieldError('specialite') ? 'border-red-500' : ''}`}
                rows={2}
              />
              {getFieldError('specialite') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('specialite')}</p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : isEditMode ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm; 