import React, { useState } from 'react';
import { Star, Send, MessageSquare, Clock, Calendar } from 'lucide-react';

export default function ClientFeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState([
    {
      id: 1,
      coachName: "Hassan Benali",
      sessionDate: "15 mai 2025",
      rating: 5,
      comment: "Séance très productive qui m'a permis de clarifier mes objectifs professionnels. Hassan a su me poser les bonnes questions pour identifier mes blocages.",
      createdAt: "16 mai 2025"
    },
    {
      id: 2,
      coachName: "Hassan Benali",
      sessionDate: "08 mai 2025",
      rating: 4,
      comment: "Bonne séance de travail sur mes compétences de leadership. J'aurais aimé avoir plus d'exercices pratiques à faire entre les séances.",
      createdAt: "09 mai 2025"
    }
  ]);
  
  const [pastSessions, setPastSessions] = useState([
    {
      id: 3,
      coachName: "Hassan Benali",
      date: "20 mai 2025",
      time: "14:00 - 15:00",
      topic: "Développement des compétences managériales",
      hasSubmittedFeedback: false
    }
  ]);
  
  const handleRatingClick = (value) => {
    setRating(value);
  };
  
  const handleRatingHover = (value) => {
    setHoverRating(value);
  };
  
  const handleSubmit = (sessionId) => {
    if (rating === 0) return;
    
    const session = pastSessions.find(s => s.id === sessionId);
    
    const newFeedback = {
      id: submittedFeedbacks.length + 1,
      coachName: session.coachName,
      sessionDate: session.date,
      rating: rating,
      comment: feedback,
      createdAt: "20 mai 2025"
    };
    
    setSubmittedFeedbacks([newFeedback, ...submittedFeedbacks]);
    
    setPastSessions(pastSessions.map(s => 
      s.id === sessionId ? { ...s, hasSubmittedFeedback: true } : s
    ));
    
    setRating(0);
    setFeedback('');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-blue-900 text-white shadow-md">
        <div className="container mx-auto py-4 px-6">
          <h1 className="text-2xl font-bold">Coach Me</h1>
          <p className="text-blue-200">Espace Client - Feedbacks des séances</p>
        </div>
      </header>
      
      <main className="container mx-auto p-6">
        <h2 className="text-xl font-semibold mb-6">Mes feedbacks de coaching</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-4">Séances récentes</h3>
            
            {pastSessions.map(session => (
              <div key={session.id} className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">{session.topic}</h4>
                    <div className="flex items-center text-gray-600 mt-1">
                      <Calendar size={16} className="mr-1" />
                      <span className="mr-4">{session.date}</span>
                      <Clock size={16} className="mr-1" />
                      <span>{session.time}</span>
                    </div>
                    <p className="text-blue-700 mt-1">Coach: {session.coachName}</p>
                  </div>
                  
                  {session.hasSubmittedFeedback ? (
                    <span className="bg-green-100 text-green-800 text-sm py-1 px-3 rounded-full">
                      Feedback envoyé
                    </span>
                  ) : null}
                </div>
                
                {!session.hasSubmittedFeedback && (
                  <div className="border-t pt-4 mt-4">
                    <h5 className="font-medium mb-2">Évaluez cette séance</h5>
                    
                    <div className="flex items-center mb-4">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          size={24}
                          className={`cursor-pointer ${
                            (rating >= value || hoverRating >= value) 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300"
                          }`}
                          onClick={() => handleRatingClick(value)}
                          onMouseEnter={() => handleRatingHover(value)}
                          onMouseLeave={() => handleRatingHover(0)}
                        />
                      ))}
                      <span className="ml-2 text-gray-600 text-sm">
                        {rating > 0 ? 
                          ["", "Peu satisfait", "Assez satisfait", "Satisfait", "Très satisfait", "Excellent"][rating] 
                          : "Sélectionnez une note"}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Partagez votre expérience et vos suggestions..."
                        className="w-full border border-gray-300 rounded-md p-3 h-24"
                      />
                    </div>
                    
                    <button
                      onClick={() => handleSubmit(session.id)}
                      disabled={rating === 0}
                      className={`flex items-center justify-center px-4 py-2 rounded-md ${
                        rating === 0 
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      <Send size={16} className="mr-2" /> Envoyer mon feedback
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            <h3 className="text-lg font-medium mb-4 mt-8">Historique des feedbacks</h3>
            
            {submittedFeedbacks.length > 0 ? (
              <div className="space-y-4">
                {submittedFeedbacks.map(item => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">Séance avec {item.coachName}</h4>
                        <p className="text-sm text-gray-600">{item.sessionDate}</p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${
                              i < item.rating 
                                ? "text-yellow-400 fill-yellow-400" 
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-start">
                        <MessageSquare size={16} className="mr-2 mt-1 text-gray-500" />
                        <p className="text-gray-700">{item.comment}</p>
                      </div>
                    </div>
                    
                    <div className="text-right mt-2">
                      <span className="text-xs text-gray-500">Envoyé le {item.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                Vous n'avez pas encore soumis de feedback.
              </div>
            )}
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-medium mb-4">Pourquoi donner un feedback ?</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <MessageSquare size={18} className="text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Améliorer votre coaching</h4>
                    <p className="text-sm text-gray-600">
                      Vos retours aident votre coach à adapter son approche à vos besoins.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <Calendar size={18} className="text-purple-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Suivre votre progression</h4>
                    <p className="text-sm text-gray-600">
                      Gardez une trace de votre parcours et de votre évolution.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Star size={18} className="text-green-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Qualité du service</h4>
                    <p className="text-sm text-gray-600">
                      Contribuez à maintenir la haute qualité des services de coaching.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Vos feedbacks sont confidentiels et utilisés uniquement pour améliorer la qualité de nos services de coaching.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}