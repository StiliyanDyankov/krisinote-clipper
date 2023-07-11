import { HtmlHTMLAttributes, useEffect, useRef, useState } from "react";
import { WrapperTypes, createNewWrapper, createSelectionContainer, findAndAnnihilateChildren, getElementDepth, getViableOutlinedElement, removeHoverWrapper, removeSelectionContainer } from "../../utils/lib";

const MultiselectPage = () => {

    const [selectionContainer, setSelectionContainer] = useState<HTMLElement | null>(()=> {
        if(document.getElementById("krisinote-clipper-selection-container")) {
           document.body.removeChild(document.getElementById("krisinote-clipper-selection-container") as Node);
        }
        console.log("runs creation of cont");
        return createSelectionContainer();
    });

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
        if(selectionContainer) {
            console.log("runs attaching of events");
            document.addEventListener('mouseover', handleMouseOverEvent);
            document.addEventListener("mouseout", handleMouseOutEvent);
            document.addEventListener("click", handleClickEvent)
        }

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