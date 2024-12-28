import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";
import { AuthContext } from "../Contexts/Context";
import Section from "../Components/Section";
import { toast, ToastContainer } from "react-toastify";
// import * as XLSX from "xlsx"; // Import the xlsx library
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import wealthlogo from "../assets/images/png logo.png";
const NetWorth = () => {
  const { API, token } = useContext(AuthContext);
  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch assets from various APIs
  const fetchAssets = async () => {
    try {
      const [
        insuranceResponse,
        depositsResponse,
        cryptoResponse,
        recurringDepositsResponse,
        propertiesResponse,
        stocksResponse,
        mutualFundsResponse,
        bondsResponse,
      ] = await Promise.all([
        axios.get(`${API}/insurance`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/deposits`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/cryptocurrencies`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/recurring_deposits`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/properties`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/stocks`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/mutual-funds`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/bonds`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const assets = [
        ...insuranceResponse.data.policies.map((policy) => ({
          name: policy.policy_name,
          value: policy.coverage_limit,
          type: "Insurance Policy",
        })),
        ...depositsResponse.data.deposits.map((deposit) => ({
          name: deposit.deposit_name,
          value: deposit.deposit_amount,
          type: "Fixed Deposit",
        })),
        ...cryptoResponse.data.cryptos.map((crypto) => ({
          name: crypto.name,
          value: crypto.current_value,
          type: "Cryptocurrency",
        })),
        ...recurringDepositsResponse.data.deposits.map((rd) => ({
          name: rd.bank_name,
          value: rd.maturity_amount,
          type: "Recurring Deposit",
        })),
        ...propertiesResponse.data.properties.map((property) => ({
          name: property.property_name,
          value: property.current_value,
          type: "Property",
        })),
        ...stocksResponse.data.stocks.map((stock) => ({
          name: stock.symbol,
          value: stock.current_value,
          type: "Stock",
        })),
        ...mutualFundsResponse.data.mutualFunds.map((fund) => ({
          name: fund.fund_name,
          value: fund.current_value,
          type: "Mutual Fund",
        })),
        ...bondsResponse.data.bonds.map((bond) => ({
          name: bond.issuer,
          value: bond.market_value,
          type: "Bond",
        })),
      ];

      setAssets(assets);
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast.error("Failed to fetch assets.");
    }
  };

  // Fetch liabilities from various APIs
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
    } catch (error) {
      console.error("Error fetching liabilities:", error);
      toast.error("Failed to fetch liabilities.");
    }
  };

  // Calculate total assets
  const calculateTotalAssets = () =>
    assets.reduce((sum, asset) => sum + (parseFloat(asset.value) || 0), 0);

  // Calculate total liabilities
  const calculateTotalLiabilities = () =>
    liabilities.reduce((sum, liability) => sum + (parseFloat(liability.value) || 0), 0);

  // Calculate net worth
  const calculateNetWorth = () => calculateTotalAssets() - calculateTotalLiabilities();

  // Export to Excel
  // const downloadToExcel = () => {
  //   const data = [
  //     ...assets.map((asset) => ({ Name: asset.name, Value: asset.value, Type: asset.type })),
  //     ...liabilities.map((liability) => ({
  //       Name: liability.name,
  //       Value: liability.value,
  //       Type: liability.type,
  //     })),
  //   ];

  //   const worksheet = XLSX.utils.json_to_sheet(data);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "NetWorth");
  //   XLSX.writeFile(workbook, "NetWorth.xlsx");
  //   toast.success("Downloaded as Excel!");
  // };




  const downloadToExcel = async () => {
    const topMarginRows = 0; // Number of empty rows above the logo
    const bottomMarginRows = 3; // Number of empty rows below the logo
  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("NetWorth");
  
    // Add top margin
    for (let i = 0; i < topMarginRows; i++) {
      worksheet.addRow([]);
    }
  
    // Add the logo
    const logo = await fetch(wealthlogo).then((res) => res.arrayBuffer());
    const imageId = workbook.addImage({
      buffer: logo,
      extension: "png",
    });
  
    worksheet.addImage(imageId, {
      tl: { col: 0, row: topMarginRows }, // Place after top margin rows
      ext: { width: 200, height: 80 },
    });
  
    // Add bottom margin
    for (let i = 0; i < bottomMarginRows; i++) {
      worksheet.addRow([]);
    }
  
    // Add a header
    worksheet.addRow(["Plexify Private Limited"]);
    worksheet.mergeCells(`A${topMarginRows + bottomMarginRows + 2}:D${topMarginRows + bottomMarginRows + 2}`);
    const headerRow = worksheet.getRow(topMarginRows + bottomMarginRows + 2);
    headerRow.font = { size: 16, bold: true };
  
    // Add column headers
    worksheet.addRow(["S. No", "Name", "Invested Amount", "Invested Type"]);
    const columnHeaderRow = worksheet.getRow(topMarginRows + bottomMarginRows + 3);
    columnHeaderRow.font = { bold: true }; // Style column headers
  
    // Add data rows with S. No
    let serialNumber = 1; // Initialize serial number
    assets.forEach((asset) => {
      worksheet.addRow([serialNumber++, asset.name, asset.value, asset.type]);
    });
    liabilities.forEach((liability) => {
      worksheet.addRow([serialNumber++, liability.name, liability.value, liability.type]);
    });
  
    // Save the workbook
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "NetWorth.xlsx");
    toast.success("Downloaded with logo as Excel!");
  };
  
  
  


  useEffect(() => {
    setLoading(true);
    Promise.all([fetchAssets(), fetchLiabilities()])
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [API, token]);

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg">
      <ToastContainer />
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Net Worth Overview</h1>
        <p className="text-gray-600">Track and calculate your net worth based on assets and liabilities.</p>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Section title="Assets">
            <table className="table-auto w-full text-left border-collapse mb-4">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Invested Amount</th>
                  <th className="p-2">Type</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset, index) => (
                  <tr key={index} className="font-bolder">
                    <td className="p-2">{asset.name}</td>
                    <td className="p-2">{`₹${asset.value}`}</td>
                    <td className="p-2">{asset.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-right text-gray-800 font-bold">
              Total Assets: ₹{calculateTotalAssets().toFixed(2)}
            </p>
          </Section>

          <Section title="Liabilities">
            <table className="table-auto w-full text-left border-collapse mb-4">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">	Invested Amount</th>
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
            <p className="text-right text-gray-800 font-bold">
              Total Liabilities: ₹{calculateTotalLiabilities().toFixed(2)}
            </p>
          </Section>

          <Section title="Summary">
            <p className="text-gray-800 font-bold">
              Total Assets: ₹{calculateTotalAssets().toFixed(2)}
            </p>
            <p className="text-gray-800 font-bold">
              Total Liabilities: ₹{calculateTotalLiabilities().toFixed(2)}
            </p>
            <p className="text-gray-800 font-bold">
              Net Worth: ₹{calculateNetWorth().toFixed(2)}
            </p>
          </Section>

          <div className="flex space-x-4">
            <button
              className="bg-green-600 text-white py-2 px-4 rounded mt-4"
              onClick={() => toast.success("Net worth saved!")}
            >
              <FaCheckCircle className="inline mr-2" /> Save Net Worth
            </button>
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded mt-4"
              onClick={downloadToExcel}
            >
              Download to Excel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NetWorth;
