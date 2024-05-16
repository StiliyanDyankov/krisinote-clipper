import { useState } from "react"
import LandingPage from "./components/LandingPage"
import MultiselectPage from "./components/MultiselectPage"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { IconButton } from "@mui/material"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"

enum PageState {
  LANDING = "LANDING",
  MUTLISELECT = "MULTISELECT",
  LOADING = "LOADING"
}

export const colorsTailwind = {
  primary: "#90caf9",
  "l-secondary": "#003554",
  "l-utility-dark": "#00043A",
  "l-tools-bg": "#E9ECEF",
  "l-divider": "#7D7D7D",
  "l-workscreen-bg": "#F4F4F4",
  "l-workspace-bg": "#FAFAFA",
  "d-100-body-bg": "#292e4c",
  "d-200-cards": "#373d65",
  "d-300-chips": "#454c7f",
  "d-400-sibebar": "#525c98",
  "d-500-divider": "#666fac",
  "d-600-lightest": "#8c93c0",
  "d-700-text": "#bfc3dc"
}

const theme = createTheme({
  palette: {
    primary: {
      main: colorsTailwind["d-600-lightest"],
      contrastText: "#fff"
    },
    background: {
      default: colorsTailwind["d-500-divider"]
    },
    secondary: {
      main: "#fff"
    },
    text: {
      primary: "#ffffff"
    }
  },
  typography: {
    fontSize: 16,
    fontFamily: "Quicksand,Roboto,sans-serif,Segoe UI,Arial"
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textAlign: "left"
        }
      }
    }
  }
})

function App({ id, onExit }: { id?: any; onExit: (request: any) => void }) {
  const [pageState, setPageState] = useState<PageState>(() => {
    return PageState.LANDING
  })

  const handleMultiselectClick = () => {
    setPageState(PageState.MUTLISELECT)
  }

  return (
    <>
      <div style={{ all: "initial" }}>
        <ThemeProvider theme={theme}>
          <style>
            {`
					@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
					`}
          </style>
          <div
            id="krisinote-pages-container"
            style={{
              fontFamily: "'Quicksand', sans-serif",
              color: "#ffffff",
              padding: "10px",
              backgroundColor: colorsTailwind["d-100-body-bg"],
              border: `2px solid ${colorsTailwind["d-300-chips"]}`,
              fontSize: "16px"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "16px",
                marginBottom: "5px"
              }}
            >
              <div>
                {pageState === PageState.LOADING ? null : (
                  <h1
                    style={{
                      fontWeight: "500",
                      fontStyle: "italic",
                      fontSize: "16px"
                    }}
                  >
                    {
                      document.head.getElementsByTagName("title").item(0)
                        ?.innerText
                    }
                  </h1>
                )}
              </div>

              <IconButton
                onClick={() => {
                  onExit({ type: "LIFECYCLE_STATUS" })
                }}
                sx={{
                  ":hover": {
                    backgroundColor: "rgba(255,255,255,0.05)"
                  }
                }}
              >
                <CloseRoundedIcon
                  style={{
                    fill: "#fff"
                  }}
                />
              </IconButton>
            </div>
            {pageState === PageState.LANDING ? (
              <LandingPage onMultiSelectClick={handleMultiselectClick} />
            ) : null}
            {pageState === PageState.MUTLISELECT ? <MultiselectPage /> : null}
          </div>
        </ThemeProvider>
      </div>
    </>
  )
}

export default App
