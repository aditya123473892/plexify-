import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import { FaMoneyBillWave, FaCalendarAlt, FaUser, FaPhone, FaEnvelope, FaPercent, FaHashtag, FaPlus } from "react-icons/fa";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Section from "../Components/Section";

function RecurringDepositManagement() {
  const { API, token, beneficiaryUser } = useContext(AuthContext);
  const [deposits, setDeposits] = useState([
    {
      bankName: "",
      depositAmount: "",
      interestRate: "",
      startDate: "",
      maturityDate: "",
      maturityAmount: "",
      rdNumber: "",
    },
  ]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [addedBeneficiaries, setAddedBeneficiaries] = useState([]);

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const response = await axios.get(`${API}/deposits`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setDeposits(response.data.deposits || []);
        setBeneficiaries(response.data.beneficiaries || []);
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
        interestRate: "",
        startDate: "",
        maturityDate: "",
        maturityAmount: "",
        rdNumber: "",
      },
    ]);
  };

  const handleAddBeneficiary = (userIndex) => {
    if (beneficiaryUser.length > 0 && !addedBeneficiaries.includes(userIndex)) {
      const user = beneficiaryUser[userIndex];
console.log('✌️beneficiaryUser --->', beneficiaryUser);
      const newBeneficiary = {
        beneficiary_id: user.beneficiary_id || "",
        name: user.name || "",
        contact: user.contact || "",
        email: user.email || "",
        entitlement: user.entitlement || "",
        relationship: user.relationship || "",
        notify: false,
      };

      setBeneficiaries([...beneficiaries, newBeneficiary]);
      setAddedBeneficiaries([...addedBeneficiaries, userIndex]); 
    } else {
      toast.error("This user has already been added or no users are available.");
    }
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
      if (
        !deposit.bankName ||
        !deposit.depositAmount ||
        !deposit.interestRate ||
        !deposit.startDate ||
        !deposit.maturityDate ||
        !deposit.maturityAmount
      ) {
        toast.error("All deposit fields are required.");
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


    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    console.log('✌️beneficiaries --->', beneficiaries);
    const beneficiaryIds = beneficiaries.map((beneficiary) => beneficiary.beneficiary_id); 
  
    const data = { deposits, beneficiaries: beneficiaryIds };
  
    try {
      const response = await axios.post(`${API}/recurring_deposits`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
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

      <form onSubmit={handleSubmit}>
        {deposits.map((deposit, index) => (
          <div key={index} className="mb-4 border-b pb-4">
            <FieldSection title="Recurring Deposit Details">
              <InputWithIcon
                icon={<FaHashtag />}
                type="text"
                placeholder="RD Number"
                value={deposit.rdNumber}
                onChange={(e) =>
                  handleDepositChange(index, "rdNumber", e.target.value)
                }
              />
              <InputWithIcon
                icon={<FaMoneyBillWave />}
                type="text"
                placeholder="Bank Name"
                value={deposit.bankName}
                onChange={(e) =>
                  handleDepositChange(index, "bankName", e.target.value)
                }
              />
              <InputWithIcon
                icon={<FaMoneyBillWave />}
                type="number"
                placeholder="Deposit Amount"
                value={deposit.depositAmount}
                onChange={(e) =>
                  handleDepositChange(index, "depositAmount", e.target.value)
                }
              />
              <InputWithIcon
                icon={<FaPercent />}
                type="number"
                placeholder="Interest Rate"
                value={deposit.interestRate}
                onChange={(e) =>
                  handleDepositChange(index, "interestRate", e.target.value)
                }
              />
              <InputWithIcon
                icon={<FaCalendarAlt />}
                type="date"
                placeholder="Start Date"
                value={deposit.startDate}
                onChange={(e) =>
                  handleDepositChange(index, "startDate", e.target.value)
                }
              />
              <InputWithIcon
                icon={<FaCalendarAlt />}
                type="date"
                placeholder="Maturity Date"
                value={deposit.maturityDate}
                onChange={(e) =>
                  handleDepositChange(index, "maturityDate", e.target.value)
                }
              />
              <InputWithIcon
                icon={<FaMoneyBillWave />}
                type="number"
                placeholder="Maturity Amount"
                value={deposit.maturityAmount}
                onChange={(e) =>
                  handleDepositChange(index, "maturityAmount", e.target.value)
                }
              />
            </FieldSection>
          </div>
        ))}

        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={addDeposit}
            className="bg-[#538d2dfd] text-white px-4 py-2 rounded-lg hover:bg-[#4c7033fd]"
          >
            Add New Deposit
          </button>
        </div>

        <section>
          <h3 className="font-semibold text-xl">Beneficiaries</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {beneficiaries.map((beneficiary, index) => (
              <div key={index} className="border rounded-lg p-4 shadow-md">
                <div>
                  <label className="font-bold text-lg">{beneficiary.name}</label>
                  <p className="text-sm text-gray-600">{beneficiary.contact}</p>
                  <p className="text-sm text-gray-600">{beneficiary.email}</p>
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleBeneficiaryChange(index, "notify", !beneficiary.notify)}
                    className="text-green-600"
                  >
                    {beneficiary.notify ? "Stop Notification" : "Start Notification"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <label className="block font-medium">Select Beneficiaries:</label>
            <select
              onChange={(e) => handleAddBeneficiary(e.target.value)}
              className="border-l-2 border-[#538d2dfd] shadow-lg p-2 text-white rounded-md w-full outline-0 bg-[#538d2dfd]"
            >
              <option value="" disabled selected>Select a beneficiary</option>
              {beneficiaryUser &&
                beneficiaryUser
                  .filter((user, index) => !addedBeneficiaries.includes(index))
                  .map((user, index) => (
                    <option key={index} value={index}>
                      {user.name}
                    </option>
                  ))}
            </select>
          </div>
        </section>

        <div className="flex justify-center mb-6">
          <button
            type="submit"
            className="bg-[#538d2dfd] text-white px-6 py-2 rounded-lg hover:bg-[#4c7033fd]"
          >
            Submit
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
}

export default RecurringDepositManagement;
