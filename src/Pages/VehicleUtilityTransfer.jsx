import React, { useState } from "react";
import { FaPlus, FaCheckCircle, FaTrash } from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import Section from "../Components/Section";

const VehicleUtilityTransfer = () => {
  const [transfers, setTransfers] = useState([
    { vehicleId: "", vehicleModel: "", newOwner: "", transferDate: "" },
  ]);

  const handleTransferChange = (index, field, value) => {
    const newTransfers = [...transfers];
    newTransfers[index][field] = value;
    setTransfers(newTransfers);
  };

  const addTransfer = () => {
    setTransfers([
      ...transfers,
      { vehicleId: "", vehicleModel: "", newOwner: "", transferDate: "" },
    ]);
  };

  const removeTransfer = (index) => {
    const newTransfers = transfers.filter((_, i) => i !== index);
    setTransfers(newTransfers);
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Vehicle Utility Transfer
        </h1>
        <p className="text-gray-600">
          Submit the details for transferring the utility rights of your
          vehicle.
        </p>
      </header>

      {/* Transfers Section */}
      {transfers.map((transfer, index) => (
        <FieldSection title="Transfer Details">
          <InputWithIcon
            icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Vehicle ID"
            value={transfer.vehicleId}
            onChange={(e) =>
              handleTransferChange(index, "vehicleId", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Vehicle Model"
            value={transfer.vehicleModel}
            onChange={(e) =>
              handleTransferChange(index, "vehicleModel", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="New Owner's Name"
            value={transfer.newOwner}
            onChange={(e) =>
              handleTransferChange(index, "newOwner", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
            type="date"
            placeholder="Transfer Date"
            value={transfer.transferDate}
            onChange={(e) =>
              handleTransferChange(index, "transferDate", e.target.value)
            }
          />
          <button
            onClick={() => removeTransfer(index)}
            className="text-red-600 mt-2"
          >
            Remove Transfer
          </button>
        </FieldSection>
      ))}
      <button
        onClick={addTransfer}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
      >
        <FaPlus className="inline mr-2" /> Add Transfer
      </button>

      {/* Save Button */}
      <button
        type="submit"
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Submit Transfers
      </button>
    </div>
  );
};

export default VehicleUtilityTransfer;
