import React, { FunctionComponent } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";
import Navigation from "./components/navigation/Navigation";
import AdminNavigation from "./components/navigation/AdminNavigation";
import Routes from "./Routes";
import Footer from "./components/ui/Footer";

const App: FunctionComponent = () => {
  const location = useLocation();
  return (
    <div className="App">
      {location?.pathname?.includes("admin") ? (
        <AdminNavigation />
      ) : (
        <Navigation />
      )}

      <Routes />

      <Footer />
    </div>
  );
};

export default App;
