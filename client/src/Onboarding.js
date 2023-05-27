import { useState } from "react";
import { useCookies } from "react-cookie";
import Footer from "./Footer";
import Header from "./Header";
import axios from "./axios.js";
import { Navigate, useNavigate } from "react-router-dom";

import {
  CountryDropdown,
  RegionDropdown,
  CountryRegionData,
} from "react-country-region-selector";


const OnBoarding = () => {

  const [cookies, setCookie, removeCookie] = useCookies(['user']);

  const [formData, setFormData] = useState({
    user_id: cookies.UserId,
    first_name: "",
    last_name: "",
    job_title: "",
    rate: "",
    experience: "",
    url: "",
    about: "",
    country: "",
    region: ""
  })



  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log('submitted');
    e.preventDefault();
    try {
      const response = await axios.put('/user', { formData })
      const success = response.status === 200
      console.log(response)
      if (success) navigate('/clientdashboard')
    } catch(err) {
      console.log(err)
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    console.log('value' + value, 'name' + name)

    setFormData((prevState) => ({
        ...prevState,
        [name]:value
    }))
  };

  
  function selectCountry(val) {
    setFormData((prevState) => ({
        ...prevState,
        country: val
    }))
  }

  function selectRegion(val) {
    setFormData((prevState) => ({
        ...prevState,
        region: val
    }))
  }

  return (
    <>
      <Header
        smallState={true}
        setShowAuthModal={() => {}}
        showAuthModal={false}
      />
      <div className="onboarding">
        <h2 style={{color: "white"}}>CONTRACTOR PROFILE</h2>

        <form onSubmit={handleSubmit}>
          <section>
            <label htmlFor="first_name">First Name</label>
            <input
              id="first_name"
              type="text"
              name="first_name"
              placeholder="First Name"
              required={true}
              value={formData.first_name}
              onChange={handleChange}
              autoComplete="disabled"
            />
            <label htmlFor="last_name">Last Name</label>
            <input
              id="last_name"
              type="text"
              name="last_name"
              placeholder="Last Name"
              required={true}
              value={formData.last_name}
              onChange={handleChange}
              autoComplete="disabled"
            />
            <label htmlFor="job_title">Job Title</label>
            <input
              id="job_title"
              type="text"
              name="job_title"
              placeholder="Job Title"
              required={true}
              value={formData.job_title}
              onChange={handleChange}
              autoComplete="disabled"
            />
            <label htmlFor="rate">Rate in $/hr</label>
            <input className="rateInput"
              id="rate"
              type="number"
              name="rate"
              placeholder="Rate"
              required={true}
              min={0}
              value={formData.rate}
              onChange={handleChange}
              autoComplete="disabled"
            />
            <div className="experience">
            <input
              id="novice"
              type="radio"
              name="experience"
              required={true}
              value={formData.experience}
              onChange={handleChange}
              checked={true}
            />
            <label htmlFor="novice">Novice</label>
            <input
              id="skilled"
              type="radio"
              name="experience"
              required={true}
              value={formData.experience}
              onChange={handleChange}
              checked={true}
            />
            <label htmlFor="skilled">Skilled</label>
            <input
              id="expert"
              type="radio"
              name="experience"
              required={true}
              value={formData.experience}
              onChange={handleChange}
              checked={true}
            />
            <label htmlFor="expert">Expert</label>
            </div>
          </section>

          <section className="right-section">
            
           
             <label htmlFor="about">About me</label>
            <input
              id="about"
              type="text"
              name="about"
              placeholder="Software developer passionate about coding..."
              required={true}
              value={formData.about}
              onChange={handleChange}
              autoComplete="disabled"
            />
            <div className="country">
            <label htmlFor="country">Country Of Residence</label>
            <CountryDropdown value={formData.country} onChange={selectCountry} />
            <RegionDropdown
              disableWhenEmpty={true}
              country={formData.country}
              value={formData.region}
              onChange={selectRegion}
            />
            </div>
            <input type="submit" />
          </section>
          <section className="section-third">
          <label htmlFor="about">Profile Picture</label>
              <input
                type="url"
                name="url"
                id="url"
                onChange={handleChange}
                required={true}
                placeholder="Picture URL"
                autoComplete="disabled"
              />
            <div className="pic-container">
               {formData.url && <img src={formData.url} alt="Profile Picture" style={{border: "solid 2px white"}} />}
            </div>
          </section>
          
        </form>
      </div>
      <Footer />
    </>
  );
};

export default OnBoarding;
