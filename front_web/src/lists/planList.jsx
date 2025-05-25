

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlans, deletePlans } from '@/redux/slices/planSlice';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Loader2, Plus, Edit, Trash } from "lucide-react";

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

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce plan ?')) {
      dispatch(deletePlans({ id }));
    }
  };

  const handleAdd = () => {
    navigate('/addPlan');
  };

  return (
    <div className="flex min-h-screen w-full ml-32 bg-slate-50">
      <Sidebar />
      <main className="flex-1 w-full px-0 py-10">
        <div className="w-full max-w-full mx-auto">
          <div className="flex justify-between items-center mb-8 px-8">
            <h1 className="text-3xl font-bold text-slate-800">Plans</h1>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow"
              onClick={handleAdd}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un plan
            </Button>
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
                    <TableHead>Catégorie ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan, index) => (
                    <TableRow
                      key={plan.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50 hover:bg-blue-50 transition'}
                    >
                      <TableCell className="font-semibold text-slate-800">{plan.id}</TableCell>
                      <TableCell className="text-slate-700">{plan.titre}</TableCell>
                      <TableCell className="text-slate-700">{plan.description}</TableCell>
                      <TableCell className="text-slate-700">{plan.prix} MAD</TableCell>
                      <TableCell className="text-slate-700">{plan.duree} jours</TableCell>
                      <TableCell className="text-slate-700">{plan.categorie_id}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(plan.id)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(plan.id)}>
                            <Trash className="w-4 h-4 mr-2" />
                            Supprimer
                          </Button>
                        </div>
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

export default PlanList;
