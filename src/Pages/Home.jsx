import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import wealthlogo from '../assets/images/Picture_1.png'
import video_pic from '../assets/images/video_pic.png'
import { FaArrowTrendUp } from "react-icons/fa6";
import '../assets/css/swiper.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { MdArrowOutward, MdOutlineQueryStats } from "react-icons/md";
import { FaMoneyBillWave, FaHandsHelping } from "react-icons/fa";
import { Link } from 'react-router-dom';
import FeatureSwiper from '../Components/FeatureSwiper';
import PaymentsSlider from '../Components/PaymentsSlider';
import Accordion from '../Components/Accordion';
ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const data = {
    labels: ['Profit', 'Cost'],
    datasets: [
      {
        label: 'Monthly Stats',
        data: [95, 19],
        backgroundColor: [
          'rgba(10, 108, 18, 0.9)',
          'rgba(255, 99, 132, 0.6)',

        ],
        borderColor: [
          'rgba(10, 108, 18, 1)',
          'rgba(255, 99, 132, 1)',

        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  const CircularProgressBar = ({ percentage, title, color }) => {
    return (
      <div className="flex flex-col items-center w-20">
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            pathColor: color || '#ff0000',
            textColor: '#ffffff',
            trailColor: '#e6e6e6',
          })}
          strokeWidth={10}
        />
        {/* <h3 className="text-xl text-black mt-2 font-semibold whitespace-nowrap">&#x20b9; {title}</h3> */}
      </div>
    );
  };


  return (
    <>
      <header className="mb-8 text-white rounded-2xl bg-[#548831]">
      <div className="  p-5 mt-4 rounded-xl">
      <div className="flex justify-between text-white">
        <div className="text-center">
          <img className="w-2/5 mx-auto filter brightness-[20.5]" src={wealthlogo} alt="Manage, Grow, Pass On" />
          <p className='pt-3 '>Manage, Grow, Pass On</p>
        </div>

        <div className="text-center flex flex-col justify-center">
          <h2 className="text-6xl font-bold text-center py-5 text-[#daa431]">
          Manage Grow Inherit
          </h2>
          <h2 className="text-lg text-center text-white">
            चिंतामुक्त भविष्य, विरासत का सुखद सफर
          </h2>
        </div>

        <div className="text-center mt-2">
          <img className="w-2/5 mx-auto rounded-full filter brightness-[20.5]" src={video_pic} alt="Video Consultation Booking" />
          <p className='pt-2'>Video Consultation Booking</p>
        </div>
      </div>
</div>
      </header>

      <div>



        <div className="grid md:grid-cols-3 gap-7">


          <div className="col-span-1 z-20 border-l-8  rounded-3xl p-4 bg-[#538d2dfd] shadow-2xl group transition ease-in-out duration-500 relative overflow-hidden border-white">
            <div className="bground"></div>
            {/* Header Section */}
            <div className="flex justify-end pb-4 ">
              <div className="flex items-center whitespace-nowrap">
                <img src={wealthlogo} alt="Wealth Logo" className="w-8 h-8 filter brightness-[20.5]" />
                <div className="pl-2 pt-1 italic text-white">Wealth Guard</div>
              </div>
            </div>

            {/* Balance Section */}
            <div className="flex items-center">
              <div className="text-3xl font-semibold text-white w-36">
                <CircularProgressBar percentage={90} title="10,00,000" color="#538d2dfd" />
              </div>
              <div className="pl-4 w-full text-white">
                <div className="text-2xl font-bold">
                Total Wealth
                  <div>
                    <span>₹</span> 39.09 Lakhs
                  </div>
                </div>

                {/* Sub-Balances */}
                <div className="flex justify-between mt-3 ">
                  {[
                    { label: "Saving (3)", amount: "19.09", bgColor: "bg-[#538d2dfd]" },
                    { label: "Deposit (3)", amount: "20.00", bgColor: "bg-[#538d2dfd]" },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className={`w-8 h-2 rounded-3xl my-2 ${item.bgColor} bg-white`} />
                      <div className="text-sm font-bold text-white">
                        {item.label}
                        <div>
                          <span>₹</span> {item.amount} Lakhs
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-around border-t-2 pt-3 mt-3 text-white">
              {["Statement", "Manage", "Spends"].map((text, index) => (
                <React.Fragment key={index}>
                  <div>{text}</div>
                  {index < 2 && <span className="mx-2">|</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="col-span-1 z-20 border-l-8  rounded-3xl p-4 bg-[#538d2dfd] shadow-2xl group transition ease-in-out duration-500 relative overflow-hidden border-white">
            <div className="bground"></div>
            {/* Header Section */}
            <div className="flex justify-end pb-4 ">
              <div className="flex items-center whitespace-nowrap">
                <img src={wealthlogo} alt="Wealth Logo" className="w-8 h-8 filter brightness-[20.5]" />
                <div className="pl-2 pt-1 italic text-white">Wealth Guard</div>
              </div>
            </div>

            {/* Balance Section */}
            <div className="flex items-center">
              <div className="text-3xl font-semibold text-white w-36">
                <CircularProgressBar percentage={90} title="10,00,000" color="#538d2dfd" />
              </div>
              <div className="pl-4 w-full text-white">
                <div className="text-2xl font-bold">
                Current Liabilities
                  <div>
                    <span>₹</span> 39.09 Lakhs
                  </div>
                </div>

                {/* Sub-Balances */}
                <div className="flex justify-between mt-3 ">
                  {[
                    { label: "Saving (3)", amount: "19.09", bgColor: "bg-[#538d2dfd]" },
                    { label: "Deposit (3)", amount: "20.00", bgColor: "bg-[#538d2dfd]" },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className={`w-8 h-2 rounded-3xl my-2 ${item.bgColor} bg-white`} />
                      <div className="text-sm font-bold text-white">
                        {item.label}
                        <div>
                          <span>₹</span> {item.amount} Lakhs
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-around border-t-2 pt-3 mt-3 text-white">
              {["Statement", "Manage", "Spends"].map((text, index) => (
                <React.Fragment key={index}>
                  <div>{text}</div>
                  {index < 2 && <span className="mx-2">|</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="col-span-1 z-20 border-l-8  rounded-3xl p-4 bg-[#538d2dfd] shadow-2xl group transition ease-in-out duration-500 relative overflow-hidden border-white">
            <div className="bground"></div>
            {/* Header Section */}
            <div className="flex justify-end pb-4 ">
              <div className="flex items-center whitespace-nowrap">
                <img src={wealthlogo} alt="Wealth Logo" className="w-8 h-8 filter brightness-[20.5]" />
                <div className="pl-2 pt-1 italic text-white">Wealth Guard</div>
              </div>
            </div>

            {/* Balance Section */}
            <div className="flex items-center">
              <div className="text-3xl font-semibold text-white w-36">
                <CircularProgressBar percentage={90} title="10,00,000" color="#538d2dfd" />
              </div>
              <div className="pl-4 w-full text-white">
                <div className="text-2xl font-bold">
                Net Worth
                  <div>
                    <span>₹</span> 39.09 Lakhs
                  </div>
                </div>

                {/* Sub-Balances */}
                <div className="flex justify-between mt-3 ">
                  {[
                    { label: "Saving (3)", amount: "19.09", bgColor: "bg-[#538d2dfd]" },
                    { label: "Deposit (3)", amount: "20.00", bgColor: "bg-[#538d2dfd]" },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className={`w-8 h-2 rounded-3xl my-2 ${item.bgColor} bg-white`} />
                      <div className="text-sm font-bold text-white">
                        {item.label}
                        <div>
                          <span>₹</span> {item.amount} Lakhs
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-around border-t-2 pt-3 mt-3 text-white">
              {["Statement", "Manage", "Spends"].map((text, index) => (
                <React.Fragment key={index}>
                  <div>{text}</div>
                  {index < 2 && <span className="mx-2">|</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
       

        </div>









        {/* charts */}

        <div className=" my-10 flex md:flex-row flex-col space-x-6 border-l-8 border-[#538d2dfd] rounded-3xl">

          {/* 8 */}
          <div className="md:w-8/12 p-10 pb-24 rounded-2xl shadow-2xl z-40 bg-white  relative">
           <div className="bground2 top-40 opacity-70 bg-[#538d2dfd]"><div className="bground2 opacity-70 top-32 bg-[#b6e299fd]"></div></div>
            <div className="flex justify-between pb-10">
              <div className='flex items-center'>
                <MdOutlineQueryStats className='size-12 p-3 rounded-full shadow-xl bg-[#538d2da4]' />
                <div className='p-3 text-xl'>Statistics</div>
              </div>
              <div className='flex items-center'>
                <MdOutlineQueryStats className='size-12 p-3 rounded-full shadow-xl' />
                <div className='p-3 text-xl'>
                  <select className='border rounded p-2 text-xl shadow-xl bg-[#538d2da4]'>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-evenly pb-16 border-b-2 border-black mb-3">
              <div>
                <div className='text-xl text-white'>Income</div>
                <div className='z-10 relative'>
                  <div className="text-3xl font-semibold">$4634.54</div>
                  <div className='text-xl text-gray-400'>
                    <span className='text-green-800'><FaArrowTrendUp className='inline-block' /> 12.4%</span> in this month
                  </div>
                </div>
              </div>
              <div className='border border-black mx-6'></div>
              <div>
                <div className='text-xl text-white'>Income</div>
                <div className='z-10 relative'>
                  <div className="text-3xl font-semibold">$4634.54</div>
                  <div className='text-xl text-gray-400'>
                    <span className='text-green-800'><FaArrowTrendUp className='inline-block' /> 12.4%</span> in this month
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-container h-96 max-h-[400px] flex flex-col items-center">
              {/* <h2 className="text-3xl font-semibold text-[#08551b] mb-4">Monthly Stats</h2> */}
              <Pie data={data} options={options} />
            </div>
          </div>

          {/* 4 */}
          <div className="md:w-4/12 p-10 rounded-2xl text-white shadow-2xl bg-[#538d2dfd] z-40 relative border-l-8 border-[#538d2dfd]">
          <div className="bground opacity-40"><div className="bground2 bg-slate-200 opacity-40"></div></div>
            <div className="flex justify-end pb-10">

              <div className='flex items-center'>
                {/* <MdOutlineQueryStats className='size-12 p-3 rounded-full shadow-xl' /> */}
                <div className='p-3 text-xl'>
                  <select


                    className='border rounded p-2 text-xl shadow-xl bg-[#538d2da4]'
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
                <div className="text-xs ">Current Liabilities</div>
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
                <div className="text-white text-lg font-semibold mb-1">Current Liabilities <span className='text-green-400'> <FaArrowTrendUp className='inline-block' /> 70%</span> </div>
                <div className="w-full bg-gray-300 rounded-full h-4 shadow-2xl">
                  <div className="bg-[#85bb65] h-4 rounded-full shadow-2xl" style={{ width: '45%' }}></div>
                </div>
              </div>

              {/* Stat 2 */}
              <div>
                <div className="text-white text-lg font-semibold mb-1">Net Worth<span className='text-blue-700'> <FaArrowTrendUp className='inline-block' /> 45%</span> </div>
                <div className="w-full bg-gray-300 rounded-full h-4">
                  <div className="bg-[#5cace4] h-4 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>

              {/* Stat 3 */}
              <div>
                <div className="text-white text-lg font-semibold mb-1">In this month<span className='text-yellow-700'> <FaArrowTrendUp className='inline-block' /> 25%</span> </div>
                <div className="w-full bg-gray-300 rounded-full h-4">
                  <div className="bg-[#f3a541] h-4 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*end charts */}



        {/* Beneficiary */}


        <div className="mt-6 ">
          <div className="text-4xl font-bold my-20 text-center">Beneficiary</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {/* Card 1 */}
            <div className="bg-white  shadow-2xl p-5 relative overflow-hidden group border-l-8 border-[#538d2dfd] rounded-3xl">
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
            <div className="bg-white border-l-8 border-[#538d2dfd] rounded-3xl shadow-2xl p-5 relative overflow-hidden group">
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
            <div className="bg-white border-l-8 border-[#538d2dfd] rounded-3xl shadow-2xl p-5 relative overflow-hidden group">
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
        {/* <FeatureSwiper /> */}

        <PaymentsSlider />
        <Accordion />


      </div>
    </>
  );
};

export default Home;
