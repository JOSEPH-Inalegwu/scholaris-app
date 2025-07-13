// src/Hooks/logout.js
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';

export const handleLogoutLogic = async (navigate) => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    toast.error('❌ Failed to log out');
  } else {
    toast.success('🚪 Logged out successfully');
    navigate('/');
  }
};
