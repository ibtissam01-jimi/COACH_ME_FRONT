
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Importation du dispatch
import { createRessource } from '../redux/slices/ressourceSlice'; // Importation de l'action
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AddRessource = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Utilisation de useDispatch
  const [form, setForm] = useState({
    titre: '',
    type: '',
    url: '',
    estPremium: false,
    is_individual: false,
    prix: '',
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch de l'action pour créer une ressource
    dispatch(createRessource(form))
      .then(() => {
        navigate('/ressources'); // Redirection après la création
      })
      .catch((error) => {
        console.error("Erreur lors de la création de la ressource :", error);
      });
  };

  return (
    <Card className="max-w-6xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Ajouter une Ressource</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Label htmlFor="titre">Titre</Label>
            <Input name="titre" value={form.titre} onChange={handleChange} required className="w-full" />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Vidéo</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="lien">Lien</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="url">URL</Label>
            <Input name="url" value={form.url} onChange={handleChange} required className="w-full" />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="estPremium"
              name="estPremium"
              checked={form.estPremium}
              onChange={(e) => setForm((prev) => ({ ...prev, estPremium: e.target.checked }))} />
            <Label htmlFor="estPremium">Est Premium</Label>
          </div>

          {form.estPremium && (
            <div>
              <Label htmlFor="prix">Prix (€)</Label>
              <Input
                name="prix"
                type="number"
                value={form.prix}
                onChange={handleChange}
                min={0}
                className="w-full"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_individual"
              name="is_individual"
              checked={form.is_individual}
              onChange={(e) => setForm((prev) => ({ ...prev, is_individual: e.target.checked }))} />
            <Label htmlFor="is_individual">Individuel</Label>
          </div>

          <Button type="submit" className="w-full mt-6">Enregistrer</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddRessource;

