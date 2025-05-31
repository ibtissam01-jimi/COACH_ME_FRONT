import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlans, deletePlans } from '@/redux/slices/planSlice';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Loader2, Plus, Edit, Trash } from "lucide-react";
import ConfirmDialog from '@/components/ui/ConfirmDialog';  // boîte de confirmation

const PlanList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { plans, loading } = useSelector((state) => state.plans);

  const [filterTitre, setFilterTitre] = useState('');
  const [filterCategorie, setFilterCategorie] = useState('');

  // États pour confirmation suppression
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/editPlan/${id}`);
  };

  const handleDelete = (id) => {
    setPlanToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deletePlans({ id: planToDelete })).unwrap();
      // Suppression réussie, on ferme la confirmation sans message
    } catch {
      // Erreur suppression, tu peux gérer une erreur si tu veux (console.log ou autre)
      // Par exemple: console.error('Erreur lors de la suppression');
    }
    setDeleting(false);
    setConfirmOpen(false);
    setPlanToDelete(null);
  };

  const handleAdd = () => {
    navigate('/addPlan');
  };

  const categories = Array.from(
    new Set(plans.map(plan => plan.categorie?.nom).filter(Boolean))
  );

  const filteredPlans = plans.filter(plan => {
    const matchTitre = plan.titre.toLowerCase().includes(filterTitre.toLowerCase());
    const matchCategorie = filterCategorie === '' || (plan.categorie?.nom === filterCategorie);
    return matchTitre && matchCategorie;
  });

  return (
    <div className="flex min-h-screen w-full ml-32 bg-white">
      <Sidebar />
      <main className="flex-1 w-full px-0 py-10">
        <div className="w-full max-w-full mx-auto">
          <div className="flex justify-between items-center mb-8 px-8">
            <h1 className="text-3xl font-medium text-slate-800">Plans</h1>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow"
              onClick={handleAdd}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un plan
            </Button>
          </div>

          {/* FILTRES */}
          <div className="flex gap-4 mb-6 px-8 max-w-3xl">
            <div className="flex items-center gap-2 border border-slate-300 rounded-md shadow-md px-3 py-2 bg-white">
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
              value={filterCategorie}
              onChange={(e) => setFilterCategorie(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-gray-200 mx-8">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
              </div>
            ) : (
              <Table className="w-full min-w-[900px]">
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>ID</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Ressources</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((plan, index) => (
                    <TableRow
                      key={plan.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50 hover:bg-blue-50 transition'}
                    >
                      <TableCell className="font-semibold text-slate-800">{plan.id}</TableCell>
                      <TableCell className="text-slate-700">{plan.titre}</TableCell>
                      <TableCell className="text-slate-700">{plan.description}</TableCell>
                      <TableCell className="text-slate-700">{plan.prix} MAD</TableCell>
                      <TableCell className="text-slate-700">{plan.duree} jours</TableCell>
                      <TableCell className="text-slate-700">{plan.categorie?.nom || '—'}</TableCell>
                      <TableCell>
                        <ul className="list-disc ml-4 text-sm text-gray-600">
                          {plan.ressources?.map((res) => (
                            <li key={res.id}>
                              {res.titre} ({res.type})
                            </li>
                          ))}
                        </ul>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(plan.id)}
                            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(plan.id)}
                            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                            disabled={deleting}
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPlans.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-500 py-6">
                        Aucun plan trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Boîte de dialogue de confirmation */}
          <ConfirmDialog
            open={confirmOpen}
            title="Confirmer la suppression"
            description="Êtes-vous sûr de vouloir supprimer ce plan ? Cette action est irréversible."
            onConfirm={handleConfirmDelete}
            onCancel={() => {
              setConfirmOpen(false);
              setPlanToDelete(null);
            }}
            loading={deleting}
          />
        </div>
      </main>
    </div>
  );
};

export default PlanList;
