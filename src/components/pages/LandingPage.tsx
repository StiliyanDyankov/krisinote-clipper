import { useEffect, useRef, useState } from "react";
import { WrapperTypes, createNewWrapper, createSelectionContainer, isElementViable, removeSelectionContainer } from "../../utils/lib";

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

const putButtons = (id:number): void => {
    console.log("new buttons are put for",id);
    const selectionWrapper = document.getElementById(`krisinote-clipper-selection-wrapper-${id}`) as HTMLElement;

    selectionWrapper.style.position = "absolute";

    let plusIcon = document.createElement("div");
    plusIcon.style.width = "20px";
    plusIcon.style.height = "20px";
    plusIcon.style.borderRadius = "2px 0 0 2px";
    plusIcon.style.backgroundColor = "black";
    plusIcon.style.boxShadow = "0 0 0 2px black";
    plusIcon.style.position = "relative";
    plusIcon.style.margin = "auto";
    let plusLine1 = document.createElement("div");
    plusLine1.style.width = "10px";
    plusLine1.style.height = "2px";
    plusLine1.style.backgroundColor = "white";
    plusLine1.style.position = "absolute";
    plusLine1.style.top = "50%";
    plusLine1.style.left = "50%";
    plusLine1.style.transform = "translate(-50%, -50%)";
    let plusLine2 = document.createElement("div");
    plusLine2.style.width = "2px";
    plusLine2.style.height = "10px";
    plusLine2.style.backgroundColor = "white";
    plusLine2.style.position = "absolute";
    plusLine2.style.top = "50%";
    plusLine2.style.left = "50%";
    plusLine2.style.transform = "translate(-50%, -50%)";
    plusIcon.appendChild(plusLine1);
    plusIcon.appendChild(plusLine2);

    let plusButton = document.createElement("div");
    plusButton.id = "krisinote-clipper-article-plus-button";
    plusButton.style.width = "27px";
    plusButton.style.height = "24px";
    plusButton.style.cursor = "pointer";

    plusButton.appendChild(plusIcon);

    let minusIcon = document.createElement("div");
    minusIcon.style.width = "20px";
    minusIcon.style.height = "20px";
    minusIcon.style.borderRadius = "0 2px 2px 0";
    minusIcon.style.backgroundColor = "black";
    minusIcon.style.boxShadow = "0 0 0 2px black";
    minusIcon.style.position = "relative";
    minusIcon.style.margin = "auto";
    let minusLine = document.createElement("div");
    minusLine.style.width = "10px";
    minusLine.style.height = "2px";
    minusLine.style.backgroundColor = "white";
    minusLine.style.position = "absolute";
    minusLine.style.top = "50%";
    minusLine.style.left = "50%";
    minusLine.style.transform = "translate(-50%, -50%)";
    minusIcon.appendChild(minusLine);


    let minusButton = document.createElement("div");
    minusButton.id = "krisinote-clipper-article-minus-button";
    minusButton.style.width = "27px";
    minusButton.style.height = "24px";
    minusButton.style.cursor = "pointer";
    
    minusButton.appendChild(minusIcon);

    let topElement = document.createElement("div");
    topElement.style.position = "absolute";
    topElement.style.top = "-12px";
    topElement.style.left = "50%";
    topElement.style.width = "54px";
    topElement.style.height = "24px";
    topElement.style.display = "flex";
    topElement.style.flexDirection = "row";
    topElement.style.pointerEvents = "all";

    topElement.appendChild(plusButton);
    topElement.appendChild(minusButton);
    
    selectionWrapper.appendChild(topElement);
}

const createNewSpecialWrapper = (outlinedElement: HTMLElement, selectionContainer: HTMLElement, id: number, eventHandlers: {
    handlePlusButtonClick: () => void,
    handleMinusButtonClick: () => void,
}) => {
    // get current wrapper
    const currentSelectedElementWrapper = selectionContainer?.firstElementChild as HTMLElement;
    document.getElementById("krisinote-clipper-article-plus-button")?.removeEventListener("click", eventHandlers.handlePlusButtonClick);
    document.getElementById("krisinote-clipper-article-minus-button")?.removeEventListener("click", eventHandlers.handleMinusButtonClick);
    document.getElementById("krisinote-clipper-selection-container")?.removeChild(currentSelectedElementWrapper);

    createNewWrapper(outlinedElement, selectionContainer as HTMLElement, WrapperTypes.selection, id);
    putButtons(id);
    document.getElementById("krisinote-clipper-article-plus-button")?.addEventListener("click", eventHandlers.handlePlusButtonClick);
    document.getElementById("krisinote-clipper-article-minus-button")?.addEventListener("click", eventHandlers.handleMinusButtonClick);
}




