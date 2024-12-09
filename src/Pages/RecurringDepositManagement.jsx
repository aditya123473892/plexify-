import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import { FaMoneyBillWave, FaCalendarAlt, FaUser, FaLink, FaPhone, FaEnvelope, FaPercent, FaHashtag } from "react-icons/fa";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";
import Section from "../Components/Section";

function RecurringDepositManagement() {
  const { API, token, beneficiaryUser } = useContext(AuthContext);
  const [deposits, setDeposits] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [addedBeneficiaries, setAddedBeneficiaries] = useState([]);

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const response = await axios.get(`${API}/recurring_deposits`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.data.deposits && response.data.deposits.length > 0) {
          const formattedDeposits = response.data.deposits.map((deposit) => ({
            id: deposit.id,
            bankName: deposit.bank_name || "",
            rdNumber: deposit.rd_number || "",
            depositAmount: deposit.monthly_deposit_amount || "",
            interestRate: deposit.interest_rate || "",
            startDate: deposit.start_date?.split("T")[0] || "", // Format for <input type="date">
            maturityDate: deposit.maturity_date?.split("T")[0] || "",
            maturityAmount: deposit.maturity_amount || "",
            beneficiaryUser: deposit.beneficiarie_user || "",
            status: deposit.status || "Active",
          }));
          setDeposits(formattedDeposits);
        } else {
          setDeposits([
            {
              id: "",
              rdNumber:'',
              bankName: "",
              depositAmount: "",
              interestRate: "",
              startDate: "",
              maturityDate: "",
              maturityAmount: "",
              beneficiaryUser: "",
              status: "Active",
            },
          ]);
        }

        if (response.data.beneficiaries && response.data.beneficiaries.length > 0) {
          setBeneficiaries(response.data.beneficiaries);
        } else {
          // If no beneficiaries data exists, keep an empty array
          setBeneficiaries([]);
        }

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
        depositId: "",
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


  const getBeneficiaryById = (id) => {
    return beneficiaryUser.find(
      (user) => String(user.beneficiary_id) === String(id)
    ) || null;
  };
  
  const uniqueBeneficiaryIds = Array.from(
    new Set(
      deposits.flatMap((deposit) => 
        deposit.beneficiaryUser ? deposit.beneficiaryUser.split(",") : []
      )
    )
  );
  
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
                value={deposit.startDate }
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

        <div className=" gap-4 mb-6">
          <button
            type="button"
            onClick={addDeposit}
            className="bg-[#538d2dfd] text-white px-4 py-2 rounded-lg hover:bg-[#4c7033fd]"
          >
            Add New Deposit
          </button>
        </div>

    

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
