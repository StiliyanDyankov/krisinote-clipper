import { useEffect, useState } from "react";

enum SelectType {
    ARTICLE = "ARTICLE",
    SIMPLIFIED_ARTICLE = "SIMPLIFIED_ARTICLE"
}

const LandingPage = ({
    onMultiSelectClick
}:{
    onMultiSelectClick: () => void;
}) => {

    const [selectType, setSelectType] = useState<SelectType>(SelectType.ARTICLE);

    return ( 
        <>
            <h1>hello world</h1>
            <button onClick={()=> {
                onMultiSelectClick();
            }}>Multiselect</button>
            <button onClick={()=> {
                setSelectType(SelectType.ARTICLE);
            }}>article select</button>
        </>
    );
}
 
export default LandingPage;