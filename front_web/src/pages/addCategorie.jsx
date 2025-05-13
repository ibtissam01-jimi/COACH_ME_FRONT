import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCategory } from '@/redux/slices/categorieSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AddCategorie = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ nom: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createCategory(formData)).unwrap();
      navigate('/categories');
    } catch (err) {
      setError("Erreur lors de l’ajout de la catégorie");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 px-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Ajouter une Catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nom">Nom de la catégorie</Label>
              <Input
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <Button type="submit" className="w-full">Ajouter</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategorie;
