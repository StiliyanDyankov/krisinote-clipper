import { HtmlHTMLAttributes, useEffect, useRef, useState } from "react";

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

const findAndAnnihilateChildren = (
    selectedElements: Map<number, HTMLElement>,
    selectedElementsDepth: Map<number, number>,
    possibleParent: {element: HTMLElement, depth: number}
): Map<number, HTMLElement> => {
        selectedElementsDepth.forEach((value, key)=> {
            if(possibleParent.depth < value) {
                if(isNthParent(possibleParent.element, selectedElements.get(key) as HTMLElement, value - possibleParent.depth)) {
                    annihilateChild(key);
                    selectedElements.delete(key);
                    selectedElementsDepth.delete(key);
                }
            }
        });
        return selectedElements;
}

const annihilateChild = (
    keyOfChild: number
): void => {
    const childWrapper = document.getElementById(`krisinote-clipper-selection-wrapper-${keyOfChild}`);
    const selectionContainer = document.getElementById("krisinote-clipper-selection-container");
    
    (selectionContainer as HTMLElement).removeChild(childWrapper as Node);
}

const isNthParent = (possibleParent: HTMLElement, childElement: HTMLElement, deltaDepth: number) => {
    let childPlaceholder = childElement;
    for(let i = 0; i < deltaDepth; i++) {
        childPlaceholder = childPlaceholder.parentElement as HTMLElement;
    }
    return childPlaceholder === possibleParent;
}

const getElementDepth = (element: HTMLElement, counter: number = 0): number => {
    if(element.nodeName === "BODY") return counter;
    else return getElementDepth(element.parentElement as HTMLElement, counter+1); 
}

const MultiselectPage = () => {

    const [selectionContainer, setSelectionContainer] = useState<HTMLElement | null>(createSelectionContainer);

    // stores outlined elements in state
    const [selectedElements, setSelectedElements] = useState<Map<number, HTMLElement>>(new Map());

    const [selectedElementsDepth, setSelectedElementsDepth] = useState<Map<number, number>>(new Map());

    let counterAutoIncr = useRef(1);

    const handleMouseOverEvent = (event: MouseEvent): void => {
        let hoveredElement = event.target as HTMLElement;                                                                                
        if(
            !hoveredElement.id.startsWith("krisinote-clipper-selection-wrapper")
            // last two checks for ignoring pop-up selection
            && !(hoveredElement.id.startsWith("react-chrome-app")) 
            && !(hoveredElement.nodeName === "IFRAME")
        ) {
            let outlinedElement: HTMLElement = getViableOutlinedElement(hoveredElement);
            
            createNewWrapper(outlinedElement, selectionContainer as HTMLElement, WrapperTypes.hover);
        }
    }

    const handleMouseOutEvent = (event: MouseEvent): void => {
        removeHoverWrapper(selectionContainer as HTMLElement);
    }


    const handleClickEvent = (event: MouseEvent) : void => {
        let outlinedElement: HTMLElement = getViableOutlinedElement(event.target as HTMLElement);
        
        if(outlinedElement.id.startsWith("react-chrome-app") && outlinedElement.nodeName === "IFRAME") {
            //
            // empty - no behaviour if selected element is the clipper itself
            //
        } else if(outlinedElement.id.startsWith("krisinote-clipper-selection-wrapper")) {
            // executes on second time selection of an element - removes the selected el

            const keyOfSavedElement = parseInt(outlinedElement.id.split("-")[4]);
            selectedElements.delete(keyOfSavedElement);
            selectedElementsDepth.delete(keyOfSavedElement);
            setSelectedElements(selectedElements);
            setSelectedElementsDepth(selectedElementsDepth);
            document.getElementById("krisinote-clipper-selection-container")?.removeChild(outlinedElement);
        } else {
            // executed on initial selection of an element
            findAndAnnihilateChildren(
                selectedElements, 
                selectedElementsDepth, 
                { element: outlinedElement, depth: getElementDepth(outlinedElement) }
            );
            
            // this logic should remain the same whether selected is parent or not
            setSelectedElements(new Map(selectedElements.set(counterAutoIncr.current, outlinedElement)));
            setSelectedElementsDepth(new Map(selectedElementsDepth.set(counterAutoIncr.current, getElementDepth(outlinedElement))));
            createNewWrapper(outlinedElement, selectionContainer as HTMLElement, WrapperTypes.selection, counterAutoIncr.current);

            counterAutoIncr.current = counterAutoIncr.current + 1;
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

    },[]);

    return ( 
        <>
            <h1>hello MultiselectPage</h1>
            <p>some paragraph content</p>
            <div>some block content {selectedElements.size}</div>
            <button
                onClick={()=> {
                    console.log(window.getComputedStyle((document.getElementById("krisinote-clipper-iframe") as HTMLIFrameElement).contentDocument?.getElementById("krisinote-pages-container") as HTMLElement).height)
                }}
            >some button</button>
        </> 
    );
}
 
export default MultiselectPage;