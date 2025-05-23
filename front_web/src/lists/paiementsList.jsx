// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchPaiements, deletePaiement } from '@/redux/slices/paiementsSlice';
// import { useNavigate } from 'react-router-dom';
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Loader2 } from "lucide-react";
// import Sidebar from '../sidebar/sidebar';

// const PaiementsList = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { items: paiements, loading } = useSelector((state) => state.paiement);

//   useEffect(() => {
//     dispatch(fetchPaiements());
//   }, [dispatch]);
 
//   const handleDelete = (id) => {
//   if (window.confirm('Voulez-vous vraiment supprimer ce paiement ?')) {
//     console.log("Deleting paiement with id:", id); // debug
//     dispatch(deletePaiement(id));
//   }
// };

// const handleEdit = (id) => {
//   navigate(`/editPaiement/${id}`);
// };



//   const handleAdd = () => {
//     navigate('/addPaiement');
//   };

//   return (
//     <div className="p-6 max-w-screen-xl mx-auto w-full">
//       <Sidebar />
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-semibold">Liste des Paiements</h2>
//         <Button onClick={handleAdd}>Ajouter un paiement</Button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center py-10">
//           <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
//         </div>
//       ) : (
//         <Table className="w-full">
//           <TableHeader>
//             <TableRow>
//               <TableHead>ID</TableHead>
//               <TableHead>Montant</TableHead>
//               <TableHead>Date</TableHead>
//               <TableHead>Méthode</TableHead>
//               <TableHead>Statut</TableHead>
//               <TableHead>Abonnement</TableHead>
//               <TableHead>Ressource</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {paiements && paiements.map((paiement) => (
//               <TableRow key={paiement.id}>
//                 <TableCell>{paiement.id}</TableCell>
//                 <TableCell>{paiement.montant} MAD</TableCell>
//                 <TableCell>{paiement.date_paiement}</TableCell>
//                 <TableCell>{paiement.methode}</TableCell>
//                 <TableCell>{paiement.statut}</TableCell>
//                 <TableCell>{paiement.abonnement_id ?? 'N/A'}</TableCell>
//                 <TableCell>{paiement.ressource_id ?? 'N/A'}</TableCell>
//                 <TableCell className="flex gap-2">
//                   <Button variant="destructive" onClick={() => handleDelete(paiement.id)}>
//                     Supprimer
//                   </Button>
//                   <Button variant="destructive" onClick={() => handleEdit(paiement.id)}>
//                     Modifier
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//     </div>
//   );
// };

// export default PaiementsList;









import React, { useEffect } from 'react';
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

const PaiementsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: paiements, loading } = useSelector((state) => state.paiement);

  useEffect(() => {
    dispatch(fetchPaiements());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce paiement ?')) {
      dispatch(deletePaiement(id));
    }
  };

  const handleEdit = (id) => {
    navigate(`/editPaiement/${id}`);
  };

  const handleAdd = () => {
    navigate('/addPaiement');
  };

  return (
    <div className="flex min-h-screen w-full ml-32 bg-slate-50">
      <Sidebar />
      <main className="flex-1 w-full px-0 py-10">
        <div className="w-full max-w-full mx-auto">
          <div className="flex justify-between items-center mb-8 px-8">
            <h1 className="text-3xl font-bold text-slate-800">Paiements</h1>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow"
              onClick={handleAdd}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un paiement
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
                  {paiements.map((paiement) => (
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
                          paiement.statut === 'Payé'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {paiement.statut}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-700">{paiement.abonnement_id ?? 'N/A'}</TableCell>
                      <TableCell className="text-slate-700">{paiement.ressource_id ?? 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(paiement.id)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(paiement.id)}
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
          )}
        </div>
      </main>
    </div>
  );
};

export default PaiementsList;
