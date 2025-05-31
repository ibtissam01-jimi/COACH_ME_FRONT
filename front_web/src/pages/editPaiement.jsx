import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPaiementById, updatePaiement } from '@/redux/slices/paiementsSlice';
import { fetchRessources } from '@/redux/slices/ressourceSlice';
import { fetchAbonnements } from '@/redux/slices/abonnementsSlice';
import { useNavigate, useParams } from 'react-router-dom';
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

const EditPaiement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { ressources } = useSelector((state) => state.ressources);
  const { abonnements } = useSelector((state) => state.abonnements);
  const { loading, error } = useSelector((state) => state.paiement);

  const [formData, setFormData] = useState({
    montant: '',
    date_paiement: '',
    methode: '',
    statut: '',
    abonnement_id: '',
    ressource_id: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    dispatch(fetchRessources());
    dispatch(fetchAbonnements());

    dispatch(fetchPaiementById(id))
      .unwrap()
      .then((response) => {
        const paiement = response.data || response;
        if (!paiement) throw new Error('Paiement non trouvé');

        setFormData({
          montant: paiement.montant || '',
          date_paiement: paiement.date_paiement?.split('T')[0] || '',
          methode: paiement.methode || '',
          statut: paiement.statut || '',
          abonnement_id: paiement.abonnement_id?.toString() || '',
          ressource_id: paiement.ressource_id?.toString() || '',
        });
      })
      .catch((err) => {
        console.error('Erreur lors du fetch du paiement:', err);
        setSubmitError("Impossible de charger le paiement.");
      });
  }, [dispatch, id]);

  const handleChange = (field, value) => {
    setSubmitError('');
    if (field === 'ressource_id') {
      setFormData({ ...formData, ressource_id: value, abonnement_id: '' });
    } else if (field === 'abonnement_id') {
      setFormData({ ...formData, abonnement_id: value, ressource_id: '' });
    } else {
      setFormData({ ...formData, [field]: value });
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
      setSubmitError('Veuillez remplir tous les champs requis.');
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(updatePaiement({ id, ...formData })).unwrap();
      navigate('/paiements');
    } catch (err) {
      console.error(err);
      setSubmitError("Une erreur est survenue lors de la mise à jour.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 px-6">
      <Card>
        
          <CardTitle>Modifier Paiement</CardTitle>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Montant</Label>
                <Input
                  type="number"
                  value={formData.montant}
                  onChange={(e) => handleChange('montant', e.target.value)}
                  disabled={isSubmitting}
                  className="focus-visible:ring-blue-500"
                />
              </div>

              <div>
                <Label>Date de paiement</Label>
                <Input
                  type="date"
                  value={formData.date_paiement}
                  onChange={(e) => handleChange('date_paiement', e.target.value)}
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={formData.abonnement_id !== '' || isSubmitting}
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
                  disabled={formData.ressource_id !== '' || isSubmitting}
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

            {submitError && <p className="text-red-600 text-sm">{submitError}</p>}
            {error && <p className="text-red-600 text-sm">{error.message || error.toString()}</p>}

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="animate-spin w-4 h-4" />}
              {isSubmitting ? 'Mise à jour...' : 'Mettre à jour le paiement'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPaiement;
