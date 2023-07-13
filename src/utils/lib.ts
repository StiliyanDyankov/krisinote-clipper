export {}

export const unviableElements = ["SPAN", "A", "I", "IFRAME", "B", "SVG", "PATH", "HR", "SUP"]

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









// here happens the magic



export const krisinoteDOMParser = (entryElement: HTMLElement) => {
    const entryElementClone = entryElement.cloneNode(true) as HTMLElement;
    
    // if(entryElement?.nodeType === Node.ELEMENT_NODE) {
        
        
        entryElementClone.style.all = "initial";
        
        entryElementClone.style.backgroundColor = getInheritedBackgroundColor(entryElement);
        entryElementClone.style.fontFamily = getInheritedFontFamily(entryElement);
        entryElementClone.style.fontSize = getInheritedFontSize(entryElement);
        
        parseDOMNode(entryElement, entryElementClone);
        
        return entryElementClone;
        // } else return;
    }
    
const defaultStylesToBeCoppied = [  
                                    "color", "display", "box-sizing", "box-shadow",

                                    "visibility", "z-index", "position",

                                    "max-width", "min-width", "max-height", "min-height",

                                    "flex-direction", "flex-wrap", "flex-flow", "justify-content", "align-items", "align-content", "gap", "row-gap", "column-gap",
                                    "order", "flex-grow", "flex-shrink", "flex-basis", "flex", "align-self",

                                    "grid-template-columns", "grid-template-areas", "grid-template", "column-gap", "row-gap", "gap", "justify-items", "align-items", "place-items", "justify-content", "align-content", "place-content", "grid-auto-columns", "grid-auto-rows", "grid-auto-flow", "grid",
                                    "grid-column-start", "grid-column-end", "grid-row-start", "grid-row-end", "grid-column", "grid-row", "grid-area", "justify-self", "align-self", "place-self",
                                    
                                    "font-size", "font-style", "font-family", "font-weight", "overflow-wrap", "contain", "line-height", "tab-size", "text-size-adjust",
                                    "text-transform", "letter-spacing", "vertical-align",
                                    
                                    "border-color", "border-width", "border-style", 
                                    "border-bottom-left-radius", "border-bottom-right-radius", "border-top-left-radius", "border-top-right-radius", 
                                    "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", 

                                    "padding-top", "padding-right", "padding-left", "padding-bottom",

                                    "margin-top", "margin-right", "margin-left", "margin-bottom", 

                                    "background-color",
                                
                                    "overflow-x", "overflow-y",

                                    "list-style-image", "list-style-position", "list-style-type",
                                ];

                                
const sizingStylesToBeCoppied = [  
                                   
                                    "padding-right", "padding-left", 

                                    "margin-right", "margin-left", 

                                    "gap",

                                ];

const INSERTION_VIEWPORT_WIDTH = 1200;

const parseGridTemplateColumns = (original: string): string => {

    const split = original.split(" ");
    
    split.forEach((val, i) => {
        if (val.includes("px")) {
            let viewPortWidth = parseInt(window.getComputedStyle(document.body).getPropertyValue("width").slice(0, -2));
            let pxVal = parseInt(val.slice(0, -2));
            split[i] = `${Math.floor((pxVal/viewPortWidth)*100)}%`;
        }
    });
    
    return split.join(" ");
} 


