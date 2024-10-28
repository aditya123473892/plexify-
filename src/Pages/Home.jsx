import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import picture_1 from "../assets/images/Picture_1.png";
import video_pic from "../assets/images/video_pic.png";
import { Link } from 'react-router-dom';
import FeatureSwiper from '../Components/FeatureSwiper';
import PaymentsSlider from '../Components/PaymentsSlider';
import Accordion from '../Components/Accordion';

const CircularProgressBar = ({ percentage, title, color,moneytitle }) => {
  return (
    <div className="flex flex-col items-center w-20">
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={buildStyles({
          pathColor: color || '#ff0000', // Use the provided color or default to red
          textColor: '#000', 
          trailColor: '#e6e6e6', // Background circle color
        })}
        strokeWidth={10}
      />
      <h3 className="text-xl text-black mt-2 font-semibold whitespace-nowrap">&#x20b9; {title}</h3>
      <h3 className="text-md text-black whitespace-nowrap">{moneytitle}</h3>
    </div>
  );
};

const WealthManagement = () => {
  return (
    <div className="bg-[#3d5e27fd] text-white p-5 mt-4 rounded-xl">
      <div className="flex justify-between">
        <div className="text-center">
          <img className="w-2/5 mx-auto" src={picture_1} alt="Manage, Grow, Pass On" />
          <p>Manage, Grow, Pass On</p>
        </div>

        <div className="text-center flex flex-col justify-center">
          <h2 className="text-lg text-center py-5">
            Secure Wealth Management, Seamless Legacy Planning, and Transmission of Wealth to Your Loved Ones
          </h2>
          <h2 className="text-lg text-center">
            चिंतामुक्त भविष्य, विरासत का सुखद सफर
          </h2>
        </div>

        <div className="text-center">
          <img className="w-2/5 mx-auto rounded-full" src={video_pic} alt="Video Consultation Booking" />
          <p>Video Consultation Booking</p>
        </div>
      </div>

      {/* Main Overview - Center Content */}
      <div className="grid grid-cols-3 gap-5 mt-6">
        {/* Flexbox wrapper to center the CircularProgressBar components */}
        <div className="flex justify-center items-center col-span-1 shadow-2xl rounded-lg p-7 bg-white">
          <CircularProgressBar percentage={100} title="10,00,000" color="#4caf50" moneytitle='Total Wealth' />
        </div>
        <div className="flex justify-center items-center col-span-1 shadow-2xl rounded-lg p-7 bg-white">
          <CircularProgressBar percentage={25} title="2,500,000" color="#ff9800" moneytitle='Current Liablities'/>
        </div>
        <div className="flex justify-center items-center col-span-1 shadow-2xl rounded-lg p-7 bg-white">
          <CircularProgressBar percentage={75} title="7,500,000" color="#2196f3" moneytitle='
Net Worth'/>
        </div>
      </div>

      {/* Beneficiary Content */}
      <div className="mt-6 ">
        <div className="text-4xl font-bold my-20 text-center">Beneficiary</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
  {/* Card 1 */}
  <div className="bg-[#152f0afd] rounded-lg shadow-lg p-5  group ">
  <div className="img-box mb-4">
    <img
      className="w-full rounded-full transition-transform duration-500 ease-in-out group-hover:-translate-y-24"
      src="https://d2qp0siotla746.cloudfront.net/img/use-cases/profile-picture/template_0.jpg"
      alt="Assets of Beneficiary 1"
    />
    <div className="absolute inset-0 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100  bg-opacity-60 p-4">
    </div>
  </div>
    <div className="text-2xl font-bold text-center">Assets of Beneficiary 1</div>  
  <div className="max-h-0 opacity-0 transition-all duration-500 ease-in-out overflow-hidden group-hover:max-h-full group-hover:opacity-100 group-hover:mb-[-70px] text-white text-center mt-2 group-hover:-translate-y-28">
   <div><span>Wealth: XXXX</span><br />
    <span>Liabilities: XXXX</span>
    </div> 
    <Link to="#" className="text-green-200 underline mt-2">Read More</Link>
  </div>
</div>




  {/* Card 2 */}
  <div className="bg-[#152f0afd] rounded-lg shadow-lg p-5 relative overflow-hidden group">
  <div className="img-box mb-4 relative overflow-hidden">
    <img
      className="w-full rounded-full transition-transform duration-500 ease-in-out group-hover:-translate-y-24"
      src="https://d2qp0siotla746.cloudfront.net/img/use-cases/profile-picture/template_0.jpg"
      alt="Assets of Beneficiary 2"
    />
    <div className="absolute inset-0 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 bg-black bg-opacity-50 p-4">
      <div className="text-white text-center">
        <span>Wealth: XXXX</span><br />
        <span>Liabilities: XXXX</span>
      </div>
      <Link to="#" className="text-green-200 underline mt-2">Read More</Link>
    </div>
  </div>
  <div className="text-2xl font-bold text-center text-white mt-2 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100">
    Assets of Beneficiary 2
  </div>
</div>


  {/* Card 3 */}
<div className="bg-[#152f0afd] rounded-lg shadow-lg p-5 relative overflow-hidden group">
    <div className="img-box mb-4 relative overflow-hidden">
      <img
        className="w-full rounded transition-transform duration-300 "
        src="https://d2qp0siotla746.cloudfront.net/img/use-cases/profile-picture/template_0.jpg"
        alt="Assets of Beneficiary 3"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black bg-opacity-50">
        <div className="text-white text-center">
          <span>Wealth: XXXX</span><br />
          <span>Liabilities: XXXX</span>
        </div>
        <Link to="#" className="text-green-200 underline mt-2">Read More</Link>
      </div>
    </div>
    <div className="text-2xl font-bold text-white text-center mt-2 transition-opacity duration-300 ">
      Assets of Beneficiary 3
    </div>
</div>
</div>


      </div>
      <FeatureSwiper/>

      <PaymentsSlider/> 
      <Accordion/>
    </div>
  );
};

export default WealthManagement;
