import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar'
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './api/AuthContext'
import AccountPage from './pages/AccountPage';
import MyClassesPage from './pages/MyClassesPage';
import StudioPage from "./pages/StudioPage"
import SubscriptionsPage from './pages/SubscriptionsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <Navbar/>
        <Routes>
            <Route path='/' element={<HomePage />}></Route>
            <Route path='/register/' element={<RegisterPage />}></Route>
            <Route path='/login/' element={<LoginPage />}></Route>
            <Route path='/accounts/:tab' element={<AccountPage/>}></Route>
            <Route path='/myclasses/' element={<MyClassesPage/>}></Route>
            <Route path='/studio/:studio_id' element={<StudioPage/>}></Route>
            <Route path='/subscriptions/' element={<SubscriptionsPage/>}></Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
