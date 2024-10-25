import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules"; 
import image1 from "../assets/images/corausal/1.jpg"; 
import image2 from "../assets/images/corausal/2.jpg"; 
import image3 from "../assets/images/corausal/3.webp"; 
import image4 from "../assets/images/corausal/4.jpg"; 
import image5 from "../assets/images/corausal/5.webp"; 
import image6 from "../assets/images/corausal/6.jpg"; 
import image7 from "../assets/images/corausal/7.avif"; 
import image8 from "../assets/images/corausal/8.webp"; 
import image9 from "../assets/images/corausal/9.jpg"; 
import image10 from "../assets/images/corausal/10.webp"; 
import image11 from "../assets/images/corausal/11.png"; 
import image12 from "../assets/images/corausal/12.jpg"; 
import 'swiper/css';
import 'swiper/css/pagination'; 
import '../assets/css/swiper.css'

const FeatureSwiper = () => {
  const slides = [
    {
      title: "Insurance Policies",
      img: image1,
      logo: image5,
      description: "Key Aspects of Insurance Policies Management: Administration, Compliance, Risk Assessment, Claims Processing, Customer Support."
    },
    {
      title: "Fixed Deposit",
      img: image2,
      logo: image7,
      description: "Optimizing Investments, Maturity Tracking, Interest Calculation, Renewals, and Customer Service Enhancement."
    },
    {
      title: "Property",
      img: image3,
      logo: image11,
      description: "Asset Maintenance, Tenant Relations, Financial Management, Lease Administration, and Property Marketing Strategies."
    },
    {
      title: "Stocks",
      img: image4,
      logo: image12,
      description: "Investment Analysis, Portfolio Diversification, Market Monitoring, Trading Strategies, and Risk Management Techniques."
    },
    {
      title: "Bonds",
      img: image5,
      logo: image10,
      description: "Fixed-Income Investments, Yield Analysis, Credit Risk Assessment, Duration Management, and Portfolio Allocation Strategies."
    },
    {
      title: "Mutual funds",
      img: image6,
      logo: image3,
      description: "Diversified Investments, Fund Selection, Performance Monitoring, Risk Analysis, and Portfolio Rebalancing Strategies."
    },
    {
      title: "Cryptocurrencies",
      img: image7,
      logo: image9,
      description: "Digital Asset Trading, Blockchain Technology, Market Volatility Management, Investment Strategies, and Security Measures."
    },
    {
        title: "Cryptocurrencies",
        img: image8,
        logo: image5,
        description: "Digital Asset Trading, Blockchain Technology, Market Volatility Management, Investment Strategies, and Security Measures."
      },
      {
        title: "Cryptocurrencies",
        img: image9,
        logo: image2,
        description: "Digital Asset Trading, Blockchain Technology, Market Volatility Management, Investment Strategies, and Security Measures."
      },
      {
        title: "Cryptocurrencies",
        img: image10,
        logo: image6,
        description: "Digital Asset Trading, Blockchain Technology, Market Volatility Management, Investment Strategies, and Security Measures."
      },
      {
        title: "Cryptocurrencies",
        img: image11,
        logo: image5,
        description: "Digital Asset Trading, Blockchain Technology, Market Volatility Management, Investment Strategies, and Security Measures."
      },
      {
        title: "Cryptocurrencies",
        img: image12,
        logo: image1,
        description: "Digital Asset Trading, Blockchain Technology, Market Volatility Management, Investment Strategies, and Security Measures."
      },
  ];

  return (

    
    <div className="sec_swiper">
   <div class="text-3xl font-bold text-center my-20">Grow your Investment</div>

      <Swiper
        modules={[Pagination]} // Ensure Pagination is included in the modules array
        pagination={{ clickable: true }} // Enable pagination
        spaceBetween={30}
        slidesPerView={4}
        className="mySwiper2"
        
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className={`hero ${index % 2 === 0 ? "second" : "first"}`}>
              <img className="hero-profile-img" src={slide.img} alt={slide.title} />
              <div className="hero-description-bk"></div>
              <div className="hero-logo">
                <img src={slide.logo} alt={`${slide.title} Logo`} />
              </div>
              <div className="hero-description text-white p-4">
                <p className="font-bold text-lg">{slide.title}</p>
                <span className="text-sm">{slide.description}</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeatureSwiper;
