// import React, { useEffect, useState } from 'react'; 
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   fetchObjectifs,
//   addObjectif,
//   deleteObjectif,
//   updateObjectif
// } from '../redux/slices/objectifSlice';

// import api from '../redux/api'; // instance axios
// import {
//   PlusCircle,
//   Trash2,
//   ChevronDown,
//   ChevronUp,
//   Edit,
//   Save,
//   X,
//   CheckCircle2,
// } from 'lucide-react';

// const ObjectifsList = () => {
//   const dispatch = useDispatch();
//   const { data: objectifs = [], status, error } = useSelector(state => state.objectifs || {});
//   const loading = status === 'loading';

//   const [users, setUsers] = useState([]);
//   const [selectedUserId, setSelectedUserId] = useState('');
//   const [newObjectiveTitle, setNewObjectiveTitle] = useState('');
  
//   const [sousObjectifsMap, setSousObjectifsMap] = useState({});
//   const [expandedObjectifs, setExpandedObjectifs] = useState({});
//   const [editingObjective, setEditingObjective] = useState(null);
//   const [newSubObjectiveTitle, setNewSubObjectiveTitle] = useState('');
//   const [addingSubObjectiveId, setAddingSubObjectiveId] = useState(null);

//   // Charger objectifs
//   useEffect(() => {
//     dispatch(fetchObjectifs());
//   }, [dispatch]);

//   // Charger users depuis API
//   useEffect(() => {
//     api.get('/allUsers')
//       .then(res => setUsers(res.data))
//       .catch(() => setUsers([]));
//   }, []);

//   // Charger sous-objectifs
//   useEffect(() => {
//     objectifs.forEach(obj => {
//       if (!sousObjectifsMap[obj.id]) {
//         api.get(`/sous-objectifs?objectif_id=${obj.id}`)
//           .then(res => {
//             setSousObjectifsMap(prev => ({ ...prev, [obj.id]: res.data }));
//           })
//           .catch(() => {
//             setSousObjectifsMap(prev => ({ ...prev, [obj.id]: [] }));
//           });
//       }
//     });
//   }, [objectifs]);

//   // Toggle expand objectif
//   const toggleExpand = (id) => {
//     setExpandedObjectifs(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   // Commencer édition objectif
//   const startEditingObjective = (objectif) => {
//     setEditingObjective({ id: objectif.id, titre: objectif.titre });
//   };

//   // Sauvegarder édition objectif
//   const saveEditedObjective = () => {
//     if (!editingObjective || editingObjective.titre.trim() === '') return;

//     dispatch(updateObjectif({ id: editingObjective.id, updatedData: { titre: editingObjective.titre } }))
//       .unwrap()
//       .then(() => setEditingObjective(null))
//       .catch(err => alert('Erreur lors de la mise à jour : ' + err));
//   };

//   // Supprimer objectif
//   const deleteObjective = (id) => {
//     dispatch(deleteObjectif(id))
//       .unwrap()
//       .catch(err => alert('Erreur lors de la suppression : ' + err));
//   };

//   // Ajouter un nouvel objectif avec user sélectionné
//   const handleAddObjective = () => {
//     if (newObjectiveTitle.trim() === '') {
//       alert("Le titre de l'objectif est obligatoire");
//       return;
//     }
//     if (!selectedUserId) {
//       alert("Veuillez sélectionner un utilisateur");
//       return;
//     }
//     // Dispatch avec userId pour assigner l'objectif
//     dispatch(addObjectif({ titre: newObjectiveTitle, userId: selectedUserId }))
//       .unwrap()
//       .then(() => {
//         setNewObjectiveTitle('');
//         setSelectedUserId('');
//       })
//       .catch(err => alert('Erreur lors de l\'ajout : ' + err));
//   };

//   // Toggle complétion sous-objectif
//   const toggleSubObjectiveCompleted = (objectifId, subId) => {
//     setSousObjectifsMap(prev => {
//       const newSubObjs = prev[objectifId].map(sub => 
//         sub.id === subId ? { ...sub, completed: !sub.completed } : sub
//       );
//       return { ...prev, [objectifId]: newSubObjs };
//     });
//   };

