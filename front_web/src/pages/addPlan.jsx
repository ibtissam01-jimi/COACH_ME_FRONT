import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPlans } from '@/redux/slices/planSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AddPlan = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prix: '',
    duree: '',
    categorie_id: '',
  });

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
      await dispatch(createPlans([formData])).unwrap();
      navigate('/plans');
    } catch (err) {
      setError('Erreur lors de l’ajout du plan');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 px-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Ajouter un Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="titre">Titre</Label>
              <Input id="titre" name="titre" value={formData.titre} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="prix">Prix (MAD)</Label>
                <Input id="prix" name="prix" type="number" step="0.01" value={formData.prix} onChange={handleChange} required />
              </div>

              <div>
                <Label htmlFor="duree">Durée (jours)</Label>
                <Input id="duree" name="duree" type="number" value={formData.duree} onChange={handleChange} required />
              </div>

              <div>
                <Label htmlFor="categorie_id">Catégorie ID</Label>
                <Input id="categorie_id" name="categorie_id" type="number" value={formData.categorie_id} onChange={handleChange} required />
              </div>
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <Button type="submit" className="w-full">Ajouter</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPlan;
