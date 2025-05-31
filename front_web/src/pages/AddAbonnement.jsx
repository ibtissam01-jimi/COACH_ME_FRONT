import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlans } from '@/redux/slices/planSlice';
import { fetchCoachs } from '@/redux/slices/coachSlice';
import { fetchAbonnements, createAbonnement } from '@/redux/slices/abonnementsSlice';
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
import { Loader2 } from 'lucide-react';

const AddAbonnement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { plans } = useSelector(state => state.plans);
  const { coachs } = useSelector(state => state.coachs);
  const { error } = useSelector(state => state.abonnements);

  const [formData, setFormData] = useState({
    plan_id: '',
    coache_id: '',
    statut: '',
    date_debut: '',
    date_fin: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchPlans());
    dispatch(fetchCoachs());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' })); // Clear error
  };

  const handleSelectChange = (name) => (value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' })); // Clear error
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.plan_id) errors.plan_id = 'Le plan est requis.';
    if (!formData.coache_id) errors.coache_id = 'Le coach est requis.';
    if (!formData.statut) errors.statut = 'Le statut est requis.';
    if (!formData.date_debut) errors.date_debut = 'La date de début est requise.';
    if (!formData.date_fin) errors.date_fin = 'La date de fin est requise.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await dispatch(createAbonnement(formData)).unwrap();
      dispatch(fetchAbonnements());
      navigate('/abonnements');
    } catch (err) {
      setFormErrors({ global: "Erreur lors de la création de l'abonnement" });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    'border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full';

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 px-6">
      <Card>

          <CardTitle className="text-xl text-center">Ajouter un Abonnement</CardTitle>
       
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Plan</Label>
                <Select
                  onValueChange={handleSelectChange('plan_id')}
                  value={formData.plan_id}
                  disabled={loading}
                >
                  <SelectTrigger className={inputStyle}>
                    <SelectValue placeholder="Choisir un plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map(plan => (
                      <SelectItem key={plan.id} value={String(plan.id)}>{plan.titre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.plan_id && <p className="text-red-600 text-sm mt-1">{formErrors.plan_id}</p>}
              </div>

              <div>
                <Label>Coach</Label>
                <Select
                  onValueChange={handleSelectChange('coache_id')}
                  value={formData.coache_id}
                  disabled={loading}
                >
                  <SelectTrigger className={inputStyle}>
                    <SelectValue placeholder="Choisir un coach" />
                  </SelectTrigger>
                  <SelectContent>
                    {coachs.map(coach => (
                      <SelectItem key={coach.id} value={String(coach.id)}>
                        {coach.prenom} {coach.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.coache_id && <p className="text-red-600 text-sm mt-1">{formErrors.coache_id}</p>}
              </div>

              <div>
                <Label>Statut</Label>
                <Select
                  onValueChange={handleSelectChange('statut')}
                  value={formData.statut}
                  disabled={loading}
                >
                  <SelectTrigger className={inputStyle}>
                    <SelectValue placeholder="Choisir un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="expire">Expiré</SelectItem>
                    <SelectItem value="annule">Annulé</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.statut && <p className="text-red-600 text-sm mt-1">{formErrors.statut}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Date Début</Label>
                <Input
                  type="date"
                  name="date_debut"
                  value={formData.date_debut}
                  onChange={handleChange}
                  disabled={loading}
                  className={inputStyle}
                />
                {formErrors.date_debut && <p className="text-red-600 text-sm mt-1">{formErrors.date_debut}</p>}
              </div>

              <div>
                <Label>Date Fin</Label>
                <Input
                  type="date"
                  name="date_fin"
                  value={formData.date_fin}
                  onChange={handleChange}
                  disabled={loading}
                  className={inputStyle}
                />
                {formErrors.date_fin && <p className="text-red-600 text-sm mt-1">{formErrors.date_fin}</p>}
              </div>
            </div>

            {formErrors.global && <p className="text-red-600 text-center">{formErrors.global}</p>}
            {error && <p className="text-red-600 text-center">{error}</p>}

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin w-4 h-4" />}
              {loading ? 'Ajout en cours...' : 'Ajouter Abonnement'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddAbonnement;

