import React, { useState } from 'react';
import { FaBitcoin, FaCoins, FaDollarSign, FaCalendarAlt, FaWallet, FaPlus, FaCheckCircle } from 'react-icons/fa';
import InputWithIcon from '../Components/InputWithIcon';
import FieldSection from '../Components/FieldSection';
import Section from '../Components/Section';

const CryptoManagement = () => {
  const [cryptos, setCryptos] = useState([
    { name: '', amountHeld: '', currentValue: '', acquisitionDate: '', wallet: '' },
  ]);

  const handleCryptoChange = (index, field, value) => {
    const newCryptos = [...cryptos];
    newCryptos[index][field] = value;
    setCryptos(newCryptos);
  };

  const addCrypto = () => {
    setCryptos([...cryptos, { name: '', amountHeld: '', currentValue: '', acquisitionDate: '', wallet: '' }]);
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
        <FieldSection title={`Cryptocurrency ${index + 1}`}>
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

      <button
        type="submit"
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Save Cryptocurrency Details
      </button>
    </div>
  );
};

export default CryptoManagement;
