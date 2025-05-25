
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAbonnements, deleteAbonnement } from '@/redux/slices/abonnementsSlice';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash } from 'lucide-react';
import Sidebar from '../sidebar/sidebar';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useNavigate } from 'react-router-dom';

const AbonnementList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { abonnements, loading } = useSelector((state) => state.abonnements);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [abonnementToDelete, setAbonnementToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchAbonnements());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/editAbonnement/${id}`);
  };

  const handleAdd = () => {
    navigate('/addAbonnement');
  };

  const handleDelete = (id) => {
    setAbonnementToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    await dispatch(deleteAbonnement(abonnementToDelete));
    setDeleting(false);
    setConfirmOpen(false);
    setAbonnementToDelete(null);
  };

  return (
    <div className="flex min-h-screen w-full ml-32 bg-slate-50">
      <Sidebar />
      <main className="flex-1 w-full px-0 py-10">
        <div className="w-full max-w-full mx-auto">
          <div className="flex justify-between items-center mb-8 px-8">
            <h1 className="text-3xl font-bold text-slate-800">Abonnements</h1>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow"
              onClick={handleAdd}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un abonnement
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-gray-200 mx-8">
            <Table className="w-full min-w-[900px]">
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>ID</TableHead>
                  <TableHead>Coach</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Date Début</TableHead>
                  <TableHead>Date Fin</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan="7" className="text-center py-8">
                      Chargement des abonnements...
                    </TableCell>
                  </TableRow>
                ) : abonnements.length > 0 ? (
                  abonnements.map((abo) => (
                    <TableRow
                      key={abo.id}
                      className={abo.id % 2 === 0 ? 'bg-white' : 'bg-slate-50 hover:bg-blue-50 transition'}
                    >
                      <TableCell className="text-slate-700">{abo.id}</TableCell>
                      <TableCell className="text-slate-700">{abo.coache_id}</TableCell>
                      <TableCell className="text-slate-700">{abo.plan?.titre || 'N/A'}</TableCell>
                      <TableCell className="text-slate-700">{abo.date_debut}</TableCell>
                      <TableCell className="text-slate-700">{abo.date_fin}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          abo.statut === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {abo.statut}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(abo.id)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(abo.id)}
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            Supprimer
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="7" className="text-center py-8 text-slate-500">
                      Aucun abonnement trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <ConfirmDialog
            open={confirmOpen}
            title="Confirmer la suppression"
            description="Êtes-vous sûr de vouloir supprimer cet abonnement ? Cette action est irréversible."
            onConfirm={handleConfirmDelete}
            onCancel={() => { setConfirmOpen(false); setAbonnementToDelete(null); }}
            loading={deleting}
          />
        </div>
      </main>
    </div>
  );
};

export default AbonnementList;

