import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from "../Contexts/Context";
import Section from '../Components/Section';
import { toast, ToastContainer } from "react-toastify";
const BeneficiaryDetails = () => {
  const { API, token } = useContext(AuthContext);
  const { beneficiary_id } = useParams();
  const [beneficiary, setBeneficiary] = useState(null);
  const [beneficiaryDetails, setBeneficiaryDetails] = useState([]); // Default to an empty array
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBeneficiaryDetails = async () => {
      if (!beneficiary_id) {
        return;
      }
      try {
        const response = await axios.get(`${API}/beneficiary/${beneficiary_id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        setBeneficiary(response.data.beneficiary[0]);
        setBeneficiaryDetails({
          recurringDeposits: response.data.recurringDeposits || [],
          properties: response.data.properties || [],
          preciousMetals: response.data.preciousMetals || [],
          stocks: response.data.stocks || [],
          bonds: response.data.bonds || [],
        });
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
  
    if (beneficiary_id) {
      fetchBeneficiaryDetails();
    }
  }, [beneficiary_id, API, token]);
  
  

  if (loading) {
    return <p>Loading...</p>; // You can replace this with a spinner or skeleton loader.
  }

  if (error) {
    return <p>Error fetching beneficiary details.</p>;
  }



  const bufferToBase64 = (buffer) => {
    const binary = String.fromCharCode.apply(null, new Uint8Array(buffer.data));
    return `data:${buffer.type};base64,${btoa(binary)}`;
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString()}`;
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBeneficiary((prevBeneficiary) => ({
      ...prevBeneficiary,
      [name]: value,
    }));
  };
  
  const handleSaveChanges = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        `${API}/update-beneficiary`,
        {
          beneficiary_id: beneficiary_id,
          updatedData: beneficiary, 
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        toast.success('Beneficiary details updated successfully');
      }
    } catch (error) {
      console.error('Error updating beneficiary:', error);
      toast.error('Error updating beneficiary details');
    }
  };
  
  

  return (
    <div className="min-h-screen bg-white p-6 rounded-lg shadow-2xl mt-10 md:mt-20 overflow-y-auto">
<Section className="bg-gray-50 p-8 rounded-lg shadow-lg border border-gray-300">
      <h2 className="text-3xl font-semibold text-[#2d3e50] mb-8">Beneficiary Information</h2>
      
      <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
        {/* Beneficiary Image or Initials */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-white font-semibold text-3xl shadow-lg mb-6 md:mb-0">
          {beneficiary.document && beneficiary.document.data ? (
            <img
              src={bufferToBase64(beneficiary.document)} // Convert buffer to base64 if necessary
              alt="Beneficiary"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span>{beneficiary.name.charAt(0)}</span> // Display initial if no document is available
          )}
        </div>

        {/* Beneficiary Editable Details */}
        <div className="ml-0 md:ml-6">
          <input
            type="text"
            name="name"
            value={beneficiary.name}
            onChange={handleInputChange}
            className="text-xl font-semibold text-[#2d3e50] mb-2 w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="relationship"
            value={beneficiary.relationship}
            onChange={handleInputChange}
            className="text-sm text-gray-600 mb-2 w-full p-2 border border-gray-300 rounded-md"
            placeholder="Relationship"
          />
          <input
            type="text"
            name="contact"
            value={beneficiary.contact || ''}
            onChange={handleInputChange}
            className="text-sm text-gray-600 mb-2 w-full p-2 border border-gray-300 rounded-md"
            placeholder="Contact"
          />
          <input
            type="number"
            name="entitlement"
            value={beneficiary.entitlement}
            onChange={handleInputChange}
            className="text-sm text-gray-600 mb-2 w-full p-2 border border-gray-300 rounded-md"
            placeholder="Entitlement (%)"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          type="button" // This is not inside a form, so type="button" is used
          onClick={handleSaveChanges}
          className="px-6 py-2 text-white bg-[#3a5e22fd] rounded-md shadow-md hover:bg-[#35581efd]"
        >
          Save Changes
        </button>
      </div>
    </Section>




<Section className="bg-white p-6 rounded-lg shadow-md mt-6">
  <h3 className="text-3xl font-semibold text-[#538d2dfd] mb-4">Beneficiary Investment Details</h3>

  {beneficiaryDetails.recurringDeposits && beneficiaryDetails.recurringDeposits.length > 0 && (
    <Section id="recurring-deposits" className="bg-white p-4 rounded-lg  mb-6">
      <h4 className="font-semibold text-[#538d2dfd] text-2xl">Recurring Deposits</h4>
      {beneficiaryDetails.recurringDeposits.map((item, index) => (
        <Link 
          key={index} 
          to={`/recurring-deposit`} 
          className="block bg-gray-100 p-4 rounded-lg  hover:bg-gray-200 transition mb-4"
        >
          <strong className='font-semibold text-[#538d2dfd]'>RD {index + 1}</strong>
          <p><strong>RD Number:</strong> {item.rd_number}</p>
          <p><strong>Monthly Deposit Amount:</strong> {formatCurrency(item.monthly_deposit_amount)}</p>
          <p><strong>Interest Rate:</strong> {item.rd_interest_rate}%</p>
          <p><strong>Maturity Amount:</strong> {formatCurrency(item.rd_maturity_amount)}</p>
          <p><strong>Bank Name:</strong> {item.rd_bank_name}</p>
        </Link>
      ))}
    </Section>
  )}

  {beneficiaryDetails.properties && beneficiaryDetails.properties.length > 0 && (
    <Section id="properties" className="bg-white p-4 rounded-lg shadow mb-6">
      <h4 className="font-semibold text-[#538d2dfd] text-2xl">Properties</h4>
      {beneficiaryDetails.properties.map((item, index) => (
        <Link 
          key={index} 
          to={`/property`} 
          className="block bg-gray-100 p-4 rounded-lg  hover:bg-gray-200 transition mb-4"
        >
          <strong className='font-semibold text-[#538d2dfd]'>Property {index + 1}</strong>
          <p><strong>Property Name:</strong> {item.property_name}</p>
          <p><strong>Location:</strong> {item.location}</p>
          <p><strong>Area:</strong> {item.area_in_sqft} sqft</p>
          <p><strong>Purchase Price:</strong> {formatCurrency(item.purchase_price)}</p>
          <p><strong>Property Value:</strong> {formatCurrency(item.property_value)}</p>
        </Link>
      ))}
    </Section>
  )}

  {beneficiaryDetails.preciousMetals && beneficiaryDetails.preciousMetals.length > 0 && (
    <Section id="precious-metals" className="bg-white p-4 rounded-lg shadow mb-6">
      <h4 className="font-semibold text-[#538d2dfd] text-2xl">Precious Metals</h4>
      {beneficiaryDetails.preciousMetals.map((item, index) => (
        <Link 
          key={index} 
          to={`/precious-metals`} 
          className="block bg-gray-100 p-4 rounded-lg  hover:bg-gray-200 transition mb-4"
        >
          <strong className='font-semibold text-[#538d2dfd]'>Metal {index + 1}</strong>
          <p><strong>Metal Type:</strong> {item.metal_type}</p>
          <p><strong>Weight:</strong> {item.weight} grams</p>
          <p><strong>Purchase Price:</strong> {formatCurrency(item.pm_purchase_price)}</p>
          <p><strong>Current Value:</strong> {formatCurrency(item.pm_current_value)}</p>
        </Link>
      ))}
    </Section>
  )}

  {beneficiaryDetails.stocks && beneficiaryDetails.stocks.length > 0 && (
    <Section id="stocks" className="bg-white p-4 rounded-lg shadow mb-6">
      <h4 className="font-semibold text-[#538d2dfd] text-2xl">Stocks</h4>
      {beneficiaryDetails.stocks.map((item, index) => (
        <Link 
          key={index} 
          to={`/stocks`} 
          className="block bg-gray-100 p-4 rounded-lg  hover:bg-gray-200 transition mb-4"
        >
          <strong className='font-semibold text-[#538d2dfd]'>Stock {index + 1}</strong>
          <p><strong>Stock Symbol:</strong> {item.symbol}</p>
          <p><strong>Purchase Price:</strong> {formatCurrency(item.stock_purchase_price)}</p>
          <p><strong>Quantity:</strong> {item.quantity}</p>
          <p><strong>Current Value:</strong> {formatCurrency(item.stock_current_value)}</p>
        </Link>
      ))}
    </Section>
  )}

  {beneficiaryDetails.bonds && beneficiaryDetails.bonds.length > 0 && (
    <Section id="bonds" className="bg-white p-4 rounded-lg shadow mb-6">
      <h4 className="font-semibold text-[#538d2dfd] text-2xl">Bonds</h4>
      {beneficiaryDetails.bonds.map((item, index) => (
        <Link 
          key={index} 
          to={`/bonds`} 
          className="block bg-gray-100 p-4 rounded-lg  hover:bg-gray-200 transition mb-4"
        >
          <strong className='font-semibold text-[#538d2dfd]'>Bond {index + 1}</strong>
          <p><strong>Issuer:</strong> {item.issuer}</p>
          <p><strong>Bond Type:</strong> {item.bond_type}</p>
          <p><strong>Face Value:</strong> {formatCurrency(item.face_value)}</p>
          <p><strong>Bond Interest Rate:</strong> {item.bond_interest_rate}</p>
        </Link>
      ))}
    </Section>
  )}
</Section>




<ToastContainer/>
    </div>
  );
};

export default BeneficiaryDetails;
