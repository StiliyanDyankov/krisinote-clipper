import { useEffect, useRef, useState } from "react";
import { SelectType, WrapperTypes, createNewSpecialWrapper, createNewWrapper, createSelectionContainer, getArticleSelectionEl, isElementViable, krisinoteDOMParser, parseDomTree, putButtons, removeSelectionContainer, removeWrappers } from "../../utils/lib";


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
            // removeWrappers();
            if(selectType === SelectType.ARTICLE) {
                createNewSpecialWrapper(getArticleSelectionEl(), selectionContainer as HTMLElement, currentSelectedElementKey.current, {handlePlusButtonClick, handleMinusButtonClick});
            } else if(selectType === SelectType.FULL_PAGE) {
                createNewSpecialWrapper(document.body, selectionContainer as HTMLElement, currentSelectedElementKey.current, {handlePlusButtonClick, handleMinusButtonClick});
            }
        }
    }, [selectType]);
    
    useEffect(() => {
        if(selectionContainer){
            // attach new event listeners
            document.getElementById("krisinote-clipper-article-plus-button")?.addEventListener("click", handlePlusButtonClick);
            document.getElementById("krisinote-clipper-article-minus-button")?.addEventListener("click", handleMinusButtonClick);

            console.log(selectedElements.get(currentSelectedElementKey.current));

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
            <button onClick={()=> {
                setSelectType(SelectType.FULL_PAGE);
            }}>full page select</button>
            <button
            onClick={()=> {
                parseDomTree(selectedElements.get(currentSelectedElementKey.current) as HTMLElement);
            }}
            >get stile</button>
        </>
    );
}
 
export default LandingPage;