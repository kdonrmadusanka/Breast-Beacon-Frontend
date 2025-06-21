import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PatientSignup } from '../components/PatientSignup';
import { DoctorSignup } from '../components/DoctorSignup';
import { ClinicianSignup } from '../components/ClinicianSignup';
import Home from '../pages/Home';
import Login from '../pages/Login';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Validity from '../pages/Validity';
import Services from '../pages/Services';
import Resources from '../pages/Resources';
import { ErrorPage } from '../pages/ErrorPage';
import '../../styles.css'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/home', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/services', element: <Services /> },
  { path: '/resources', element: <Resources /> },
  { path: '/contact', element: <Contact /> },
  { path: '/validity', element: <Validity /> },
  { path: '/login', element: <Login /> },
  { path: '/signup/patient', element: <PatientSignup /> },
  { path: '/signup/doctor', element: <DoctorSignup /> },
  { path: '/signup/clinician', element: <ClinicianSignup /> },
  { path: '*', element: <ErrorPage />, errorElement: <ErrorPage /> },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;