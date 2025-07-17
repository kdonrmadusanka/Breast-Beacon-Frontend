import type { RouteObject } from "react-router-dom";
import Home from "../pages/public/Home";
import Dashboard from "../pages/patient/Dashboard";
import UploadMammogram from "../pages/patient/UploadMammogram";
import { ViewResults } from "../pages/patient/ViewResults";
import NotFound from "../pages/shared/NotFound";
import { ClinicianDashboard } from "../pages/clinician/ClinicianDashboard";
// import { StudyComparisonView } from '../pages/clinician/StudyComparisonView';
import TreatmentPlanEditor from "../pages/treatment/TreatmentPlanEditor";
import { AuthGuard } from "../components/auth/AuthGuard";
import { Login } from "../pages/public/Login";
import { Unauthorized } from "../pages/shared/Unauthorized";
import { TestLogin } from "../pages/dev/TestLogin";
import { Signup } from "../pages/public/Signup";

export const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
  {
    path: "/patient",
    element: <AuthGuard role="patient" />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "upload", element: <UploadMammogram /> },
      { path: "results", element: <ViewResults /> },
      { path: "progress", element: <div>Progress Tracking (TBD)</div> },
      { path: "appointments", element: <div>Appointments (TBD)</div> },
      { path: "education", element: <div>Educational Resources (TBD)</div> },
    ],
  },
  {
    path: "/clinician",
    element: <AuthGuard role="clinician" />,
    children: [
      { path: "dashboard", element: <ClinicianDashboard /> },
      { path: "treatment-plan", element: <TreatmentPlanEditor /> },
      // { path: 'study-comparison', element: <StudyComparisonView image1={{ imageId: '', metadata: {} }} image2={{ imageId: '', metadata: {} }} /> }, // Update with real data
    ],
  },
  { path: "/unauthorized", element: <Unauthorized /> },
  { path: "*", element: <NotFound /> },
  { path: "/dev/login", element: <TestLogin /> },
];
