import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUsers, deleteUser } from '@/redux/slices/userSlice';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import UserForm from './UserForm';
import Sidebar from '@/components/Sidebar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Edit, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const UserList = () => {
  const dispatch = useDispatch();
  const { users, isLoading, error } = useSelector((state) => state.users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    setUserToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    await dispatch(deleteUser(userToDelete));
    setDeleting(false);
    setConfirmOpen(false);
    setUserToDelete(null);
  };

  const handleEdit = (id) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedUserId(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
    dispatch(fetchUsers());
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex min-h-screen w-full ml-32 bg-slate-50"> 
      <Sidebar />
      <main className="flex-1 w-full px-0 py-10">
        <div className="w-full max-w-full mx-auto">
          <div className="flex justify-between items-center mb-8 px-8">
            <h1 className="text-3xl font-bold text-slate-800">Utilisateurs</h1>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un utilisateur
            </Button>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-gray-200 mx-8">
            <Table className="w-full min-w-[900px]">
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    className={user.id % 2 === 0 ? 'bg-white' : 'bg-slate-50 hover:bg-blue-50 transition'}
                  >
                    <TableCell className="font-semibold text-slate-800">{user.nom}</TableCell>
                    <TableCell className="text-slate-700">{user.prenom}</TableCell>
                    <TableCell className="text-slate-700">{user.email}</TableCell>
                    <TableCell className="text-slate-700">{user.telephone}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.statut === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.statut}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'coach' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.role === 'admin' ? 'Administrateur' :
                         user.role === 'coach' ? 'Coach' : 'Coache'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user.id)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {isModalOpen && (
            <Modal
              isOpen={isModalOpen}
              onClose={handleModalClose}
              title={selectedUserId ? 'Modifier un utilisateur' : 'Ajouter un utilisateur'}
              description={selectedUserId ? "Mettre à jour les informations de l'utilisateur" : "Créer un nouveau compte utilisateur"}
            >
              <UserForm
                key={selectedUserId || 'new'}
                userId={selectedUserId}
                onSuccess={handleModalClose}
                onCancel={handleModalClose}
              />
            </Modal>
          )}
          <ConfirmDialog
            open={confirmOpen}
            title="Confirmer la suppression"
            description="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
            onConfirm={handleConfirmDelete}
            onCancel={() => { setConfirmOpen(false); setUserToDelete(null); }}
            loading={deleting}
          />
        </div>
      </main>
    </div>
  );
};

export default UserList; 