//   // Ajouter sous-objectif local
//   const addSubObjective = (objectifId) => {
//     if (newSubObjectiveTitle.trim() === '') return;
//     setSousObjectifsMap(prev => {
//       const newId = prev[objectifId].length > 0 ? Math.max(...prev[objectifId].map(s => s.id)) + 1 : 1;
//       const newSubObj = { id: newId, titre: newSubObjectiveTitle, completed: false };
//       return { ...prev, [objectifId]: [...prev[objectifId], newSubObj] };
//     });
//     setNewSubObjectiveTitle('');
//     setAddingSubObjectiveId(null);
//   };

//   // Supprimer sous-objectif local
//   const deleteSubObjective = (objectifId, subId) => {
//     setSousObjectifsMap(prev => {
//       const filtered = prev[objectifId].filter(sub => sub.id !== subId);
//       return { ...prev, [objectifId]: filtered };
//     });
//   };

//   if (loading) return <p>Chargement des objectifs...</p>;
//   if (error) return <p>Erreur : {error}</p>;

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900 p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-6">Liste des Objectifs</h2>

//       <div className="mb-6 flex items-center gap-3">
//         {/* Select utilisateur */}
//         <select
//           value={selectedUserId}
//           onChange={e => setSelectedUserId(e.target.value)}
//           className="border border-gray-300 rounded px-3 py-2"
//         >
//           <option value="">-- Sélectionner un utilisateur --</option>
//           {users.map(user => (
//             <option key={user.id} value={user.id}>{user.nom}</option>
//           ))}
//         </select>

//         <input
//           type="text"
//           className="border border-gray-300 rounded px-3 py-2 flex-grow"
//           placeholder="Ajouter un nouvel objectif"
//           value={newObjectiveTitle}
//           onChange={e => setNewObjectiveTitle(e.target.value)}
//           onKeyDown={e => e.key === 'Enter' && handleAddObjective()}
//         />
//         <button
//           onClick={handleAddObjective}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
//         >
//           <PlusCircle size={20} className="mr-1" /> Ajouter
//         </button>
//       </div>

//       {(!objectifs || objectifs.length === 0) && <p>Aucun objectif trouvé.</p>}

//       <div className="space-y-4">
//         {objectifs.map(objectif => (
//           <div key={objectif.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b">
//               <div className="flex items-center gap-3">
//                 {editingObjective?.id === objectif.id ? (
//                   <>
//                     <input
//                       type="text"
//                       className="border border-gray-300 rounded px-2 py-1"
//                       value={editingObjective.titre}
//                       onChange={e =>
//                         setEditingObjective(prev => ({ ...prev, titre: e.target.value }))
//                       }
//                     />
//                     <button
//                       onClick={saveEditedObjective}
//                       className="text-green-600 hover:text-green-800"
//                       title="Enregistrer"
//                     >
//                       <Save size={20} />
//                     </button>
//                     <button
//                       onClick={() => setEditingObjective(null)}
//                       className="text-red-600 hover:text-red-800"
//                       title="Annuler"
//                     >
//                       <X size={20} />
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <h3 className="text-lg font-semibold">{objectif.titre}</h3>
//                     <button
//                       onClick={() => startEditingObjective(objectif)}
//                       className="text-yellow-600 hover:text-yellow-800"
//                       title="Modifier"
//                     >
//                       <Edit size={20} />
//                     </button>
//                   </>
//                 )}
//               </div>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => toggleExpand(objectif.id)}
//                   className="text-gray-600 hover:text-gray-900"
//                   title={expandedObjectifs[objectif.id] ? 'Réduire' : 'Développer'}
//                 >
//                   {expandedObjectifs[objectif.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                 </button>

//                 <button
//                   onClick={() => deleteObjective(objectif.id)}
//                   className="text-red-600 hover:text-red-800"
//                   title="Supprimer"
//                 >
//                   <Trash2 size={20} />
//                 </button>
//               </div>
//             </div>

//             {expandedObjectifs[objectif.id] && (
//               <div className="px-6 py-4 bg-gray-50">
//                 <h4 className="font-semibold mb-2">Sous-objectifs :</h4>

