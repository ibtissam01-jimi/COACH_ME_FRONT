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
  SelectValue
} from '@/components/ui/select';

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
    ressource_id: ''
  });

  useEffect(() => {
    dispatch(fetchRessources());
    dispatch(fetchAbonnements());
  }, [dispatch]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(addPaiement(formData));
    navigate('/paiements');
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6">Ajouter un Paiement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Montant */}
        <div>
          <label className="block font-medium">Montant</label>
          <Input
            type="number"
            value={formData.montant}
            onChange={(e) => handleChange('montant', e.target.value)}
            required
          />
        </div>

        {/* Date de paiement */}
        <div>
          <label className="block font-medium">Date de paiement</label>
          <Input
            type="date"
            value={formData.date_paiement}
            onChange={(e) => handleChange('date_paiement', e.target.value)}
            required
          />
        </div>

        {/* Méthode */}
        <div>
          <label className="block font-medium">Méthode</label>
          <Select onValueChange={(value) => handleChange('methode', value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Méthode de paiement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cache">Cash</SelectItem>
              <SelectItem value="virement">Virement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Statut */}
        <div>
          <label className="block font-medium">Statut</label>
          <Select onValueChange={(value) => handleChange('statut', value)} required>
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

        

        {/* Ressource */}
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

        {/* Abonnement */}
        <div>
          <label className="block font-medium">Abonnement (optionnel)</label>
          <Select onValueChange={(value) => handleChange('abonnement_id', value)}>
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
          Ajouter Paiement
        </Button>
      </form>
    </div>
  );
};

export default AddPaiement;
