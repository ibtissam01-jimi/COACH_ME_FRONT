import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRessources,
  deleteRessources,
  clearError,
  clearMessage,
} from '../redux/slices/ressourceSlice';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../sidebar/sidebar';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, Edit, Trash, Plus } from 'lucide-react';

import ConfirmDialog from '@/components/ui/ConfirmDialog';  // <- Import du ConfirmDialog

const RessourcesTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { ressources, loading, error, message } = useSelector(
    (state) => state.ressources
  );

  const [filterTitre, setFilterTitre] = useState('');
  const [filterType, setFilterType] = useState('');

  // États pour confirmation suppression
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [ressourceToDelete, setRessourceToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchRessources());
  }, [dispatch]);

  // Afficher message success via alert puis nettoyage
  useEffect(() => {
    if (message) {
      alert(message);
      dispatch(clearMessage());
    }
  }, [message, dispatch]);

  // Afficher message erreur via alert puis nettoyage
  useEffect(() => {
    if (error) {
      alert(`Erreur : ${error}`);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Nouveau handleDelete avec confirmation via ConfirmDialog
  const handleDelete = (id) => {
    setRessourceToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteRessources([ressourceToDelete])).unwrap();
      // suppression réussie, rien de spécial à faire, la liste va se mettre à jour
    } catch (err) {
      // gérer erreur si nécessaire
    }
    setDeleting(false);
    setConfirmOpen(false);
    setRessourceToDelete(null);
  };

  const handleAdd = () => {
    navigate('/addRessource');
  };

  const handleEdit = (id) => {
    navigate(`/editRessource/${id}`);
  };

  const filteredRessources = ressources.filter((r) => {
    const titreMatch =
      r.titre?.toLowerCase().includes(filterTitre.toLowerCase()) ?? false;
    const typeMatch = filterType ? r.type === filterType : true;
    return titreMatch && typeMatch;
  });

  const types = [...new Set(ressources.map((r) => r.type).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-2">Chargement des ressources...</span>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-10">
      <Sidebar />
      <div className="flex justify-between items-center mb-8 px-8">
        <h2 className="text-3xl font-medium text-slate-800">Ressources</h2>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une ressource
        </Button>
      </div>

      {/* Filtres */}
      <div className="flex gap-4 mb-6 px-8">
        <div className="flex items-center gap-2 border border-slate-300  rounded-md shadow-md px-3 py-2 bg-white">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Rechercher par titre..."
            value={filterTitre}
            onChange={(e) => setFilterTitre(e.target.value)}
            className="w-full text-gray-700 placeholder-gray-400 focus:outline-none"
          />
        </div>
        <select
          className="border border-gray-300 rounded-md px-4 py-2 w-1/3"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Tous les types</option>
          {types.map((type, idx) => (
            <option key={idx} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-gray-200 mx-8">
        <Table className="w-full min-w-[900px]">
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>ID</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Est Premium</TableHead>
              <TableHead>Individuel</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRessources.length > 0 ? (
              filteredRessources.map((ressource, index) => (
                <TableRow
                  key={ressource.id}
                  className={
                    index % 2 === 0
                      ? 'bg-white'
                      : 'bg-slate-50 hover:bg-blue-50 transition'
                  }
                >
                  <TableCell className="font-semibold text-slate-800">
                    {ressource.id}
                  </TableCell>
                  <TableCell className="text-slate-700">{ressource.titre}</TableCell>
                  <TableCell className="text-slate-700">{ressource.type}</TableCell>
                  <TableCell className="text-blue-600 hover:underline">
                    <a
                      href={ressource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      Télécharger
                    </a>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        ressource.estPremium
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {ressource.estPremium ? 'Oui' : 'Non'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        ressource.is_individual
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {ressource.is_individual ? 'Oui' : 'Non'}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {ressource.prix ? `${ressource.prix} €` : 'Gratuit'}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(ressource.id)}
                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(ressource.id)}
                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                        disabled={deleting}
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-slate-600 py-6">
                  Aucune ressource trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ConfirmDialog pour suppression */}
      <ConfirmDialog
        open={confirmOpen}
        title="Confirmer la suppression"
        description="Êtes-vous sûr de vouloir supprimer cette ressource ? Cette action est irréversible."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setRessourceToDelete(null);
        }}
        loading={deleting}
      />
    </div>
  );
};

export default RessourcesTable;


