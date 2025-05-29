import React from "react";
import logo from "./RNDM-3.png"; // Make sure the path is correct
import styles from "./Logo.module.css";

/**
 * A simple component that renders the ITX logo as an image.
 * @component
 * @param {string} [className] - Optional CSS class name(s) to apply to the logo.
 * @param {object} [props] - Any additional props to pass to the underlying `<img>` element.
 * @returns {JSX.Element} The ITX logo as an image.
 * @author Stine
 */
function Logo({ className, ...props }) {
  return (
    <img
      src={logo}
      alt="ITX Logo"
      className={`${styles.logo} ${className || ""}`}
      {...props}
    />
  );
}

export default Logo;
