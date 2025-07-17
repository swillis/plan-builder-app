import React from "react";
import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Login: React.FC = () => {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // User is now signed in, will be redirected by parent component
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Login failed: " + error.message);
      } else {
        alert("Login failed: Unknown error");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6">Sign in to Plan Builder</h1>
        <button
          onClick={handleGoogleLogin}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center"
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 48 48">
            <g>
              <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.13 2.36 30.45 0 24 0 14.82 0 6.73 5.8 2.69 14.09l7.98 6.2C12.13 13.36 17.62 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.36 46.1 24.55z"/>
              <path fill="#FBBC05" d="M10.67 28.29c-1.13-3.36-1.13-6.97 0-10.33l-7.98-6.2C.7 16.36 0 20.09 0 24c0 3.91.7 7.64 2.69 12.24l7.98-6.2z"/>
              <path fill="#EA4335" d="M24 48c6.45 0 12.13-2.13 16.19-5.81l-7.19-5.6c-2.01 1.35-4.59 2.16-9 2.16-6.38 0-11.87-3.86-13.33-9.29l-7.98 6.2C6.73 42.2 14.82 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </g>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
