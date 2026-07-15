import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
// import Gallerie from "./pages/Gallerie";
// import APropos from "./pages/APropos";
// import Contact from "./pages/Contact";
// import Exposition from "./pages/Exposition";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        {/* <Route path="/Gallerie" element={<Gallerie />} />
        <Route path="/A-propos" element={<APropos />} />
        <Route path="/Contact" element={<Contact />} /> */}
        {/* <Route path="/Exposition" element={<Exposition />} /> */}
      </Route>
    </Routes>
  );
}

export default App;