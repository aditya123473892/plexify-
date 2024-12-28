import React, { useState, useContext, useEffect } from "react";
import {
  FaUser,
  FaRupeeSign,
  FaIdCard,
  FaPhone,
  FaEnvelope,
  FaPlus,
  FaFileUpload,
  FaCheckCircle,
  FaEye
} from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import Section from "../Components/Section";
import { toast, ToastContainer } from "react-toastify";

import axios from "axios";
import { AuthContext } from "../Contexts/Context";

const NPSManagement = () => {
  const { API, token } = useContext(AuthContext);

  const [npsDetails, setNpsDetails] = useState([
    { name: "", phone: "", email: "", npsNumber: "", contribution: "", nominee: "" },
  ]);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Fetch NPS data when the component mounts
  useEffect(() => {
    const fetchNpsData = async () => {
      try {
        const response = await axios.get(`${API}/nps`, {
          headers: {
            Authorization: `Bearer ${token}`, // Passing the token for authentication
            "Content-Type": "application/json",
          },
        });

        if (response.data.npsDetails && response.data.npsDetails.length > 0) {
       
          const formattedNpsDetails = response.data.npsDetails.map((nps) => {
            const documentBlob = nps.document
            ? new Blob([new Uint8Array(nps.document.data)], { type: "application/pdf" })
            : null;
        return{
            name: nps.name || "",
            phone: nps.phone || "",
            email: nps.email || "",
            npsNumber: nps.nps_number || "",
            contribution: nps.contribution || "",
            nominee: nps.nominee || "",
            document: setUploadedFile(documentBlob),
        }
          });
          setNpsDetails(formattedNpsDetails);
        } else {
          // If no NPS details are found, initialize with empty data
          setNpsDetails([{
            name: "",
            phone: "",
            email: "",
            npsNumber: "",
            contribution: "",
            nominee: "",
            document: null,
          }]);
        }
      } catch (error) {
        console.error("Error fetching NPS data:", error);
        toast.error("Error fetching NPS data. Please try again.");
      }
    };

    fetchNpsData();
  }, [API, token]); // Dependency array ensures effect runs when API or token changes

  const handleNpsChange = (index, field, value) => {
    const newNpsDetails = [...npsDetails];
    newNpsDetails[index][field] = value;
    setNpsDetails(newNpsDetails);
  };

  const addNpsDetail = () => {
    setNpsDetails([...npsDetails, { name: "", phone: "", email: "", npsNumber: "", contribution: "", nominee: "" }]);
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      setUploadedFile(files[0]); // Update the single document
      console.log("Uploaded document:", files[0]);
    }
  };

  const handleSubmit = async () => {
    const data = { npsDetails };

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      if (uploadedFile) {
        formData.append("document", uploadedFile);
      }

      const response = await axios.post(`${API}/nps_data`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("NPS details saved successfully!");
      } else {
        toast.error("Failed to save NPS details. Please try again.");
      }
    } catch (error) {
      console.error("Error saving NPS details:", error);
      toast.error("An error occurred while saving NPS details.");
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <ToastContainer />
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Your NPS</h1>
        <p className="text-gray-600">
          Keep track of your National Pension System (NPS) investments effortlessly.
        </p>
      </header>

      {npsDetails.map((nps, index) => (
        <FieldSection title={`NPS Detail ${index + 1}`} key={index}>
          <InputWithIcon
            icon={<FaUser className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Account Holder Name"
            value={nps.name}
            onChange={(e) => handleNpsChange(index, "name", e.target.value)}
          />
          <InputWithIcon
            icon={<FaPhone className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Contact Number"
            value={nps.phone}
            onChange={(e) => handleNpsChange(index, "phone", e.target.value)}
          />
          <InputWithIcon
            icon={<FaEnvelope className="text-[#538d2dfd] mx-2" />}
            type="email"
            placeholder="Email Address"
            value={nps.email}
            onChange={(e) => handleNpsChange(index, "email", e.target.value)}
          />
          <InputWithIcon
            icon={<FaIdCard className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="NPS Account Number"
            value={nps.npsNumber}
            onChange={(e) => handleNpsChange(index, "npsNumber", e.target.value)}
          />
          <InputWithIcon
            icon={<span className="text-[#538d2dfd] mx-2 font-extrabold">₹</span>}
            type="number"
            placeholder="Annual Contribution"
            value={nps.contribution}
            onChange={(e) => handleNpsChange(index, "contribution", e.target.value)}
          />
          <InputWithIcon
            icon={<FaUser className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Nominee Name"
            value={nps.nominee}
            onChange={(e) => handleNpsChange(index, "nominee", e.target.value)}
          />
        </FieldSection>
      ))}

      <button
        onClick={addNpsDetail}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
      >
        <FaPlus className="inline mr-2" /> Add NPS Detail
      </button>

      <Section title="Document Upload">
        <div className="flex items-center border-l-2 border-[#538d2dfd] rounded-md shadow-lg mb-4">
          
          <input
            type="file"
              name="document"
    accept="application/pdf"
            className="border-0 rounded-md p-3 w-full bg-transparent"
            onChange={handleFileChange}
          />
        </div>

        {uploadedFile ? (
    <div className="mt-4 flex items-center space-x-4">
      <a
        href={URL.createObjectURL(uploadedFile)}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#538d2dfd] text-white p-2 rounded-md shadow-md hover:bg-[#4c7033fd] inline-flex items-center"
      >
        <FaEye className="mr-2" />
        View Uploaded File
      </a>
      <button
        onClick={() => setUploadedFile(null)} // Remove the document
        className="text-red-500 hover:text-red-700 underline"
      >
        Remove File
      </button>
    </div>
  ) : (
    <p className="text-gray-500 mt-2">No document uploaded. Please upload one.</p>
  )}

      </Section>

      <button
        onClick={handleSubmit}
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Save NPS Details
      </button>
    </div>
  );
};

export default NPSManagement;
