import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  FaClipboard,
  FaTag,
  FaDollarSign,
  FaCheckCircle,
} from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import Section from "../Components/Section";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";

function InsurancePage() {
  const { API, token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    policyName: "",
    policyNumber: "",
    provider: "",
    policyType: "Life Insurance",
    policyPeriod: "",
    premiumAmount: "",
    coverageLimit: "",
    maturityAmount: "",
    nomineeName: "",
    nomineeRelation: "",
    document: null, // Add a state for the document
  });
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Flag for edit mode

  // Fetch insurance data on component mount
  useEffect(() => {
    const fetchInsuranceData = async () => {
      try {
        const response = await axios.get(`${API}/insurance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.policies.length > 0) {
          const policy = response.data.policies[0]; // Assuming the user has only one policy for simplicity
          setFormData({
            policyName: policy.policy_name,
            policyNumber: policy.policy_number,
            provider: policy.provider,
            policyType: policy.policy_type,
            policyPeriod: policy.policy_period,
            premiumAmount: policy.premium_amount,
            coverageLimit: policy.coverage_limit,
            maturityAmount: policy.maturity_amount,
            nomineeName: policy.nominee_name || "",
            nomineeRelation: policy.nominee_relation || "",
            document: null, // Assuming document is not fetched here
          });
          setIsEditMode(false); // If data exists, set view mode
        }
      } catch (error) {
        console.error("Error fetching insurance data:", error);
        toast.error("Failed to fetch insurance data.");
      }
    };

    fetchInsuranceData();
  }, [API, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      setFormData((prevData) => ({
        ...prevData,
        document: files[0], // Store the file in the state
      }));
    }
  };

  const handleSave = async () => {
    console.log("Form data before saving:", formData);

    if (
      !formData.policyName ||
      !formData.policyNumber ||
      !formData.premiumAmount
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!formData.document) {
      toast.error("Please upload a policy document.");
      return;
    }

    setLoading(true);
    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "document") {
        formDataToSend.append(key, formData[key]);
      }
    });

    formDataToSend.append("document", formData.document);

    try {
      const response = await axios.post(`${API}/insurance`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response:", response.data);
      toast.success("Insurance policy saved successfully!");
      setLoading(false);
      setIsEditMode(false); // Set to view mode after saving
    } catch (error) {
      console.error("Error saving insurance policy:", error);
      toast.error("Failed to save insurance policy.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Manage Your Insurance Policies</h1>
        <p className="mt-2">
          Easily add, view, and manage your insurance policies with helpful
          features.
        </p>
      </header>

      <Section title="Select Policy Type" className="mb-10">
        <select
          name="policyType"
          value={formData.policyType}
          onChange={handleChange}
          className="border-l-2 border-[#538d2dfd] shadow-lg p-2 text-white rounded-md w-full outline-0 bg-[#538d2dfd]"
          disabled={!isEditMode} // Disable in view mode
        >
          <option>Life Insurance</option>
          <option>Health Insurance</option>
          <option>Car Insurance</option>
          <option>Home Insurance</option>
          <option>Term Insurance</option>
          <option>Indemnity Information</option>
          <option>Others</option>
        </select>
      </Section>

      <Section title="Policy Details" className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputWithIcon
            icon={<FaClipboard />}
            placeholder="Policy Name"
            name="policyName"
            value={formData.policyName}
            type="text"
            onChange={handleChange}
            readOnly={!isEditMode} // Disable input if not in edit mode
          />
          <InputWithIcon
            icon={<FaTag />}
            placeholder="Policy Number"
            name="policyNumber"
            type="number"
            value={formData.policyNumber}
            onChange={handleChange}
            readOnly={!isEditMode} // Disable input if not in edit mode
          />
          <InputWithIcon
            icon={<FaClipboard />}
            placeholder="Provider"
            name="provider"
            type="text"
            value={formData.provider}
            onChange={handleChange}
            readOnly={!isEditMode} // Disable input if not in edit mode
          />
          <InputWithIcon
            icon={<FaClipboard />}
            placeholder="Policy Period"
            name="policyPeriod"
            type="text"
            value={formData.policyPeriod}
            onChange={handleChange}
            readOnly={!isEditMode} // Disable input if not in edit mode
          />
          <InputWithIcon
            icon={<FaClipboard />}
            placeholder="Nominee Name"
            name="nomineeName"
            type="text"
            value={formData.nomineeName}
            onChange={handleChange}
            readOnly={!isEditMode} // Disable input if not in edit mode
          />
          <InputWithIcon
            icon={<FaClipboard />}
            placeholder="Nominee Relation"
            name="nomineeRelation"
            type="text"
            value={formData.nomineeRelation}
            onChange={handleChange}
            readOnly={!isEditMode} // Disable input if not in edit mode
          />
          <InputWithIcon
            icon={<FaDollarSign />}
            placeholder="Premium Amount"
            name="premiumAmount"
            type="number"
            value={formData.premiumAmount}
            onChange={handleChange}
            readOnly={!isEditMode} // Disable input if not in edit mode
          />
          <InputWithIcon
            icon={<FaDollarSign />}
            placeholder="Coverage Limit"
            name="coverageLimit"
            type="number"
            value={formData.coverageLimit}
            onChange={handleChange}
            readOnly={!isEditMode} // Disable input if not in edit mode
          />
          <InputWithIcon
            className="col-span-2"
            icon={<FaCheckCircle />}
            placeholder="Maturity Amount"
            name="maturityAmount"
            type="number"
            value={formData.maturityAmount}
            onChange={handleChange}
            readOnly={!isEditMode} // Disable input if not in edit mode
          />
        </div>
      </Section>

      <Section title="Upload Document" className="mb-10">
        <input
          type="file"
          name="document"
          onChange={handleFileChange}
          className="border-l-2 border-[#538d2dfd] shadow-lg p-2 text-white rounded-md w-full outline-0"
          disabled={!isEditMode} // Disable in view mode
        />
      </Section>

      <div className="text-right">
        <button
          onClick={isEditMode ? handleSave : () => setIsEditMode(true)} // Toggle edit mode
          className="bg-[#538d2dfd] text-white py-2 px-6 rounded-md shadow-md hover:bg-[#4c7033fd]"
          disabled={loading}
        >
          {loading ? "Saving..." : isEditMode ? "Save Changes" : "Edit Policy"}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default InsurancePage;
