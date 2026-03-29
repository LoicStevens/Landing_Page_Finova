import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Guide from "./pages/Guide";
import GuideSuccess from "./pages/GuideSuccess";
import TradingTools from "./pages/TradingTools";
import Performance from "./pages/Performance";
import Academy from "./pages/Academy";
import MarketInsights from "./pages/MarketInsights";
import Consulting from "./pages/Consulting";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <div className="overflow-x-hidden w-full">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/guide/merci" element={<GuideSuccess />} />
        <Route path="/trading-tools" element={<TradingTools />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/market-insights" element={<MarketInsights />} />
        <Route path="/consulting" element={<Consulting />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/success" element={<GuideSuccess />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
