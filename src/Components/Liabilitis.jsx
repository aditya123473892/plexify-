import React, { useState, useEffect, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import {
  FaHome,
  FaCar,
  FaUniversity,
  FaBriefcase,
  FaFileAlt,
} from "react-icons/fa";
import { AuthContext } from "../Contexts/Context";
import axios from "axios";
import { Link } from "react-router-dom";

const LiabilitiesSlider = () => {
  const { API, token } = useContext(AuthContext);
  const [liabilityCounts, setLiabilityCounts] = useState({
    homeLoan: 0,
    carLoan: 0,
    educationLoan: 0,
    businessLoan: 0,
    otherLiabilities: 0,
  });

  const liabilities = [
    {
      id: "homeLoan",
      icon: <FaHome />,
      title: "Home Loan",
      description: "Loans for purchasing or constructing a residential property.",
      endpoint: "home-loans",
      color: "border-l-8 border-[#f68121] text-[#f68121]",
      link: "/liabilites",
    },
    {
      id: "carLoan",
      icon: <FaCar />,
      title: "Car Loan",
      description: "Loans to finance the purchase of a new or used car.",
      endpoint: "vehicle-loans",
      color: "border-l-8 border-[#ed1c24] text-[#ed1c24]",
      link: "/liabilites",
    },
    {
      id: "educationLoan",
      icon: <FaUniversity />,
      title: "Education Loan",
      description: "Loans to cover tuition and other expenses for higher education.",
      endpoint: "education-loans",
      color: "border-l-8 border-[#582c8b] text-[#582c8b]",
      link: "/liabilites",
    },
    {
      id: "businessLoan",
      icon: <FaBriefcase />,
      title: "Business Loan",
      description: "Loans to fund business operations, expansions, or startups.",
      endpoint: "business-loans",
      color: "border-l-8 border-[#0166b4] text-[#0166b4]",
      link: "/liabilites",
    },
    {
      id: "otherLiabilities",
      icon: <FaFileAlt />,
      title: "Other liabilites",
      description: "Miscellaneous liabilites not categorized elsewhere.",
      endpoint: "personal-loans",
      color: "border-l-8 border-[#ed1c24] text-[#ed1c24]",
      link: "/liabilites",
    },
  ];

  const fetchLiabilityCounts = async () => {
    try {
      const promises = liabilities.map(({ endpoint }) =>
        axios.get(`${API}/${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const responses = await Promise.all(promises);

      const counts = responses.reduce((acc, response, index) => {
        const { data } = response;
        const liability = liabilities[index].id;

        acc[liability] = data.loans?.length || data.homeLoans?.length || 0; // Adjust to match API responses.
        return acc;
      }, {});

      setLiabilityCounts(counts);
    } catch (error) {
      console.error("Error fetching liabilities:", error);
    }
  };

  useEffect(() => {
    fetchLiabilityCounts();
  }, []);

  return (
    <div className="liabilities_content mx-6">
      <div className="text-2xl font-bold text-center my-12">Your Liabilities</div>
      <Swiper
        className="mySwiper2 mt-10"
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
        {liabilities.map(({ id, icon, title, description, link, color }) => (
          <SwiperSlide
            key={id}
            style={{ background: "transparent", height: "230px" }}
          >
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
                  {liabilityCounts[id] || 0}
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default LiabilitiesSlider;