const parseDOMNode = (realElement: HTMLElement | null, clonedElement: HTMLElement | null) => {
    
    if(realElement?.nodeType === Node.ELEMENT_NODE 
        && window.getComputedStyle(realElement as Element).getPropertyValue("visibility")!=="hidden") {
            // we have as a given here that the elements ARE actual html elements
            clonedElement = clonedElement as HTMLElement;
            // if(realElement?.nodeName === "BUTTON") {
            //     clonedElement?.parentElement?.removeChild(clonedElement);
            // }
        
        // remove id
        if(realElement?.id){
            clonedElement?.removeAttribute("id");
        }
        
        // remove class
        if(realElement?.className){
            clonedElement?.removeAttribute("class");
        }
        
        // here happens cloning of classes
        
        let styleAttributes = "";
        
        defaultStylesToBeCoppied.forEach((value) => {
            styleAttributes = appendStyle(styleAttributes, value, window.getComputedStyle(realElement as Element).getPropertyValue(value));
            clonedElement?.setAttribute("style", styleAttributes);
        });
        
        // gets the value of a given size prop as a number in px
        let viewPortWidth = parseInt(window.getComputedStyle(document.body).getPropertyValue("width").slice(0, -2));
        
        // gets the calculated size of an x-axis margin/padding and sets it as a fraction of vw
        sizingStylesToBeCoppied.forEach((value) => {
            // gets the value of a given size prop as a number in px
            let sizing = parseInt(window.getComputedStyle(realElement as Element).getPropertyValue(value).slice(0, -2))
            styleAttributes = appendStyle(styleAttributes, value, `${Math.floor((sizing/viewPortWidth)*INSERTION_VIEWPORT_WIDTH)}px`);
            clonedElement?.setAttribute("style", styleAttributes);
        });

        if(window.getComputedStyle(realElement as Element).getPropertyValue("display") === "grid") {
            clonedElement.style.gridTemplateColumns = parseGridTemplateColumns(window.getComputedStyle(realElement).getPropertyValue("grid-template-columns"));
        }
        
        

        clonedElement.style.backgroundColor = getInheritedBackgroundColor(realElement);

        clonedElement.style.overflowX = "hidden";

        console.log("element qualifiest", clonedElement.nodeName)
        if(clonedElement.nodeName === "IMG" || clonedElement.nodeName === "svg" || clonedElement.nodeName === "I" || clonedElement.nodeName === "path") {
            if(realElement?.getAttribute("width")){
                clonedElement?.removeAttribute("width");
            }
            if(realElement?.getAttribute("height")){
                clonedElement?.removeAttribute("height");
            }
            clonedElement.style.width = window.getComputedStyle(realElement as Element).getPropertyValue("width")
            clonedElement.style.height = window.getComputedStyle(realElement as Element).getPropertyValue("height")
        }

    }


    // run the algorithm
    realElement?.childNodes.forEach((childNode, key) => {
        parseDOMNode(childNode as HTMLElement, clonedElement?.childNodes.item(key) as HTMLElement)
    })
}

const appendStyle = (styleString: string, styleToBeAppended: string, value: string) => {
    return `${styleString}${styleToBeAppended}: ${value}; `;
}

function getInheritedBackgroundColor(el: HTMLElement): string {
    // get default style for current browser
    var defaultStyle = "rgba(0, 0, 0, 0)" ; // typically "rgba(0, 0, 0, 0)"
  
    // get computed color for el
    var backgroundColor = window.getComputedStyle(el).backgroundColor;
  
    // if we got a real value, return it
    if (backgroundColor != defaultStyle && backgroundColor != "rgba(0, 0, 0)") return backgroundColor;
  
    // otherwise, recurse up the DOM tree
    if (el.parentNode) return getInheritedBackgroundColor(el.parentNode as HTMLElement);
  
    // if we've reached the top of the tree and still haven't found a value,
    // return the default style
    return defaultStyle;
  }

  function getInheritedFontFamily(el: HTMLElement): string {
    // get default style for current browser
    var defaultStyle = "Times New Roman"; // typically "Times New Roman"
  
    // get computed font family for el
    var fontFamily = window.getComputedStyle(el).fontFamily;
  
    // if we got a real value, return it
    if (fontFamily != defaultStyle) return fontFamily;
  
    // otherwise, recurse up the DOM tree
    if (el.parentNode) return getInheritedFontFamily(el.parentNode as HTMLElement);
  
    // if we've reached the top of the tree and still haven't found a value,
    // return the default style
    return defaultStyle;
  }

  function getInheritedFontSize(el: HTMLElement): string {
      
      // get default font size for current browser
      var defaultSize = "16px"; // typically 16px
      
      // get computed font size for el
      if(el?.nodeType === Node.ELEMENT_NODE) {
          var fontSize = window.getComputedStyle(el).fontSize;
          
          // if we got a real value, return it
          if (fontSize != defaultSize) return fontSize;
          
          // otherwise, recurse up the DOM tree
          if (el.parentNode) return getInheritedFontSize(el.parentNode as HTMLElement);
        }
  
    // if we've reached the top of the tree and still haven't found a value,
    // return the default size
    return defaultSize;
  }
  


