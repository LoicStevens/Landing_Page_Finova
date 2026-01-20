import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import GuideForm from "./components/GuideForm";
import SuccessPage from "./pages/SuccessPage";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<GuideForm />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
