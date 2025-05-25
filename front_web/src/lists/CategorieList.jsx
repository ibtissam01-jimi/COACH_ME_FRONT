
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, deleteCategory } from '@/redux/slices/categorieSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Sidebar from '../sidebar/sidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Trash, Plus } from 'lucide-react';

const CategorieList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: categories, loading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
      dispatch(deleteCategory({ id }));
    }
  };

  const handleAdd = () => {
    navigate('/addCategorie');
  };

  return (
    <div className="flex min-h-screen w-full ml-32 bg-slate-50">
      <Sidebar />
      <main className="flex-1 w-full px-0 py-10">
        <div className="w-full max-w-full mx-auto">
          <div className="flex justify-between items-center mb-8 px-8">
            <h1 className="text-3xl font-bold text-slate-800">Catégories</h1>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une catégorie
            </Button>
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
                  {categories && categories.map((categorie, index) => (
                    <TableRow
                      key={categorie.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50 hover:bg-blue-50 transition'}
                    >
                      <TableCell className="font-semibold text-slate-800">{categorie.id}</TableCell>
                      <TableCell className="text-slate-700">{categorie.nom}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(categorie.id)}
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Supprimer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategorieList;

