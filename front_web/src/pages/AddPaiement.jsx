import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPaiement } from '@/redux/slices/paiementsSlice';
import { fetchRessources } from '@/redux/slices/ressourceSlice';
import { fetchAbonnements } from '@/redux/slices/abonnementsSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const AddPaiement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { ressources } = useSelector((state) => state.ressources);
  const { abonnements } = useSelector((state) => state.abonnements);

  const [formData, setFormData] = useState({
    montant: '',
    date_paiement: '',
    methode: '',
    statut: '',
    abonnement_id: '',
    ressource_id: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    dispatch(fetchRessources());
    dispatch(fetchAbonnements());
  }, [dispatch]);

  const handleChange = (field, value) => {
    setError('');
    if (field === 'ressource_id') {
      setFormData((prev) => ({
        ...prev,
        ressource_id: value,
        abonnement_id: '',
      }));
    } else if (field === 'abonnement_id') {
      setFormData((prev) => ({
        ...prev,
        abonnement_id: value,
        ressource_id: '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const isFormValid =
    formData.montant &&
    formData.date_paiement &&
    formData.methode &&
    formData.statut &&
    (formData.abonnement_id || formData.ressource_id);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setError('Veuillez remplir tous les champs requis.');
      return;
    }

    setLoading(true);
    try {
      await dispatch(addPaiement(formData)).unwrap();
      navigate('/paiements');
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de l’ajout du paiement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 px-6">
      <Card>
        
          <CardTitle>Ajouter un Paiement</CardTitle>
       
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Montant</Label>
                <Input
                  type="number"
                  value={formData.montant}
                  onChange={(e) => handleChange('montant', e.target.value)}
                  disabled={loading}
                  className="focus-visible:ring-blue-500"
                />
              </div>

              <div>
                <Label>Date de paiement</Label>
                <Input
                  type="date"
                  value={formData.date_paiement}
                  onChange={(e) => handleChange('date_paiement', e.target.value)}
                  disabled={loading}
                  className="focus-visible:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Méthode</Label>
                <Select
                  value={formData.methode}
                  onValueChange={(val) => handleChange('methode', val)}
                  disabled={loading}
                >
                  <SelectTrigger className="focus-visible:ring-blue-500">
                    <SelectValue placeholder="Sélectionner une méthode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cache">Cash</SelectItem>
                    <SelectItem value="virement">Virement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Statut</Label>
                <Select
                  value={formData.statut}
                  onValueChange={(val) => handleChange('statut', val)}
                  disabled={loading}
                >
                  <SelectTrigger className="focus-visible:ring-blue-500">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payé">Payé</SelectItem>
                    <SelectItem value="en attente">En attente</SelectItem>
                    <SelectItem value="annulé">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Ressource</Label>
                <Select
                  value={formData.ressource_id}
                  onValueChange={(val) => handleChange('ressource_id', val)}
                  disabled={formData.abonnement_id !== '' || loading}
                >
                  <SelectTrigger className="focus-visible:ring-blue-500">
                    <SelectValue placeholder="Sélectionner une ressource" />
                  </SelectTrigger>
                  <SelectContent>
                    {ressources.map((res) => (
                      <SelectItem key={res.id} value={res.id.toString()}>
                        {res.titre || `Ressource ${res.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Abonnement</Label>
                <Select
                  value={formData.abonnement_id}
                  onValueChange={(val) => handleChange('abonnement_id', val)}
                  disabled={formData.ressource_id !== '' || loading}
                >
                  <SelectTrigger className="focus-visible:ring-blue-500">
                    <SelectValue placeholder="Sélectionner un abonnement" />
                  </SelectTrigger>
                  <SelectContent>
                    {abonnements.map((ab) => (
                      <SelectItem key={ab.id} value={ab.id.toString()}>
                        {ab.nom || `Abonnement ${ab.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin w-4 h-4" />}
              {loading ? 'Ajout en cours...' : 'Ajouter Paiement'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPaiement;
