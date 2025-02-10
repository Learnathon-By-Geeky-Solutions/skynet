import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    // Retrieve user from storage if available
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      console.log('User already stored:', user.username);
      navigate('/');
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const userData = urlParams.get('user');

    if (!userData) {
      console.log('No user data found. Redirecting to login...');
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(decodeURIComponent(userData));
      console.log('Logged in as:', parsedUser.username);

      // Store user data and reload page to reflect changes
      localStorage.setItem('user', JSON.stringify(parsedUser));
      setUser(parsedUser);

      console.log('Redirecting to home...');
      setTimeout(() => {
        navigate(0); // Reload to ensure user data is reflected in Home
      }, 500);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [user, navigate]);

  return <h1>Welcome {user ? user.username : 'User'}!</h1>;
};

export default AuthSuccess;
