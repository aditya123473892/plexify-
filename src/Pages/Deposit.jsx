import React, { useState, useContext, useEffect } from "react";
import { FaClipboard, FaTag, FaCalendar, FaRupeeSign } from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import Section from "../Components/Section";
import axios from "axios";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";

const ManageDeposits = () => {
  const { API, token } = useContext(AuthContext);

  const [depositDetails, setDepositDetails] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // State to track edit mode
  const [isLoading, setIsLoading] = useState(true); // Loading state for API call

  useEffect(() => {
    const fetchDepositDetails = async () => {
      try {
        const response = await axios.get(`${API}/deposits`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.deposits && response.data.deposits.length > 0) {
          const deposit = response.data.deposits[0];
console.log('✌️deposit --->', deposit);


          setDepositDetails({
            depositId: deposit.deposit_id || "",
            depositType: deposit.deposit_type || "Fixed Deposit",
            depositName: deposit.deposit_name || "",
            accountNumber: deposit.account_number || "",
            bankName: deposit.bank_name || "",
            depositTerm: deposit.deposit_term || "",
            depositAmount: deposit.deposit_amount || "",
            interestRate: deposit.interest_rate || "",
            maturityAmount: deposit.maturity_amount || "",
          });
        }
        setIsLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching deposit details:", error);
        toast.error("Failed to fetch deposit details.");
        setIsLoading(false);
      }
    };

    fetchDepositDetails(); // Fetch deposit details on page load
  }, [API, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (["interestRate"].includes(name)) {
      let formattedValue = value;

      if (value) {
        formattedValue = parseFloat(value).toFixed(2); // Fix to two decimal places
      }

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
      setIsEditMode(false); // Set to view mode after saving
    } catch (error) {
      console.error("Error submitting deposit data:", error);
      toast.error("Failed to save deposit details.");
      setLoading(false); // Stop loading after error
    }
  };
  console.log('depositDetails --->', depositDetails);
  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Manage Your Deposits</h1>
        <p className="mt-2">Easily add, view, and manage your deposits with helpful features.</p>
      </header>

      {isLoading ? (
        <div>Loading...</div> // Loading state until the deposit data is fetched
      ) : (
        <>
          <Section title="Deposit Type" className="mb-10">
            <select
              name="depositType"
              value={depositDetails.depositType}
              onChange={handleInputChange}
              className="border-l-2 border-[#538d2dfd] shadow-lg p-2 text-white rounded-md w-full outline-0 bg-[#538d2dfd]"
              disabled={!isEditMode} // Disable if not in edit mode
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
                readOnly={!isEditMode} // Disable if not in edit mode
              />
              <InputWithIcon
                icon={<FaTag />}
                name="accountNumber"
                type="text"
                placeholder="Account Number"
                value={depositDetails.accountNumber}
                onChange={handleInputChange}
                readOnly={!isEditMode} // Disable if not in edit mode
              />
              <InputWithIcon
                icon={<FaClipboard />}
                name="bankName"
                type="text"
                placeholder="Bank Name"
                value={depositDetails.bankName}
                onChange={handleInputChange}
                readOnly={!isEditMode} // Disable if not in edit mode
              />
              <InputWithIcon
                icon={<FaCalendar />}
                name="depositTerm"
                type="text"
                placeholder="Deposit Term"
                value={depositDetails.depositTerm}
                onChange={handleInputChange}
                readOnly={!isEditMode} // Disable if not in edit mode
              />
              <InputWithIcon
                icon={<FaRupeeSign />}
                name="depositAmount"
                type="number"
                placeholder="Deposit Amount"
                value={depositDetails.depositAmount}
                onChange={handleInputChange}
                readOnly={!isEditMode} // Disable if not in edit mode
              />
              <InputWithIcon
                icon={<FaRupeeSign />}
                name="interestRate"
                type="number"
                placeholder="Interest Rate"
                value={depositDetails.interestRate}
                onChange={handleInputChange}
                readOnly={!isEditMode} // Disable if not in edit mode
              />
              <InputWithIcon
                className="col-span-2"
                icon={<FaRupeeSign />}
                name="maturityAmount"
                type="number"
                placeholder="Maturity Amount"
                value={depositDetails.maturityAmount}
                onChange={handleInputChange}
                readOnly={!isEditMode} // Disable if not in edit mode
              />
            </div>
          </Section>

          <section className="mb-10 border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Document Upload</h2>

            <div className="relative flex items-center">
              <input
                type="file"
                accept="application/pdf, image/*"
                onChange={handleFileChange}
                id="file-input"
                className="hidden"
                disabled={!isEditMode} // Disable if not in edit mode
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer bg-[#538d2dfd] text-white py-2 px-4  rounded-md shadow-md hover:bg-[#4c7033fd]"
              >
                Choose a file
              </label>

              {file && (
                <span className="ml-4 text-[#538d2dfd] font-semibold">
                  {file.name}
                </span>
              )}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Renewal Reminders</h3>
              <p className="mt-2">Set reminders for deposit renewals.</p>
            </div>

            <div className="border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Investment Strategies</h3>
              <p className="mt-2">Track your investment performance.</p>
            </div>
          </section>

          <div className="flex justify-end">
            {isEditMode ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#538d2dfd] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#4c7033fd] disabled:bg-gray-300"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            ) : (
              <button
                onClick={() => setIsEditMode(true)}
                className="bg-[#4c7033fd] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#538d2dfd]"
              >
                Edit
              </button>
            )}
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default ManageDeposits;
