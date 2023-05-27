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


const ClientOnBoarding = () => {

  const [cookies, setCookie, removeCookie] = useCookies(['user']);

  const [clientForm, setClientForm] = useState({
    client_user_id: cookies.UserId,
    client_first_name: "",
    client_last_name: "",
    client_talent: "",
    client_rate: "",
    client_experience: "",
    client_url: "",
    client_about: "",
    client_country: "",
    client_region: ""
  })


  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/clientuser', { clientForm })
      const success = response.status === 200
      if (success) navigate('/dashboard')
    } catch(err) {
      console.log(err)
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setClientForm((prevState) => ({
        ...prevState,
        [name]:value
    }))
  };

  
  function selectClientCountry(val) {
    setClientForm((prevState) => ({
        ...prevState,
        client_country: val
    }))
  }

  function selectClientRegion(val) {
    setClientForm((prevState) => ({
        ...prevState,
        client_region: val
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
        <h2 style={{color: "white"}}>CLIENT PROFILE</h2>

        <form onSubmit={handleSubmit}>
          <section>
            <label htmlFor="client_first_name">First Name</label>
            <input
              id="client_first_name"
              type="text"
              name="client_first_name"
              placeholder="First Name"
              required={true}
              value={clientForm.client_first_name}
              onChange={handleChange}
              autoComplete="disabled"
              maxLength={50}
            />
            <label htmlFor="client_last_name">Last Name</label>
            <input
              id="client_last_name"
              type="text"
              name="client_last_name"
              placeholder="Last Name"
              required={true}
              value={clientForm.client_last_name}
              onChange={handleChange}
              autoComplete="disabled"
              maxLength={50}
            />
            <label htmlFor="client_talent">Looking for..</label>
            <input
              id="client_talent"
              type="text"
              name="client_talent"
              placeholder="A developer"
              required={true}
              value={clientForm.client_talent}
              onChange={handleChange}
              autoComplete="disabled"
              maxLength={55}
            />
            <label htmlFor="client_rate">Max Hourly Rate (USD)</label>
            <input className="rateInput"
              id="client_rate"
              type="number"
              name="client_rate"
              placeholder="Rate"
              required={true}
              min={0}
              value={clientForm.client_rate}
              onChange={handleChange}
              autoComplete="disabled"
            
            />
            <div className="experience">
            <h4>Select Contractor Skill Level</h4>
            <input
              id="client_novice"
              type="radio"
              name="experience"
              required={true}
              value={clientForm.client_experience}
              onChange={(e) => setClientForm({...clientForm, client_experience: e.target.value})}
              checked={true}
            />
            <label htmlFor="client_novice">Novice</label>
            <input
              id="client_skilled"
              type="radio"
              name="experience"
              required={true}
              value={clientForm.client_experience}
              onChange={(e) => setClientForm({...clientForm, client_experience: e.target.value})}
              checked={true}
            />
            <label htmlFor="client_skilled">Skilled</label>
            <input
              id="client_expert"
              type="radio"
              name="experience"
              required={true}
              value={clientForm.client_experience}
              onChange={(e) => setClientForm({...clientForm, client_experience: e.target.value})}
              checked={true}
            />
            <label htmlFor="client_expert">Expert</label>
            </div>
          </section>

          <section className="right-section">
            
           
             <label htmlFor="client_about">About My Business</label>
            <input
              id="client_about"
              type="text"
              name="client_about"
              placeholder="A fintech startup..."
              required={true}
              value={clientForm.client_about}
              onChange={handleChange}
              autoComplete="disabled"
              maxLength={55}
            />
            <div className="country">
            <label htmlFor="client_country">Country Of Residence</label>
            <CountryDropdown value={clientForm.client_country} onChange={selectClientCountry} />
            <RegionDropdown
              disableWhenEmpty={true}
              country={clientForm.client_country}
              value={clientForm.client_region}
              onChange={selectClientRegion}
            />
            </div>
            <input type="submit" />
          </section>
          <section className="section-third">
          <label htmlFor="client_about">Profile Picture</label>
              <input
                type="url"
                name="client_url"
                id="client_url"
                onChange={handleChange}
                required={true}
                placeholder="Picture URL"
                autoComplete="disabled"
              />
            <div className="pic-container">
               {clientForm.client_url && <img src={clientForm.client_url} alt="Profile Picture" style={{border: "solid 2px white"}} />}
            </div>
          </section>
          
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ClientOnBoarding;
