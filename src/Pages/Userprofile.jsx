import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch beneficiaries on component mount
  useEffect(() => {
    const fetchBeneficiaries = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3523/beneficiaries");
        setBeneficiaries(response.data.beneficiaries || []);
      } catch (err) {
        console.error("Error fetching beneficiaries:", err);
        setError("Failed to fetch beneficiaries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBeneficiaries();
  }, []);

  const handleAddBeneficiaryRedirect = () => {
    window.location.href = "/beneficiary"; // Replace with your actual URL
  };

  return (
    <div className="profile-container">
      {/* Left Section */}
      <div className="left-section">
        <div className="profile-header">
          <h2 className="profile-name">Jane Doe</h2>
          <p className="profile-title">Owner at Her Company Inc.</p>
          <p className="profile-desc">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Reprehenderit, eligendi dolorum sequi illum qui unde aspernatur non
            deserunt.
          </p>
          <div className="status">
            <strong>Status:</strong>{" "}
            <span className="status-active">Active</span>
          </div>
          <div className="member-info">
            <strong>Member since:</strong> <span>Nov 07, 2016</span>
          </div>
        </div>

        {/* Beneficiaries Section */}
        <div className="similar-profiles">
          <h3 className="section-title">Beneficiaries</h3>
          {loading ? (
            <p>Loading beneficiaries...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : beneficiaries.length > 0 ? (
            <div className="beneficiary-list">
              {beneficiaries.map((beneficiary, index) => (
                <div key={index} className="beneficiary">
                  <img
                    src={beneficiary.img || "https://via.placeholder.com/50"}
                    alt={beneficiary.name}
                  />
                  <p>{beneficiary.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No beneficiaries found.</p>
          )}
          <button
            className="add-beneficiary-btn"
            onClick={handleAddBeneficiaryRedirect}
          >
            Add Beneficiary
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="right-section">
        {/* About Section */}
        <div className="about-section">
          <h3 className="section-title">About</h3>
          <p>
            <strong>First Name:</strong> Jane
          </p>
          <p>
            <strong>Last Name:</strong> Doe
          </p>
          <p>
            <strong>Gender:</strong> Female
          </p>
          <p>
            <strong>Email:</strong> jane@example.com
          </p>
          <p>
            <strong>Contact No.:</strong> +11 998001001
          </p>
          <p>
            <strong>Current Address:</strong> Beech Creek, PA, Pennsylvania
          </p>
          <p>
            <strong>Permanent Address:</strong> Arlington Heights, IL, Illinois
          </p>
          <p>
            <strong>Birthday:</strong> Feb 06, 1998
          </p>
        </div>

        {/* Experience Section */}
        <div className="experience-section">
          <h3 className="section-title">Experience</h3>
          <ul>
            <li>Owner at Her Company Inc. (March 2020 - Now)</li>
            <li>Owner at Her Company Inc. (March 2020 - Now)</li>
            <li>Owner at Her Company Inc. (March 2020 - Now)</li>
          </ul>
        </div>

        {/* Education Section */}
        <div className="education-section">
          <h3 className="section-title">Education</h3>
          <ul>
            <li>Masters Degree in Oxford (March 2020 - Now)</li>
            <li>Bachelors Degree in LPU (March 2020 - Now)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
