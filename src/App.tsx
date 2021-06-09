import React, { FunctionComponent } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";
import Navigation from "./components/navigation/Navigation";
import AdminNavigation from "./components/navigation/AdminNavigation";
import Routes from "./Routes";

const App: FunctionComponent = () => {
  const location = useLocation();
  return (
    <div className="App">
      {location?.pathname?.includes("admin") ? (
        <AdminNavigation />
      ) : (
        <Navigation />
      )}

      <main>
        <Routes />
      </main>
    </div>
  );
};

export default App;
