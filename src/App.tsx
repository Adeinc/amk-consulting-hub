import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastProvider } from "./components/ui/Toast";
import { Home } from "./pages/public/Home";
import { RoomsList } from "./pages/public/RoomsList";
import { RoomDetail } from "./pages/public/RoomDetail";
import { SignIn } from "./pages/public/SignIn";
import { SignUp } from "./pages/public/SignUp";
import { PractitionerDashboard } from "./pages/practitioner/Dashboard";
import { AdminDashboard } from "./pages/admin/AdminDashboard";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<RoomsList />} />
          <Route path="/rooms/:slug" element={<RoomDetail />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/dashboard" element={<PractitionerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