//                 <ul className="space-y-2 mb-4">
//                   {(sousObjectifsMap[objectif.id] || []).map(sub => (
//                     <li key={sub.id} className="flex items-center justify-between bg-white border rounded px-3 py-2">
//                       <label className="flex items-center gap-2 cursor-pointer flex-grow">
//                         <input
//                           type="checkbox"
//                           checked={sub.completed}
//                           onChange={() => toggleSubObjectiveCompleted(objectif.id, sub.id)}
//                         />
//                         <span className={sub.completed ? 'line-through text-gray-500' : ''}>{sub.titre}</span>
//                       </label>
//                       <button
//                         onClick={() => deleteSubObjective(objectif.id, sub.id)}
//                         className="text-red-600 hover:text-red-800"
//                         title="Supprimer sous-objectif"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </li>
//                   ))}
//                 </ul>

//                 {addingSubObjectiveId === objectif.id ? (
//                   <div className="flex gap-2 items-center">
//                     <input
//                       type="text"
//                       placeholder="Nouveau sous-objectif"
//                       className="border border-gray-300 rounded px-3 py-1 flex-grow"
//                       value={newSubObjectiveTitle}
//                       onChange={e => setNewSubObjectiveTitle(e.target.value)}
//                       onKeyDown={e => e.key === 'Enter' && addSubObjective(objectif.id)}
//                     />
//                     <button
//                       onClick={() => addSubObjective(objectif.id)}
//                       className="text-green-600 hover:text-green-800"
//                       title="Ajouter sous-objectif"
//                     >
//                       <CheckCircle2 size={24} />
//                     </button>
//                     <button
//                       onClick={() => setAddingSubObjectiveId(null)}
//                       className="text-red-600 hover:text-red-800"
//                       title="Annuler"
//                     >
//                       <X size={24} />
//                     </button>
//                   </div>
//                 ) : (
//                   <button
//                     onClick={() => setAddingSubObjectiveId(objectif.id)}
//                     className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
//                   >
//                     <PlusCircle size={18} /> Ajouter un sous-objectif
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ObjectifsList;









import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchObjectifs,
  addObjectif,
  deleteObjectif,
  updateObjectif,
} from '../redux/slices/objectifSlice';
import {
  fetchSousObjectifs,
  addSousObjectif,
  deleteSousObjectif,
  updateSousObjectif,
} from '../redux/slices/sousObjectifSlice';
import api from '../redux/api';

import {
  PlusCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  Edit,
  Save,
  X,
  CheckCircle2,
} from 'lucide-react';

