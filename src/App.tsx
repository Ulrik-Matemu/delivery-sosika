import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/signUp';
import SignIn from './pages/signIn';
import Dashboard from './pages/dashboard'; // Create this component
//import { signOut } from 'firebase/auth';
//import { auth } from './services/firebase';
import { Home } from './pages/home';
import Orders from './pages/orders';
import WelcomeScreen from './pages/welcome';



const App: React.FC = () => {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/home" element={<Home /> } />
        <Route path="/orders" element={<Orders />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route path="*" element={<React.Fragment><h2>404 Not Found</h2></React.Fragment>} />
      </Routes>
    </Router>
  );
};

export default App;