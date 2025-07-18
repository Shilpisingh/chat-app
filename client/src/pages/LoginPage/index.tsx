import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles.scss";
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import { loginUser } from "../../api/userService";

const LoginPage = () => {
  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (name: string, value: string) => {
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = { ...formErrors };
    if (!formFields.email.includes("@"))
      newErrors.email = "Please enter valid email";
    if (formFields.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const validationErrors = validate();
    setFormErrors(validationErrors);
    if (formFields.email.length < 1 && formFields.password.length < 1) {
      return;
    }
    try {
      const response = await loginUser(formFields);
      if (!response || !response.token) {
        setError("Invalid email or password");
        return;
      }
      localStorage.setItem("token", response.token); // save token
      localStorage.setItem("user", JSON.stringify(response.user));
      navigate("/home");
      setSuccess("Login successful!");
      setFormFields({ email: "", password: "" });
    } catch (error) {
      console.log("error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <h1>Login</h1>
        <p></p>
        <div className="login-form">
          {error && <p style={{ color: "red" }}>❌ {error}</p>}
          {success && <p style={{ color: "green" }}>✅ {success}</p>}
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <InputField
              type="email"
              name="email"
              placeholder="Email Address"
              value={formFields.email}
              error={formErrors.email}
              handleChange={handleChange}
            />
            <InputField
              type="password"
              name="password"
              placeholder="Password"
              value={formFields.password}
              error={formErrors.password}
              handleChange={handleChange}
            />
            <Button title="Log In" type="submit" />
          </form>
        </div>
        <p className="signup-text">
          Already have account <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