const ObjectifsList = () => {
  const dispatch = useDispatch();

  const { data: objectifs = [], status, error } = useSelector((state) => state.objectifs || {});
  const { data: sousObjectifs = [] } = useSelector((state) => state.sousObjectifs || {});

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newObjectiveTitle, setNewObjectiveTitle] = useState('');
  const [expandedObjectifs, setExpandedObjectifs] = useState({});
  const [editingObjective, setEditingObjective] = useState(null);
  const [newSubObjectiveTitle, setNewSubObjectiveTitle] = useState('');
  const [addingSubObjectiveId, setAddingSubObjectiveId] = useState(null);

  useEffect(() => {
    dispatch(fetchObjectifs());
  }, [dispatch]);

  useEffect(() => {
    api.get('/allUsers')
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  useEffect(() => {
    objectifs.forEach((obj) => {
      dispatch(fetchSousObjectifs(obj.id));
    });
  }, [dispatch, objectifs]);

  const toggleExpand = (id) => {
    setExpandedObjectifs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const startEditingObjective = (objectif) => {
    setEditingObjective({ id: objectif.id, titre: objectif.titre });
  };

  const saveEditedObjective = () => {
    if (!editingObjective || editingObjective.titre.trim() === '') return;
    dispatch(updateObjectif({ id: editingObjective.id, updatedData: { titre: editingObjective.titre } }))
      .unwrap()
      .then(() => setEditingObjective(null))
      .catch((err) => alert('Erreur lors de la mise à jour : ' + err));
  };

  const deleteObjective = (id) => {
    dispatch(deleteObjectif(id))
      .unwrap()
      .catch((err) => alert('Erreur lors de la suppression : ' + err));
  };

  const handleAddObjective = () => {
    if (newObjectiveTitle.trim() === '') {
      alert("Le titre de l'objectif est obligatoire");
      return;
    }
    if (!selectedUserId) {
      alert("Veuillez sélectionner un utilisateur");
      return;
    }
    dispatch(addObjectif({ titre: newObjectiveTitle, userId: selectedUserId }))
      .unwrap()
      .then(() => {
        setNewObjectiveTitle('');
        setSelectedUserId('');
      })
      .catch((err) => alert('Erreur lors de l\'ajout : ' + err));
  };

  const handleAddSousObjectif = (objectifId) => {
    if (!newSubObjectiveTitle.trim()) return;
    dispatch(addSousObjectif({ titre: newSubObjectiveTitle, objectif_id: objectifId }))
      .unwrap()
      .then(() => {
        setNewSubObjectiveTitle('');
        setAddingSubObjectiveId(null);
      })
      .catch((err) => alert('Erreur lors de l\'ajout : ' + err));
  };

  const handleDeleteSousObjectif = (id) => {
    dispatch(deleteSousObjectif(id))
      .unwrap()
      .catch((err) => alert('Erreur lors de la suppression : ' + err));
  };

  const filteredSousObjectifs = (objectifId) => {
    return sousObjectifs.filter((s) => s.objectif_id === objectifId);
  };

  if (status === 'loading') return <p>Chargement des objectifs...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Liste des Objectifs</h2>

      <div className="mb-6 flex items-center gap-3">
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">-- Sélectionner un utilisateur --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.nom}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="border border-gray-300 rounded px-3 py-2 flex-grow"
          placeholder="Ajouter un nouvel objectif"
          value={newObjectiveTitle}
          onChange={(e) => setNewObjectiveTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddObjective()}
        />
        <button
          onClick={handleAddObjective}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
        >
          <PlusCircle size={20} className="mr-1" /> Ajouter
        </button>
      </div>

      <div className="space-y-4">
        {objectifs.map((objectif) => (
          <div key={objectif.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b">
              <div className="flex items-center gap-3">
                {editingObjective?.id === objectif.id ? (
                  <>
                    <input
                      type="text"
                      className="border border-gray-300 rounded px-2 py-1"
                      value={editingObjective.titre}
                      onChange={(e) =>
                        setEditingObjective({ ...editingObjective, titre: e.target.value })
                      }
                    />
                    <button onClick={saveEditedObjective}>
                      <Save size={20} className="text-green-600" />
                    </button>
                    <button onClick={() => setEditingObjective(null)}>
                      <X size={20} className="text-red-600" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-lg font-medium">{objectif.titre}</span>
                    <button onClick={() => startEditingObjective(objectif)}>
                      <Edit size={20} className="text-gray-600" />
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => deleteObjective(objectif.id)}>
                  <Trash2 size={20} className="text-red-600" />
                </button>
                <button onClick={() => toggleExpand(objectif.id)}>
                  {expandedObjectifs[objectif.id] ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>
            </div>

            {expandedObjectifs[objectif.id] && (
              <div className="p-4 space-y-2">
                {filteredSousObjectifs(objectif.id).map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between border px-3 py-2 rounded"
                  >
                    <span className={sub.completed ? 'line-through text-gray-500' : ''}>
                      {sub.titre}
                    </span>
                    <button onClick={() => handleDeleteSousObjectif(sub.id)}>
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                ))}

                {addingSubObjectiveId === objectif.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="border px-2 py-1 rounded w-full"
                      value={newSubObjectiveTitle}
                      onChange={(e) => setNewSubObjectiveTitle(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleAddSousObjectif(objectif.id)
                      }
                    />
                    <button
                      onClick={() => handleAddSousObjectif(objectif.id)}
                      className="text-green-600"
                    >
                      <CheckCircle2 size={20} />
                    </button>
                    <button onClick={() => setAddingSubObjectiveId(null)}>
                      <X size={20} className="text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingSubObjectiveId(objectif.id)}
                    className="text-blue-600 text-sm"
                  >
                    + Ajouter un sous-objectif
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObjectifsList;

