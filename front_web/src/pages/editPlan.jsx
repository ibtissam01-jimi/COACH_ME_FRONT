import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPlanById, updatePlan } from '@/redux/slices/planSlice';
import { fetchCategories } from '@/redux/slices/categorieSlice';
import { fetchRessources } from '@/redux/slices/ressourceSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const EditPlan = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const plan = useSelector((state) =>
    state.plans.plans.find((p) => p.id === parseInt(id))
  );
  const { items: categories } = useSelector((state) => state.categories);
  const { ressources } = useSelector((state) => state.ressources);

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prix: '',
    duree: '',
    categorie_id: '',
    ressources_ids: [],
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchRessources());
  }, [dispatch]);

  useEffect(() => {
    if (!plan) {
      dispatch(fetchPlanById(id));
    } else {
      setFormData({
        titre: plan.titre || '',
        description: plan.description || '',
        prix: plan.prix !== undefined ? plan.prix.toString() : '',
        duree: plan.duree !== undefined ? plan.duree.toString() : '',
        categorie_id: plan.categorie_id ? String(plan.categorie_id) : '',
        ressources_ids: plan.ressources
          ? plan.ressources.map((r) => String(r.id))
          : [],
      });
    }
  }, [dispatch, id, plan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      categorie_id: value,
    }));
    setFieldErrors((prev) => ({ ...prev, categorie_id: '' }));
  };

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      ressources_ids: isChecked
        ? [...prev.ressources_ids, value]
        : prev.ressources_ids.filter((id) => id !== value),
    }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.titre.trim()) errors.titre = 'Le titre est requis.';
    if (!formData.description.trim()) errors.description = 'La description est requise.';
    if (!formData.prix || isNaN(formData.prix)) errors.prix = 'Prix invalide.';
    if (!formData.duree || isNaN(formData.duree)) errors.duree = 'Durée invalide.';
    if (!formData.categorie_id) errors.categorie_id = 'Catégorie requise.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        prix: parseFloat(formData.prix),
        duree: parseInt(formData.duree, 10),
        categorie_id: parseInt(formData.categorie_id, 10),
        ressources_ids: formData.ressources_ids.map((id) => parseInt(id, 10)),
      };

      await dispatch(updatePlan({ id, data: payload })).unwrap();
      navigate('/plans');
    } catch (err) {
      setError("Erreur lors de la mise à jour du plan");
    } finally {
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <div className="w-full max-w-7xl mx-auto mt-10 px-6 text-center">
        <Loader2 className="mx-auto animate-spin w-8 h-8 text-gray-500" />
        <p className="mt-2 text-gray-600">Chargement du plan...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-10 px-6">
      <Card>

          <CardTitle>Modifier le Plan</CardTitle>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {['titre', 'description', 'prix', 'duree'].map((field) => (
              <div key={field}>
                <Label htmlFor={field} className="capitalize block text-left">{field}</Label>
                {field === 'description' ? (
                  <Textarea
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    disabled={loading}
                    className={`focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      fieldErrors[field] ? 'border-red-500' : ''
                    }`}
                  />
                ) : (
                  <Input
                    id={field}
                    name={field}
                    type={field === 'prix' || field === 'duree' ? 'number' : 'text'}
                    value={formData[field]}
                    onChange={handleChange}
                    disabled={loading}
                    className={`focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      fieldErrors[field] ? 'border-red-500' : ''
                    }`}
                  />
                )}
                {fieldErrors[field] && (
                  <p className="text-red-600 text-sm mt-1">{fieldErrors[field]}</p>
                )}
              </div>
            ))}

            <div>
              <Label htmlFor="categorie_id">Catégorie</Label>
              <Select
                onValueChange={handleCategoryChange}
                value={formData.categorie_id}
                disabled={loading}
              >
                <SelectTrigger
                  className={`focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fieldErrors.categorie_id ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.nom || cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.categorie_id && (
                <p className="text-red-600 text-sm mt-1">{fieldErrors.categorie_id}</p>
              )}
            </div>

            <div>
              <Label>Ressources (optionnel)</Label>
              <div className="space-y-2 border rounded p-3 max-h-52 overflow-y-auto">
                {ressources.map((res) => (
                  <div key={res.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`res-${res.id}`}
                      value={res.id.toString()}
                      checked={formData.ressources_ids.includes(res.id.toString())}
                      onChange={handleCheckboxChange}
                      disabled={loading}
                    />
                    <label htmlFor={`res-${res.id}`}>{res.titre}</label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Cochez les ressources à associer. Laisser vide si aucune.
              </p>
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <Button type="submit" className="w-full flex justify-center items-center gap-2" disabled={loading}>
              {loading && <Loader2 className="animate-spin w-4 h-4" />}
              Modifier
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPlan;
