import { Button } from "@mui/material";
import { useEffect } from "react";

// chrome.runtime.onMessage.addListener((message) => {
//     console.log("never btraink the chain okay eltsfj go", message);
// });
// async function getCurrentTab() {
//     let queryOptions = { active: true, lastFocusedWindow: true };
//     // `tab` will either be a `tabs.Tab` instance or `undefined`.
//     let [tab] = await chrome.tabs.query(queryOptions);
//     return tab;
// }

const AuthPage = () => {

    return ( 
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent:"center",
                    fontSize: "16px",
                    gap: "16px"
                }}
            >
                <h1
                    style={{
                        textAlign: "center"
                    }}
                >Login with your Krisinote account to continue:</h1>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={()=> {
                        chrome.runtime.sendMessage({ message: `Open new tab` });
                    }}
                    style={{
                        fontWeight: "700",
                        color: "#fff",
                        fontSize: "16px",
                        position: "relative"
                    }}
                >
                    Login
                </Button>
            </div>
        </>

    );
}
 
export default AuthPage;