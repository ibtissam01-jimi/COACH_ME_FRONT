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
  SelectValue
} from '@/components/ui/select';

const EditPaiement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { ressources } = useSelector((state) => state.ressources);
  const { abonnements } = useSelector((state) => state.abonnements);
  const { items, loading, error } = useSelector((state) => state.paiement);

  const [formData, setFormData] = useState({
    montant: '',
    date_paiement: '',
    methode: '',
    statut: '',
    abonnement_id: '',
    ressource_id: ''
  });

  useEffect(() => {
    dispatch(fetchRessources());
    dispatch(fetchAbonnements());

    dispatch(fetchPaiementById(id))
      .unwrap()
      .then((paiement) => {
        setFormData({
          montant: paiement.montant || '',
          date_paiement: paiement.date_paiement ? paiement.date_paiement.split('T')[0] : '',
          methode: paiement.methode || '',
          statut: paiement.statut || '',
          abonnement_id: paiement.abonnement_id ? paiement.abonnement_id.toString() : '',
          ressource_id: paiement.ressource_id ? paiement.ressource_id.toString() : ''
        });
      })
      .catch(() => {
        // gérer erreur si besoin
      });
  }, [dispatch, id]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ici on envoie tous les champs modifiables (au moins statut, methode, ressource, abonnement)
    try {
      await dispatch(updatePaiement({ id, ...formData })).unwrap();
      navigate('/paiements');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6">Modifier Paiement #{id}</h2>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-600 mb-4">{error.message || error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Montant</label>
            <Input
              type="number"
              value={formData.montant}
              onChange={(e) => handleChange('montant', e.target.value)}
              required
            />
        </div>


        <div>
          <label className="block font-medium">Date de paiement</label>
          <Input
            type="date"
            value={formData.date_paiement}
            onChange={(e) => handleChange('date_paiement', e.target.value)}
            required
          />
        </div>

        {/* Méthode modifiable */}
        <div>
          <label className="block font-medium mb-1">Méthode</label>
          <Select
            value={formData.methode}
            onValueChange={(value) => handleChange('methode', value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Méthode de paiement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cache">Cash</SelectItem>
              <SelectItem value="virement">Virement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Statut modifiable */}
        <div>
          <label className="block font-medium mb-1">Statut</label>
          <Select
            value={formData.statut}
            onValueChange={(value) => handleChange('statut', value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="payé">Payé</SelectItem>
              <SelectItem value="en attente">En attente</SelectItem>
              <SelectItem value="annulé">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ressource modifiable */}
        <div>
                  <label className="block font-medium">Ressource</label>
                  <Select onValueChange={(value) => handleChange('ressource_id', value)} required>
                    <SelectTrigger>
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

        {/* Abonnement modifiable */}
        <div>
          <label className="block font-medium mb-1">Abonnement (optionnel)</label>
          <Select
            value={formData.abonnement_id}
            onValueChange={(value) => handleChange('abonnement_id', value)}
          >
            <SelectTrigger>
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

        <Button type="submit" className="w-full">
          Mettre à jour le paiement
        </Button>
      </form>
    </div>
  );
};

export default EditPaiement;
