export {}

export const unviableElements = ["SPAN", "A", "I", "IFRAME", "B", "SVG", "PATH"]

export enum WrapperTypes {
    hover = "hover",
    selection = "selection"
}

export const isElementViable = (element: HTMLElement): boolean => {
    return window.getComputedStyle(element).getPropertyValue("display") !== "inline" 
            && !(unviableElements.includes(element.tagName)) 
            && element.id !== "krisinote-clipper-selection-container";
}

export const getViableParent = (element: HTMLElement): HTMLElement => {
    if(isElementViable(element)) {
        return element;
    } else return getViableParent(element.parentElement as HTMLElement);
}

export const getViableOutlinedElement = (hoveredElement: HTMLElement): HTMLElement => {
    let outlinedElement: HTMLElement | null = null;
    if(!isElementViable(hoveredElement)) {
        outlinedElement = getViableParent(hoveredElement);
    } else {
        outlinedElement = hoveredElement;
    }
    return outlinedElement;
}


export const createSelectionContainer = (): HTMLElement => {
    const selectionContainer = document.createElement("div");
    selectionContainer.id = "krisinote-clipper-selection-container";
    document.body.appendChild(selectionContainer);
    return selectionContainer;
}

export const removeSelectionContainer = (): void => {
    const container = document.getElementById("krisinote-clipper-selection-container");
    if(container) {
        document.body.removeChild(container);
    }
}

export const createNewWrapper = (outlinedElement: HTMLElement, selectionContainer: HTMLElement, type: WrapperTypes, id: number | null = null): HTMLElement => {


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

export const removeHoverWrapper = (selectionContainer: HTMLElement): void => {
    const hoverWrapper = document.getElementById("krisinote-clipper-hover-wrapper");
    if(hoverWrapper) {
        selectionContainer.removeChild(hoverWrapper as Node);
    }
}

export const findAndAnnihilateChildren = (
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

export const annihilateChild = (
    keyOfChild: number
): void => {
    const childWrapper = document.getElementById(`krisinote-clipper-selection-wrapper-${keyOfChild}`);
    const selectionContainer = document.getElementById("krisinote-clipper-selection-container");
    
    (selectionContainer as HTMLElement).removeChild(childWrapper as Node);
}

export const isNthParent = (possibleParent: HTMLElement, childElement: HTMLElement, deltaDepth: number) => {
    let childPlaceholder = childElement;
    for(let i = 0; i < deltaDepth; i++) {
        childPlaceholder = childPlaceholder.parentElement as HTMLElement;
    }
    return childPlaceholder === possibleParent;
}

export const getElementDepth = (element: HTMLElement, counter: number = 0): number => {
    if(element.nodeName === "BODY") return counter;
    else return getElementDepth(element.parentElement as HTMLElement, counter+1); 
}