const LandingPage = ({
    onMultiSelectClick
}:{
    onMultiSelectClick: () => void;
}) => {

    const [selectType, setSelectType] = useState<SelectType>(SelectType.ARTICLE);

    const [selectionContainer, setSelectionContainer] = useState<HTMLElement | null>(()=> {
        if(document.getElementById("krisinote-clipper-selection-container")) {
           document.body.removeChild(document.getElementById("krisinote-clipper-selection-container") as Node);
        }
        return createSelectionContainer();
    });

    const currentSelectedElementKey = useRef(9999);

    const [selectedElements, setSelectedElements] = useState<Map<number,HTMLElement>>(() => {
        const selEl = new Map<number,HTMLElement>();
        selEl.set(currentSelectedElementKey.current, getArticleSelectionEl());
        return selEl;
    });


    const handlePlusButtonClick = () => {
        const currentSelectedEl = selectedElements.get(currentSelectedElementKey.current);
        // check if a parent element has been traced before
        if(selectedElements.has(currentSelectedElementKey.current + 1)){
            currentSelectedElementKey.current++;
            createNewSpecialWrapper(
                selectedElements.get(currentSelectedElementKey.current) as HTMLElement,
                selectionContainer as HTMLElement,
                currentSelectedElementKey.current,
                {handlePlusButtonClick, handleMinusButtonClick}
            )
            // check if element has a parent and it's not body
        } else if(currentSelectedEl?.parentNode && currentSelectedEl?.parentNode.nodeName !== "BODY") {
            currentSelectedElementKey.current++;
            selectedElements.set(currentSelectedElementKey.current, currentSelectedEl?.parentNode as HTMLElement);
            createNewSpecialWrapper(
                currentSelectedEl.parentNode as HTMLElement,
                selectionContainer as HTMLElement,
                currentSelectedElementKey.current,
                {handlePlusButtonClick, handleMinusButtonClick}
            )
        }
    }

    const handleMinusButtonClick = () => {
        const currentSelectedEl = selectedElements.get(currentSelectedElementKey.current);
        // check if a child element has been traced before
        if(selectedElements.has(currentSelectedElementKey.current - 1)){
            currentSelectedElementKey.current--;
            createNewSpecialWrapper(
                selectedElements.get(currentSelectedElementKey.current) as HTMLElement,
                selectionContainer as HTMLElement,
                currentSelectedElementKey.current,
                {handlePlusButtonClick, handleMinusButtonClick}
            )
            //check if element has a child and it's a viable element
        } else if(currentSelectedEl?.firstChild && isElementViable(currentSelectedEl?.firstChild as HTMLElement)) {
            currentSelectedElementKey.current--;
            selectedElements.set(currentSelectedElementKey.current, currentSelectedEl?.firstChild as HTMLElement);
            createNewSpecialWrapper(
                currentSelectedEl.firstChild as HTMLElement,
                selectionContainer as HTMLElement,
                currentSelectedElementKey.current,
                {handlePlusButtonClick, handleMinusButtonClick}
            )
        }
    }

    useEffect(() => {
        if(selectionContainer){
            createNewWrapper(getArticleSelectionEl(), selectionContainer as HTMLElement, WrapperTypes.selection, currentSelectedElementKey.current);
            putButtons(currentSelectedElementKey.current);

              
            // attach new event listeners
            document.getElementById("krisinote-clipper-article-plus-button")?.addEventListener("click", handlePlusButtonClick);
            document.getElementById("krisinote-clipper-article-minus-button")?.addEventListener("click", handleMinusButtonClick);

        }
        return () => {
            document.getElementById("krisinote-clipper-article-plus-button")?.removeEventListener("click", handlePlusButtonClick);
            document.getElementById("krisinote-clipper-article-minus-button")?.removeEventListener("click", handleMinusButtonClick);
            if(document.getElementById("krisinote-clipper-selection-container") && document.getElementById("krisinote-clipper-selection-container")?.children.length){

                removeSelectionContainer();
            }
            console.log("runs deletion of container");
        }
    }, []);

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