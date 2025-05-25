
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlans } from '@/redux/slices/planSlice';
import { fetchCoachs } from '@/redux/slices/coachSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

const AddAbonnement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { plans } = useSelector((state) => state.plans);
  const { coachs } = useSelector((state) => state.coachs);

  const [formData, setFormData] = useState({
    plan_id: '',
    coach_id: '',
    statut: '',
    date_debut: '',
    date_fin: '',
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchPlans());
    dispatch(fetchCoachs());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name) => (value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        // Retirer l'ID utilisateur car la vérification d'authentification est supprimée
      };

      console.log('Submitting abonnement:', payload);
      // dispatch(createAbonnement(payload)).unwrap();
      navigate('/abonnements');
      dispatch(fetchAbonnements()); // Rafraîchit la liste des abonnements
    } catch (err) {
      setError("Erreur lors de l’ajout de l’abonnement");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 px-6">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un Abonnement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Plan</Label>
                <Select onValueChange={handleSelectChange('plan_id')} value={formData.plan_id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={String(plan.id)}>
                        {plan.titre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Coach</Label>
                <Select onValueChange={handleSelectChange('coach_id')} value={formData.coach_id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un coach" />
                  </SelectTrigger>
                  <SelectContent>
                    {coachs.map((coach) => (
                      <SelectItem key={coach.id} value={String(coach.id)}>
                        {`${coach.prenom} ${coach.nom}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Statut</Label>
                <Select onValueChange={handleSelectChange('statut')} value={formData.statut}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="expiré">Expiré</SelectItem>
                    <SelectItem value="annulé">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Date Début</Label>
                <Input type="date" name="date_debut" value={formData.date_debut} onChange={handleChange} required />
              </div>

              <div>
                <Label>Date Fin</Label>
                <Input type="date" name="date_fin" value={formData.date_fin} onChange={handleChange} required />
              </div>
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <Button type="submit" className="w-full">Ajouter Abonnement</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddAbonnement;
