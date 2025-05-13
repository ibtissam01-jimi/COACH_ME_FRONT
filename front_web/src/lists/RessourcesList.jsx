
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRessources, deleteRessources } from '../redux/slices/ressourceSlice';
import { useNavigate } from 'react-router-dom';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const RessourcesTable = () => {
  const dispatch = useDispatch();
  const { ressources, loading, error, message } = useSelector((state) => state.ressources);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchRessources());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      alert(message);
    }
  }, [message]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-2">Chargement des ressources...</span>
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

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette ressource ?")) {
      dispatch(deleteRessources([id]));
    }
  };

  const handleAdd = () => {
    navigate('/addRessource');
  };

  const handleEdit = (id) => {
    navigate(`/editRessource/${id}`);
  };

  return (
    <Card className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Liste des ressources</h2>
        <Button onClick={handleAdd}>Ajouter une ressource</Button>
      </div>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Est Premium</TableHead>
              <TableHead>Individuel</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ressources.length > 0 ? (
              ressources.map((ressource) => (
                <TableRow key={ressource.id}>
                  <TableCell>{ressource.id}</TableCell>
                  <TableCell>{ressource.titre}</TableCell>
                  <TableCell>{ressource.type}</TableCell>
                  <TableCell>
                    <a href={ressource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {ressource.url}
                    </a>
                  </TableCell>
                  <TableCell>{ressource.estPremium ? 'Oui' : 'Non'}</TableCell>
                  <TableCell>{ressource.is_individual ? 'Oui' : 'Non'}</TableCell>
                  <TableCell>{ressource.prix ? `${ressource.prix} €` : 'Gratuit'}</TableCell>
                  <TableCell className="space-x-2">
                    <Button onClick={() => handleEdit(ressource.id)} size="sm">Modifier</Button>
                    <Button onClick={() => handleDelete(ressource.id)} size="sm" variant="destructive">Supprimer</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="8" className="text-center text-gray-500">
                  Aucune ressource trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RessourcesTable;

