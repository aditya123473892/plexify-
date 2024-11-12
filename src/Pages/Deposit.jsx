import React, { useState, useContext } from "react";
import { FaClipboard, FaTag, FaCalendar, FaDollarSign } from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import Section from "../Components/Section";
import axios from "axios";
import { AuthContext } from "../Contexts/Context";
import { toast } from "react-toastify";

const ManageDeposits = () => {
  const { API, token } = useContext(AuthContext);
  const [depositDetails, setDepositDetails] = useState({
    depositType: "Fixed Deposit",
    depositName: "",
    accountNumber: "",
    bankName: "",
    depositTerm: "",
    depositAmount: "",
    interestRate: "",
    maturityAmount: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Restrict depositAmount, interestRate, and maturityAmount to two decimal places
    if (["depositAmount", "interestRate", "maturityAmount"].includes(name)) {
      let formattedValue = value;

      if (value) {
        formattedValue = parseFloat(value).toFixed(2); // Fix to two decimal places
      }

      // Only allow valid values (greater than or equal to 0)
      if (!isNaN(formattedValue) && parseFloat(formattedValue) >= 0) {
        setDepositDetails((prevDetails) => ({
          ...prevDetails,
          [name]: formattedValue,
        }));
      }
    } else {
      setDepositDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    // Validation check
    if (!depositDetails.depositAmount || !depositDetails.interestRate || !depositDetails.maturityAmount) {
      alert("Please enter valid deposit details");
      return;
    }

    if (!file) {
      toast.error("Please upload a deposit document.");
      return;
    }

    setLoading(true); // Start loading

    const formDataToSend = new FormData();
    Object.keys(depositDetails).forEach((key) => {
      if (key !== "document") {
        formDataToSend.append(key, depositDetails[key]);
      }
    });
    formDataToSend.append("document", file); // Append the file correctly

    try {
      const response = await axios.post(`${API}/deposits`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response:", response.data);
      toast.success("Deposit details saved successfully!");
      setLoading(false); // Stop loading after success
    } catch (error) {
      console.error("Error submitting deposit data:", error);
      toast.error("Failed to save deposit details.");
      setLoading(false); // Stop loading after error
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Manage Your Deposits</h1>
        <p className="mt-2">Easily add, view, and manage your deposits with helpful features.</p>
      </header>

      <Section title="Deposit Type" className="mb-10">
        <select
          name="depositType"
          value={depositDetails.depositType}
          onChange={handleInputChange}
          className="border-l-2 border-[#538d2dfd] shadow-lg p-2 text-white rounded-md w-full outline-0 bg-[#538d2dfd]"
        >
          <option>Fixed Deposit</option>
          <option>Recurring Deposit</option>
          <option>Term Deposit</option>
          <option>Savings Deposit</option>
          <option>Others</option>
        </select>
      </Section>

      <Section title="Deposit Details" className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputWithIcon
            icon={<FaClipboard />}
            name="depositName"
            type="text"
            placeholder="Deposit Name"
            value={depositDetails.depositName}
            onChange={handleInputChange}
          />
          <InputWithIcon
            icon={<FaTag />}
            name="accountNumber"
            type="number"
            placeholder="Account Number"
            value={depositDetails.accountNumber}
            onChange={handleInputChange}
          />
          <InputWithIcon
            icon={<FaClipboard />}
            name="bankName"
            type="text"
            placeholder="Bank Name"
            value={depositDetails.bankName}
            onChange={handleInputChange}
          />
          <InputWithIcon
            icon={<FaCalendar />}
            name="depositTerm"
            type="text"
            placeholder="Deposit Term"
            value={depositDetails.depositTerm}
            onChange={handleInputChange}
          />
          <InputWithIcon
            icon={<FaDollarSign />}
            name="depositAmount"
            type="number"
            placeholder="Deposit Amount"
            value={depositDetails.depositAmount}
            onChange={handleInputChange}
          />
          <InputWithIcon
            icon={<FaDollarSign />}
            name="interestRate"
            type="number"
            placeholder="Interest Rate"
            value={depositDetails.interestRate}
            onChange={handleInputChange}
          />
          <InputWithIcon
            className="col-span-2"
            icon={<FaDollarSign />}
            name="maturityAmount"
            type="number"
            placeholder="Maturity Amount"
            value={depositDetails.maturityAmount}
            onChange={handleInputChange}
          />
        </div>
      </Section>

      <section className="mb-10 border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Document Upload</h2>
        <input
          type="file"
          accept="application/pdf, image/*"
          onChange={handleFileChange}
          className="mb-4"
        />



        
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Renewal Reminders</h3>
          <p className="mt-2">Set reminders for deposit renewals.</p>
          <button className="bg-[#538d2dfd] text-white py-2 px-4 mt-4 rounded-md shadow-md hover:bg-[#4c7033fd]">
            Add Reminder
          </button>
        </div>

        <div className="border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Educational Resources</h3>
          <p className="mt-2">
            Learn more about different types of deposits and interest
            calculations.
          </p>
          <button className="bg-[#538d2dfd] text-white py-2 px-4 mt-4 rounded-md shadow-md hover:bg-[#4c7033fd]">
            Explore Resources
          </button>
        </div>
      </section>

      <div className="text-right">
        <button
          onClick={handleSubmit}
          className="bg-[#538d2dfd] text-white py-2 px-6 rounded-md shadow-md hover:bg-[#4c7033fd]"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default ManageDeposits;
