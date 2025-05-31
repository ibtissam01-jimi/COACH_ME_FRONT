import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAbonnements, updateAbonnement } from '@/redux/slices/abonnementsSlice';
import { fetchPlans } from '@/redux/slices/planSlice';
import { fetchCoachs } from '@/redux/slices/coachSlice';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const EditAbonnement = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { abonnements } = useSelector((state) => state.abonnements);
  const { plans } = useSelector((state) => state.plans);
  const { coachs } = useSelector((state) => state.coachs);

  const abonnement = abonnements.find((a) => a.id === parseInt(id));
  const [formData, setFormData] = useState({
    coache_id: '',
    plan_id: '',
    date_debut: '',
    date_fin: '',
    statut: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const isFormValid =
    formData.coache_id &&
    formData.plan_id &&
    formData.date_debut &&
    formData.date_fin &&
    formData.statut;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isFormValid) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      await dispatch(updateAbonnement({ id, data: formData })).unwrap();
      navigate('/abonnements');
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour de l’abonnement");
    } finally {
      setLoading(false);
    }
  };

  if (!abonnement) {
    return <p className="text-center mt-10">Chargement de l’abonnement...</p>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 px-6">
      <Card>

          <CardTitle>Modifier l’Abonnement</CardTitle>
       
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Coach</Label>
                <Select
                  value={formData.coache_id}
                  onValueChange={(val) => handleSelectChange('coache_id', val)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un coach" />
                  </SelectTrigger>
                  <SelectContent>
                    {coachs.map((coach) => (
                      <SelectItem key={coach.id} value={coach.id.toString()}>
                        {coach.nom} {coach.prenom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Plan</Label>
                <Select
                  value={formData.plan_id}
                  onValueChange={(val) => handleSelectChange('plan_id', val)}
                  disabled={loading}
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
                <Label>Statut</Label>
                <Select
                  value={formData.statut}
                  onValueChange={(val) => handleSelectChange('statut', val)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="expire">Expiré</SelectItem>
                    <SelectItem value="annule">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Date de début</Label>
                <Input
                  type="date"
                  name="date_debut"
                  value={formData.date_debut}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div>
                <Label>Date de fin</Label>
                <Input
                  type="date"
                  name="date_fin"
                  value={formData.date_fin}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={loading || !isFormValid}
            >
              {loading && <Loader2 className="animate-spin w-4 h-4" />}
              {loading ? 'Modification en cours...' : 'Modifier'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditAbonnement;
