import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici tu enverras la requête à ton backend pour envoyer un email de reset
    console.log("Demande de réinitialisation pour :", email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex">
      {/* Form section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md shadow-lg p-6 rounded-2xl bg-white">
          <div className="text-center">
            <img src="/assets/images/logo.png" alt="Logo" className="h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold">Mot de passe oublié</h2>
            <p className="text-muted-foreground text-sm mt-2">Entrez votre email pour réinitialiser le mot de passe</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
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
                  placeholder="Votre adresse email"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {submitted && (
              <div className="text-green-600 bg-green-50 p-2 rounded-md border border-green-200 text-sm">
                Si l’email existe, un lien de réinitialisation vous a été envoyé.
              </div>
            )}

            <Button type="submit" className="w-full mt-4">
              Réinitialiser le mot de passe
            </Button>

            <div className="text-center mt-4 text-sm">
              <Link to="/login" className="text-primary hover:underline">
                Retour à la connexion
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Illustration section */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-muted">
        <img src="/assets/images/auth/auth-img.png" alt="Illustration" className="object-cover max-h-full" />
      </div>
    </div>
  );
};

export default ForgotPassword;
