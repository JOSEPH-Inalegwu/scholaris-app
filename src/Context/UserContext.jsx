import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      setUserName(profile?.username || user.user_metadata?.username || '');
      setLoading(false);
    })();
  }, []);

  return (
    <UserContext.Provider value={{ userName, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
