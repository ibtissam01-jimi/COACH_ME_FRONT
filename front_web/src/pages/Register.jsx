import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/slices/authSlice'; 
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, message, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    dateNaissance: '',
    genre: 'Homme',
    situation_familliale: 'Célibataire',
    statut: 'Actif',
    password: '',
    confirmPassword: '',
    role: 'coache',
    date_debut: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password === formData.confirmPassword) {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = formData;
      dispatch(register(userData));
    } else {
      alert("Les mots de passe ne correspondent pas");
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/view-profile'); 
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex">
      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md shadow-lg p-6 rounded-2xl bg-white">
          <div className="text-center">
            <img src="/assets/images/logo.png" alt="Logo" className="h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold">Créer un compte</h2>
            <p className="text-muted-foreground text-sm mt-2">S'il vous plaît entrez vos détails</p>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Prénom */}
              <div className="space-y-1">
                <Label htmlFor="prenom">Prénom</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Icon icon="fa:user" />
                  </span>
                  <Input
                    id="prenom"
                    name="prenom"
                    type="text"
                    value={formData.prenom}
                    onChange={handleChange}
                    placeholder="Prénom"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Nom */}
              <div className="space-y-1">
                <Label htmlFor="nom">Nom</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Icon icon="fa:user" />
                  </span>
                  <Input
                    id="nom"
                    name="nom"
                    type="text"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Nom"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Icon icon="mage:email" />
                  </span>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div className="space-y-1">
                <Label htmlFor="telephone">Téléphone</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Icon icon="mdi:phone" />
                  </span>
                  <Input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="Téléphone"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Adresse */}
              <div className="space-y-1">
                <Label htmlFor="adresse">Adresse</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Icon icon="mdi:map-marker" />
                  </span>
                  <Input
                    id="adresse"
                    name="adresse"
                    type="text"
                    value={formData.adresse}
                    onChange={handleChange}
                    placeholder="Adresse"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Date de naissance */}
              <div className="space-y-1">
                <Label htmlFor="dateNaissance">Date de naissance</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Icon icon="mdi:calendar" />
                  </span>
                  <Input
                    id="dateNaissance"
                    name="dateNaissance"
                    type="date"
                    value={formData.dateNaissance}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Genre */}
              <div className="space-y-1">
                <Label htmlFor="genre">Genre</Label>
                <Select
                  value={formData.genre}
                  onValueChange={(value) => handleSelectChange('genre', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Homme">Homme</SelectItem>
                    <SelectItem value="Femme">Femme</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Situation familiale */}
              <div className="space-y-1">
                <Label htmlFor="situation_familliale">Situation familiale</Label>
                <Select
                  value={formData.situation_familliale}
                  onValueChange={(value) => handleSelectChange('situation_familliale', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre situation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Célibataire">Célibataire</SelectItem>
                    <SelectItem value="Marié">Marié</SelectItem>
                    <SelectItem value="Divorcé">Divorcé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Statut */}
              <div className="space-y-1">
                <Label htmlFor="statut">Statut</Label>
                <Select
                  value={formData.statut}
                  onValueChange={(value) => handleSelectChange('statut', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Actif">Actif</SelectItem>
                    <SelectItem value="Inactif">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date de début (for coache role) */}
              <div className="space-y-1">
                <Label htmlFor="date_debut">Date de début</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Icon icon="mdi:calendar-start" />
                  </span>
                  <Input
                    id="date_debut"
                    name="date_debut"
                    type="date"
                    value={formData.date_debut}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Icon icon="solar:lock-password-outline" />
                  </span>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mot de passe"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Icon icon="solar:lock-password-outline" />
                  </span>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmer le mot de passe"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Error message */}
              {isError && (
                <div className="text-sm text-red-500 flex items-center gap-2 bg-red-50 p-2 rounded-md border border-red-200">
                  <Icon icon="mdi:alert-circle" className="text-lg" />
                  {message}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full mt-4 cursor-pointer"
                variant="default"
                disabled={isLoading}
              >
                {isLoading ? 'Création du compte...' : 'Créer un compte'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Left image */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-muted">
        <img src="/assets/images/auth/auth2.jpg" alt="Illustration" className="object-cover max-h-full" />
      </div>
    </div>
  );
};

export default Register;


