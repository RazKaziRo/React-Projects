const themeFile = {
  direction: "rtl",
  typography: {
    fontFamily: ['"Varela Round"', "sans-serif"].join(","),
  },
  palette: {
    primary: {
      light: "#ffff52",
      main: "#ffd600",
      dark: "#c7a500",
      contrastText: "#000",
    },
    secondary: {
      light: "#ffffcf",
      main: "#fff59d",
      dark: "#cbc26d",
      contrastText: "#000",
    },
  },
  formWrapper: {
    width: "350px",
    margin: "0 auto",
    textAlign: "center",
  },
  loginForm: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
  },
  button: {
    margin: "20px 0",
  },
  textField: {
    margin: "15px 0",
  },
  customError: {
    color: "red",
    fontSize: "0.8rem",
  },
  mainLogo: {
    width: "225px",
  },
  buttomHelpWrapper: {
    display: "flex",
    flexWrap: "wrap",
  },
  helpText: {
    width: "100%",
    margin: "0 auto 15px auto",
  },
  helpLink: {
    fontSize: "12px",
    color: "black",
    width: "50%",
  },
};

module.exports = { themeFile };
