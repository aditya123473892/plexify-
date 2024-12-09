import React, { useState, useEffect, useContext,useRef } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaCheckCircle, FaSyncAlt, FaUser, FaLink } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../Contexts/Context";
import Section from "../Components/Section";
import InputWithIcon from "../Components/InputWithIcon";
import wealthlogo from "../assets/images/Picture_1.png";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";


const WillForm = () => {
  const { API, token,beneficiaryUser } = useContext(AuthContext);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    fatherName: "",
    motherName: "",
    address: "",
    spouseName: "",
  });

  const [witnesses, setWitnesses] = useState([{ name: "", address: "" }]);
  const [wealthDetails, setWealthDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState(null);
  const sectionRef = useRef(null);
  const [showSection, setShowSection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fetchWealthDetails = async () => {
    setLoading(true);

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
        axios.get(`${API}/insurance`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/deposits`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/cryptocurrencies`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/recurring_deposits`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/properties`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/stocks`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/mutual-funds`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/bonds`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const insurance = insuranceResponse.data.policies.map((policy) => ({
        id: `policy-${policy.policy_id}`,
        type: "Insurance Policy",
        headers: ["Policy Name", "Provider", "Coverage", "Premium"],
        details: [
          policy.policy_name,
          policy.provider,
          `$${policy.coverage_limit}`,
          `$${policy.premium_amount}`,
        ],
      }));

      const deposits = depositsResponse.data.deposits.map((deposit) => ({
        id: `deposit-${deposit.deposit_id}`,
        type: "Fixed Deposit",
        headers: ["Deposit Name", "Bank", "Amount", "Term"],
        details: [
          deposit.deposit_name,
          deposit.bank_name,
          `$${deposit.deposit_amount}`,
          deposit.deposit_term,
        ],
      }));

      const cryptos = cryptoResponse.data.cryptos.map((crypto) => ({
        id: `crypto-${crypto.id}`,
        type: "Cryptocurrency",
        headers: ["Crypto Name", "Wallet", "Amount Held", "Current Value"],
        details: [
          crypto.name,
          crypto.wallet,
          crypto.amount_held,
          `$${crypto.current_value}`,
        ],
      }));

      const recurringDeposits = recurringDepositsResponse.data.deposits.map(
        (deposit) => ({
          id: `rd-${deposit.id}`,
          type: "Recurring Deposit",
          headers: ["Bank", "RD Number", "Monthly Deposit", "Maturity Amount"],
          details: [
            deposit.bank_name,
            deposit.rd_number,
            `$${deposit.monthly_deposit_amount}`,
            `$${deposit.maturity_amount}`,
          ],
        })
      );

      const properties = propertiesResponse.data.properties.map((property) => ({
        id: `property-${property.id}`,
        type: "Property",
        headers: ["Property Name", "Location", "Area (sqft)", "Current Value"],
        details: [
          property.property_name,
          property.location,
          `${property.area_in_sqft} sqft`,
          `$${property.current_value}`,
        ],
      }));

      const stocks = stocksResponse.data.stocks.map((stock) => ({
        id: `stock-${stock.id}`,
        type: "Stock",
        headers: ["Stock Symbol", "Quantity", "Purchase Price", "Current Value"],
        details: [
          stock.symbol,
          stock.quantity,
          `$${stock.purchase_price}`,
          `$${stock.current_value}`,
        ],
      }));

      const mutualFunds = mutualFundsResponse.data.mutualFunds.map((fund) => ({
        id: `mutual-fund-${fund.id}`,
        type: "Mutual Fund",
        headers: ["Fund Name", "Manager", "Investment Amount", "Current Value"],
        details: [
          fund.fund_name,
          fund.fund_manager,
          `$${fund.investment_amount}`,
          `$${fund.current_value}`,
        ],
      }));

      const bonds = bondsResponse.data.bonds.map((bond) => ({
        id: `bond-${bond.id}`,
        type: "Bond",
        headers: ["Issuer", "Bond Type", "Face Value", "Market Value"],
        details: [
          bond.issuer,
          bond.bond_type,
          `$${bond.face_value}`,
          `$${bond.market_value}`,
        ],
      }));

      setWealthDetails([
        ...insurance,
        ...deposits,
        ...cryptos,
        ...recurringDeposits,
        ...properties,
        ...stocks,
        ...mutualFunds,
        ...bonds,
      ]);
      toast.success("Wealth details loaded successfully.");
    } catch (error) {
      console.error("Error fetching wealth details:", error);
      toast.error("Failed to load all wealth details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWealthDetails();
  }, []);

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo({ ...personalInfo, [field]: value });
  };

  const addWitness = () => {
    setWitnesses([...witnesses, { name: "", address: "" }]);
  };

  const removeWitness = (index) => {
    setWitnesses(witnesses.filter((_, i) => i !== index));
  };

  const handleWitnessChange = (index, field, value) => {
    const updated = [...witnesses];
    updated[index][field] = value;
    setWitnesses(updated);
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSignature(file);
    }
  };


  const generatePDF = async () => {
    const element = sectionRef.current;
    if (!element) {
      console.error("Element not found.");
      return;
    }

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const padding = 13;
    const contentWidth = pdfWidth - padding * 2;
    const contentHeight = pdfHeight - padding * 2;

    // Function to draw the L-shaped border
    const drawCornerBorders = () => {
      const borderThickness = 1;
      const borderColor = [83, 141, 45];
      const innerMargin = 8;
      const borderRadius = 5;

      pdf.setLineWidth(borderThickness);
      pdf.setDrawColor(...borderColor);

      pdf.setLineCap("round");
      pdf.moveTo(innerMargin + borderRadius, innerMargin);
      pdf.lineTo(pdfWidth - innerMargin - borderRadius, innerMargin);
      pdf.lineTo(pdfWidth - innerMargin, innerMargin + borderRadius);
      pdf.lineTo(pdfWidth - innerMargin, pdfHeight - innerMargin - borderRadius);
      pdf.lineTo(pdfWidth - innerMargin - borderRadius, pdfHeight - innerMargin);
      pdf.lineTo(innerMargin + borderRadius, pdfHeight - innerMargin);
      pdf.lineTo(innerMargin, pdfHeight - innerMargin - borderRadius);
      pdf.lineTo(innerMargin, innerMargin + borderRadius);
      pdf.lineTo(innerMargin + borderRadius, innerMargin);

      pdf.stroke();
    };

    drawCornerBorders();

    const scaleFactor = contentWidth / canvas.width;
    const scaledWidth = canvas.width * scaleFactor;
    const scaledHeight = canvas.height * scaleFactor;

    // If content fits on a single page
    if (scaledHeight <= contentHeight) {
      pdf.addImage(imgData, "PNG", padding, padding, scaledWidth, scaledHeight);
    } else {
      let yOffset = 0;
      while (yOffset < canvas.height) {
        const canvasSlice = document.createElement("canvas");
        canvasSlice.width = canvas.width;
        canvasSlice.height = Math.min(canvas.height - yOffset, contentHeight / scaleFactor);

        const ctx = canvasSlice.getContext("2d");
        ctx.drawImage(
          canvas,
          0,
          yOffset,
          canvas.width,
          Math.min(canvas.height - yOffset, contentHeight / scaleFactor),
          0,
          0,
          canvasSlice.width,
          canvasSlice.height
        );

        const sliceData = canvasSlice.toDataURL("image/png");
        const sliceHeight = (canvasSlice.height * contentWidth) / canvasSlice.width;

        pdf.addImage(sliceData, "PNG", padding, padding, contentWidth, sliceHeight);

        yOffset += canvasSlice.height;

        if (yOffset < canvas.height) {
          pdf.addPage();
          drawCornerBorders();
        }
      }
    }

    pdf.save("Will_Document.pdf");
  };




  const handleGenerateClick = () => {
    setShowSection(true);
    setIsLoading(true);
    setTimeout(() => {
      generatePDF();
      setIsLoading(false);
      setShowSection(false)
    }, 5000); 
  };
  const now = new Date();
  const formattedDate = `${now.getDate()} of ${now.toLocaleString('default', { month: 'long' })}, ${now.getFullYear()}`;
  
  return (




    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Will</h1>
        <p className="text-gray-600">Fill out the form below to draft your last will and testament.</p>
      </header>

      {/* Personal Information Section */}
      <Section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["fullName", "fatherName", "motherName", "spouseName", "address"].map((field, idx) => (
            <InputWithIcon
              key={idx}
              icon={<FaUser className="text-[#538d2dfd] mx-2" />}
              type={field === "address" ? "textarea" : "text"}
              placeholder={field.replace(/([A-Z])/g, " $1")}
              value={personalInfo[field]}
              onChange={(e) => handlePersonalInfoChange(field, e.target.value)}
            />
          ))}
        </div>
      </Section>

      {/* Wealth Details Section */}
      <Section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          Wealth Details
          <button onClick={fetchWealthDetails} className="ml-4 text-[#538d2dfd] hover:underline flex items-center">
            <FaSyncAlt className="mr-2" /> Refresh
          </button>
        </h2>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-t-2 border-blue-500 rounded-full"></div>
          </div>
        ) : wealthDetails.length > 0 ? (
          Object.entries(
            wealthDetails.reduce((acc, item) => {
              if (!acc[item.type]) acc[item.type] = [];
              acc[item.type].push(item);
              return acc;
            }, {})
          ).map(([type, items]) => (
            <Section key={type} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-[#538d2dfd] mb-4 flex items-center">
                {type} ({items.length})
              </h2>
              <div className="overflow-x-auto">
                {/* Headers */}
                <div className="grid grid-cols-4 gap-4 text-left mb-4 font-semibold text-gray-700">
                  {items[0].headers.map((header, idx) => (
                    <span key={idx}>{header}</span>
                  ))}
                </div>
                {/* Details */}
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-4 gap-4 mb-4">
                    {item.details.map((detail, idx) => (
                      <span key={idx}>{detail}</span>
                    ))}
                  </div>
                ))}
              </div>
            </Section>
          ))
        ) : (
          <p>No wealth details available. Please add your wealth data.</p>
        )}
      </Section>

      {/* Witnesses Section */}
      <Section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Witnesses</h2>
        {witnesses.map((witness, index) => (
          <div key={index} className="mb-4">
            <div className="flex gap-4">
              <InputWithIcon
                icon={<FaUser className="text-[#538d2dfd] mx-2" />}
                type="text"
                placeholder="Witness Name"
                value={witness.name}
                onChange={(e) => handleWitnessChange(index, "name", e.target.value)}
              />
              <InputWithIcon
                icon={<FaLink className="text-[#538d2dfd] mx-2" />}
                type="text"
                placeholder="Witness Address"
                value={witness.address}
                onChange={(e) => handleWitnessChange(index, "address", e.target.value)}
              />
            </div>
            <button
              onClick={() => removeWitness(index)}
              className="text-red-500 flex items-center mt-2"
            >
              <FaTrash className="mr-2" /> Remove Witness
            </button>
          </div>
        ))}
        <button
          onClick={addWitness}
          className="text-[#538d2dfd] flex items-center mt-4"
        >
          <FaPlus className="mr-2" /> Add Witness
        </button>
      </Section>

      {/* Signature Section */}
      <Section className="bg-white p-6 rounded-lg shadow-md space-y-6">
  <h2 className="text-2xl font-semibold text-[#538d2dfd] mb-4 flex items-center space-x-2">
    <span>Signature</span>
    <span className="text-sm text-gray-500">(Upload your signature below)</span>
  </h2>
  
  {/* Signature Upload Input */}
  <div className="flex items-center space-x-4">
    <label
      htmlFor="signatureUpload"
      className="cursor-pointer bg-[#538d2dfd] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#4c7033fd] transition-all duration-200 ease-in-out"
    >
      Choose File
    </label>
    <input
      id="signatureUpload"
      type="file"
      accept="image/*"
      onChange={handleSignatureUpload}
      className="hidden"
    />
    <span className="text-gray-500 italic">
      {signature ? "Signature uploaded successfully!" : "No file chosen"}
    </span>
  </div>

  {/* Uploaded Signature Preview */}
  {signature && (
    <div className="mt-4">
      <h4 className="text-lg font-semibold text-gray-800 mb-2">Uploaded Signature:</h4>
      <div className="flex justify-center">
        <img
          src={URL.createObjectURL(signature)}
          alt="Uploaded Signature"
          className="w-40 h-40 rounded-lg border border-gray-300 shadow-lg object-contain"
        />
      </div>
    </div>
  )}

</Section>


<div className="mt-10">
  <button
    className="bg-[#538d2dfd] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#4c7033fd] transition-colors flex items-center justify-center"
    onClick={() => {
      handleGenerateClick();
      generatePDF();
    }}
  >
    {isLoading ? (
      <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin mr-2"></div> // Spinner
    ) : (
      "Submit"
    )}
    {isLoading ? "Generating..." : ""} {/* Text changes to "Generating..." during loading */}
  </button>
</div>


      <ToastContainer />







{/* pdf */}

  {showSection && (
<section className={`bg-white p-6 rounded-lg shadow-md pdf mt-12`}  ref={sectionRef}>
        <div className="flex justify-center border-b-8 border-[#538d2dfd]">
    
      <div className="flex items-center justify-center space-x-4 pb-4">
          {/* Logo Section */}
          <img
            src={wealthlogo}
            alt="Wealth Logo"
            style={{
              width: "74px", // Adjusted logo width
              height: "74px", // Adjusted logo height
              objectFit: "contain", // Maintain aspect ratio
            }}
          />

          <div className="text-left">
            <h2 className="text-2xl md:text-4xl font-bold text-[#daa431]">
              Manage Grow Inheritff
            </h2>
            <p className="text-xl text-black pt-3">
              चिंतामुक्त भविष्य, विरासत का सुखद सफर
            </p>
          </div>
        </div>
        </div>
  {/* Personal Information */}
  <div className="my-7 border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
    <h2 className="text-2xl font-semibold text-[#538d2dfd] mb-4">Personal Information</h2>
    <p className="text-gray-700 mb-6">
      I, <strong className="text-[#538d2dfd] ">{personalInfo.fullName}</strong>, son/daughter of <strong className="text-[#538d2dfd] ">{personalInfo.fatherName}</strong> and <strong className="text-[#538d2dfd] ">{personalInfo.motherName}</strong>, residing at <strong className="text-[#538d2dfd] ">{personalInfo.address}</strong>, being of sound mind and memory, do hereby make, publish, and declare this to be my Last Will and Testament, revoking any and all former Wills and Codicils heretofore made by me.
    </p>
    <h3 className="text-xl font-semibold text-[#538d2dfd] mb-4">Declaration</h3>
    <p className="text-gray-700 mb-6">
      I declare that this is my Last Will and Testament. I am married to Mrs. <strong className="text-[#538d2dfd] ">{personalInfo.spouseName}</strong>, and I have the following children and dependents:
    </p>
    {/* Children list */}
 

    <p className="text-gray-700 mb-6">
      I am the owner and in possession of the following wealth:
    </p>
  </div>

  {/* Wealth Details */}
  { wealthDetails.length > 0 ? (
    <Section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-4xl font-semibold text-[#538d2dfd] mb-6 text-center">
        Wealth Details
      </h2>
      {Object.entries(
        wealthDetails.reduce((acc, item) => {
          if (!acc[item.type]) acc[item.type] = [];
          acc[item.type].push(item);
          return acc;
        }, {})
      ).map(([type, items]) => (
        <div key={type} className="mb-6">
          <h3 className="text-xl font-semibold text-[#538d2dfd] mb-4 pb-3 flex items-center  border-b-2 border-[#538d2dfd]">
            {type} ({items.length})
          </h3>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-4 gap-4 text-left mb-4 font-semibold text-black">
              {items[0].headers.map((header, idx) => (
                <span key={idx}>{header}</span>
              ))}
            </div>
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-4 gap-4 mb-4 text-black">
                {item.details.map((detail, idx) => (
                  <span key={idx}>{detail}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </Section>
  ) : (
    <p>No wealth details available. Please add your wealth data.</p>
  )}


{/* Beneficiaries Section */}
<div className="my-7 border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow text-black">
  <h2 className="text-2xl font-semibold text-[#538d2dfd] mb-6">Beneficiaries</h2>
  {beneficiaryUser && beneficiaryUser.length > 0 ? (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-6">
      {beneficiaryUser.map((beneficiary, index) => (
        <div
          key={beneficiary.beneficiary_id}
          className="p-4 border rounded-lg shadow-sm hover:shadow-md transition duration-200 ease-in-out flex flex-col items-center text-center"
        >
          {/* Placeholder Profile Picture */}
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-lg">
            {beneficiary.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
          
          {/* Beneficiary Name */}
          <p className="mt-4 text-lg font-semibold text-[#538d2dfd]">
            {beneficiary.name}
          </p>

          {/* Relationship */}
          <p className="text-black text-sm">
            <strong>Relationship:</strong> {beneficiary.relationship}
          </p>

          {/* Contact */}
          <p className="text-black text-sm">
            <strong>Contact:</strong>{" "}
            {beneficiary.contact ? beneficiary.contact : "Not provided"}
          </p>

          {/* Entitlement */}
          <p className="text-black text-sm">
            <strong>Entitlement:</strong> {beneficiary.entitlement}%
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p>No beneficiaries added yet.</p>
  )}
</div>



  {/* Residuary Estate */}
  <div className="my-7 border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow text-black">
    <h3 className="text-xl font-semibold text-[#538d2dfd] mb-4">Residuary Estate</h3>
    <p className="text-gray-700 mb-6">
      Any remaining assets not specified above shall be distributed in the following proportions:
    </p>
    <ul className="list-disc pl-8 text-gray-700 mb-6">
      <li>33% to Mr. A (son)</li>
      <li>33% to Ms. B (daughter)</li>
      <li>34% to Mrs. A (wife)</li>
    </ul>
  </div>

  {/* Guardianship */}
  <div className="my-7 border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow text-black">
    <h3 className="text-xl font-semibold text-[#538d2dfd] mb-4">Guardianship</h3>
    <p className="text-gray-700 mb-6">
      In the event that any of my children are minors at the time of my death, I appoint Mrs. <strong className="text-[#538d2dfd] ">{personalInfo.spouseName}</strong> as the guardian of their persons and property. If she is unable or unwilling to serve, I appoint Mr. <strong className="text-[#538d2dfd] ">{personalInfo.alternateGuardian}</strong> as guardian.
    </p>
  </div>

  {/* Signature and Witnesses */}
  <div className="my-7 border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow text-black">
    <h3 className="text-xl font-semibold text-[#538d2dfd] mb-4">Signature and Witnesses</h3>
    <p className="text-gray-700 mb-6">
      In witness whereof, I, <strong className="text-[#538d2dfd] ">{personalInfo.fullName}</strong>, have to this my Last Will and Testament, consisting of [number] pages, set my hand and seal this <span className="text-[#538d2dfd] ">{formattedDate}</span>.
    </p>
    <p className="text-gray-700 mb-6">
      Signed, sealed, published, and declared by <strong className="text-[#538d2dfd] ">{personalInfo.fullName}</strong>, the Testator, as and for his/her Last Will and Testament, in the presence of us, who, at his/her request and in his/her presence and in the presence of each other, have hereunto subscribed our names as witnesses this <span className="text-[#538d2dfd] ">{formattedDate}</span>.
    </p>

    {/* Witnesses Section */}
    <div className="my-7 p-6 rounded-lg  text-black">
  <h2 className="text-2xl font-semibold text-[#538d2dfd] mb-6">Witnesses</h2>
  {witnesses.length > 0 ? (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-6">
      {witnesses.map((witness, index) => (
        <div
          key={index}
          className="p-4 border rounded-lg shadow-sm hover:shadow-md transition duration-200 ease-in-out flex flex-col items-center text-center"
        >
          {/* Placeholder Profile Picture */}
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-lg">
            {witness.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>

          {/* Witness Number */}
          <p className="mt-4 text-lg font-semibold text-[#538d2dfd]">
            Witness {index + 1}
          </p>

          {/* Witness Name */}
          <p className="text-black text-sm">
            <strong>Name:</strong> {witness.name}
          </p>

          {/* Witness Address */}
          <p className="text-black text-sm">
            <strong>Address:</strong> {witness.address || "Not provided"}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p>No witnesses added yet.</p>
  )}
</div>

    <div className="my-7  p-6 rounded-lg text-end">
          <h2 className="text-2xl font-semibold text-[#538d2dfd] mb-4">Signature</h2>
          {signature ? (
            <div className="mt-4 flex justify-end">
              <img src={URL.createObjectURL(signature)} alt="Signature" className="w-32 h-32 mt-2" />
            </div>
          ) : (
            <p>No signature uploaded yet.</p>
          )}
        </div>


  </div>
</section>

        )}




    </div>







  );
};

export default WillForm;
