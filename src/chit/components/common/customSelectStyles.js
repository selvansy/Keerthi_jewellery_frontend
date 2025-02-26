

const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "42px",
      border: state.isFocused ? "2px solid black" : "1px solid #e2e8f0",
      boxShadow: state.isFocused ? "0 0 0 2px black" : "none",
      borderRadius: "0.375rem",
      "&:hover": {
        border: "2px solid black",
      },
    }),
  };

export default customSelectStyles;


