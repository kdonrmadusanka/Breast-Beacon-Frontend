import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BreastBeaconLogo from '../Logo/Logo';
import Button from '../components/ui/Button';
import { FaUserAlt, FaHeart, FaLaptopMedical, FaBookMedical } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { RiMentalHealthLine } from "react-icons/ri";
import Input from '../components/ui/Input';

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState("");

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  interface ButtonList {
    child: string;
    variant: "Primary" | "Secondary" | "Danger";
    action: () => void;
    icon?: React.ReactNode;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }

  const handleSubmit = () => {
    if (query.trim() !== "") {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        "_blank"
      );
    }
  }

  const buttons: ButtonList[] = [
    {
      child: "Home",
      variant: "Primary",
      action: () => { navigate(location.pathname) },
      icon: <FaHeart className="mr-1" />
    },
    {
      child: "About",
      variant: "Secondary",
      action: () => { navigate("/about") },
      icon: <RiMentalHealthLine className="mr-1" />
    },
    {
      child: "Service",
      variant: "Secondary",
      action: () => { navigate("/Service") },
      icon: <FaLaptopMedical className="mr-1" />
    },
    {
      child: "Resources",
      variant: "Secondary",
      action: () => { navigate("/resources") },
      icon: <FaBookMedical className="mr-1" />
    },
    {
      child: "Contact",
      variant: "Secondary",
      action: () => { navigate("/contact") }
    }
  ];

  const actionButtons: ButtonList[] = [
    {
      child: "Login",
      variant: "Primary",
      action: () => { navigate("/login") }
    },
    {
      child: "Sign Up",
      variant: "Primary",
      action: () => { navigate("/signup") }
    }
]

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 relative overflow-hidden'>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      
      {/* navbar */}
      <nav className='fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-lg z-50 border-b border-gray-100'>
        <div className='flex justify-between items-center h-16 px-4 max-w-7xl mx-auto'>
          <div className='flex items-center'>
            <div className='flex items-center space-x-2 cursor-pointer' onClick={() => navigate("/")}>
              <div className='w-12 h-12 flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-1 shadow-md'>
                <BreastBeaconLogo />
              </div>
              <div>
                <p className='text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent'>Breast Beacon</p>
              </div>
            </div>
          </div>
          
          <div className='hidden md:flex items-center justify-center gap-3'>
            {buttons.map((button, key) => (
              <Button 
                key={key}
                variant={button.variant}
                onClick={button.action}
                className='flex items-center px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 shadow-sm'
              >
                {button.icon}
                {button.child}
              </Button>
            ))}
          </div>
          
          <div>
            <button
              onClick={toggleModal}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110 mx-3.5"
              aria-label="User login"
            >
              <FaUserAlt size={18} />
            </button>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <div className='pt-32 pb-16 px-4 max-w-6xl mx-auto text-center'>
        <div className='flex flex-col items-center justify-center mb-10'>
          <div className='relative mb-6'>
            <div className='absolute -inset-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur opacity-30'></div>
            <div className='relative bg-white p-2 rounded-full shadow-xl border-4 border-white'>
              <BreastBeaconLogo />
            </div>
          </div>
          <h1 className='text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4'>
            Breast Beacon
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Guiding you through breast cancer awareness, prevention, and support
          </p>
        </div>
        
        {/* Search Section */}
        <div className='max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Search for Information</h2>
          <div className='flex flex-col sm:flex-row gap-4 items-center'>
            <Input
              name='search'
              placeholder="Search from Google...."
              value={query}
              onChange={handleChange} 
              icon={<CiSearch />}
              iconPosition='left'
              className='flex-grow'
            />
            <Button 
              onClick={handleSubmit}
              variant="Primary"
              className='px-6 py-3 rounded-full font-medium min-w-[120px]'
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className='flex items-center justify-center py-1'>
        <div className='flex flex-row items-center justify-center gap-8'>
          {actionButtons.map((button, key) => (
            <Button 
              key={key}
              variant={button.variant}
              onClick={button.action}
              className='group flex items-center px-6 py-3 rounded-full transition-all duration-500 hover:scale-110 shadow-md hover:shadow-2xl transform hover:-translate-y-1'
            >
              <span className='mr-2 text-lg transition-transform duration-500 group-hover:scale-125'>
                {button.icon}
              </span>
              <span className='font-semibold transition-all duration-500 group-hover:tracking-wider'>
                {button.child}
              </span>
              <span className='ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                →
              </span>
            </Button>
          ))}
        </div>
      </div>
      
      {/* Info Section */}
      <div className='py-16 px-4 max-w-6xl mx-auto'>
        <div className='bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-8 shadow-xl text-white'>
          <h3 className='text-3xl font-bold mb-6 text-center'>Understanding Breast Cancer</h3>
          <div className='text-lg leading-relaxed bg-white/10 backdrop-blur-sm rounded-2xl p-6'>
            <p className='mb-4'>
              Breast cancer is a disease in which cells in the breast grow uncontrollably, forming a lump or mass that may spread to nearby tissues or other parts of the body.
            </p>
            <p className='mb-4'>
              It usually begins in the milk ducts (ductal carcinoma) or the lobules that produce milk (lobular carcinoma) and can be influenced by genetic, hormonal, and lifestyle factors.
            </p>
            <p className='mb-4'>
              Common signs include a breast lump, changes in breast shape or skin texture, nipple discharge, or persistent pain, though it can also develop without noticeable symptoms in early stages.
            </p>
            <p>
              Risk factors include family history, mutations in genes like BRCA1/BRCA2, prolonged estrogen exposure, age, obesity, and alcohol use. Early detection through regular self-exams, clinical exams, and screening methods such as mammography greatly improves treatment success.
            </p>
          </div>
        </div>
      </div>

      <div>
        
      </div>
      
      {/* Quick Stats Section */}
      <div className='py-12 px-4 max-w-6xl mx-auto'>
        <h3 className='text-3xl font-bold text-center text-gray-800 mb-10'>Why Awareness Matters</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center'>
            <div className='text-4xl font-bold text-pink-500 mb-2'>1 in 8</div>
            <p className='text-gray-600'>women will develop breast cancer in their lifetime</p>
          </div>
          <div className='bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center'>
            <div className='text-4xl font-bold text-purple-500 mb-2'>99%</div>
            <p className='text-gray-600'>5-year survival rate for early-stage detection</p>
          </div>
          <div className='bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center'>
            <div className='text-4xl font-bold text-blue-500 mb-2'>40%</div>
            <p className='text-gray-600'>reduction in breast cancer deaths since 1989</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className='bg-gray-800 text-white py-8 text-center'>
        <p>© {new Date().getFullYear()} Breast Beacon. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default HomePage;