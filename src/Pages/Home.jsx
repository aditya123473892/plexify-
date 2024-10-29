import React from 'react';
import { Line } from 'react-chartjs-2'; // Import the Line component
import { Chart as ChartJS, LinearScale, CategoryScale, Title, Tooltip, Legend, LineElement, PointElement, Filler } from 'chart.js'; // Import from chart.js
import { MdArrowOutward, MdOutlineQueryStats } from "react-icons/md";
import { FaMoneyBillWave, FaHandsHelping } from "react-icons/fa";
import '../assets/css/swiper.css';
import { FaArrowTrendUp } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import FeatureSwiper from '../Components/FeatureSwiper';
import PaymentsSlider from '../Components/PaymentsSlider';
import Accordion from '../Components/Accordion';
ChartJS.register(
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler
);

const Home = () => {
  // Sample data for the line chart
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Current Month',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: true,
        backgroundColor: 'rgba(10, 108, 18, 0.4)',
        borderColor: 'rgba(10, 192, 18, 1)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Previous Month',
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.4)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Sample data for the second line chart
  const secondData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Projected Growth',
        data: [40, 45, 60, 55, 70, 80, 90],
        fill: true,
        backgroundColor: 'rgba(10, 108, 18, 0.4)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Historical Growth',
        data: [30, 35, 50, 45, 60, 70, 80],
        fill: true,
        backgroundColor: 'rgba(255, 159, 64, 0.4)',
        borderColor: 'rgba(25, 159, 64, 1)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  return (
    <>
      <header className="mb-8 text-[#08551b]">
        <h1 className="text-3xl font-bold ">Dashboard</h1>
        <p className="text-xl"> Details with helpful stats.</p>
      </header>

      <div>
        <div className="grid grid-cols-4 gap-7">
          <div className="grid-col-1 border rounded-3xl p-4 bg-white hover:bg-purple-300 shadow-2xl group ease-in-out duration-500 relative overflow-hidden">
            <div className='hidden hero-description-bk ease-in-out duration-500 group-hover:block group-hover:opacity-100 opacity-0'></div>
            <div className="flex justify-between">
              <div className='group-hover:bg-white rounded-full p-6 bg-purple-300 shadow-lg'>
                <FaMoneyBillWave className='size-6' />
              </div>
              <div className='border group-hover:rotate-45 group-hover:ease-in-out group-hover:duration-500 rounded-full p-6 shadow-lg'>
                <MdArrowOutward className='size-6' />
              </div>
            </div>
            <div className='pt-12 z-10 relative'>
              <div className="text-3xl font-semibold group-hover:text-white">
                $46224.54
              </div>
              <div className='text-xl text-gray-400 group-hover:text-white'>
                Total Wealth
              </div>
            </div>
          </div>

          <div className="grid-col-1 border rounded-3xl p-4 bg-white hover:bg-amber-200 shadow-2xl group ease-in-out duration-500 relative overflow-hidden second ">
            <div className='hidden hero-description-bk ease-in-out duration-500 group-hover:block group-hover:opacity-100 opacity-0'></div>
            <div className="flex justify-between">
              <div className='group-hover:bg-white rounded-full p-6 bg-amber-200 shadow-lg'>
                <FaHandsHelping className='size-6' />
              </div>
              <div className='border group-hover:rotate-45 group-hover:ease-in-out group-hover:duration-500 rounded-full p-6 shadow-lg'>
                <MdArrowOutward className='size-6' />
              </div>
            </div>
            <div className='pt-12 z-10 relative'>
              <div className="text-3xl font-semibold group-hover:text-white">
                $26234.54
              </div>
              <div className='text-xl text-gray-400 group-hover:text-white'>
                Current Liabilities
              </div>
            </div>
          </div>

          <div className="grid-col-1 border rounded-3xl p-4 bg-white hover:bg-slate-300 shadow-2xl group ease-in-out duration-500 relative overflow-hidden">
            <div className='hidden hero-description-bk ease-in-out duration-500 group-hover:block group-hover:opacity-100 opacity-0'></div>
            <div className="flex justify-between">
              <div className='group-hover:bg-white rounded-full p-6 bg-slate-300 shadow-lg'>
                <FaMoneyBillWave className='size-6' />
              </div>
              <div className='border group-hover:rotate-45 group-hover:ease-in-out group-hover:duration-500 rounded-full p-6 shadow-lg'>
                <MdArrowOutward className='size-6' />
              </div>
            </div>
            <div className='pt-12 z-10 relative'>
              <div className="text-3xl font-semibold group-hover:text-white">
                $36344.54
              </div>
              <div className='text-xl text-gray-400 group-hover:text-white'>
                Net Worth
              </div>
            </div>
          </div>

          <div className="grid-col-1 border rounded-3xl p-4 bg-white hover:bg-blue-300 shadow-2xl group ease-in-out duration-500 relative overflow-hidden second ">
            <div className='hidden hero-description-bk ease-in-out duration-500 group-hover:block group-hover:opacity-100 opacity-0'></div>
            <div className="flex justify-between">
              <div className='group-hover:bg-white rounded-full p-6 bg-blue-300 shadow-lg'>
                <FaMoneyBillWave className='size-6' />
              </div>
              <div className='border group-hover:rotate-45 group-hover:ease-in-out group-hover:duration-500 rounded-full p-6 shadow-lg'>
                <MdArrowOutward className='size-6' />
              </div>
            </div>
            <div className='pt-12 z-10 relative'>
              <div className="text-3xl font-semibold group-hover:text-white">
                $4634.54
              </div>
              <div className='text-xl text-gray-400 group-hover:text-white'>
                In this month
              </div>
            </div>
          </div>
        </div>





        {/* fwafwafwafawfaw */}

        <div className=" my-10 flex space-x-6">

          {/* 8 */}
          <div className="w-8/12 p-10  pb-24 rounded-2xl shadow-2xl bg-white">
            <div className="flex justify-between pb-10">
              <div className='flex'>
                <MdOutlineQueryStats className='size-12 p-3 rounded-full shadow-xl bg-white' />
                <div className='p-3 text-xl'>Statistics</div>
              </div>
              <div className='flex items-center'>
                <MdOutlineQueryStats className='size-12 p-3 rounded-full shadow-xl' />
                <div className='p-3 text-xl'>
                  <select


                    className='border rounded p-2 text-xl shadow-xl'
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-evenly pb-16 border-b-2 border-gray-400 mb-3">
              <div className="">
                <div className='text-xl text-gray-400'>
                  Income
                </div>

                <div className='z-10 relative'>
                  <div className="text-3xl font-semibold ">
                    $4634.54
                  </div>
                  <div className='text-xl text-gray-400'>
                    <span className='text-green-800'><FaArrowTrendUp className=' inline-block' /> 12.4%</span> n this month
                  </div>
                </div>
              </div>
              <div className='border border-gray-400 '></div>
              <div >
                <div className='text-xl text-gray-400'>
                  Income
                </div>

                <div className='z-10 relative'>
                  <div className="text-3xl font-semibold ">
                    $4634.54
                  </div>
                  <div className='text-xl text-gray-400'>
                    <span className='text-green-800'><FaArrowTrendUp className=' inline-block' /> 12.4%</span> n this month
                  </div>
                </div>
              </div>
            </div>

            <div className="h-96">

              <h2 className="text-3xl font-semibold text-[#08551b] mb-4">Monthly Stats</h2>
              <Line data={data} options={options} className='' />
            </div>
          </div>


          {/* 4 */}
          <div className="w-4/12 p-10 rounded-2xl shadow-2xl bg-white">
          <div className="flex justify-end pb-10">
          
              <div className='flex items-center'>
                {/* <MdOutlineQueryStats className='size-12 p-3 rounded-full shadow-xl' /> */}
                <div className='p-3 text-xl'>
                  <select


                    className='border rounded p-2 text-xl shadow-xl'
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </div>
            </div>
  <div className="flex justify-center items-center relative mb-8 h-96">
  {/* Circle 1 */}
  <div className="w-32 h-32 bg-[#85bb65] rounded-full opacity-80 absolute left-10 bottom-16 -translate-y-1/2 z-10 flex flex-col items-center justify-center text-center text-white font-semibold text-sm shadow-2xl">
    <div>25%</div>
    <div className="text-xs">Current Liabilities</div>
  </div>

  {/* Circle 2 */}
  <div className="w-60 h-60 bg-[#5cace4] rounded-full opacity-80 absolute left-20 top-20 -translate-y-1/2 z-0 flex flex-col items-center justify-center text-center text-white font-semibold text-lg shadow-2xl">
    <div>70%</div>
    <div className="text-sm">Net Worth</div>
  </div>

  {/* Circle 3 */}
  <div className="w-36 h-36 bg-[#f3a541] rounded-full opacity-80 absolute top-24 left-64 -translate-y-1/2 z-20 flex flex-col items-center justify-center text-center text-white font-semibold text-base shadow-2xl">
    <div>45%</div>
    <div className="text-xs">In this month</div>
  </div>
