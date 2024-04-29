import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import { redirect } from 'react-router-dom';
import ProtectedRoute from './Components/Protectected route/ProtectedRoute';
import Landing from './Pages/Landing';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Generator from './Pages/Generator';
import Settings from './Pages/Settings';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function App() {
  const [isAuthenticated, setState] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);
  const [convoId, setConvoId] = React.useState(null);
  const [twitterInfo, setTwitterInfo] = React.useState(null);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
        const newMode = !prevMode;
        if (newMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        console.log(newMode);
        return newMode;
    });
}

  const wrapPrivateRoute = (element, user, redirect) => {
    return (
      <ProtectedRoute user={user} redirect={redirect}>
        {element}
      </ProtectedRoute>
    );
  };

  //gets login state based on session key stored locally, happens evertime on component load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setState(true);
    }
    else {
      setState(false);
      redirect('/login');
    }
  }, [isAuthenticated]);

  const login = () => {
    setState(true);
  };

  const logout = () => {
    const response = axios({
      method: 'post',
      url: 'http://127.0.0.1:8001/api/logout/',

    });
    setState(false);
    redirect('/login');
    localStorage.removeItem('token');
    
  };

  //router for page based navigation, state variable passing into other components here as well
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Landing setDarkMode={toggleDarkMode} darkMode={darkMode} logout={logout}/>} />
          <Route path="/settings" exact element={wrapPrivateRoute(<Settings setDarkMode={toggleDarkMode} darkMode={darkMode} logout={logout} setTwitterInfo={setTwitterInfo} twitterInfo={twitterInfo}/>, isAuthenticated, '/home')} />
          <Route path="/home" exact element={wrapPrivateRoute(<Home setDarkMode={toggleDarkMode} darkMode={darkMode} setConvoId={setConvoId} convoId={convoId} logout={logout} setTwitterInfo={setTwitterInfo} twitterInfo={twitterInfo}/>, isAuthenticated, '/home')} />
          <Route path="/generator/:convo_id" exact element={wrapPrivateRoute(<Generator setDarkMode={toggleDarkMode} darkMode={darkMode} logout={logout} setTwitterInfo={setTwitterInfo} twitterInfo={twitterInfo}/>, isAuthenticated, '/generator')} />
          <Route path="/login" element={<Login login={login} setRememberMe={setRememberMe} setTwitterInfo={setTwitterInfo}/>}/>
          <Route path="/signup" element={<Signup/>} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
