import { useEffect, useState } from "react";
import { WrapperTypes, createNewWrapper, createSelectionContainer } from "../../utils/lib";

enum SelectType {
    ARTICLE = "ARTICLE",
    SIMPLIFIED_ARTICLE = "SIMPLIFIED_ARTICLE"
}

const getArticleSelectionEl = (): HTMLElement => {
    let docToBeReturned = document.querySelector("article");
    if(!docToBeReturned) {
        docToBeReturned = document.querySelector("body") as HTMLElement;
    }
    return docToBeReturned;
}

const putButtons = (): void => {
    const selectionWrapper = document.getElementById("krisinote-clipper-selection-wrapper") as HTMLElement;

    selectionWrapper.style.position = "relative";

    var plusIcon = document.createElement("div");
    plusIcon.style.width = "20px";
    plusIcon.style.height = "20px";
    plusIcon.style.borderRadius = "50%";
    plusIcon.style.backgroundColor = "white";
    plusIcon.style.boxShadow = "0 0 0 2px black";
    plusIcon.style.position = "relative";
    plusIcon.style.margin = "auto";
    var plusLine1 = document.createElement("div");
    plusLine1.style.width = "10px";
    plusLine1.style.height = "2px";
    plusLine1.style.backgroundColor = "black";
    plusLine1.style.position = "absolute";
    plusLine1.style.top = "50%";
    plusLine1.style.left = "50%";
    plusLine1.style.transform = "translate(-50%, -50%)";
    var plusLine2 = document.createElement("div");
    plusLine2.style.width = "2px";
    plusLine2.style.height = "10px";
    plusLine2.style.backgroundColor = "black";
    plusLine2.style.position = "absolute";
    plusLine2.style.top = "50%";
    plusLine2.style.left = "50%";
    plusLine2.style.transform = "translate(-50%, -50%)";
    plusIcon.appendChild(plusLine1);
    plusIcon.appendChild(plusLine2);



    let plusButton = document.createElement("div");
    plusButton.style.width = "27px";
    plusButton.style.height = "24px";

    plusButton.appendChild(plusIcon);



    let minusButton = document.createElement("div");


    let topElement = document.createElement("div");
    topElement.style.position = "absolute";
    topElement.style.top = "-12px";
    topElement.style.left = "50%";
    // topElement.style.transform = "translateX(-50%)";
    topElement.style.width = "54px";
    topElement.style.height = "24px";


    topElement.appendChild(plusButton);

    selectionWrapper.appendChild(topElement);

}





const LandingPage = ({
    onMultiSelectClick
}:{
    onMultiSelectClick: () => void;
}) => {

    const [selectType, setSelectType] = useState<SelectType>(SelectType.ARTICLE);

    const [selectionContainer, setSelectionContainer] = useState<HTMLElement | null>(createSelectionContainer);

    useEffect(() => {
        if(selectionContainer){
            createNewWrapper(getArticleSelectionEl(), selectionContainer as HTMLElement, WrapperTypes.selection);
            putButtons();
        }
    }, [])

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