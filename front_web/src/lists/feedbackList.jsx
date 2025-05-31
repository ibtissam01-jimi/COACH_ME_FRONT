import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createFeedback,
  fetchFeedbacks,
  clearFeedbackMessages
} from '../redux/slices/feedbackSlice';
import {
  Star,
  Send,
  Calendar,
  Clock,
  MessageSquare,
  Loader2
} from 'lucide-react';

export default function FeedbackList() {
  const dispatch = useDispatch();
  const { feedbacks, loading, error, successMessage } = useSelector((state) => state.feedback);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [session, setSession] = useState({
    id: 1,
    coachName: "Hassan Benali",
    date: "20 mai 2025",
    time: "14:00 - 15:00",
    topic: "Développement des compétences managériales"
  });

  useEffect(() => {
  if (feedbacks.length === 0) {
    dispatch(fetchFeedbacks());
  }
  return () => {
    dispatch(clearFeedbackMessages());
  };
}, [dispatch, feedbacks.length]);


  const handleRatingClick = (value) => setRating(value);
  const handleRatingHover = (value) => setHoverRating(value);
  const handleRatingLeave = () => setHoverRating(0);

  const handleSubmit = async () => {
    if (rating === 0 || feedback.trim() === '') return;

    const feedbackData = {
      commentaire: feedback,
      note: rating,
      date_feedback: new Date().toISOString().split('T')[0],
      statut: 'Non Lu'
    };

    const resultAction = await dispatch(createFeedback(feedbackData));

    if (createFeedback.fulfilled.match(resultAction)) {
      setRating(0);
      setFeedback('');
      dispatch(fetchFeedbacks());
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
        Feedbacks de coaching
      </h2>

      {/* Formulaire de soumission */}
      <section className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-12">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">{session.topic}</h3>
       
       
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">Évaluez votre séance</label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                size={28}
                className={`cursor-pointer transition-colors duration-200 ${
                  (hoverRating || rating) >= value
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
                onClick={() => handleRatingClick(value)}
                onMouseEnter={() => handleRatingHover(value)}
                onMouseLeave={handleRatingLeave}
              />
            ))}
          </div>
        </div>

        <textarea
          rows="4"
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Laissez un commentaire..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
        >
          <Send size={18} />
          {loading ? 'Envoi en cours...' : 'Envoyer le feedback'}
        </button>

        {error && <p className="text-red-600 mt-3 text-center">{error.message || error}</p>}
        {successMessage && <p className="text-green-600 mt-3 text-center">{successMessage}</p>}
      </section>

      {/* Liste des feedbacks */}
      <section className="max-w-5xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
          </div>
        ) : feedbacks.length === 0 ? (
          <p className="text-center text-gray-500">Aucun feedback trouvé.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {feedbacks.map((fb) => (
              <div
                key={fb.id}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold text-blue-700">
                      {fb.user?.name || 'Utilisateur inconnu'}
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        fb.statut === 'Lu'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {fb.statut}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <Calendar size={16} className="mr-2" />
                    {new Date(fb.date_feedback).toLocaleDateString()}
                  </div>

                  <div className="flex items-center mb-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        size={22}
                        className={`${
                          fb.note >= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-start text-gray-700 dark:text-gray-800">
                    <MessageSquare className="mr-2 mt-1 text-gray-400" size={18} />
                    <p>{fb.commentaire}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

