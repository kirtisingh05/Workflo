import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../hooks/useAuth";
import { signInWithPopup, browserPopupRedirectResolver } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import { googleAuth } from "../services/auth";

export const GoogleSignInButton = ({ className = "", onSuccess }) => {
  const { loading, saveUserInfo } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      // Configure popup settings
      googleProvider.setCustomParameters({
        prompt: 'select_account',
        redirect_uri: window.location.origin
      });
      
      const result = await signInWithPopup(
        auth, 
        googleProvider,
        browserPopupRedirectResolver
      );
      
      const { email, displayName, photoURL } = result.user;
      
      await googleAuth({ 
        email,
        name: displayName || email.split('@')[0],
        photo: photoURL
      });
      
      await saveUserInfo();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Popup closed by user');
        return;
      }
      console.error("Google sign in failed:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className={`group relative w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
        <FcGoogle className="h-5 w-5" />
      </span>
      {loading ? (
        <div className="flex items-center">
          <div className="w-5 h-5 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin mr-2"></div>
          Signing in...
        </div>
      ) : (
        "Sign in with Google"
      )}
    </button>
  );
};
