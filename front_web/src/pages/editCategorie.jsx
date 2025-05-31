import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCategory, fetchCategories } from '../redux/slices/categorieSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import {
  Card,
  CardContent,
  CardTitle
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const EditCategorie = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, loading, error } = useSelector((state) => state.categories);
  const category = items.find((cat) => cat.id === parseInt(id));

  const [nom, setNom] = useState('');
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!category) {
      dispatch(fetchCategories());
    } else {
      setNom(category.nom);
    }
  }, [category, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    if (!nom.trim()) {
      setFormError('Le nom est requis.');
      setSubmitting(false);
      return;
    }

    try {
      await dispatch(updateCategory({ id, data: { nom } })).unwrap();
      navigate('/categories');
    } catch (err) {
      setFormError("Erreur lors de la mise à jour");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle =
    'border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full';

  return (
    <div className="w-full max-w-xl mx-auto mt-10 px-4">
      <Card>
        <CardTitle className="text-3xl font-bold text-blue-800 text-center my-6">
          Modifier la Catégorie
        </CardTitle>
        <CardContent>
          {error && (
            <p className="text-red-500 mb-4">{error?.message || 'Erreur de chargement.'}</p>
          )}
          {formError && (
            <p className="text-red-500 mb-4">{formError}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </Label>
              <Input
                id="nom"
                name="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className={inputStyle}
                disabled={submitting}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={submitting}
            >
              {submitting && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
              {submitting ? 'Enregistrement...' : 'Modifier'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCategorie;
