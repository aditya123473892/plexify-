import React, { useState } from 'react';

const Accordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is UIDAI?",
      answer: "UIDAI stands for Unique Identification Authority of India. It is a statutory authority established by the Government of India under the Ministry of Electronics and Information Technology, responsible for issuing Unique Identification Numbers (UID), also known as Aadhaar numbers, to residents of India. The Aadhaar number is a 12-digit unique identity number that serves as proof of identity and address anywhere in India."
    },
    {
      question: "What is the purpose of Aadhaar?",
      answer: "Aadhaar serves as a universal identification number for residents of India, enabling efficient delivery of various government welfare schemes and services. It helps in reducing identity fraud, streamlining the process of availing government services, and promoting financial inclusion by facilitating easier access to banking and other financial services."
    },
    {
      question: "How does one enroll for Aadhaar?",
      answer: "To enroll for Aadhaar, individuals need to visit an Aadhaar enrollment center with valid identity and address proof documents. At the enrollment center, demographic and biometric data such as fingerprints and iris scans are collected. After the enrollment process is complete, the Aadhaar number is issued to the individual."
    },
    {
      question: "Is Aadhaar mandatory for all residents of India?",
      answer: "While Aadhaar is not mandatory for all residents of India, it is required for availing various government services and subsidies. It is also increasingly being used by private entities for identity verification purposes. However, the Supreme Court of India has ruled that Aadhaar cannot be made mandatory for certain services such as opening bank accounts or obtaining SIM cards."
    },
    {
      question: "What is the role of the Unique Identification Authority of India (UIDAI)?",
      answer: "UIDAI is responsible for the issuance and administration of Aadhaar numbers. It ensures the security and confidentiality of Aadhaar data and oversees the enrollment process to maintain its integrity. UIDAI also develops policies and guidelines for the use of Aadhaar and provides authentication services to government and private agencies upon request."
    },
    {
      question: "What measures are in place to protect the privacy and security of Aadhaar data?",
      answer: "UIDAI employs various security measures such as encryption, biometric authentication, and strict access controls to safeguard Aadhaar data. Additionally, the Aadhaar Act imposes stringent penalties for unauthorized access, disclosure, or misuse of Aadhaar information. Individuals also have the right to access and correct their Aadhaar data through the UIDAI's official channels."
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="accordion-container mx-5">
      <h1 className="text-center font-bold text-2xl mb-5">FAQ'S For Services</h1>
      {faqs.map((faq, index) => (
        <div key={index} className="accordion-item  rounded-xl mb-2 shadow-sm">
          <button
            className="accordion-header bg-[#f8f8f8fd]  py-4 px-6 flex justify-between w-full rounded-md shadow-lg"
            onClick={() => toggleAccordion(index)}
          >
            {faq.question}
            <span className={`icon transition-transform ${activeIndex === index ? 'transform rotate-45' : ''}`}>+</span>
          </button>
          <div className={`accordion-content rounded-lg bg-[#dddddd80] overflow-hidden transition-max-height duration-300 ease-in-out ${activeIndex === index ? 'max-h-40' : 'max-h-0'}`}>
            <p className="p-4">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
