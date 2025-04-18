
//import 'antd/dist/antd.min.css';
import './resources/global.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import Login from './pages/Login';   // import components
import Register from './pages/Register';
import Home from './pages/Home';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/Loader';
import { useSelector } from 'react-redux';
import AdminHome from "./pages/Admin/AdminHome";
import AdminBuses from "./pages/Admin/AdminBuses";
import AdminUsers from "./pages/Admin/AdminUsers";
import BookNow from './pages/BookNow';
import Bookings from './pages/Bookings';
import AdminBookings from './pages/Admin/AdminBookings';

function App() {
  const{loading} = useSelector(state=>state.alerts);
  // const auth = useAuth();
  // const clientId = "67lneqqnjupnq9220a09hc622m";
  // const logoutUri = "https://master.d2avvftcrnwudn.amplifyapp.com";
  // const cognitoDomain = "https://eu-north-18xrpoekdk.auth.eu-north-1.amazoncognito.com";

  // const signOutRedirect = () => {
  //   window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  // };

  // if (auth.isLoading) {
  //   return <div>Checking login status...</div>;
  // }

  // if (auth.error) {
  //   return <div>Error in authentication: {auth.error.message}</div>;
  // }

  return (
    <div>
      {loading && <Loader />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
          <Route path="/book-now/:id" element={<ProtectedRoute><BookNow/></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><Bookings/></ProtectedRoute>} />
         
          
          <Route path="/admin/buses" element={<ProtectedRoute><AdminBuses/></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><AdminUsers/></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute><AdminBookings/></ProtectedRoute>}/>
          <Route path="/register" element={<PublicRoute><Register/></PublicRoute>} />
          <Route path='/login' element = {<PublicRoute><Login/></PublicRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
