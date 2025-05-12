import React from "react";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>KidneyCare</h1>
      <div className="auth-section">
        <RegisterForm />
        <LoginForm />
      </div>
    </div>
  );
}

export default App;
