import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import {
  FaHandshake,
  FaFileInvoiceDollar,
  FaBitcoin,
  FaBuilding,
  FaChartLine,
} from "react-icons/fa";

const PaymentsSlider = () => {
  const payments = [
    {
      id: 1,
      icon: <FaHandshake />,
      title: "Mutual Funds",
      description:
        "Investment service pooling funds from multiple investors for diverse portfolios.",
      color: "border-l-8 border-[#f68121] text-[#f68121]",
    },
    {
      id: 2,
      icon: <FaFileInvoiceDollar />,
      title: "Bonds",
      description:
        "Fixed-income securities issued by governments or corporations for borrowing.",
      color: "border-l-8 border-[#ed1c24] text-[#ed1c24]",
    },
    {
      id: 3,
      icon: <FaBitcoin />,
      title: "Cryptocurrencies",
      description:
        "Decentralized digital or virtual currencies secured by cryptography technology.",
      color: "border-l-8 border-[#582c8b] text-[#582c8b]",
    },
    {
      id: 4,
      icon: <FaBuilding />,
      title: "Property",
      description:
        "Real estate assets including land and physical structures for investment.",
      color: "border-l-8 border-[#0166b4] text-[#0166b4]",
    },
    {
      id: 5,
      icon: <FaChartLine />,
      title: "Stock",
      description:
        "Ownership shares in a company representing proportional ownership interest.",
      color: "border-l-8 border-[#ed1c24] text-[#ed1c24]",
    },
  ];

  return (
    <div className="payments_content mx-6">
      <div className="text-2xl font-bold text-center my-12">Your Payments</div>
      <Swiper
        className="mySwiper1 mt-10"
        style={{ height: "300px" }}
        modules={[Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={3}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        loop={true}
        breakpoints={{
          // Adjust the number of slides per view based on screen width
          320: { slidesPerView: 1, spaceBetween: 10 }, // Mobile
          768: { slidesPerView: 2, spaceBetween: 15 }, // Tablet
          1024: { slidesPerView: 3, spaceBetween: 20 }, // Desktop
        }}
      >
        {payments.map(({ id, icon, title, description, color }) => (
          <SwiperSlide
            key={id}
            style={{ background: "transparent", height: "230px" }}
          >
            <div
              className={`flex flex-col justify-center items-center ${color} border-10 w-full h-230 p-6 bg-gray-100 rounded-lg shadow-lg transition-all duration-200 ease-in-out hover:translate-y-1 relative`}
            >
              <div className="text-3xl mb-4">{icon}</div>
              <h5 className="text-2xl font-bold mb-2">{title}</h5>
              <h6 className="text-sm font-normal mb-8 text-center">
                {description}
              </h6>
              <div className="number-box text-xl font-bold mt-4 rounded-s-3xl absolute bottom-3">
                0{id}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PaymentsSlider;
