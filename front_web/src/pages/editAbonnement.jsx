import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAbonnements, updateAbonnement } from '@/redux/slices/abonnementsSlice';
import { fetchPlans } from '@/redux/slices/planSlice';
import { fetchCoachs } from '@/redux/slices/coachSlice'; // Assure-toi que ce slice existe

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const EditAbonnement = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { abonnements } = useSelector((state) => state.abonnements);
  const { plans } = useSelector((state) => state.plans);
  const { coachs } = useSelector((state) => state.coachs); // coach list from redux

  const abonnement = abonnements.find((a) => a.id === parseInt(id));
  const [formData, setFormData] = useState({
    coache_id: '',
    plan_id: '',
    date_debut: '',
     date_fin: '',
    statut: '',
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchAbonnements());
    dispatch(fetchPlans());
    dispatch(fetchCoachs());
  }, [dispatch]);

  useEffect(() => {
    if (abonnement) {
      setFormData({
        coache_id: abonnement.coache_id?.toString() || '',
        plan_id: abonnement.plan_id?.toString() || '',
        date_debut: abonnement.date_debut || '',
        date_fin: abonnement.date_fin || '',
        statut: abonnement.statut || '',
      });
    }
  }, [abonnement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateAbonnement({ id, data: formData })).unwrap();
      navigate('/abonnements');
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la mise à jour de l’abonnement');
    }
  };

  if (!abonnement) {
    return <p className="text-center mt-10">Chargement de l’abonnement...</p>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 px-6">
      <Card>
        <CardHeader>
          <CardTitle>Modifier l’Abonnement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="coache_id">Coach</Label>
              <Select
                value={formData.coache_id}
                onValueChange={(val) => handleSelectChange('coache_id', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un coach" />
                </SelectTrigger>
                <SelectContent>
                  {coachs.map((coach) => (
                    <SelectItem key={coach.id} value={coach.id.toString()}>
                      {coach.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="plan_id">Plan</Label>
              <Select
                value={formData.plan_id}
                onValueChange={(val) => handleSelectChange('plan_id', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id.toString()}>
                      {plan.titre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date_debut">Date de début</Label>
              <Input
                type="date"
                name="date_debut"
                value={formData.date_debut}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="date_debut">Date de fin</Label>
              <Input
                type="date"
                name="date_fin"
                value={formData.date_fin}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="statut">Statut</Label>
              <Select
                value={formData.statut}
                onValueChange={(val) => handleSelectChange('statut', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="expire">expire</SelectItem>
                  <SelectItem value="annuler">annuler</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <Button type="submit" className="w-full">
              Modifier
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditAbonnement;