</div>



  {/* Stats and Progress Bars */}
  <div className="space-y-4">
    {/* Stat 1 */}
    <div>
      <div className="text-gray-700 text-lg font-semibold mb-1">Current Liabilities <span className='text-green-700'> <FaArrowTrendUp className='inline-block'/> 70%</span> </div>
      <div className="w-full bg-gray-300 rounded-full h-4 shadow-2xl">
        <div className="bg-[#85bb65] h-4 rounded-full shadow-2xl" style={{ width: '45%' }}></div>
      </div>
    </div>

    {/* Stat 2 */}
    <div>
      <div className="text-gray-700 text-lg font-semibold mb-1">Net Worth<span className='text-blue-700'> <FaArrowTrendUp className='inline-block'/> 45%</span> </div>
      <div className="w-full bg-gray-300 rounded-full h-4">
        <div className="bg-[#5cace4] h-4 rounded-full" style={{ width: '30%' }}></div>
      </div>
    </div>

    {/* Stat 3 */}
    <div>
      <div className="text-gray-700 text-lg font-semibold mb-1">In this month<span className='text-yellow-700'> <FaArrowTrendUp className='inline-block'/> 25%</span> </div>
      <div className="w-full bg-gray-300 rounded-full h-4">
        <div className="bg-[#f3a541] h-4 rounded-full" style={{ width: '25%' }}></div>
      </div>
    </div>
  </div>
