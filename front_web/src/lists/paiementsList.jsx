import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPaiements, deletePaiement } from '@/redux/slices/paiementsSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Loader2, Trash, Edit, Plus } from "lucide-react";
import Sidebar from '../sidebar/sidebar';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const PaiementsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: paiements, loading } = useSelector((state) => state.paiement);

  const [filters, setFilters] = useState({
    date: '',
    methode: '',
    statut: ''
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [paiementToDelete, setPaiementToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (paiements.length === 0) {
      dispatch(fetchPaiements());
    }
  }, [dispatch, paiements.length]);

  const handleDelete = (id) => {
    setPaiementToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    await dispatch(deletePaiement(paiementToDelete));
    setDeleting(false);
    setConfirmOpen(false);
    setPaiementToDelete(null);
  };

  const handleEdit = (id) => {
    navigate(`/editPaiement/${id}`);
  };

  const handleAdd = () => {
    navigate('/addPaiement');
  };

  const filteredPaiements = paiements.filter((paiement) => {
    const dateMatch = !filters.date || paiement.date_paiement === filters.date;
    const methodeMatch = !filters.methode || paiement.methode === filters.methode;
    const statutMatch = !filters.statut || paiement.statut.toLowerCase() === filters.statut.toLowerCase();
    return dateMatch && methodeMatch && statutMatch;
  });

  return (
    <div className="flex min-h-screen w-full ml-32 bg-white">
      <Sidebar />
      <main className="flex-1 w-full px-0 py-10">
        <div className="w-full max-w-full mx-auto">
          <div className="flex justify-between items-center mb-8 px-8">
            <h1 className="text-3xl font-medium text-slate-800">Paiements</h1>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow"
              onClick={handleAdd}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un paiement
            </Button>
          </div>

          {/* Filtres */}
          <div className="flex gap-4 items-center mb-6 px-8">
            <input
              type="date"
              className="border border-gray-300 rounded px-2 py-1"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            />
            <select
              className="border border-gray-300 rounded px-2 py-1"
              value={filters.methode}
              onChange={(e) => setFilters({ ...filters, methode: e.target.value })}
            >
              <option value="">Méthode</option>
              <option value="virement">Virement</option>
              <option value="cache">Cache</option>
            </select>
            <select
              className="border border-gray-300 rounded px-2 py-1"
              value={filters.statut}
              onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
            >
              <option value="">Statut</option>
              <option value="Payé">Payé</option>
              <option value="En attente">En attente</option>
              <option value="Annulé">Annulé</option>
            </select>
            <Button
              variant="outline"
              onClick={() => setFilters({ date: '', methode: '', statut: '' })}
            >
              Réinitialiser
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-gray-200 mx-8">
              <Table className="w-full min-w-[1000px]">
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>ID</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Abonnement</TableHead>
                    <TableHead>Ressource</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPaiements.length > 0 ? (
                    filteredPaiements.map((paiement) => (
                      <TableRow
                        key={paiement.id}
                        className={paiement.id % 2 === 0 ? 'bg-white' : 'bg-slate-50 hover:bg-blue-50 transition'}
                      >
                        <TableCell>{paiement.id}</TableCell>
                        <TableCell className="text-slate-700 font-medium">{paiement.montant} MAD</TableCell>
                        <TableCell className="text-slate-700">{paiement.date_paiement}</TableCell>
                        <TableCell className="text-slate-700">{paiement.methode}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            paiement.statut.trim().toLowerCase() === 'payé'
                              ? 'bg-green-100 text-green-800'
                              : paiement.statut.trim().toLowerCase() === 'annulé'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {paiement.statut}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-700">{paiement.abonnement_id ?? 'Null'}</TableCell>
                        <TableCell className="text-slate-700">{paiement.ressource?.titre ?? 'Null'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(paiement.id)}
                              className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(paiement.id)}
                              className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-500 py-4">
                        Aucun paiement trouvé avec ces filtres.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Boîte de dialogue de confirmation */}
          <ConfirmDialog
            open={confirmOpen}
            title="Confirmer la suppression"
            description="Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action est irréversible."
            onConfirm={handleConfirmDelete}
            onCancel={() => { setConfirmOpen(false); setPaiementToDelete(null); }}
            loading={deleting}
          />
        </div>
      </main>
    </div>
  );
};

export default PaiementsList;

