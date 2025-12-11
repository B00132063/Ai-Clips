// src/App.jsx
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ClipGeneratorPage from "./pages/ClipGeneratorPage";
import MyClipsPage from "./pages/MyClipsPage";
import SignInPage from "./pages/SignInPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/generator/:jobId" element={<ClipGeneratorPage />} />
      <Route path="/my-clips" element={<MyClipsPage />} />
      <Route path="/signin" element={<SignInPage />} />
    </Routes>
  );
}
// End of App.jsx