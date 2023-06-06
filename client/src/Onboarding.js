import { useState, useEffect } from "react";
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
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const userId = user?.googleId;
  const [user, setUser] = useState([]);
  const [freelancer, setFreelancer] = useState(null);

    // Ensuring that the signed-in user is a freelancer in order to grant them access to view the current component.

  useEffect(() => {
    if (user?.user_id) {
      setFreelancer(true);
    }
  }, [user]);

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
    region: "",
  });

  // Retrieving the profile information of the currently signed-in user.

  const getUser = async () => {
    const rote = "freelancerprofile";

    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/${rote}`, {
        params: { userId },
      });
      setUser(response.data);
    } catch (err) {
      console.log("error getting user profile info", err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/user`, { formData });
      const success = response.status === 200;
      console.log(response);
      if (success) navigate("/clientdashboard");
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    console.log("value" + value, "name" + name);

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  function selectCountry(val) {
    setFormData((prevState) => ({
      ...prevState,
      country: val,
    }));
  }

  function selectRegion(val) {
    setFormData((prevState) => ({
      ...prevState,
      region: val,
    }));
  }

  return (
    (user?.googleId) && (
      <>
        <Header
          smallState={true}
          setShowAuthModal={() => {}}
          showAuthModal={false}
        />
        <div className="onboarding">
          <h2 style={{ color: "white" }}>CONTRACTOR PROFILE</h2>

          <form onSubmit={handleSubmit}>
            <section className="first-section">
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
              <input
                className="rateInput"
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
                <CountryDropdown
                  value={formData.country}
                  onChange={selectCountry}
                />
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
                {formData.url && (
                  <img
                    src={formData.url}
                    alt="Profile Picture"
                    style={{ border: "solid 2px white" }}
                  />
                )}
              </div>
            </section>
          </form>
        </div>
        <Footer />
      </>
    )
  );
};

export default OnBoarding;
