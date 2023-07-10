import { useEffect, useState } from "react";


const LandingPage = ({
    onMultiSelectClick
}:{
    onMultiSelectClick: () => void;
}) => {

    return ( 
        <>
            <h1>hello world</h1>
            <button onClick={()=> {
                onMultiSelectClick();
            }}>Multiselect</button>
            
        </>
    );
}
 
export default LandingPage;