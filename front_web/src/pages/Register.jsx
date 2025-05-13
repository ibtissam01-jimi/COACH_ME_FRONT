

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/slices/authSlice'; 
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, message, user } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  



  const handleSubmit = (e) => {
  e.preventDefault();

  // Vérification que les mots de passe correspondent
  if (password === confirmPassword) {
    // Envoi de 'nom' au lieu de 'name'
    dispatch(register({
      nom: name, // Changement ici
      email, 
      password, 
      password_confirmation: confirmPassword
    }));
  } else {
    alert("Les mots de passe ne correspondent pas");
  }
};


  useEffect(() => {
    if (user) {
      navigate('/view-profile'); // Redirection après l'inscription réussie
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex">
      {/* Formulaire côté droit */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md shadow-lg p-6 rounded-2xl bg-white">
          <div className="text-center">
            <img src="/assets/images/logo.png" alt="Logo" className="h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold">Créer un compte</h2>
            <p className="text-muted-foreground text-sm mt-2">S'il vous plaît entrez vos détails</p>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom */}
              <div className="space-y-1">
                <Label htmlFor="name">Nom</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Icon icon="fa:user" />
                  </span>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="space-y-1">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Icon icon="solar:lock-password-outline" />
                  </span>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Confirmer le mot de passe */}
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Icon icon="solar:lock-password-outline" />
                  </span>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmer le mot de passe"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Se souvenir de moi */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember">Se souvenir de moi</Label>
                </div>
              </div>

              {/* Message d'erreur */}
              {isError && (
                <div className="text-sm text-red-500 flex items-center gap-2 bg-red-50 p-2 rounded-md border border-red-200">
                  <Icon icon="mdi:alert-circle" className="text-lg" />
                  {message}
                </div>
              )}

              {/* Bouton de soumission */}
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

      {/* Image côté gauche */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-muted">
        <img src="/assets/images/auth/auth2.jpg" alt="Illustration" className="object-cover max-h-full" />
      </div>
    </div>
  );
};

export default Register;
