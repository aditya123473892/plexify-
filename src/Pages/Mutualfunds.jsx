import React, { useState, useContext,useEffect } from "react";
import axios from "axios";
import { FaPlus, FaFileUpload, FaShieldAlt, FaDollarSign } from "react-icons/fa";
import Section from "../Components/Section";
import InputWithIcon from "../Components/InputWithIcon";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";

function MutualFundsManagement() {
  const { API, token } = useContext(AuthContext);
  const [funds, setFunds] = useState([]);
  
  const [document, setDocument] = useState(null); // For handling file uploads

  const addFund = () => {
    setFunds([
      ...funds,
      {
        fundName: "",
        fundManager: "",
        investmentAmount: "",
        currentValue: "",
        fundType: "",
        riskLevel: "",
        notify: false,
      },
    ]);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make the API request to fetch mutual fund data
        const response = await axios.get(`${API}/mutual-funds`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        // Check if there are any funds in the response data
        if (response.data.mutualFunds && response.data.mutualFunds.length > 0) {
          const formattedFunds = response.data.mutualFunds.map((fund) => ({
            fundName: fund.fund_name || "",  // Using fund_name from the table
            fundManager: fund.fund_manager || "",  // Using fund_manager from the table
            investmentAmount: fund.investment_amount || "",  // Using investment_amount from the table
            currentValue: fund.current_value || "",  // Using current_value from the table
            fundType: fund.fund_type || "",  // Using fund_type from the table
            riskLevel: fund.risk_level || "",  // Using risk_level from the table
            notify: fund.notify || false,  // Using notify from the table (default to false)
          }));
  
          // Set the formatted funds in the state
          setFunds(formattedFunds);
        } else {
          // If no mutual funds are found, set an empty default value
          setFunds([{
            fundName: "",
            fundManager: "",
            investmentAmount: "",
            currentValue: "",
            fundType: "",
            riskLevel: "",
            notify: false,
          }]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching mutual fund data. Please try again.");
      }
    };
  
    fetchData();
  }, [API, token]);  // Runs when the component mounts or when API/token changes
  
  const handleFundChange = (index, field, value) => {
    const updatedFunds = [...funds];
    updatedFunds[index][field] = value;
    setFunds(updatedFunds);
  };

  const handleDocumentChange = (e) => {
    setDocument(e.target.files[0]); // Set the uploaded document file
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append("funds", JSON.stringify(funds)); // Append funds data
    if (document) formData.append("document", document); // Append document file

    try {
      const response = await axios.post(`${API}/mutual-funds`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.msg);
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error(error.response?.data?.msg || "Failed to upload mutual fund data");
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8 ">
        <h1 className="text-3xl font-bold text-[#3d5e27fd] mb-2">
          Manage Your Mutual Funds
        </h1>
        <p className="text-gray-600 max-w-md ">
          Keep track of your mutual fund investments easily.
        </p>
      </header>

      <Section className="bg-[#4e7a30fd] p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-white mb-4">Mutual Funds</h2>
        {funds.map((fund, index) => (
          <div key={index} className="mb-4 border-b border-white pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <InputWithIcon
                icon={<FaDollarSign />}
                placeholder="Fund Name"
                value={fund.fundName}
                onChange={(e) =>
                  handleFundChange(index, "fundName", e.target.value)
                }
              />
              <InputWithIcon
                icon={<FaDollarSign />}
                placeholder="Fund Manager"
                value={fund.fundManager}
                onChange={(e) =>
                  handleFundChange(index, "fundManager", e.target.value)
                }
              />
              <InputWithIcon
                icon={<FaDollarSign />}
                type="number"
                placeholder="Investment Amount"
                value={fund.investmentAmount}
                onChange={(e) =>
                  handleFundChange(index, "investmentAmount", e.target.value)
                }
              />
              <InputWithIcon
                icon={<FaDollarSign />}
                type="number"
                placeholder="Current Value"
                value={fund.currentValue}
                onChange={(e) =>
                  handleFundChange(index, "currentValue", e.target.value)
                }
              />
              <div className="flex items-center">
                <select
                  className="border-l-2 border-[#538d2dfd] p-3 rounded-md shadow-lg w-full"
                  value={fund.fundType}
                  onChange={(e) =>
                    handleFundChange(index, "fundType", e.target.value)
                  }
                >
                  <option value=""> Select Fund Type</option>
                  <option value="Equity">Equity</option>
                  <option value="Debt">Debt</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div className="flex items-center">
                <select
                  className="border-l-2 border-[#538d2dfd] p-3 rounded-md shadow-lg w-full"
                  value={fund.riskLevel}
                  onChange={(e) =>
                    handleFundChange(index, "riskLevel", e.target.value)
                  }
                >
                  <option value="">Select Risk Level</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <label className="inline-flex items-center mt-2 text-white">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={fund.notify}
                  onChange={(e) =>
                    handleFundChange(index, "notify", e.target.checked)
                  }
                />
                Notify on Updates
              </label>
            </div>
          </div>
        ))}
        <button
          onClick={addFund}
          className="bg-[#538d2dfd] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#4c7033fd] mt-4"
        >
          <FaPlus className="inline mr-2" /> Add Mutual Fund
        </button>
      </Section>

      <Section className="bg-[#4e7a30fd] p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-white mb-4">Document Upload</h2>
        <input
          type="file"
          onChange={handleDocumentChange}
          className="bg-[#538d2dfd] text-white py-2 px-6 rounded-md shadow-md hover:bg-[#4c7033fd]"
        />
      </Section>

      <Section className="bg-[#4e7a30fd] p-6 rounded-lg shadow-md flex flex-col items-center">
        <h3 className="text-xl font-semibold text-white mb-2">Educational Resources</h3>
        <p className="text-white mb-4">
          Learn more about mutual fund management.
        </p>
        <button className="bg-[#538d2dfd] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#4c7033fd]">
          Explore Resources
        </button>
      </Section>

      <div className="flex justify-end">
        <button
          onClick={handleSaveChanges}
          className="bg-[#3d5e27fd] text-white py-3 px-8 rounded-md shadow-md hover:bg-[#4c7033fd] transition-all"
        >
          Save Changes
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default MutualFundsManagement;
