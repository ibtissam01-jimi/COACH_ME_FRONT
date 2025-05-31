import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, deleteCategory } from '@/redux/slices/categorieSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Sidebar from '../sidebar/sidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Trash, Plus, Edit } from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const CategorieList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: categories, loading } = useSelector((state) => state.categories);
  const [filterNom, setFilterNom] = useState('');

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    await dispatch(deleteCategory({ id: categoryToDelete }));
    setDeleting(false);
    setConfirmOpen(false);
    setCategoryToDelete(null);
  };

  const handleAdd = () => {
    navigate('/addCategorie');
  };

  const handleEdit = (id) => {
    navigate(`/editCategorie/${id}`);
  };

  const filteredCategories = categories.filter(categorie =>
    categorie.nom.toLowerCase().includes(filterNom.toLowerCase())
  );

  return (
    <div className="flex min-h-screen w-full ml-32 bg-white">
      <Sidebar />
      <main className="flex-1 w-full px-0 py-10">
        <div className="w-full max-w-full mx-auto">
          <div className="flex justify-between items-center mb-4 px-8">
            <h1 className="text-3xl font-medium text-slate-800">Catégories</h1>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow"
              onClick={handleAdd}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une catégorie
            </Button>
          </div>

          {/* Champ de recherche par nom */}
          <div className="mb-6 px-8">
            <div className="flex items-center gap-2 border border-slate-300 rounded-md shadow-md px-3 py-2 bg-white w-fit">
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
                placeholder="Filtrer par nom..."
                value={filterNom}
                onChange={(e) => setFilterNom(e.target.value)}
                className="w-48 text-gray-700 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-gray-200 mx-8">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
              </div>
            ) : (
              <Table className="w-full min-w-[600px]">
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>ID</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((categorie, index) => (
                    <TableRow
                      key={categorie.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50 hover:bg-blue-50 transition'}
                    >
                      <TableCell className="font-semibold text-slate-800">{categorie.id}</TableCell>
                      <TableCell className="text-slate-700">{categorie.nom}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(categorie.id)}
                            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(categorie.id)}
                            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Boîte de dialogue de confirmation */}
          <ConfirmDialog
            open={confirmOpen}
            title="Confirmer la suppression"
            description="Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible."
            onConfirm={handleConfirmDelete}
            onCancel={() => { setConfirmOpen(false); setCategoryToDelete(null); }}
            loading={deleting}
          />
        </div>
      </main>
    </div>
  );
};

export default CategorieList;



