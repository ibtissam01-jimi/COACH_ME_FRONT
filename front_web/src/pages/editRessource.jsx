

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRessource, updateRessource } from '../redux/slices/ressourceSlice'; 
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

const EditRessource = () => {
  const { id } = useParams(); // Paramètre d'URL pour l'ID de la ressource
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selected, loading, error, message } = useSelector((state) => state.ressources);

  const [form, setForm] = useState({
    titre: '',
    type: '',
    url: '',
    estPremium: false,
    is_individual: false,
    prix: '',
  });

  // Charge la ressource à éditer
  useEffect(() => {
    if (id) {
      dispatch(getRessource(id)); // Récupère la ressource par son ID
    }
  }, [id, dispatch]);

  // Remplir le formulaire avec les données de la ressource
  useEffect(() => {
    if (selected) {
      setForm({
        titre: selected.titre || '',
        type: selected.type || '',
        url: selected.url || '',
        estPremium: selected.estPremium || false,
        is_individual: selected.is_individual || false,
        prix: selected.prix || '', // Assurez-vous que `prix` est bien un nombre
      });
    }
  }, [selected]);

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
    if (form.titre && form.url && form.type) {
      dispatch(updateRessource({ id, data: form }));
      navigate('/ressources');
    } else {
      alert("Veuillez remplir tous les champs obligatoires.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Chargement des données...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 font-semibold text-center mt-4">
        Erreur : {error}
      </div>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Modifier la Ressource</CardTitle>
      </CardHeader>
      <CardContent>
        {message && (
          <div className={`text-${message.type === 'error' ? 'red' : 'green'}-500 font-semibold text-center mt-4`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="titre">Titre</Label>
            <Input
              name="titre"
              value={form.titre}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select onValueChange={handleSelectChange} value={form.type}>
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
            <Input
              name="url"
              value={form.url}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="estPremium"
              name="estPremium"
              checked={form.estPremium}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, estPremium: checked }))}
            />
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
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_individual"
              name="is_individual"
              checked={form.is_individual}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_individual: checked }))}
            />
            <Label htmlFor="is_individual">Individuel</Label>
          </div>

          <Button type="submit" className="w-full">Enregistrer</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditRessource;

