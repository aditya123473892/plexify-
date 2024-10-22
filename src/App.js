import logo from "./logo.svg";
import "./App.css";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import RegistrationForm from "./Forms/Registrationform";
import NomineeForm from "./Forms/Nomineeform";
import LoginForm from "./Forms/Login";

function App() {
  return (
    <div>
      <Sidebar></Sidebar>
      <RegistrationForm></RegistrationForm>
    </div>
  );
}

export default App;
