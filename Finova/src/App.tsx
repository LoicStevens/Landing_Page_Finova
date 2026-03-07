import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import GuideForm from "./components/GuideForm";
import SuccessPage from "./pages/SuccessPage";
import Footer from "./components/Footer";
import SignIn from "./pages/SignIn";
import Register from "./pages/register";
import ForgotPassword from "./pages/forgot-password";
import ComingSoon from "./pages/ComingSoon";
import Academy from "./pages/Academy";

function App() {
  return (
    <div className="overflow-x-hidden w-full">
      <Navbar />
      <Routes>
        <Route path="/" element={<GuideForm />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/hedge-fund" element={<ComingSoon title="Hedge Fund" />} />
        <Route path="/trading-tools" element={<ComingSoon title="Trading Tools" />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/market-insights" element={<ComingSoon title="Market Insights" />} />
        <Route path="/consulting" element={<ComingSoon title="Consulting" />} />
        <Route path="/about" element={<ComingSoon title="About" />} />
        <Route path="/contact" element={<ComingSoon title="Contact" />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
