import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPasswordThunk, resetState } from '@/redux/slices/authSlice';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { isSuccess, isError, message, isLoading } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    dispatch(forgotPasswordThunk(email));
  };

  useEffect(() => {
    // Reset messages on unmount or after 5 seconds
    const timer = setTimeout(() => {
      dispatch(resetState());
    }, 5000);

    return () => clearTimeout(timer);
  }, [dispatch, isSuccess, isError]);

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md shadow-lg p-6 rounded-2xl bg-white">
          <div className="text-center">
            <img src="/assets/images/logo.png" alt="Logo" className="h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold">Mot de passe oublié</h2>
            <p className="text-muted-foreground text-sm mt-2">
              Entrez votre email pour réinitialiser le mot de passe
            </p>
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

            {isSuccess && (
              <div className="text-green-600 bg-green-50 p-2 rounded-md border border-green-200 text-sm">
                {message}
              </div>
            )}

            {isError && (
              <div className="text-red-600 bg-red-50 p-2 rounded-md border border-red-200 text-sm">
                {message}
              </div>
            )}

            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? 'Envoi en cours...' : 'Réinitialiser le mot de passe'}
            </Button>

            <div className="text-center mt-4 text-sm">
              <Link to="/login" className="text-primary hover:underline">
                Retour à la connexion
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 items-center justify-center bg-muted">
        <img src="/assets/images/auth/auth-img.png" alt="Illustration" className="object-cover max-h-full" />
      </div>
    </div>
  );
};

export default ForgotPassword;
