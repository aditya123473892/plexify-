import logo from "./logo.svg";
import "./App.css";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import RegistrationForm from "./Forms/Registrationform";

function App() {
  return (
    <div>
      <Navbar></Navbar>
      <Sidebar></Sidebar>
      <RegistrationForm></RegistrationForm>
    </div>
  );
}

export default App;
