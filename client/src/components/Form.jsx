import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

const countryCodes = [
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "India" },
];

const Form = ({ formType }) => {
  const [formData, setFormData] = useState({
    name: "",
    countryCode: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("formData"));
    if (savedData) {
      setFormData(savedData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.name) {
      tempErrors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      tempErrors.name = "Name can only contain alphabets";
    }

    if (!formData.countryCode) {
      tempErrors.countryCode = "Country code is required";
    }

    if (!formData.phoneNumber) {
      tempErrors.phoneNumber = "Phone Number is required";
    } else if (!/^\d+$/.test(formData.phoneNumber)) {
      tempErrors.phoneNumber = "Phone number must be numeric";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      axios
        .post("http://localhost:3000/submit-form", {
          form_type: formType,
          name: formData.name,
          country_code: formData.countryCode,
          phone_number: formData.phoneNumber,
        })
        .then(() => {
          const response = axios.get("http://localhost:3000/data");
          const data = response;

          console.log("Data from SQL:", data);
          alert("Data synchronized with the Excel sheet");
          alert("Form submitted successfully");
        })
        .catch((error) => {
          console.error("There was an error submitting the form!", error);
        });
    }
  };

  return (
    <div className="form-container">
      <h2>Form {formType}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div>
          <label>Country Code: </label>
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
          >
            <option value="">Select Country Code</option>
            {countryCodes.map((country) => (
              <option key={country.code} value={country.code}>
                {country.code} - {country.country}
              </option>
            ))}
          </select>
          {errors.countryCode && <p className="error">{errors.countryCode}</p>}
        </div>
        <div>
          <label>Phone Number: </label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form;
