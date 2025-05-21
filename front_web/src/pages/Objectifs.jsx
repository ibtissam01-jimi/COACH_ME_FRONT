import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, ChevronDown, ChevronUp, CheckCircle2, Circle, Edit, Save, X } from 'lucide-react';

export default function CoachObjectivesPage() {
  const [clients, setClients] = useState([
    { id: 1, name: "Sofia Bouhamidi" },
    { id: 2, name: "Karim Alaoui" },
    { id: 3, name: "Leila Bennani" }
  ]);
  
  const [selectedClient, setSelectedClient] = useState(1);
  
  const [objectives, setObjectives] = useState([
    {
      id: 1,
      title: "Améliorer ma santé",
      progress: 66,
      isExpanded: false,
      subObjectives: [
        { id: 101, title: "Faire du sport 3 fois par semaine", completed: true },
        { id: 102, title: "Méditer 10 minutes par jour", completed: false },
        { id: 103, title: "Adopter une alimentation équilibrée", completed: true }
      ]
    },
    {
      id: 2,
      title: "Développer mes compétences professionnelles",
      progress: 33,
      isExpanded: true,
      subObjectives: [
        { id: 201, title: "Lire un livre sur le leadership", completed: true },
        { id: 202, title: "Suivre une formation en ligne", completed: false },
        { id: 203, title: "Participer à un webinaire", completed: false }
      ]
    },
    {
      id: 3,
      title: "Organisation personnelle",
      progress: 100,
      isExpanded: false,
      subObjectives: [
        { id: 301, title: "Créer un système d'organisation de tâches", completed: true },
        { id: 302, title: "Mettre en place un planning hebdomadaire", completed: true },
      ]
    }
  ]);
  
  const [editingObjective, setEditingObjective] = useState(null);
  const [editingSubObjective, setEditingSubObjective] = useState(null);
  const [newObjectiveTitle, setNewObjectiveTitle] = useState("");
  const [newSubObjectiveTitle, setNewSubObjectiveTitle] = useState("");
  const [addingSubObjectiveId, setAddingSubObjectiveId] = useState(null);
  
  // Calculate progress when sub-objectives change
  useEffect(() => {
    const updatedObjectives = objectives.map(obj => {
      if (obj.subObjectives.length === 0) return { ...obj, progress: 0 };
      
      const completedCount = obj.subObjectives.filter(sub => sub.completed).length;
      const progress = Math.round((completedCount / obj.subObjectives.length) * 100);
      
      return { ...obj, progress };
    });
    
    setObjectives(updatedObjectives);
  }, [objectives]);
  
  const toggleExpand = (id) => {
    setObjectives(objectives.map(obj => 
      obj.id === id ? { ...obj, isExpanded: !obj.isExpanded } : obj
    ));
  };
  
  const toggleSubObjective = (objectiveId, subObjectiveId) => {
    setObjectives(objectives.map(obj => 
      obj.id === objectiveId ? {
        ...obj,
        subObjectives: obj.subObjectives.map(sub => 
          sub.id === subObjectiveId ? { ...sub, completed: !sub.completed } : sub
        )
      } : obj
    ));
  };
  
  const addObjective = () => {
    if (newObjectiveTitle.trim() === "") return;
    
    const newId = Math.max(0, ...objectives.map(obj => obj.id)) + 1;
    setObjectives([
      ...objectives,
      {
        id: newId,
        title: newObjectiveTitle,
        progress: 0,
        isExpanded: true,
        subObjectives: []
      }
    ]);
    setNewObjectiveTitle("");
  };
  
  const deleteObjective = (id) => {
    setObjectives(objectives.filter(obj => obj.id !== id));
  };
  
  const startEditing = (id) => {
    const objective = objectives.find(obj => obj.id === id);
    setEditingObjective({ id, title: objective.title });
  };
  
  const saveEditedObjective = () => {
    if (!editingObjective || editingObjective.title.trim() === "") return;
    
    setObjectives(objectives.map(obj => 
      obj.id === editingObjective.id ? { ...obj, title: editingObjective.title } : obj
    ));
    setEditingObjective(null);
  };
  
  const startEditingSubObjective = (objectiveId, subObjectiveId) => {
    const objective = objectives.find(obj => obj.id === objectiveId);
    const subObjective = objective.subObjectives.find(sub => sub.id === subObjectiveId);
    setEditingSubObjective({ objectiveId, subObjectiveId, title: subObjective.title });
  };
  
  const saveEditedSubObjective = () => {
    if (!editingSubObjective || editingSubObjective.title.trim() === "") return;
    
    setObjectives(objectives.map(obj => 
      obj.id === editingSubObjective.objectiveId ? {
        ...obj,
        subObjectives: obj.subObjectives.map(sub => 
          sub.id === editingSubObjective.subObjectiveId ? { ...sub, title: editingSubObjective.title } : sub
        )
      } : obj
    ));
    setEditingSubObjective(null);
  };
  
  const addSubObjective = (objectiveId) => {
    if (newSubObjectiveTitle.trim() === "") return;
    
    setObjectives(objectives.map(obj => {
      if (obj.id === objectiveId) {
        const newSubId = Math.max(0, ...obj.subObjectives.map(sub => sub.id)) + 1;
        return {
          ...obj,
          subObjectives: [
            ...obj.subObjectives,
            { id: newSubId, title: newSubObjectiveTitle, completed: false }
          ]
        };
      }
      return obj;
    }));
    
    setNewSubObjectiveTitle("");
    setAddingSubObjectiveId(null);
  };
  
  const deleteSubObjective = (objectiveId, subObjectiveId) => {
    setObjectives(objectives.map(obj => 
      obj.id === objectiveId ? {
        ...obj,
        subObjectives: obj.subObjectives.filter(sub => sub.id !== subObjectiveId)
      } : obj
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-blue-900 text-white shadow-md">
        <div className="container mx-auto py-4 px-6">
          <h1 className="text-2xl font-bold">Coach Me</h1>
          <p className="text-blue-200">Espace Coach - Gestion des Objectifs</p>
        </div>
      </header>
      
      <main className="container mx-auto p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-1">Gestion des Objectifs</h2>
            <div className="flex items-center">
              <label htmlFor="client-select" className="mr-2 font-medium">Client:</label>
              <select 
                id="client-select"
                value={selectedClient}
                onChange={(e) => setSelectedClient(Number(e.target.value))}
                className="border border-gray-300 rounded px-3 py-1"
              >
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="text"
              value={newObjectiveTitle}
              onChange={(e) => setNewObjectiveTitle(e.target.value)}
              placeholder="Nouvel objectif"
              className="border border-gray-300 rounded px-3 py-2 mr-2"
            />
            <button 
              onClick={addObjective}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
            >
              <PlusCircle size={18} className="mr-1" /> Ajouter
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {objectives.map(objective => (
            <div 
              key={objective.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="px-6 py-4 flex items-center justify-between bg-gray-50 border-b">
                <div className="flex items-center flex-grow">
                  <button 
                    onClick={() => toggleExpand(objective.id)}
                    className="mr-2 text-gray-500 hover:bg-gray-200 rounded-full p-1"
                  >
                    {objective.isExpanded ? 
                      <ChevronUp size={20} /> : 
                      <ChevronDown size={20} />
                    }
                  </button>
                  
                  {editingObjective && editingObjective.id === objective.id ? (
                    <div className="flex-grow flex items-center">
                      <input
                        type="text"
                        value={editingObjective.title}
                        onChange={(e) => setEditingObjective({...editingObjective, title: e.target.value})}
                        className="border border-gray-300 rounded px-2 py-1 flex-grow"
                        autoFocus
                      />
                      <button 
                        onClick={saveEditedObjective}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <Save size={18} />
                      </button>
                      <button 
                        onClick={() => setEditingObjective(null)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex-grow flex items-center">
                      <h3 className="font-medium text-lg">{objective.title}</h3>
                      <button 
                        onClick={() => startEditing(objective.id)}
                        className="ml-2 text-gray-500 hover:text-blue-600"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-4">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${objective.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{objective.progress}%</span>
                  <button 
                    onClick={() => deleteObjective(objective.id)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              {objective.isExpanded && (
                <div className="p-6">
                  <ul className="space-y-3">
                    {objective.subObjectives.map(subObj => (
                      <li key={subObj.id} className="flex items-center justify-between">
                        <div className="flex items-center flex-grow">
                          <button 
                            onClick={() => toggleSubObjective(objective.id, subObj.id)}
                            className="mr-2 text-gray-500 hover:text-blue-600"
                          >
                            {subObj.completed ? 
                              <CheckCircle2 className="text-green-600" size={18} /> : 
                              <Circle size={18} />
                            }
                          </button>
                          
                          {editingSubObjective && 
                           editingSubObjective.objectiveId === objective.id && 
                           editingSubObjective.subObjectiveId === subObj.id ? (
                            <div className="flex-grow flex items-center">
                              <input
                                type="text"
                                value={editingSubObjective.title}
                                onChange={(e) => setEditingSubObjective({
                                  ...editingSubObjective, 
                                  title: e.target.value
                                })}
                                className="border border-gray-300 rounded px-2 py-1 flex-grow"
                                autoFocus
                              />
                              <button 
                                onClick={saveEditedSubObjective}
                                className="ml-2 text-green-600 hover:text-green-800"
                              >
                                <Save size={16} />
                              </button>
                              <button 
                                onClick={() => setEditingSubObjective(null)}
                                className="ml-2 text-red-600 hover:text-red-800"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex-grow flex items-center">
                              <span className={`${subObj.completed ? 'line-through text-gray-500' : ''}`}>
                                {subObj.title}
                              </span>
                              <button 
                                onClick={() => startEditingSubObjective(objective.id, subObj.id)}
                                className="ml-2 text-gray-400 hover:text-blue-600"
                              >
                                <Edit size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <button 
                          onClick={() => deleteSubObjective(objective.id, subObj.id)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  
                  {addingSubObjectiveId === objective.id ? (
                    <div className="mt-4 flex items-center">
                      <input
                        type="text"
                        value={newSubObjectiveTitle}
                        onChange={(e) => setNewSubObjectiveTitle(e.target.value)}
                        placeholder="Nouveau sous-objectif"
                        className="border border-gray-300 rounded px-3 py-1 flex-grow mr-2"
                        autoFocus
                      />
                      <button 
                        onClick={() => addSubObjective(objective.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Ajouter
                      </button>
                      <button 
                        onClick={() => setAddingSubObjectiveId(null)}
                        className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded text-sm"
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setAddingSubObjectiveId(objective.id)}
                      className="mt-4 text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    >
                      <PlusCircle size={16} className="mr-1" /> Ajouter un sous-objectif
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}