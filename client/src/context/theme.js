import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#3964EF",
            // secondary: "#4285F4",
            // light: "#8AB4F8",
        },
        secondary: {
            main: "#676B6E",
        },
        black: {
            main: "#000",
            soft: "rgba(0, 0, 0, 0.15)",
        },
        textPrimary: {
            main: "#000",
        },
        red: {
            light: "#f6685e",
            main: "#f44336",
            dark: "#b71c1c",
        },
        yellow: {
            main: "#ffc107",
        },
        green: {
            main: "#4caf50",
        },
    },
    typography: {
        fontFamily: "Montserrat, Arial, sans-serif",
        lineHeight: 1.3,
        h1: {
            fontSize: 40,
            fontWeight: 500,
        },
        h2: {
            fontSize: 22,
            fontWeight: 600,
        },
        h3: {
            fontSize: 18,
            fontWeight: 600,
        },
        h4: {
            fontSize: 14,
            // opacity: 0.7,
        },
        // un used
        h5: {
            fontSize: 14,
            fontWeight: 500,
            opacity: 0.7,
        },
        h6: {
            fontSize: 10,
            fontWeight: 900,
        },
        body1: {
            fontSize: 14,
        },
        body2: {
            fontWeight: 600,
            opacity: 0.7,
            fontSize: 12,
        },
        subtitle1: {
            fontSize: 12,
        },
        subtitle2: {
            fontWeight: 600,
            opacity: 0.5,
            fontSize: 12,
        },
        navItems: {
            fontSize: 14,
            fontWeight: 600,
        },
    },

    components: {
        // MuiTypography: {
        //     styleOverrides: {
        //         h2: {
        //             "@media (max-width: 600px)": {
        //                 fontSize: 45,
        //             },
        //         },
        //     },
        // },

        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    padding: 8,
                    paddingLeft: 15,
                    paddingRight: 15,
                    fontFamily: "Montserrat, Arial, sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    borderRadius: 30,
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "none",
                    },
                },
            },
        },

        MuiTabs: {
            styleOverrides: {
                root: {
                    borderBottom: "1px solid #E0E0E0",
                    textTransform: "none",
                    // width: "100%",
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                },
            },
        },
    },
});

export default theme;
