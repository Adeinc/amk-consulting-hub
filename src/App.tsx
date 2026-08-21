import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastProvider } from "./components/ui/Toast";
import { ScrollToTop } from "./components/ScrollToTop";
import { RouteLoading } from "./components/RouteLoading";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
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
const Contact = lazy(() => import("./pages/public/Contact").then((m) => ({ default: m.Contact })));
const Faq = lazy(() => import("./pages/public/Faq").then((m) => ({ default: m.Faq })));
const PrivacyPolicy = lazy(() => import("./pages/public/PrivacyPolicy").then((m) => ({ default: m.PrivacyPolicy })));
const Terms = lazy(() => import("./pages/public/Terms").then((m) => ({ default: m.Terms })));
const NotFound = lazy(() => import("./pages/public/NotFound").then((m) => ({ default: m.NotFound })));
const PractitionerDashboard = lazy(() =>
  import("./pages/practitioner/Dashboard").then((m) => ({ default: m.PractitionerDashboard })),
);
const Profile = lazy(() => import("./pages/practitioner/Profile").then((m) => ({ default: m.Profile })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
const RoomsAdmin = lazy(() => import("./pages/admin/RoomsAdmin").then((m) => ({ default: m.RoomsAdmin })));
const BookingsAdmin = lazy(() => import("./pages/admin/BookingsAdmin").then((m) => ({ default: m.BookingsAdmin })));
const PractitionersAdmin = lazy(() =>
  import("./pages/admin/PractitionersAdmin").then((m) => ({ default: m.PractitionersAdmin })),
);
const SettingsAdmin = lazy(() => import("./pages/admin/SettingsAdmin").then((m) => ({ default: m.SettingsAdmin })));

function App() {
  return (
    <ErrorBoundary>
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
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
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
                <Route
                  path="/admin/rooms"
                  element={
                    <ProtectedRoute requireRole="admin">
                      <RoomsAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/bookings"
                  element={
                    <ProtectedRoute requireRole="admin">
                      <BookingsAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/practitioners"
                  element={
                    <ProtectedRoute requireRole="admin">
                      <PractitionersAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute requireRole="admin">
                      <SettingsAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
