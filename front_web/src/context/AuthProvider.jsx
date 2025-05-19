import { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from '../redux/slices/auhSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, token, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check for token in Redux state or localStorage
    const storedToken = token || localStorage.getItem('access_token');
    if (storedToken && !user) {
      dispatch(fetchMe());
    }
  }, [dispatch, token, user]);

  const value = {
    user,
    token,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};