</div>
 </div>

        <div className="mt-6 ">
          <div className="text-4xl font-bold my-20 text-center">Beneficiary</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
  {/* Card 1 */}
  <div className="bg-white rounded-lg shadow-2xl p-5 relative overflow-hidden group">
    <div className="img-box mb-4 relative flex justify-center overflow-hidden">
      <img
        className="w-64 h-64 rounded-full transition-transform duration-300"
        src="https://d2qp0siotla746.cloudfront.net/img/use-cases/profile-picture/template_0.jpg"
        alt="Assets of Beneficiary 1"
      />
      <div className="absolute translate-x-[50%] inset-0 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black bg-opacity-50 rounded-full w-64 h-64 ">
        <div className="text-center">
          <span>Wealth: XXXX</span><br />
          <span>Liabilities: XXXX</span>
        </div>
        <Link to="#" className="text-green-200 underline mt-2">Read More</Link>
      </div>
    </div>
    <div className="text-2xl font-bold text-center mt-2 transition-opacity duration-300">
      Assets of Beneficiary 1
    </div>
  </div>

  {/* Card 2 */}
  <div className="bg-white rounded-lg shadow-2xl p-5 relative overflow-hidden group">
    <div className="img-box mb-4 relative flex justify-center overflow-hidden">
      <img
        className="w-64 h-64 rounded-full transition-transform duration-300"
        src="https://d2qp0siotla746.cloudfront.net/img/use-cases/profile-picture/template_0.jpg"
        alt="Assets of Beneficiary 2"
      />
      <div className="absolute translate-x-[50%] inset-0 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black bg-opacity-50 rounded-full w-64 h-64">
        <div className="text-center">
          <span>Wealth: XXXX</span><br />
          <span>Liabilities: XXXX</span>
        </div>
        <Link to="#" className="text-green-200 underline mt-2">Read More</Link>
      </div>
    </div>
    <div className="text-2xl font-bold text-center mt-2 transition-opacity duration-300">
      Assets of Beneficiary 2
    </div>
  </div>

  {/* Card 3 */}
  <div className="bg-white rounded-lg shadow-2xl p-5 relative overflow-hidden group">
    <div className="img-box mb-4 relative flex justify-center overflow-hidden">
      <img
        className="w-64 h-64 rounded-full transition-transform duration-300"
        src="https://d2qp0siotla746.cloudfront.net/img/use-cases/profile-picture/template_0.jpg"
        alt="Assets of Beneficiary 3"
      />
      <div className="absolute translate-x-[50%] inset-0 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black bg-opacity-50 rounded-full w-64 h-64">
        <div className="text-center">
          <span>Wealth: XXXX</span><br />
          <span>Liabilities: XXXX</span>
        </div>
        <Link to="#" className="text-green-200 underline mt-2">Read More</Link>
      </div>
    </div>
    <div className="text-2xl font-bold text-center mt-2 transition-opacity duration-300">
      Assets of Beneficiary 3
    </div>
  </div>
</div>





        </div>
      <FeatureSwiper/>

      <PaymentsSlider/> 
      <Accordion/>


      </div>
    </>
  );
};

export default Home;
