

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPlanById, updatePlan } from '@/redux/slices/planSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const EditPlan = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Utilisation correcte du useSelector pour récupérer le plan depuis le store
  const plan = useSelector((state) =>
    state.plans.plans.find((p) => p.id === parseInt(id))
  );

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prix: '',
    duree: '',
    categorie_id: '',
  });

  const [error, setError] = useState(null);

  // Récupérer les données du plan si elles n'ont pas encore été chargées
  useEffect(() => {
    if (!plan) {
      dispatch(fetchPlanById(id));
    } else {
      setFormData({
        titre: plan.titre || '',
        description: plan.description || '',
        prix: plan.prix || '',
        duree: plan.duree || '',
        categorie_id: plan.categorie_id || '',
      });
    }
  }, [dispatch, id, plan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Form data before submitting:', formData); // Check the data

  try {
    await dispatch(updatePlan({ id, data: formData })).unwrap();
    navigate('/plans');
  } catch (err) {
    console.log('Error:', err); // Log the full error
    setError("Erreur lors de la mise à jour du plan");
  }
};



  if (!plan) {
    return <p className="text-center mt-10">Chargement du plan...</p>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 px-6">
      <Card>
        <CardHeader>
          <CardTitle>Modifier le Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="titre">Titre</Label>
              <Input
                id="titre"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="prix">Prix (MAD)</Label>
              <Input
                id="prix"
                name="prix"
                type="number"
                step="0.01"
                value={formData.prix}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="duree">Durée (jours)</Label>
              <Input
                id="duree"
                name="duree"
                type="number"
                value={formData.duree}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="categorie_id">Catégorie ID</Label>
              <Input
                id="categorie_id"
                name="categorie_id"
                type="number"
                value={formData.categorie_id}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <Button type="submit" className="w-full">Modifier</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPlan;
