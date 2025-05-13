import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlans, deletePlans } from '@/redux/slices/planSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

const PlanList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { plans, loading } = useSelector((state) => state.plans);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  
  const handleEdit = (id) => {
    navigate(`/editPlan/${id}`);
  };


  const handleDelete = (id = null) => {
  if (id) {
    // Si un ID spécifique est passé, supprimez un seul plan
    if (window.confirm('Voulez-vous vraiment supprimer ce plan ?')) {
      dispatch(deletePlans({ id }));
    }
  } else {
    // Sinon, supprimez les plans sélectionnés
    if (selectedPlans.length > 0 && window.confirm('Voulez-vous vraiment supprimer ces plans ?')) {
      dispatch(deletePlans({ ids: selectedPlans }));
    } else {
      alert('Aucun plan sélectionné');
    }
  }
};


  const handleAdd = () => {
    navigate('/addPlan');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Liste des Plans</h2>
        <Button onClick={handleAdd}>Ajouter un plan</Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Catégorie ID</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>{plan.id}</TableCell>
                <TableCell>{plan.titre}</TableCell>
                <TableCell>{plan.description}</TableCell>
                <TableCell>{plan.prix} MAD</TableCell>
                <TableCell>{plan.duree} jours</TableCell>
                <TableCell>{plan.categorie_id}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="outline" onClick={() => handleEdit(plan.id)}>Modifier</Button>
                  <Button variant="destructive" onClick={() => handleDelete(plan.id)}>Supprimer</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default PlanList;




