import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastProvider } from "./components/ui/Toast";
import { ScrollToTop } from "./components/ScrollToTop";
import { RouteLoading } from "./components/RouteLoading";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";

const Home = lazy(() => import("./pages/public/Home").then((m) => ({ default: m.Home })));
const RoomsList = lazy(() => import("./pages/public/RoomsList").then((m) => ({ default: m.RoomsList })));
const RoomDetail = lazy(() => import("./pages/public/RoomDetail").then((m) => ({ default: m.RoomDetail })));
const SignIn = lazy(() => import("./pages/public/SignIn").then((m) => ({ default: m.SignIn })));
const SignUp = lazy(() => import("./pages/public/SignUp").then((m) => ({ default: m.SignUp })));
const ForgotPassword = lazy(() =>
  import("./pages/public/ForgotPassword").then((m) => ({ default: m.ForgotPassword })),
);
const ResetPassword = lazy(() =>
  import("./pages/public/ResetPassword").then((m) => ({ default: m.ResetPassword })),
);
const PractitionerDashboard = lazy(() =>
  import("./pages/practitioner/Dashboard").then((m) => ({ default: m.PractitionerDashboard })),
);
const Profile = lazy(() => import("./pages/practitioner/Profile").then((m) => ({ default: m.Profile })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/rooms" element={<RoomsList />} />
              <Route path="/rooms/:slug" element={<RoomDetail />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <PractitionerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
