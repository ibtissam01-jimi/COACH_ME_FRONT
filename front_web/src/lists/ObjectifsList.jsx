




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
  toggleSousObjectifCompleted,
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
    if(objectifs.length===0){
    dispatch(fetchObjectifs());
    }
  }, [dispatch ,objectifs.length]);

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

  // Tu enlèves objectifs des dépendances pour éviter de relancer si la liste change



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

  // ✅ Correction ici : `dedie_a` au lieu de `userId`
  dispatch(addObjectif({ titre: newObjectiveTitle, dedie_a: selectedUserId }))
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

  const toggleCompleted = (id) => {
    dispatch(toggleSousObjectifCompleted(id));
  };

  const filteredSousObjectifs = (objectifId) => {
    return sousObjectifs.filter((s) => s.objectif_id === objectifId);
  };

  const calculateProgress = (objectifId) => {
    const sous = filteredSousObjectifs(objectifId);
    if (sous.length === 0) return 0;
    const completed = sous.filter((s) => s.completed).length;
    return Math.round((completed / sous.length) * 100);
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
              <div>
                {editingObjective?.id === objectif.id ? (
                  <div className="flex items-center gap-2">
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
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold">{objectif.titre}</h3>
                    <p className="text-sm text-gray-500">{objectif.description}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Progression : {calculateProgress(objectif.id)}%
                    </p>
                    
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => deleteObjective(objectif.id)} title="Supprimer l'objectif">
                  <Trash2 size={20} className="text-red-600" />
                </button>
                <button onClick={() => toggleExpand(objectif.id)} title="Afficher / Cacher sous-objectifs">
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
                    className="flex items-center justify-between border px-3 py-2 rounded dark:border-gray-600"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        onChange={() => toggleCompleted(sub.id)}
                      />
                      <span className={sub.completed ? 'line-through text-gray-400' : ''}>
                        {sub.titre}
                      </span>
                    </div>
                    <button onClick={() => handleDeleteSousObjectif(sub.id)} title="Supprimer le sous-objectif">
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                ))}

                {addingSubObjectiveId === objectif.id ? (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      className="border px-2 py-1 rounded w-full"
                      value={newSubObjectiveTitle}
                      onChange={(e) => setNewSubObjectiveTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSousObjectif(objectif.id)}
                      placeholder="Titre du sous-objectif"
                    />
                    <button
                      onClick={() => handleAddSousObjectif(objectif.id)}
                      className="text-green-600"
                      title="Ajouter sous-objectif"
                    >
                      <CheckCircle2 size={20} />
                    </button>
                    <button
                      onClick={() => setAddingSubObjectiveId(null)}
                      title="Annuler"
                    >
                      <X size={20} className="text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAddingSubObjectiveId(objectif.id);
                      setNewSubObjectiveTitle('');
                    }}
                    className="flex items-center gap-1 text-blue-600 hover:underline mt-2"
                  >
                    <PlusCircle size={18} /> Ajouter un sous-objectif
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


