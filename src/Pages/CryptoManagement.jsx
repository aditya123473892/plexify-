import React, { useState, useContext, useEffect } from 'react';
import { FaBitcoin, FaCoins, FaRupeeSign, FaCalendarAlt, FaWallet, FaPlus, FaCheckCircle } from 'react-icons/fa';
import InputWithIcon from '../Components/InputWithIcon';
import FieldSection from '../Components/FieldSection';
import Section from '../Components/Section';
import { AuthContext } from "../Contexts/Context"; // Your AuthContext to get API and token
import axios from 'axios'; // Axios for API calls
import { toast, ToastContainer } from "react-toastify"; // Toast notifications
import "react-toastify/dist/ReactToastify.css";

const CryptoManagement = () => {
  const [cryptos, setCryptos] = useState([  // Initial state setup
    { name: '', amountHeld: '', currentValue: '', acquisitionDate: '', wallet: '' },
  ]);

  const { API, token } = useContext(AuthContext); // Getting API and token from context

  // Function to handle changes in cryptocurrency fields
  const handleCryptoChange = (index, field, value) => {
    const newCryptos = [...cryptos];
    newCryptos[index][field] = value;
    setCryptos(newCryptos);
  };

  // Function to add a new cryptocurrency entry
  const addCrypto = () => {
    setCryptos([...cryptos, { name: '', amountHeld: '', currentValue: '', acquisitionDate: '', wallet: '' }]);
  };

  // Fetch cryptocurrency data from the backend
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await axios.get(`${API}/cryptocurrencies`, {
          headers: {
            Authorization: `Bearer ${token}`, // Passing the token for authentication
            'Content-Type': 'application/json',
          },
        });

        if (response.data.cryptos && response.data.cryptos.length > 0) {
          const formattedCryptos = response.data.cryptos.map((crypto) => ({
            name: crypto.name || "",
            amountHeld: crypto.amount_held || "",
            currentValue: crypto.current_value || "",
            acquisitionDate: crypto.acquisition_date || "",
            wallet: crypto.wallet || "",
          }));
          setCryptos(formattedCryptos);
        } else {
          setCryptos([{
            name: "",
            amountHeld: "",
            currentValue: "",
            acquisitionDate: "",
            wallet: "",
          }]);
        }
      } catch (error) {
        console.error("Error fetching cryptocurrency data:", error);
        toast.error("Error fetching cryptocurrency data. Please try again.");
      }
    };

    fetchCryptoData();
  }, [API, token]);  // Dependency array: will run when API or token changes

  // Handle saving cryptocurrency details to the backend
  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${API}/cryptocurrencies`, // Your backend endpoint for saving cryptocurrencies
        { cryptos }, // Data to be sent to the backend
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add authorization token
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        toast.success("Cryptocurrency details saved successfully!");
      }
    } catch (error) {
      console.error("Error saving cryptocurrency details", error);
      toast.error("There was an error saving the cryptocurrency details. Please try again.");
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Your Cryptocurrencies</h1>
        <p className="text-gray-600">
          Keep track of your cryptocurrency holdings and monitor their current value.
        </p>
      </header>

      {/* Cryptocurrency Section */}
      {cryptos.map((crypto, index) => (
        <FieldSection title={`Cryptocurrency ${index + 1}`} key={index}>
          <InputWithIcon
            icon={<FaBitcoin className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Cryptocurrency Name (e.g., Bitcoin, Ethereum)"
            value={crypto.name}
            onChange={(e) => handleCryptoChange(index, 'name', e.target.value)}
          />
          <InputWithIcon
            icon={<FaCoins className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Amount Held"
            value={crypto.amountHeld}
            onChange={(e) => handleCryptoChange(index, 'amountHeld', e.target.value)}
          />
          <InputWithIcon
            icon={<span className="text-[#538d2dfd] mx-2 font-extrabold" >₹ </span>}
            type="number"
            placeholder="Current Value (in USD)"
            value={crypto.currentValue}
            onChange={(e) => handleCryptoChange(index, 'currentValue', e.target.value)}
          />
          <InputWithIcon
            icon={<FaCalendarAlt className="text-[#538d2dfd] mx-2" />}
            type="date"
            placeholder="Acquisition Date"
            value={crypto.acquisitionDate}
            onChange={(e) => handleCryptoChange(index, 'acquisitionDate', e.target.value)}
          />
          <InputWithIcon
            icon={<FaWallet className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Wallet / Exchange Platform"
            value={crypto.wallet}
            onChange={(e) => handleCryptoChange(index, 'wallet', e.target.value)}
          />
        </FieldSection>
      ))}

      <button
        onClick={addCrypto}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
      >
        <FaPlus className="inline mr-2" /> Add Cryptocurrency
      </button>

      {/* Educational Resources */}
      <Section title="Educational Resources">
        <p className="text-gray-600 mb-4">Explore our educational resources on cryptocurrency management.</p>
        <button className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]">
          <FaBitcoin className="inline mr-2" /> Learn More
        </button>
      </Section>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Save Cryptocurrency Details
      </button>

      {/* ToastContainer - required to render toasts */}
      <ToastContainer />
    </div>
  );
};

export default CryptoManagement;
