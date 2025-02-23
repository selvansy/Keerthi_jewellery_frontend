const customSelectStyles = {
  control: (provided, state) => ({
      ...provided,
      minHeight: "41px",
      height: "50px",
      borderWidth: "3px",
      borderColor: state.isFocused ? "#023453" : "#D1D5DB",
      "&:hover": {
          borderColor: "#023453", 
      },
  }),
  valueContainer: (provided) => ({
      ...provided,
      height: "50px",
      padding: "10px 15px", 
  }),
  input: (provided) => ({
      ...provided,
      margin: "0px",
      padding: "5px 10px", 
  }),
  indicatorsContainer: (provided) => ({
      ...provided,
      height: "50px",
  }),
};

export default customSelectStyles;
