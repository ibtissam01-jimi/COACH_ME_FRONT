import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, deleteCategory } from '@/redux/slices/categorieSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

const CategorieList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: categories, loading } = useSelector((state) => state.categories); // Accès à `items` et non `categories`

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
    <div  className="p-6 max-w-screen-xl mx-auto w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Catégories</h2>
        <Button onClick={handleAdd}>Ajouter une catégorie</Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        </div>
      ) : (
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories && categories.map((categorie) => (
              <TableRow key={categorie.id}>
                <TableCell>{categorie.id}</TableCell>
                <TableCell>{categorie.nom}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="destructive" onClick={() => handleDelete(categorie.id)}>Supprimer</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default CategorieList;
