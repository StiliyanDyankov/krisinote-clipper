import { useEffect, useState } from "react";

const unviableElements = ["SPAN", "A", "I", "IFRAME", "B", "SVG", "PATH"]

enum WrapperTypes {
    hover = "hover",
    selection = "selection"
}

const isElementViable = (element: HTMLElement): boolean => {
    return window.getComputedStyle(element).getPropertyValue("display") !== "inline" 
            && !(unviableElements.includes(element.tagName)) 
            && element.id !== "krisinote-clipper-selection-container";
}

const getViableParent = (element: HTMLElement): HTMLElement => {
    if(isElementViable(element)) {
        return element;
    } else return getViableParent(element.parentElement as HTMLElement);
}

const getViableOutlinedElement = (hoveredElement: HTMLElement): HTMLElement => {
    let outlinedElement: HTMLElement | null = null;
    if(!isElementViable(hoveredElement)) {
        outlinedElement = getViableParent(hoveredElement);
    } else {
        outlinedElement = hoveredElement;
    }
    return outlinedElement;
}


const createSelectionContainer = (): HTMLElement => {
    const selectionContainer = document.createElement("div");
    selectionContainer.id = "krisinote-clipper-selection-container";
    document.body.appendChild(selectionContainer);
    return selectionContainer;
}

const removeSelectionContainer = (): void => {
    const container = document.getElementById("krisinote-clipper-selection-container");
    if(container) {
        document.body.removeChild(container);
    }
}

const createNewWrapper = (outlinedElement: HTMLElement, selectionContainer: HTMLElement, type: WrapperTypes, id: number | null = null): HTMLElement => {


    const hoverWrapper = document.createElement("div");

    hoverWrapper.id = `krisinote-clipper-${type}-wrapper${id? "-" + id: ""}`;
    
    hoverWrapper.style.border = "3px solid blue";
    hoverWrapper.style.backgroundColor = "rgba(0,0,0,0.3)";
    hoverWrapper.style.position = "absolute";
    hoverWrapper.style.zIndex = "99998";
    if(!id) {
        hoverWrapper.style.pointerEvents = "none";
    } else {
        hoverWrapper.style.pointerEvents = "all";
    }

    hoverWrapper.style.height = window.getComputedStyle(outlinedElement).height;
    hoverWrapper.style.width = window.getComputedStyle(outlinedElement).width;
    hoverWrapper.style.top = `${outlinedElement.getBoundingClientRect().top + window.scrollY}px`;
    hoverWrapper.style.left = `${outlinedElement.getBoundingClientRect().left + window.scrollX}px`;

    selectionContainer.appendChild(hoverWrapper);
    
    return hoverWrapper;
}

const removeHoverWrapper = (selectionContainer: HTMLElement): void => {
    const hoverWrapper = document.getElementById("krisinote-clipper-hover-wrapper");
    if(hoverWrapper) {
        selectionContainer.removeChild(hoverWrapper as Node);
    }
}

const MultiselectPage = () => {

    const [selectionContainer, setSelectionContainer] = useState<HTMLElement>(createSelectionContainer);

    // stores outlined elements in state
    const [selectedElements, setSelectedElements] = useState<Map<number, HTMLElement>>(new Map());

    const [counterAutoIncr, setCounterAutoIncr] = useState<number>(1);

    const handleMouseOverEvent = (event: MouseEvent): void => {
        let hoveredElement = event.target as HTMLElement;

        if(!hoveredElement.id.startsWith("krisinote-clipper-selection-wrapper")) {
            let outlinedElement: HTMLElement = getViableOutlinedElement(hoveredElement);
            
            createNewWrapper(outlinedElement, selectionContainer, WrapperTypes.hover);
        }
    }

    const handleMouseOutEvent = (event: MouseEvent): void => {
        removeHoverWrapper(selectionContainer);
    }


    const handleClickEvent = (event: MouseEvent) : void => {
        let outlinedElement: HTMLElement = getViableOutlinedElement(event.target as HTMLElement);
        
        // check if decendants of this elements are in state and handle

        if(outlinedElement.id.startsWith("krisinote-clipper-selection-wrapper")) {
            const keyOfSavedElement = parseInt(outlinedElement.id.split("-")[5]);
            setSelectedElements(prevState => {
                prevState.delete(keyOfSavedElement);
                return new Map(prevState);
            })
            // fix bug here
            document.getElementById("krisinote-clipper-selection-container")?.removeChild(outlinedElement);
        } else {

            
            setSelectedElements(new Map(selectedElements.set(counterAutoIncr, outlinedElement)));
            createNewWrapper(outlinedElement, selectionContainer, WrapperTypes.selection, counterAutoIncr);
            setCounterAutoIncr(c => c+1);
        }



        
        
    }

    useEffect(()=> {
        document.addEventListener('mouseover', handleMouseOverEvent);
        document.addEventListener("mouseout", handleMouseOutEvent);
        document.addEventListener("click", handleClickEvent)

        return () => {
            // clean-up
            document.removeEventListener('mouseover', handleMouseOverEvent);
            document.removeEventListener("mouseout", handleMouseOutEvent);
            document.removeEventListener("click", handleClickEvent);
            removeSelectionContainer();
        }

    },[])

    return ( 
        <>
            <h1>hello MultiselectPage</h1>
            <p>some paragraph content</p>
            <div>some block content</div>
            <button
                onClick={()=> {
                    console.log(window.getComputedStyle((document.getElementById("krisinote-clipper-iframe") as HTMLIFrameElement).contentDocument?.getElementById("krisinote-pages-container") as HTMLElement).height)
                }}
            >some button</button>
        </> 
    );
}
 
export default MultiselectPage;