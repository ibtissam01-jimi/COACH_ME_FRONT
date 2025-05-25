import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, resetState } from '../redux/slices/authSlice';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams(); // Assurez-vous que la route contient :token
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPassword({ token, password, password_confirmation }));
  };

  if (isSuccess) {
    setTimeout(() => {
      dispatch(resetState());
      navigate('/login');
    }, 3000);
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-semibold mb-4">Réinitialiser le mot de passe</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={password_confirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          {isLoading ? 'Réinitialisation...' : 'Réinitialiser'}
        </button>
        {(isError || isSuccess) && (
          <p className={isError ? 'text-red-500' : 'text-green-500'}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
