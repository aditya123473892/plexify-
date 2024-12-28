import React, { useState, useEffect, useContext } from "react";
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
import { AuthContext } from "../Contexts/Context";
import axios from "axios";
import { Link } from "react-router-dom";

const PaymentsSlider = () => {
  const { API, token } = useContext(AuthContext);
  const [investmentCounts, setInvestmentCounts] = useState({
    mutualFunds: 0,
    bonds: 0,
    cryptocurrencies: 0,
    properties: 0,
    stocks: 0,
  });

  const payments = [
    {
      id: "mutualFunds",
      icon: <FaHandshake />,
      title: "Mutual Funds",
      description:
        "Investment service pooling funds from multiple investors for diverse portfolios.",
      endpoint: "mutual-funds",
      color: "border-l-8 border-[#f68121] text-[#f68121]",
      link: "/mutual-funds",
    },
    {
      id: "bonds",
      icon: <FaFileInvoiceDollar />,
      title: "Bonds",
      description:
        "Fixed-income securities issued by governments or corporations for borrowing.",
      endpoint: "bonds",
      color: "border-l-8 border-[#ed1c24] text-[#ed1c24]",
      link: "/bonds",
    },
    {
      id: "cryptocurrencies",
      icon: <FaBitcoin />,
      title: "Cryptocurrencies",
      description:
        "Decentralized digital or virtual currencies secured by cryptography technology.",
      endpoint: "cryptocurrencies",
      color: "border-l-8 border-[#582c8b] text-[#582c8b]",
      link: "/cryptocurrencies",
    },
    {
      id: "properties",
      icon: <FaBuilding />,
      title: "Properties",
      description:
        "Real estate assets including land and physical structures for investment.",
      endpoint: "properties",
      color: "border-l-8 border-[#0166b4] text-[#0166b4]",
      link: "/properties",
    },
    {
      id: "stocks",
      icon: <FaChartLine />,
      title: "Stocks",
      description:
        "Ownership shares in a company representing proportional ownership interest.",
      endpoint: "stocks",
      color: "border-l-8 border-[#ed1c24] text-[#ed1c24]",
      link: "/stocks",
    },
  ];

  const fetchInvestmentCounts = async () => {
    try {
      // Fetch data from all endpoints concurrently
      const promises = payments.map(({ endpoint }) =>
        axios.get(`${API}/${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const responses = await Promise.all(promises);

      // Extract counts based on specific API response structures
      const counts = responses.reduce((acc, response, index) => {
        const { data } = response;

        switch (payments[index].id) {
          case "mutualFunds":
            acc.mutualFunds = data.mutualFunds?.length || data.items?.length || 0;
            break;
          case "bonds":
            acc.bonds = data.bonds?.length || data.items?.length || 0;
            break;
          case "cryptocurrencies":
            acc.cryptocurrencies = data.cryptos?.length || 0; // Use `data.cryptos`
            break;
          case "properties":
            acc.properties = data.properties?.length || data.items?.length || 0;
            break;
          case "stocks":
            acc.stocks = data.stocks?.length || data.items?.length || 0;
            break;
          default:
            acc[payments[index].id] = data.items?.length || data.length || 0; // General fallback
        }

        return acc;
      }, {});

      setInvestmentCounts(counts);
    } catch (error) {
      console.error("Error fetching investment counts:", error);
    }
  };

  useEffect(() => {
    fetchInvestmentCounts();
  }, []);

  return (
    <div className="payments_content mx-6">
      <div className="text-2xl font-bold text-center my-12">Your Assets</div>
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
          320: { slidesPerView: 1, spaceBetween: 10 },
          768: { slidesPerView: 2, spaceBetween: 15 },
          1024: { slidesPerView: 3, spaceBetween: 20 },
        }}
      >
        {payments.map(({ id, icon, title, description, color, link }) => (
          <SwiperSlide key={id} style={{ background: "transparent", height: "230px" }}>
            <Link to={link}>
              <div
                className={`flex flex-col justify-center items-center ${color} border-10 w-full h-230 p-6 bg-gray-100 rounded-lg shadow-lg transition-all duration-200 ease-in-out hover:translate-y-1 relative`}
              >
                <div className="text-3xl mb-4">{icon}</div>
                <h5 className="text-2xl font-bold mb-2">{title}</h5>
                <h6 className="text-sm font-normal mb-8 text-center">
                  {description}
                </h6>
                <div className="number-box text-xl font-bold mt-4 rounded-s-3xl absolute bottom-3">
                  {investmentCounts[id] || 0}
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PaymentsSlider;
