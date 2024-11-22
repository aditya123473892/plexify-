import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleBeneficiaryClick = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
  };

  const closeModal = () => {
    setSelectedBeneficiary(null);
  };

  return (
    <div style={styles.cardContainer}>
      {/* Left Section */}
      <div style={styles.leftSection}>
        <div style={styles.profileInfo}>
          <img
            src="https://via.placeholder.com/150"
            alt="User Avatar"
            style={styles.avatar}
          />
          <h2 style={styles.name}>Jane Doe</h2>
          <p style={styles.title}>Owner at Her Company Inc.</p>
          <p style={styles.bio}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat,
            delectus.
          </p>
        </div>
        <div style={styles.statusContainer}>
          <div>
            <strong>Status:</strong>{" "}
            <span style={styles.statusActive}>Active</span>
          </div>
          <div>
            <strong>Member Since:</strong> Nov 07, 2016
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div style={styles.rightSection}>
        <h3 style={styles.sectionTitle}>Beneficiaries</h3>
        {loading ? (
          <p>Loading beneficiaries...</p>
        ) : error ? (
          <p style={styles.errorText}>{error}</p>
        ) : beneficiaries.length > 0 ? (
          <div style={styles.beneficiaryList}>
            {beneficiaries.map((beneficiary, index) => (
              <div
                key={index}
                style={styles.beneficiaryCard}
                onClick={() => handleBeneficiaryClick(beneficiary)}
              >
                <img
                  src={beneficiary.img || "https://via.placeholder.com/100"}
                  alt={beneficiary.name}
                  style={styles.beneficiaryImage}
                />
                <p style={styles.beneficiaryName}>{beneficiary.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No beneficiaries found.</p>
        )}
      </div>

      {/* Modal */}
      {selectedBeneficiary && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <button style={styles.closeBtn} onClick={closeModal}>
              &times;
            </button>
            <h3>{selectedBeneficiary.name}</h3>
            <p>
              <strong>Contact:</strong> {selectedBeneficiary.contact || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {selectedBeneficiary.email || "N/A"}
            </p>
            <p>
              <strong>Entitlement:</strong>{" "}
              {selectedBeneficiary.entitlement || "N/A"}
            </p>
            <p>
              <strong>Relationship:</strong>{" "}
              {selectedBeneficiary.relationship || "N/A"}
            </p>
            <p>
              <strong>Notify:</strong>{" "}
              {selectedBeneficiary.notify ? "Yes" : "No"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  cardContainer: {
    display: "flex",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    fontFamily: "'Arial', sans-serif",
  },
  leftSection: {
    width: "35%",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    textAlign: "center",
  },
  rightSection: {
    width: "65%",
    padding: "20px",
  },
  profileInfo: {
    marginBottom: "20px",
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    marginBottom: "10px",
  },
  name: {
    fontSize: "20px",
    fontWeight: "bold",
    margin: "10px 0",
  },
  title: {
    fontSize: "16px",
    color: "#666",
  },
  bio: {
    fontSize: "14px",
    color: "#333",
    marginTop: "10px",
  },
  statusContainer: {
    marginTop: "20px",
    fontSize: "14px",
  },
  statusActive: {
    color: "green",
  },
  sectionTitle: {
    fontSize: "18px",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  beneficiaryList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "20px",
  },
  beneficiaryCard: {
    cursor: "pointer",
    textAlign: "center",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s",
  },
  beneficiaryCardHover: {
    transform: "scale(1.05)",
  },
  beneficiaryImage: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    marginBottom: "10px",
  },
  beneficiaryName: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    width: "400px",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default UserProfile;
