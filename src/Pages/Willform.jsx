import React from 'react';
import {
  FaUser,
  FaHome,
  FaCar,
  FaFileAlt,
  FaMoneyBill,
  FaBuilding,
  FaLandmark,
  FaDigitalTachograph,
} from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const WillFormSummary = ({ allData = {} }) => {
  const personalInfo = allData.personalInfo || {};
  const assets = allData.assets || {};
  const liabilities = allData.liabilities || {};
  const digitalIdentity = allData.digitalIdentity || {};
  const signature = allData.signature || {};

  const generatePDF = () => {
    const element = document.getElementById('will-summary');
    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Will_Summary.pdf');
    });
  };

  return (
    <div className="min-h-screen bg-white p-6 rounded-xl relative">
      <div id="will-summary">
        <h1 className="text-3xl font-bold text-center mb-6">Last Will and Testament Summary</h1>

        {/* Personal Information Section */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
          <div className="bg-gray-100 p-4 rounded-md shadow-md">
            <p><FaUser className="inline text-green-600" /> <strong>Full Name:</strong> {personalInfo.fullName || 'N/A'}</p>
            <p><FaHome className="inline text-green-600" /> <strong>Address:</strong> {personalInfo.address || 'N/A'}</p>
            <p><FaUser className="inline text-green-600" /> <strong>Father's Name:</strong> {personalInfo.fatherName || 'N/A'}</p>
            <p><FaUser className="inline text-green-600" /> <strong>Mother's Name:</strong> {personalInfo.motherName || 'N/A'}</p>
          </div>
        </section>

        {/* Assets Section */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Assets</h2>
          <div className="bg-gray-100 p-4 rounded-md shadow-md">
            <p><FaFileAlt className="inline text-green-600" /> <strong>Insurance Policies:</strong> {assets.insurancePolicies || 'N/A'}</p>
            <p><FaMoneyBill className="inline text-green-600" /> <strong>Fixed Deposits:</strong> {assets.fixedDeposit || 'N/A'}</p>
            <p><FaBuilding className="inline text-green-600" /> <strong>Real Estate:</strong> {assets.realEstate || 'N/A'}</p>
            <p><FaLandmark className="inline text-green-600" /> <strong>Bonds:</strong> {assets.bonds || 'N/A'}</p>
            <p><FaDigitalTachograph className="inline text-green-600" /> <strong>Cryptocurrencies:</strong> {assets.cryptocurrencies || 'N/A'}</p>
          </div>
        </section>

        {/* Liabilities Section */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Liabilities</h2>
          <div className="bg-gray-100 p-4 rounded-md shadow-md">
            <p><FaHome className="inline text-green-600" /> <strong>Home Loan:</strong> {liabilities.homeLoan || 'N/A'}</p>
            <p><FaCar className="inline text-green-600" /> <strong>Car Loan:</strong> {liabilities.carLoan || 'N/A'}</p>
          </div>
        </section>

        {/* Digital Identity Section */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Digital Identity</h2>
          <div className="bg-gray-100 p-4 rounded-md shadow-md">
            <p><FaDigitalTachograph className="inline text-green-600" /> <strong>Digital Accounts:</strong> {digitalIdentity.accounts || 'N/A'}</p>
          </div>
        </section>

        {/* Signature Section */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Signature and Date</h2>
          <div className="bg-gray-100 p-4 rounded-md shadow-md">
            <p><FaUser className="inline text-green-600" /> <strong>Signature Name:</strong> {signature.name || 'N/A'}</p>
            <p><FaFileAlt className="inline text-green-600" /> <strong>Signature Date:</strong> {signature.date || 'N/A'}</p>
          </div>
        </section>
      </div>

      {/* Confirm and Upload Buttons */}
      <div className="text-center mt-6 space-x-4">
      <button className="bg-gray-200 text-green-600 py-2 px-4 rounded-md shadow-md hover:bg-gray-300">
          Upload Digital Signature
        </button>
        <button
          onClick={generatePDF}
          className="bg-[#538d2dfd] text-white py-2 px-6 rounded-md shadow-md hover:bg-[#4c7033fd]"
        >
          Confirm and Finalize Will
        </button>
     
     
      </div>
    </div>
  );
};

export default WillFormSummary;
