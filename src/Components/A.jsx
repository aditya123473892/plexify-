import React from 'react';

const styles = {
    page: {
      padding: '30px',
      backgroundColor: '#fff',
    },
    section: {
      marginBottom: '20px',
      marginTop: '1.75rem',
      padding: '1.5rem',
      borderLeft: '2px solid #538d2dfd',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '1.25rem', // equivalent to text-xl
      fontWeight: '600', // equivalent to font-semibold
      display: 'flex', // equivalent to flex
      marginBottom: '1rem', // equivalent to mb-4
      color: '#538d2dfd',
    },
    titleSpan: {
      display: 'inline', // equivalent to inline
      marginRight: '0.75rem', // equivalent to mr-3
      color: '#538d2dfd', // equivalent to text-[#538d2dfd]
      marginTop: '0.25rem', // equivalent to mt-1
    },
    text: {
      fontSize: '12px',
    },
  };
  

const WillHTML = () => {
  // Static data for testing
  const personalInfo = {
    fullName: 'John Doe',
    fatherName: 'Richard Doe',
    motherName: 'Jane Doe',
    spouseName: 'Anna Doe',
    address: '1234 Elm Street, Springfield',
  };

  const witnesses = [
    { name: 'Sam Smith', address: '5678 Oak Street' },
    { name: 'Tom Brown', address: '9101 Pine Avenue' },
  ];

  const wealthDetails = [
    {
      id: 'bank-account-1',
      type: 'Bank Account',
      headers: ['Account No', 'Bank'],
      details: ['Account No: 123456', 'Bank: ABC Bank'],
    },
    {
      id: 'property-1',
      type: 'Property',
      headers: ['Property Name', 'Details'],
      details: ['House at 1234 Elm Street', 'Car Model: Tesla'],
    },
    {
      id: 'insurance-1',
      type: 'Insurance Policy',
      headers: ['Policy Name', 'Provider', 'Coverage', 'Premium'],
      details: ['Life Insurance', 'ABC Insurance Co.', '$500,000', '$1,200/year'],
    },
    {
      id: 'deposit-1',
      type: 'Fixed Deposit',
      headers: ['Deposit Name', 'Bank', 'Amount', 'Term'],
      details: ['Retirement Fund', 'XYZ Bank', '$50,000', '5 years'],
    },
  ];

  return (
<div className='w-100'>
<div style={styles.page}>
      <div style={styles.section}>
        <h2 style={styles.title}>Personal Information</h2>
        <p style={styles.text}>Full Name: {personalInfo.fullName}</p>
        <p style={styles.text}>Father's Name: {personalInfo.fatherName}</p>
        <p style={styles.text}>Mother's Name: {personalInfo.motherName}</p>
        <p style={styles.text}>Spouse's Name: {personalInfo.spouseName}</p>
        <p style={styles.text}>Address: {personalInfo.address}</p>
      </div>

    

      <div style={styles.section}>
        <h2 style={styles.title}>Wealth Details</h2>
        {wealthDetails.map((item, index) => (
          <div key={index}  style={styles.section}>
            <p style={styles.text}>{item.type}:</p>
            <p style={styles.text}>Details: {item.details.join(', ')}</p>
          </div>
        ))}
      </div>
      <div style={styles.section}>
        <h2 style={styles.title}>Witnesses</h2>
        {witnesses.map((witness, index) => (
          <div key={index} style={styles.section}>
            Witness {index + 1}: {witness.name}, Address: {witness.address}
          </div>
        ))}
      </div>
    </div>
</div>
  );
};

export default WillHTML;
