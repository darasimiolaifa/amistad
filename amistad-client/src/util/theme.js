export default {
  palette: {
    primary: {
      light: "#33c9dc",
      dark: "#008394",
      main: "#00bcd4",
      contrastText: "#fff"
    },
    secondary: {
      light: "#ff6333",
      dark: "#ff3d00",
      main: "#b22a00",
      contrastText: "#fff"
    }
  },
  otherStyling: {
    typography: {
      useNextVariants: true
    },
    form: {
      textAlign: "center"
    },
    image: {
      margin: "20px auto 0 auto",
      width: "52px",
      height: "52px"
    },
    pageTitle: {
      margin: "10px auto 10px auto"
    },
    textField: {
      margin: "10px auto 10px auto"
    },
    button: {
      marginTop: 20,
      position: "relative"
    },
    progress: {
      position: "absolute"
    },
    customError: {
      color: "red",
      fontSize: "0.8rem",
      marginTop: 10
    },
    hiddenRule: {
      border: "none",
      margin: 4
    },
    visibleRule: {
      width: "100%",
      borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
      marginBottom: 20
    },
    paper: {
      padding: 20
    },
    profile: {
      "& .image-wrapper": {
        textAlign: "center",
        position: "relative",
        "& .button": {
          position: "absolute",
          top: "80%",
          left: "70%"
        }
      },
      "& .profile-image": {
        width: 200,
        height: 200,
        objectFit: "cover",
        maxWidth: "100%",
        borderRadius: "50%"
      },
      "& .profile-details": {
        textAlign: "center",
        "& span, svg": {
          verticalAlign: "middle"
        },
        "& a": {
          color: "#00bcd4"
        }
      },
      "& hr": {
        border: "none",
        margin: "0 0 10px 0"
      },
      "& svg.button": {
        "&:hover": {
          cursor: "pointer"
        }
      }
    },
    buttons: {
      textAlign: "center",
      "& a": {
        margin: "20px 10px"
      }
    }
  }
};
