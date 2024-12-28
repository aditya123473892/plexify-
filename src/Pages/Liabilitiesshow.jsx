import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Contexts/Context";
import Section from "../Components/Section";
import { toast, ToastContainer } from "react-toastify";

const LiabilitiesPage = () => {
  const { API, token } = useContext(AuthContext);
  const [liabilities, setLiabilities] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLiabilities = async () => {
    try {
      const [
        homeLoansResponse,
        personalLoansResponse,
        vehicleLoansResponse,
        educationLoansResponse,
        businessLoansResponse,
      ] = await Promise.all([
        axios.get(`${API}/home-loans`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/personal-loans`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/vehicle-loans`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/education-loans`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/business-loans`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const liabilities = [
        ...homeLoansResponse.data.homeLoans.map((loan) => ({
          name: loan.institution_name,
          value: loan.loan_amount,
          type: "Home Loan",
        })),
        ...personalLoansResponse.data.loans.map((loan) => ({
          name: loan.institution_name,
          value: loan.loan_amount,
          type: "Personal Loan",
        })),
        ...vehicleLoansResponse.data.loans.map((loan) => ({
          name: loan.institution_name,
          value: loan.loan_amount,
          type: "Vehicle Loan",
        })),
        ...educationLoansResponse.data.loans.map((loan) => ({
          name: loan.institution_name,
          value: loan.loan_amount,
          type: "Education Loan",
        })),
        ...businessLoansResponse.data.loans.map((loan) => ({
          name: loan.institution_name,
          value: loan.loan_amount,
          type: "Business Loan",
        })),
      ];

      setLiabilities(liabilities);
      toast.success("Liabilities fetched successfully.");
    } catch (error) {
      console.error("Error fetching liabilities:", error);
      toast.error("Failed to fetch liabilities.");
    }
  };

  const calculateTotalLiabilities = () =>
    liabilities.reduce((sum, liability) => sum + (parseFloat(liability.value) || 0), 0);

  useEffect(() => {
    setLoading(true);
    fetchLiabilities().finally(() => setLoading(false));
  }, [API, token]);

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg">
      <ToastContainer />
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Liabilities Overview</h1>
        <p className="text-gray-600">Track all your liabilities in one place.</p>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Section title="Liabilities">
            <table className="table-auto w-full text-left border-collapse mb-4">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Value</th>
                  <th className="p-2">Type</th>
                </tr>
              </thead>
              <tbody>
                {liabilities.map((liability, index) => (
                  <tr key={index}>
                    <td className="p-2">{liability.name}</td>
                    <td className="p-2">{`₹${liability.value}`}</td>
                    <td className="p-2">{liability.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="Summary">
            <p className="text-gray-800 font-bold">
              Total Liabilities: ₹{calculateTotalLiabilities().toFixed(2)}
            </p>
          </Section>
        </>
      )}
    </div>
  );
};

export default LiabilitiesPage;
