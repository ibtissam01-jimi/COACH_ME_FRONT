import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCategory } from '@/redux/slices/categorieSlice';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const AddCategorie = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nom: '' });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!form.nom.trim()) errors.nom = 'Le nom de la catégorie est requis.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await dispatch(createCategory(form)).unwrap();
      navigate('/categories');
    } catch (error) {
      setFormErrors({ global: "Erreur lors de l'ajout de la catégorie." });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    'border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full';

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-blue-800 text-center mb-4">
            Ajouter une Catégorie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="nom" className="block text-sm font-medium text-left text-gray-700 mb-1">
                Nom de la catégorie
              </Label>
              <Input
                name="nom"
                placeholder="Entrez le nom de la catégorie"
                value={form.nom}
                onChange={handleChange}
                disabled={loading}
                className={inputStyle}
              />
              {formErrors.nom && <p className="text-red-500 text-sm mt-1">{formErrors.nom}</p>}
            </div>

            {formErrors.global && <p className="text-red-500 text-sm">{formErrors.global}</p>}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
              {loading ? 'Ajout en cours...' : 'Ajouter'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategorie;
