import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import { FaMoneyBillWave, FaCalendarAlt, FaUser, FaPhone, FaEnvelope, FaPercent, FaLink, FaPlus, FaCheckCircle, FaHashtag } from "react-icons/fa";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RecurringDepositManagement() {
  const { API, token } = useContext(AuthContext);
  const [deposits, setDeposits] = useState([{
    bankName: "",
    depositAmount: "",
    tenure: "",
    interestRate: "",
    startDate: "",
    maturityDate: "",
    maturityAmount: "",
    rdNumber: "",
    status: "",
  }]);
  const [beneficiaries, setBeneficiaries] = useState([{
    name: "",
    contact: "",
    email: "",
    entitlement: "",
    relationship: "",
    notify: false,
  }]);

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const response = await axios.get(`${API}/deposits`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setDeposits(response.data.deposits || [{
          bankName: "",
          depositAmount: "",
          tenure: "",
          interestRate: "",
          startDate: "",
          maturityDate: "",
          maturityAmount: "",
          rdNumber: "",
          status: "",
        }]);
        setBeneficiaries(response.data.beneficiaries || [{
          name: "",
          contact: "",
          email: "",
          entitlement: "",
          relationship: "",
          notify: false,
        }]);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data. Please try again.");
      }
    };

    fetchDeposits();
  }, [API, token]);

  const addDeposit = () => {
    setDeposits([
      ...deposits,
      {
        bankName: "",
        depositAmount: "",
        tenure: "",
        interestRate: "",
        startDate: "",
        maturityDate: "",
        maturityAmount: "",
        rdNumber: "",
        status: "",
      },
    ]);
  };

  const addBeneficiary = () => {
    setBeneficiaries([
      ...beneficiaries,
      {
        name: "",
        contact: "",
        email: "",
        entitlement: "",
        relationship: "",
        notify: false,
      },
    ]);
  };

  const handleDepositChange = (index, field, value) => {
    const updatedDeposits = [...deposits];
    updatedDeposits[index][field] = value;
    setDeposits(updatedDeposits);
  };

  const handleBeneficiaryChange = (index, field, value) => {
    const updatedBeneficiaries = [...beneficiaries];
    updatedBeneficiaries[index][field] = value;
    setBeneficiaries(updatedBeneficiaries);
  };

  const validateForm = () => {
    for (let deposit of deposits) {
      if (!deposit.bankName || !deposit.depositAmount || !deposit.interestRate || !deposit.startDate || !deposit.maturityDate || !deposit.maturityAmount) {
        toast.error("All deposit fields are required.", {
          position: "bottom-right",
        });
        return false;
      }
      if (isNaN(deposit.depositAmount) || deposit.depositAmount <= 0) {
        toast.error("Deposit Amount should be a positive number.");
        return false;
      }
      if (isNaN(deposit.interestRate) || deposit.interestRate <= 0) {
        toast.error("Interest Rate should be a positive number.");
        return false;
      }
      if (isNaN(deposit.maturityAmount) || deposit.maturityAmount <= 0) {
        toast.error("Maturity Amount should be a positive number.");
        return false;
      }
    }

    for (let beneficiary of beneficiaries) {
      if (!beneficiary.name || !beneficiary.contact || !beneficiary.email || !beneficiary.entitlement || !beneficiary.relationship) {
        toast.error("All beneficiary fields are required.");
        return false;
      }
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(beneficiary.email)) {
        toast.error("Invalid email address.", {
          position: "bottom-right",
        });
        return false;
      }
      if (isNaN(beneficiary.entitlement) || beneficiary.entitlement <= 0 || beneficiary.entitlement > 100) {
        toast.error("Entitlement percentage should be a number between 0 and 100.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = {
      deposits,
      beneficiaries,
    };

    try {
      const response = await axios.post(`${API}/recurring_deposits`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data); // Handle the response as needed

      toast.success("Data submitted successfully!");
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data. Please try again.");
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Your Recurring Deposits
        </h1>
        <p className="text-gray-600">
          Effortlessly manage your recurring deposits and keep track of beneficiary details.
        </p>
      </header>

      {deposits.map((deposit, index) => (
        <div key={index} className="mb-4 border-b pb-4">
          <FieldSection title="Recurring Deposits">
            <InputWithIcon
              icon={<FaHashtag />}
              type="text"
              placeholder="RD Number"
              value={deposit.rdNumber}
              onChange={(e) => handleDepositChange(index, "rdNumber", e.target.value)}
            />
            <InputWithIcon
              icon={<FaMoneyBillWave />}
              type="text"
              placeholder="Bank Name"
              value={deposit.bankName}
              onChange={(e) => handleDepositChange(index, "bankName", e.target.value)}
            />
            <InputWithIcon
              icon={<FaMoneyBillWave />}
              type="number"
              placeholder="Monthly Deposit Amount"
              value={deposit.depositAmount}
              onChange={(e) => handleDepositChange(index, "depositAmount", e.target.value)}
            />
            <InputWithIcon
              icon={<FaPercent />}
              type="number"
              placeholder="Interest Rate (%)"
              value={deposit.interestRate}
              onChange={(e) => handleDepositChange(index, "interestRate", e.target.value)}
            />
            <InputWithIcon
              icon={<FaCalendarAlt />}
              type="date"
              placeholder="Start Date"
              value={deposit.startDate}
              onChange={(e) => handleDepositChange(index, "startDate", e.target.value)}
            />
            <InputWithIcon
              icon={<FaCalendarAlt />}
              type="date"
              placeholder="Maturity Date"
              value={deposit.maturityDate}
              onChange={(e) => handleDepositChange(index, "maturityDate", e.target.value)}
            />
            <InputWithIcon
              icon={<FaMoneyBillWave />}
              type="number"
              placeholder="Maturity Amount"
              value={deposit.maturityAmount}
              onChange={(e) => handleDepositChange(index, "maturityAmount", e.target.value)}
            />
            <InputWithIcon
              icon={<FaCheckCircle />}
              type="text"
              placeholder="Status"
              value={deposit.status}
              onChange={(e) => handleDepositChange(index, "status", e.target.value)}
            />
          </FieldSection>
        </div>
      ))}
      <button
        onClick={addDeposit}
        className="bg-[#3d5e27fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded-md shadow-md mt-4"
      >
        <FaPlus className="inline mx-2" /> Add Deposit
      </button>

      {beneficiaries.map((beneficiary, index) => (
        <div key={index} className="mb-4 border-b pb-4">
          <FieldSection title="Beneficiary Information">
            <InputWithIcon
              icon={<FaUser />}
              type="text"
              placeholder="Name"
              value={beneficiary.name}
              onChange={(e) => handleBeneficiaryChange(index, "name", e.target.value)}
            />
            <InputWithIcon
              icon={<FaPhone />}
              type="text"
              placeholder="Contact"
              value={beneficiary.contact}
              onChange={(e) => handleBeneficiaryChange(index, "contact", e.target.value)}
            />
            <InputWithIcon
              icon={<FaEnvelope />}
              type="email"
              placeholder="Email"
              value={beneficiary.email}
              onChange={(e) => handleBeneficiaryChange(index, "email", e.target.value)}
            />
            <InputWithIcon
              icon={<FaPercent />}
              type="number"
              placeholder="Entitlement (%)"
              value={beneficiary.entitlement}
              onChange={(e) => handleBeneficiaryChange(index, "entitlement", e.target.value)}
            />
            <InputWithIcon
              icon={<FaLink />}
              type="text"
              placeholder="Relationship"
              value={beneficiary.relationship}
              onChange={(e) => handleBeneficiaryChange(index, "relationship", e.target.value)}
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={beneficiary.notify}
                onChange={(e) => handleBeneficiaryChange(index, "notify", e.target.checked)}
                className="mr-2"
              />
              <span>Notify on Maturity</span>
            </div>
          </FieldSection>
        </div>
      ))}
      <button
        onClick={addBeneficiary}
        className="bg-[#3d5e27fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded-md shadow-md mt-4"
      >
        <FaPlus className="inline mx-2" /> Add Beneficiary
      </button>



      <ToastContainer />
   <div className="text-end">
   <button
        onClick={handleSubmit}
        className="bg-[#538d2dfd] hover:bg-[#4c7033fd] text-white py-2 px-4 rounded-md shadow-md mt-4"
      >
        Submit
      </button>
   </div>
    </div>
    
  );
}

export default RecurringDepositManagement;
