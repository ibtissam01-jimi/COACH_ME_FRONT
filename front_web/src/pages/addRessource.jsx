import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createRessource } from '../redux/slices/ressourceSlice';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const AddRessource = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    titre: '',
    type: '',
    url: '',
    estPremium: false,
    is_individual: false,
    prix: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (value) => {
    setForm((prev) => ({ ...prev, type: value }));
  };

  const handleEstPremiumChange = (checked) => {
    setForm((prev) => ({
      ...prev,
      estPremium: checked,
      prix: checked ? prev.prix : '',
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!form.titre.trim()) errors.titre = 'Le titre est requis.';
    if (!form.type) errors.type = 'Le type est requis.';
    if (!form.url.trim()) errors.url = 'L’URL est requise.';
    if (form.estPremium && (!form.prix || Number(form.prix) < 0)) {
      errors.prix = 'Le prix doit être un nombre positif.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    dispatch(createRessource(form))
      .then(() => {
        navigate('/ressources');
      })
      .catch((error) => {
        console.error('Erreur lors de la création de la ressource :', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const inputStyle =
    'border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full';

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 px-4">
      <Card>
        
          <CardTitle className="text-3xl font-bold text-blue-800 text-center mb-4">
            Ajouter une Ressource
          </CardTitle>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="titre" className="block text-sm font-medium text-left text-gray-700 mb-1">
                Titre
              </Label>
              <Input
                name="titre"
                placeholder="Nom de la ressource"
                value={form.titre}
                onChange={handleChange}
                disabled={loading}
                className={inputStyle}
              />
              {formErrors.titre && <p className="text-red-500 text-sm mt-1">{formErrors.titre}</p>}
            </div>

            <div>
              <Label htmlFor="type" className="block text-sm font-medium text-left text-gray-700 mb-1">
                Type
              </Label>
              <Select onValueChange={handleSelectChange} value={form.type} disabled={loading}>
                <SelectTrigger className={inputStyle}>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Vidéo</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.type && <p className="text-red-500 text-sm mt-1">{formErrors.type}</p>}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="url" className="block text-sm font-medium text-left text-gray-700 mb-1">
                URL
              </Label>
              <Input
                name="url"
                placeholder="Lien de la ressource"
                value={form.url}
                onChange={handleChange}
                disabled={loading}
                className={inputStyle}
              />
              {formErrors.url && <p className="text-red-500 text-sm mt-1">{formErrors.url}</p>}
            </div>

            <div className="flex items-center space-x-2 md:col-span-2">
              <Checkbox
                id="estPremium"
                name="estPremium"
                checked={form.estPremium}
                onChange={(e) => handleEstPremiumChange(e.target.checked)}
              />
              <Label htmlFor="estPremium" className="text-gray-700">
                Est Premium
              </Label>
            </div>

            {form.estPremium && (
              <div className="md:col-span-2">
                <Label htmlFor="prix" className="block text-sm font-medium text-left text-gray-700 mb-1">
                  Prix (€)
                </Label>
                <Input
                  name="prix"
                  type="number"
                  min="0"
                  value={form.prix}
                  onChange={handleChange}
                  className={inputStyle}
                  required={form.estPremium}
                />
                {formErrors.prix && <p className="text-red-500 text-sm mt-1">{formErrors.prix}</p>}
              </div>
            )}

            <div className="flex items-center space-x-2 md:col-span-2">
              <Checkbox
                id="is_individual"
                name="is_individual"
                checked={form.is_individual}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, is_individual: e.target.checked }))
                }
              />
              <Label htmlFor="is_individual" className="text-gray-700">
                Individuel
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full md:col-span-2 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRessource;

