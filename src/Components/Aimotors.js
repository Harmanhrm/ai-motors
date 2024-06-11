import React, { useState } from "react";
import Popup from "./Popup";
import { useNavigate } from "react-router-dom";
import './ai-motors.css';
import axios from 'axios';

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  colour: "",
  seatMaterial: "",
  performance: "",
  seats: "",
  virtualAssistant: false,
  selfDriving: false,
  facialRecognition: false,
};

const Aimotors = ({ setCalculatedPrice }) => {
  const [popup, setPopup] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({ ...formValues, [name]: type === 'checkbox' ? checked : value });
  };

  const validateForm = () => {
    let errors = {};
    if (formValues.firstName.length < 2) {
      errors.firstName = "First name must be at least 2 characters.";
    }
    if (formValues.lastName.length < 2) {
      errors.lastName = "Last name must be at least 2 characters.";
    }
    if (!/^[a-zA-Z]+\.[a-zA-Z]+@gmail\.com$/.test(formValues.email)) {
      errors.email = "Email should be in the format firstname.lastname@gmail.com.";
    }
    if (!formValues.colour) {
      errors.colour = "Please select a car colour.";
    }
    if (!formValues.seatMaterial) {
      errors.seatMaterial = "Please select a seat material.";
    }
    if (!formValues.performance) {
      errors.performance = "Please select a performance level.";
    }
    if (!formValues.seats) {
      errors.seats = "Please select the number of seats.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const userData = {
        ...formValues,
        seats: parseInt(formValues.seats, 10)  // Convert seats to integer
      };
      console.log('User data:', userData);
      setIsLoading(true);  // Set loading status to true
      try {
        const response = await axios.post('https://carpricing.web.app/calculate', userData);
        setCalculatedPrice(response.data.price);
        setPopup(true);
      } catch (error) {
        console.error('Error calculating car price:', error);
        if (error.response && error.response.data) {
          console.error('Error details:', error.response.data);
          alert(`Error: ${error.response.data.message}`);
        } else {
          alert('An unexpected error occurred.');
        }
      } finally {
        setIsLoading(false);  
      }
    }
  };

  const handleClosePopup = () => {
    setPopup(false);
    navigate("/Home");
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form-layout">
        <div className="left-column">
          <div className="form-group">
            <input
              placeholder="First Name"
              type="text"
              name="firstName"
              value={formValues.firstName}
              onChange={handleChange}
            />
            {formErrors.firstName && <p className="error">{formErrors.firstName}</p>}
          </div>
          <div className="form-group">
            <input
              placeholder="Last Name"
              type="text"
              name="lastName"
              value={formValues.lastName}
              onChange={handleChange}
            />
            {formErrors.lastName && <p className="error">{formErrors.lastName}</p>}
          </div>
          <div className="form-group">
            <input
              placeholder="Email"
              type="text"
              name="email"
              value={formValues.email}
              onChange={handleChange}
            />
            {formErrors.email && <p className="error">{formErrors.email}</p>}
          </div>
        </div>
        <div className="vertical-line"></div>
        <div className="right-column">
          <div className="form-group">
            <select
              name="colour"
              value={formValues.colour}
              onChange={handleChange}
            >
              <option value="">Select a Colour</option>
              <option value="White">White</option>
              <option value="Black">Black</option>
              <option value="Silver">Silver</option>
              <option value="Blue">Blue</option>
              <option value="Pearl White">Pearl White</option>
              <option value="Metallic Red">Metallic Red</option>
              <option value="Midnight Blue">Midnight Blue</option>
            </select>
            {formErrors.colour && <p className="error">{formErrors.colour}</p>}
          </div>
          <div className="form-group">
            <select
              name="seatMaterial"
              value={formValues.seatMaterial}
              onChange={handleChange}
            >
              <option value="">Select Seat Material</option>
              <option value="Fabric">Fabric</option>
              <option value="Synthetic Leather">Synthetic Leather</option>
            </select>
            {formErrors.seatMaterial && <p className="error">{formErrors.seatMaterial}</p>}
          </div>
          <div className="form-group">
            <select
              name="performance"
              value={formValues.performance}
              onChange={handleChange}
            >
              <option value="">Select Performance</option>
              <option value="Normal">Normal</option>
              <option value="Sport">Sport</option>
            </select>
            {formErrors.performance && <p className="error">{formErrors.performance}</p>}
          </div>
          <div className="form-group">
            <select
              name="seats"
              value={formValues.seats}
              onChange={handleChange}
            >
              <option value="">Select Number of Seats</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
            {formErrors.seats && <p className="error">{formErrors.seats}</p>}
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="virtualAssistant"
                checked={formValues.virtualAssistant}
                onChange={handleChange}
              />
              Virtual Assistant
            </label>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="selfDriving"
                checked={formValues.selfDriving}
                onChange={handleChange}
              />
              Self Driving
            </label>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="facialRecognition"
                checked={formValues.facialRecognition}
                onChange={handleChange}
              />
              Facial Recognition
            </label>
          </div>
        </div>
        <button type="submit" className="submit-btn">
          {isLoading ? <div className="spinner"></div> : "Calculate"}
        </button>
      </form>
      <Popup trigger={popup} setTrigger={setPopup} onClose={handleClosePopup}>
        <h3>Thanks For Your Patience. You Can View Your calculated Price Above</h3>
      </Popup>
    </div>
  );
};

export default Aimotors;
