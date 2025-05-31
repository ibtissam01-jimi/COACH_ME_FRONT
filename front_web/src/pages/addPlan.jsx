import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPlans } from '@/redux/slices/planSlice';
import { fetchCategories } from '@/redux/slices/categorieSlice';
import { fetchRessources } from '@/redux/slices/ressourceSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const AddPlan = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prix: '',
    duree: '',
    categorie_id: '',
    ressources_ids: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { items: categories } = useSelector((state) => state.categories);
  const { ressources } = useSelector((state) => state.ressources);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchRessources());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      categorie_id: value,
    }));
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

  const validateForm = () => {
    const errors = {};
    if (!formData.titre.trim()) errors.titre = 'Le titre est requis.';
    if (!formData.description.trim()) errors.description = 'La description est requise.';
    if (!formData.prix || isNaN(formData.prix)) errors.prix = 'Prix invalide.';
    if (!formData.duree.trim()) errors.duree = 'La durée est requise.';
    if (!formData.categorie_id) errors.categorie_id = 'Une catégorie est requise.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;
    setLoading(true);
    try {
      await dispatch(createPlans([formData])).unwrap();
      navigate('/plans');
    } catch (err) {
      setError('Erreur lors de l’ajout du plan');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    'border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full';

  return (
    <div className="w-full max-w-md mx-auto mt-10 px-4">
      <Card>
        
          <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
            Ajouter un Plan
          </CardTitle>
       
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="titre" className="text-sm text-gray-700 font-medium mb-1 block text-left">
                Titre
              </Label>
              <Input
                id="titre"
                name="titre"
                placeholder="Nom du plan"
                value={formData.titre}
                onChange={handleChange}
                disabled={loading}
                className={inputStyle}
              />
              {formErrors.titre && <p className="text-red-500 text-sm mt-1">{formErrors.titre}</p>}
            </div>

            <div>
              <Label htmlFor="description" className="text-sm text-gray-700 font-medium mb-1 block text-left">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Décris ton plan"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                className={inputStyle}
              />
              {formErrors.description && (
                <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
              )}
            </div>

            <div>
              <Label htmlFor="prix" className="text-sm text-gray-700 font-medium mb-1 block text-left">
                Prix
              </Label>
              <Input
                type="number"
                id="prix"
                name="prix"
                placeholder="Ex : 99.99"
                value={formData.prix}
                onChange={handleChange}
                disabled={loading}
                className={inputStyle}
              />
              {formErrors.prix && <p className="text-red-500 text-sm mt-1">{formErrors.prix}</p>}
            </div>

            <div>
              <Label htmlFor="duree" className="text-sm text-gray-700 font-medium mb-1 block text-left">
                Durée
              </Label>
              <Input
                id="duree"
                name="duree"
                placeholder="Ex : 30 jours"
                value={formData.duree}
                onChange={handleChange}
                disabled={loading}
                className={inputStyle}
              />
              {formErrors.duree && <p className="text-red-500 text-sm mt-1">{formErrors.duree}</p>}
            </div>

            <div>
              <Label className="text-sm text-gray-700 font-medium mb-1 block text-left">Catégorie</Label>
              <Select
                onValueChange={handleCategoryChange}
                value={formData.categorie_id}
                disabled={loading}
              >
                <SelectTrigger className={inputStyle}>
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.categorie_id && (
                <p className="text-red-500 text-sm mt-1">{formErrors.categorie_id}</p>
              )}
            </div>

            <div>
              <Label className="text-sm text-gray-700 font-medium mb-1 block text-left">
                Ressources (optionnel)
              </Label>
              <div className="space-y-2 border border-gray-300 rounded-md p-3 max-h-52 overflow-y-auto">
                {ressources?.map((res) => (
                  <div key={res.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`res-${res.id}`}
                      value={res.id.toString()}
                      checked={formData.ressources_ids.includes(res.id.toString())}
                      onChange={handleCheckboxChange}
                      disabled={loading}
                      className="accent-blue-500"
                    />
                    <label htmlFor={`res-${res.id}`} className="text-gray-700">
                      {res.titre}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Cochez les ressources à associer. Laisser vide si aucune.
              </p>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {loading && <Loader2 className="animate-spin w-4 h-4" />}
              {loading ? 'Ajout en cours...' : 'Ajouter'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPlan;


