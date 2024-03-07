const SelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    cursor: "pointer",
    borderColor: state.isFocused ? base.border : base.border,
    "&:hover": {
      border: state.isfocused ? base.border : base.border,
    },
    boxShadow: state.isFocused ? "0 0 2px #000 inset, 0 0 0 2px 0.5 inset" : 0,
    outline: state.isFocused ? "2px solid black" : "none",
    outlineOffset: state.isFocused ? "2px" : "none",
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
  multiValue: (base: any) => {
    return {
      ...base,
      color: "white",
      backgroundColor: "#282828",
      borderRadius: "16px",
      fontWeight: "600",
    }
  },
  multiValueLabel: (base: any) => {
    return {
      ...base,
      paddingLeft: "12px",
      color: "white",
    }
  },
  multiValueRemove: (base: any) => {
    return {
      ...base,
      borderRadius: "0 16px 16px 0",
    }
  },
  valueContainer: (base: any) => {
    return {
      ...base,
    }
  },
}

export default SelectStyles
