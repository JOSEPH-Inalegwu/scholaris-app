import { supabase } from '../supabaseClient';

/**
 * Fetches user profile data with fallbacks
 * @returns {Object} { username, profilePicture, loading, error }
 */
export const useUserProfile = () => {
  const fetchUserProfile = async () => {
    try {
      // Get authenticated user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('Auth error:', authError?.message || 'User not found');
        return { username: '', profilePicture: null, loading: false, error: authError?.message };
      }

      // Try to fetch profile from database
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username, full_name')
        .eq('id', user.id)
        .single();

      // Handle profile fetch error (ignore if profile doesn't exist)
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError.message);
      }

      // Determine username with fallback priority:
      // 1. Database profile username
      // 2. Database profile full_name
      // 3. Auth metadata full_name
      // 4. Auth metadata username
      // 5. Email prefix
      // 6. 'User'
      let username = '';
      
      if (profile?.username) {
        username = profile.username;
      } else if (profile?.full_name) {
        username = profile.full_name;
      } else if (user.user_metadata?.full_name) {
        username = user.user_metadata.full_name;
      } else if (user.user_metadata?.username) {
        username = user.user_metadata.username;
      } else if (user.email) {
        username = user.email.split('@')[0];
      } else {
        username = 'User';
      }

      // Get profile picture from Google OAuth metadata
      const profilePicture = user.user_metadata?.avatar_url || null;

      console.log('Profile result:', { username, profilePicture, loading: false, error: null });
      return { username, profilePicture, loading: false, error: null };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { username: 'User', profilePicture: null, loading: false, error: error.message };
    }
  };

  return { fetchUserProfile };
};

/**
 * Generates initials from a name
 * @param {string} name - The name to generate initials from
 * @returns {string} - The initials (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'U';
  
  const words = name.trim().split(' ');
  
  if (words.length >= 2) {
    // First letter of first and last name
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  } else {
    // First two letters of single name
    return name.slice(0, 2).toUpperCase();
  }
};