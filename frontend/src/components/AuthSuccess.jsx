import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/auth/me', {
          credentials: 'include', // Ensures cookies are sent with the request
        });

        if (!response.ok) {
          throw new Error('User not authenticated');
        }

        const userData = await response.json();
        // console.log('Authenticated user:', userData);
        setUser(userData);

        // ✅ Redirect to home page after successful authentication
        setTimeout(() => {
          navigate('/');
        }, 500);
      } catch (error) {
        console.error('Error fetching user:', error);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  return <h1>Welcome {user ? user.username : 'User'}!</h1>;
};

export default AuthSuccess;
