import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from 'react-icons/fa';
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
} from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import FarmerLogo from '../assets/farmer.png';
import Klogo from '../assets/KisanLogo.png';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [createUserWithEmailAndPassword, , loadingCreate, errorCreate] =
    useCreateUserWithEmailAndPassword(auth);
  const [signInWithEmailAndPassword, , loadingLogin, errorLogin] =
    useSignInWithEmailAndPassword(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignup) {
        const res = await createUserWithEmailAndPassword(email, password);
        if (res?.user) {
          await addDoc(collection(db, 'users'), {
            uid: res.user.uid,
            name,
            email,
            authProvider: 'local',
          });
          localStorage.setItem('user', JSON.stringify(res.user));
          toast.success('Signed up successfully');
          navigate('/vendor-portal');
        }
      } else {
        const res = await signInWithEmailAndPassword(email, password);
        if (res?.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
          toast.success('Logged in successfully');
          navigate('/vendor-portal');
        }
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    }
  };

  useEffect(() => {
    if (errorCreate || errorLogin) {
      toast.error((errorCreate || errorLogin)?.message);
    }
  }, [errorCreate, errorLogin]);

  const loading = loadingCreate || loadingLogin;

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4 py-8 font-inria">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-6xl md:max-w-3xl overflow-hidden flex flex-col md:flex-row scale-100 md:scale-[0.95] transition-transform duration-300">
        {/* Left: Auth Form */}
        <div className="md:w-1/2 w-full p-8 sm:p-10 md:p-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-17 h-14 bg-green-600 rounded-md flex items-center justify-center">
              <img src={Klogo} alt="Kisan-Logo" className="h-10 w-auto" />
            </div>
            <h1 className="text-2xl font-bold text-green-700">Kisan-e-Mandi</h1>
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-xl font-bold text-gray-800 mb-2">
            {isSignup ? 'Sign Up' : 'Hello Farmer !!!'}
          </h2>
          <p className="mt-5 text-gray-600 mb-6 text-base md:text-sm">
            {isSignup
              ? 'Create your account to become a vendor.'
              : 'Welcome back! Sign in to your account.'}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-12 space-y-5">
            {isSignup && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 sm:py-2 text-base sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            )}

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-xs" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 sm:py-2 text-base sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-xs" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 sm:py-2 text-base sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm sm:text-xs"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 sm:py-2 text-base sm:text-sm rounded-lg font-semibold transition-all duration-200"
            >
              {loading
                ? 'Processing...'
                : isSignup
                ? 'Create Account'
                : 'Sign In'}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-sm text-center text-gray-600 mt-4">
            {isSignup ? 'Already have an account?' : 'New here?'}{' '}
            <span
              className="text-green-600 font-medium cursor-pointer hover:underline"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </span>
          </p>
        </div>

        {/* Right: Image Column */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-green-100 p-6">
          <img
            src={FarmerLogo}
            alt="Farmer Illustration"
            className="max-h-[450px] object-contain drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;





