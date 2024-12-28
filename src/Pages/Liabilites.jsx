import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  FaHome,
  FaUser,
  FaCar,
  FaGraduationCap,
  FaBusinessTime,
  FaPercentage,
  FaBuilding,
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import { AuthContext } from "../Contexts/Context";

const ManageLiabilities = () => {
  const { API, token } = useContext(AuthContext);

  const [liabilities, setLiabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    institutionName: "",
    loanAmount: "",
    loanTenureYears: "",
    interestRate: "",
    accountNumber: "",
    vehicleType: "",
    loanPurpose: "",
    courseInstitution: "",
    businessPurpose: "",
  });

  const endpointMap = {
    "Home Loan": "home-loans",
    "Personal Loan": "personal-loans",
    "Vehicle Loan": "vehicle-loans",
    "Education Loan": "education-loans",
    "Business Loan": "business-loans",
  };

  useEffect(() => {
    const fetchLiabilities = async () => {
      if (!selectedType) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${API}/${endpointMap[selectedType]}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLiabilities(response.data.loans || []);
      } catch (error) {
        toast.error("Failed to fetch liabilities.");
        console.error(error);
      }
      setLoading(false);
    };

    fetchLiabilities();
  }, [API, token, selectedType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setFormData({
      institutionName: "",
      loanAmount: "",
      accountNumber: "",
      loanTenureYears: "",
      interestRate: "",
      vehicleType: "",
      loanPurpose: "",
      courseInstitution: "",
      businessPurpose: "",
    });
    setEditMode(false);
    setEditId(null);
    setLiabilities([]);
  };

  const handleSubmit = async () => {
    if (!selectedType || !endpointMap[selectedType]) {
      toast.error("Please select a valid liability type.");
      return;
    }

    const endpoint = `${API}/${endpointMap[selectedType]}${
      editMode && editId ? `/${editId}` : ""
    }`;

    const method = editMode ? "put" : "post";

    setLoading(true);
    try {
      await axios[method](
        endpoint,
        {
          institution_name: formData.institutionName,
          loan_amount: formData.loanAmount,
          loan_tenure_years: formData.loanTenureYears,
          interest_rate: formData.interestRate,
          account_number: formData.accountNumber,
          vehicle_type: formData.vehicleType,
          loan_purpose: formData.loanPurpose,
          course_institution: formData.courseInstitution,
          business_purpose: formData.businessPurpose,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const successMessage = editMode
        ? `${selectedType} updated successfully!`
        : `${selectedType} saved successfully!`;
      toast.success(successMessage);

      const updatedLiability = {
        id: editId,
        institution_name: formData.institutionName,
        loan_amount: formData.loanAmount,
        loan_tenure_years: formData.loanTenureYears,
        interest_rate: formData.interestRate,
        account_number: formData.accountNumber,
        vehicle_type: formData.vehicleType,
        loan_purpose: formData.loanPurpose,
        course_institution: formData.courseInstitution,
        business_purpose: formData.businessPurpose,
      };

      setLiabilities((prev) =>
        editMode
          ? prev.map((item) =>
              item.id === editId ? updatedLiability : item
            )
          : [...prev, updatedLiability]
      );

      setEditMode(false);
      setEditId(null);
      setFormData({
        institutionName: "",
        loanAmount: "",
        accountNumber: "",
        loanTenureYears: "",
        interestRate: "",
        vehicleType: "",
        loanPurpose: "",
        courseInstitution: "",
        businessPurpose: "",
      });
    } catch (error) {
      toast.error(editMode ? "Failed to update liability." : "Failed to save liability.");
      console.error(error);
    }
    setLoading(false);
  };

  const handleEdit = (liability) => {
    setEditMode(true);
    setEditId(liability.id);
    setFormData({
      institutionName: liability.institution_name,
      loanAmount: liability.loan_amount,
      accountNumber: liability.account_number || "",
      loanTenureYears: liability.loan_tenure_years || "",
      interestRate: liability.interest_rate || "",
      vehicleType: liability.vehicle_type || "",
      loanPurpose: liability.loan_purpose || "",
      courseInstitution: liability.course_institution || "",
      businessPurpose: liability.business_purpose || "",
    });
  };

  const handleDelete = async (id) => {
    if (!selectedType || !endpointMap[selectedType]) return;

    setLoading(true);
    try {
      await axios.delete(`${API}/${endpointMap[selectedType]}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`${selectedType} deleted successfully!`);
      setLiabilities((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      toast.error("Failed to delete liability.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white p-6 rounded-lg shadow-2xl mt-10 md:mt-20 overflow-y-auto">
      <header>
        <h1 className="text-3xl font-bold mb-8">Manage Your Liabilities</h1>
        <p className="text-gray-600">Add, update, and delete your liabilities efficiently.</p>
      </header>

      <div className="mb-6 border border-gray-300 rounded-lg shadow-md p-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Select Liability Type</h2>
          <select
            className="border-l-2 border-[#538d2dfd] shadow-lg p-2 text-white rounded-md w-full outline-0 bg-[#538d2dfd]"
            value={selectedType}
            onChange={handleTypeChange}
          >
            <option value="">Choose a Type</option>
            {Object.keys(endpointMap).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </section>

        {selectedType && (
          <FieldSection title={`${editMode ? "Edit" : "Add"} ${selectedType}`} icon={<FaFileInvoiceDollar />}>
            <InputWithIcon
              label="Institution Name"
              name="institutionName"
              value={formData.institutionName}
              onChange={handleInputChange}
              placeholder="Enter institution name"
              icon={<FaBuilding />}
            />
            <InputWithIcon
              label="Loan Amount"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleInputChange}
              placeholder="Enter loan amount"
              icon={<FaFileInvoiceDollar />}
            />
            {selectedType !== "Business Loan" && (
              <InputWithIcon
                label="Account Number"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                placeholder="Enter account number"
                icon={<FaUser />}
              />
            )}
            <InputWithIcon
              label="Loan Tenure (Years)"
              name="loanTenureYears"
              value={formData.loanTenureYears}
              onChange={handleInputChange}
              placeholder="Enter loan tenure"
              icon={<FaCalendarAlt />}
            />
            <InputWithIcon
              label="Interest Rate (%)"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleInputChange}
              placeholder="Enter interest rate"
              icon={<FaPercentage />}
            />
            {selectedType === "Vehicle Loan" && (
              <InputWithIcon
                label="Vehicle Type"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                placeholder="Enter vehicle type"
                icon={<FaCar />}
              />
            )}
            {selectedType === "Education Loan" && (
              <InputWithIcon
                label="Course Institution"
                name="courseInstitution"
                value={formData.courseInstitution}
                onChange={handleInputChange}
                placeholder="Enter course institution"
                icon={<FaGraduationCap />}
              />
            )}
            {selectedType === "Business Loan" && (
              <InputWithIcon
                label="Business Purpose"
                name="businessPurpose"
                value={formData.businessPurpose}
                onChange={handleInputChange}
                placeholder="Enter business purpose"
                icon={<FaBusinessTime />}
              />
            )}
          </FieldSection>
        )}

        <div className={`text-right mt-4 ${selectedType ? "" : "hidden"}`}>
          <button
            type="button"
            onClick={handleSubmit}
            className={`bg-[#538d2dfd] text-white py-2 px-6 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#4c7033fd]"
            }`}
            disabled={loading}
          >
            {loading ? (editMode ? "Updating..." : "Saving...") : editMode ? "Update Liability" : "Save Liability"}
          </button>
        </div>
      </div>

      <ToastContainer />

      <div className="my-7 border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow text-black">
        <h2 className="text-2xl font-semibold text-[#538d2dfd] mb-6">Liabilities</h2>
        {liabilities.length > 0 ? (
          <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-6">
            {liabilities.map((liability) => (
              <div
                key={liability.id}
                className="p-4 border-l-2 border-[#538d2dfd] rounded-lg shadow hover:shadow-md transition duration-200 ease-in-out flex flex-col items-center text-center"
              >
                <p className="text-lg font-semibold">{selectedType}</p>
                <p>
                  <strong>Bank:</strong> {liability.institution_name}
                </p>
                <p>
                  <strong>Amount:</strong> {liability.loan_amount}
                </p>
                <p>
                  <strong>Loan Tenure:</strong> {liability.loan_tenure_years || "N/A"} years
                </p>
                <p>
                  <strong>Interest Rate:</strong> {liability.interest_rate || "N/A"}%
                </p>
                {selectedType === "Vehicle Loan" && (
                  <p>
                    <strong>Vehicle Type:</strong> {liability.vehicle_type || "N/A"}
                  </p>
                )}
                {selectedType === "Education Loan" && (
                  <p>
                    <strong>Course Institution:</strong> {liability.course_institution || "N/A"}
                  </p>
                )}
                {selectedType === "Business Loan" && (
                  <p>
                    <strong>Business Purpose:</strong> {liability.business_purpose || "N/A"}
                  </p>
                )}
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => handleEdit(liability)}
                    className="bg-[#538d2dfd] text-white py-1 px-3 rounded-md hover:bg-[#416e23fd]"
                  >
                    <FaEdit className="inline-block"/> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(liability.id)}
                    className="bg-[#538d2dfd] text-white py-1 px-3 rounded-md hover:bg-[#3b6320fd]"
                  >
                    <FaTrash  className="inline-block"/> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No liabilities added yet.</p>
        )}
      </div>
    </div>
  );
};

export default ManageLiabilities;
