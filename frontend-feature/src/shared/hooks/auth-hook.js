import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);
  const [userType, setUserType] = useState(false);
  const [username, setUsername] = useState(false);

  const navigate = useNavigate();

  const login = useCallback((uid, un,  ut, token, expirationDate) => {
    setUserId(uid);
    setUsername(un);
    setUserType(ut);
    setToken(token);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,  
        username: un,
        userType: ut,
        token: token,
        expiration: tokenExpirationDate.toISOString()
      })
    );
  }, []);

  const logout = useCallback(() => {
    setUserId(null);
    setUsername(null);
    setUserType(null);
    setToken(null);
    setTokenExpirationDate(null);
    localStorage.removeItem('userData');
    navigate('/');
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData && 
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.username, storedData.userType, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  return { token, login, logout, userId, username, userType };
};