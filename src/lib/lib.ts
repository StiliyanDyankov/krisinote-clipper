import {
  ContainerMinusButtonId,
  ContainerPlusButtonId,
  SelectionContainerId,
  WrapperTypes,
  UnviableElements,
  StyleDeclaration,
  HoverWrapperStyles,
  TestBoxStyles,
  PlusIconStyles,
  PlusLineHorizontalStyles,
  PlusLineVerticalStyles,
  ButtonStyles,
  MinusIconStyles,
  MinusLineStyles,
  TopElementStyles
} from "./constants"

export {}

export const removeWrappers = (): void => {
  const selectionContainer = document.getElementById(SelectionContainerId)
  if (selectionContainer) {
    selectionContainer.childNodes.forEach((wrapper) => {
      selectionContainer.removeChild(wrapper)
    })
  }
}

export const isElementViable = (element: HTMLElement): boolean => {
  return (
    window.getComputedStyle(element).getPropertyValue("display") !== "inline" &&
    !UnviableElements.includes(element.nodeName) &&
    element.id !== SelectionContainerId
  )
}

export const getViableParent = (element: HTMLElement): HTMLElement => {
  if (isElementViable(element)) {
    return element
  } else return getViableParent(element.parentElement as HTMLElement)
}

export const createSelectionContainer = (): HTMLElement => {
  const selectionContainer = document.createElement("div")
  selectionContainer.id = SelectionContainerId
  document.body.appendChild(selectionContainer)
  return selectionContainer
}

export const removeSelectionContainer = (): void => {
  const container = document.getElementById(SelectionContainerId)
  if (container) {
    document.body.removeChild(container)
  }
}

export const applyStyles = (
  element: HTMLDivElement,
  styles: StyleDeclaration
): void => {
  Object.keys(styles).forEach((key) => {
    element.style[key as any] = styles[key]
  })
}

export const createNewWrapper = (
  outlinedElement: HTMLElement,
  selectionContainer: HTMLElement,
  type: WrapperTypes,
  id: number | null = null
): HTMLElement => {
  const hoverWrapper = document.createElement("div")

  hoverWrapper.id = `krisinote-clipper-${type}-wrapper${id ? "-" + id : ""}`

  applyStyles(hoverWrapper, HoverWrapperStyles)

  if (!id) {
    hoverWrapper.style.pointerEvents = "none"
  } else {
    hoverWrapper.style.pointerEvents = "all"
  }

  hoverWrapper.style.height = window.getComputedStyle(outlinedElement).height
  hoverWrapper.style.width = window.getComputedStyle(outlinedElement).width
  hoverWrapper.style.top = `${outlinedElement.getBoundingClientRect().top + window.scrollY}px`
  hoverWrapper.style.left = `${outlinedElement.getBoundingClientRect().left + window.scrollX}px`

  selectionContainer.appendChild(hoverWrapper)

  return hoverWrapper
}

export const removeHoverWrapper = (selectionContainer: HTMLElement): void => {
  const hoverWrapper = document.getElementById(
    "krisinote-clipper-hover-wrapper"
  )
  if (hoverWrapper) {
    selectionContainer.removeChild(hoverWrapper as Node)
  }
}

export const findAndAnnihilateChildren = (
  selectedElements: Map<number, HTMLElement>,
  selectedElementsDepth: Map<number, number>,
  possibleParent: { element: HTMLElement; depth: number }
): Map<number, HTMLElement> => {
  selectedElementsDepth.forEach((value, key) => {
    if (possibleParent.depth < value) {
      if (
        isNthParent(
          possibleParent.element,
          selectedElements.get(key) as HTMLElement,
          value - possibleParent.depth
        )
      ) {
        annihilateChild(key)
        selectedElements.delete(key)
        selectedElementsDepth.delete(key)
      }
    }
  })
  return selectedElements
}

export const annihilateChild = (keyOfChild: number): void => {
  const childWrapper = document.getElementById(
    `krisinote-clipper-selection-wrapper-${keyOfChild}`
  )
  const selectionContainer = document.getElementById(SelectionContainerId)

  ;(selectionContainer as HTMLElement).removeChild(childWrapper as Node)
}

export const isNthParent = (
  possibleParent: HTMLElement,
  childElement: HTMLElement,
  deltaDepth: number
) => {
  let childPlaceholder = childElement
  for (let i = 0; i < deltaDepth; i++) {
    childPlaceholder = childPlaceholder.parentElement as HTMLElement
  }
  return childPlaceholder === possibleParent
}

export const getElementDepth = (
  element: HTMLElement,
  counter: number = 0
): number => {
  if (element.nodeName === "BODY") return counter
  else return getElementDepth(element.parentElement as HTMLElement, counter + 1)
}

export const parseDomTree = async (
  el: HTMLElement | Map<Number, HTMLElement>,
  multiselect: boolean = false
) => {
  const testBox = document.createElement("div")
  applyStyles(testBox, TestBoxStyles)
  document.body.appendChild(testBox)

  if (multiselect) {
    ;(el as Map<Number, HTMLElement>).forEach((el) => {
      const cloned = krisinoteDOMParser(el as HTMLElement)

      const xmls = new XMLSerializer()
      const stringified = xmls.serializeToString(cloned)

      // just for testing purposes

      testBox.insertAdjacentHTML("afterbegin", xmls.serializeToString(cloned))
      const link = document.querySelectorAll("head link")

      console.log(
        performance
          .getEntries()
          .map((entry) => {
            return entry.name
          })
          .filter((url) => {
            return url.includes(".woff") || url.includes("font")
          })
      )

      const fontArr = performance
        .getEntries()
        .map((entry) => {
          return entry.name
        })
        .filter((url) => {
          return url.includes(".woff") || url.includes("font")
        })

      console.log("font array", fontArr)

      const result = fontArr.map(
        (font) => `<link href="${font}" type="text/css" rel="stylesheet"/>`
      )

      console.log("final result", result)

      const finalRes = result.join("") + stringified
      console.log(finalRes)
    })
  } else {
    const cloned = krisinoteDOMParser(el as HTMLElement)

    const xmls = new XMLSerializer()
    const stringified = xmls.serializeToString(cloned)

    // just for testing purposes

    testBox.insertAdjacentHTML("afterbegin", xmls.serializeToString(cloned))
    const link = document.querySelectorAll("head link")

    console.log(
      performance
        .getEntries()
        .map((entry) => {
          return entry.name
        })
        .filter((url) => {
          return url.includes(".woff") || url.includes("font")
        })
    )

    const fontArr = performance
      .getEntries()
      .map((entry) => {
        return entry.name
      })
      .filter((url) => {
        return url.includes(".woff") || url.includes("font")
      })

    console.log("font array", fontArr)

    const result = fontArr.map(
      (font) => `<link href="${font}" type="text/css" rel="stylesheet"/>`
    )

    console.log("final result", result)

    const finalRes = result.join("") + stringified
    console.log(finalRes)
  }

  // testBox.appendChild(cloned);

  // try to get all link elements
}

export enum SelectType {
  ARTICLE = "ARTICLE",
  FULL_PAGE = "FULL_PAGE",
  SIMPLIFIED_ARTICLE = "SIMPLIFIED_ARTICLE"
}

export const getArticleSelectionEl = (): HTMLElement => {
  let docToBeReturned = document.querySelector(
    "main article"
  ) as HTMLElement | null
  if (!docToBeReturned) {
    docToBeReturned = document.querySelector("article") as HTMLElement | null
  }
  if (!docToBeReturned) {
    docToBeReturned = document.querySelector("body") as HTMLElement
  }
  return docToBeReturned
}

export const putButtons = (id: number): void => {
  const selectionWrapper = document.getElementById(
    `krisinote-clipper-selection-wrapper-${id}`
  ) as HTMLElement

  selectionWrapper.style.position = "absolute"

  const plusIcon = document.createElement("div")
  applyStyles(plusIcon, PlusIconStyles)
  const plusLineHorizontal = document.createElement("div")
  applyStyles(plusLineHorizontal, PlusLineHorizontalStyles)
  const plusLineVertical = document.createElement("div")
  applyStyles(plusLineVertical, PlusLineVerticalStyles)
  plusIcon.appendChild(plusLineHorizontal)
  plusIcon.appendChild(plusLineVertical)

  const plusButton = document.createElement("div")
  plusButton.id = ContainerPlusButtonId
  applyStyles(plusButton, ButtonStyles)

  plusButton.appendChild(plusIcon)

  const minusIcon = document.createElement("div")
  applyStyles(minusIcon, MinusIconStyles)
  const minusLine = document.createElement("div")
  applyStyles(minusLine, MinusLineStyles)
  minusIcon.appendChild(minusLine)

  const minusButton = document.createElement("div")
  minusButton.id = ContainerMinusButtonId
  applyStyles(minusButton, ButtonStyles)
  minusButton.appendChild(minusIcon)

  const topElement = document.createElement("div")
  applyStyles(topElement, TopElementStyles)

  topElement.appendChild(plusButton)
  topElement.appendChild(minusButton)

  selectionWrapper.appendChild(topElement)
}

export const createNewSpecialWrapper = (
  outlinedElement: HTMLElement,
  selectionContainer: HTMLElement,
  id: number,
  eventHandlers: {
    handlePlusButtonClick: () => void
    handleMinusButtonClick: () => void
  }
) => {
  // get current wrapper
  const currentSelectedElementWrapper =
    selectionContainer?.firstElementChild as HTMLElement

  if (currentSelectedElementWrapper) {
    document
      .getElementById(ContainerPlusButtonId)
      ?.removeEventListener("click", eventHandlers.handlePlusButtonClick)
    document
      .getElementById(ContainerMinusButtonId)
      ?.removeEventListener("click", eventHandlers.handleMinusButtonClick)
    document
      .getElementById(SelectionContainerId)
      ?.removeChild(currentSelectedElementWrapper)
  }

  createNewWrapper(
    outlinedElement,
    selectionContainer as HTMLElement,
    WrapperTypes.selection,
    id
  )
  putButtons(id)
  document
    .getElementById(ContainerPlusButtonId)
    ?.addEventListener("click", eventHandlers.handlePlusButtonClick)
  document
    .getElementById(ContainerMinusButtonId)
    ?.addEventListener("click", eventHandlers.handleMinusButtonClick)
}

// here happens the magic

export const krisinoteDOMParser = (entryElement: HTMLElement) => {
  const entryElementClone = entryElement.cloneNode(true) as HTMLElement

  entryElementClone.style.all = "initial"

  entryElementClone.style.backgroundColor =
    getInheritedBackgroundColor(entryElement)
  entryElementClone.style.fontFamily = getInheritedFontFamily(entryElement)
  entryElementClone.style.fontSize = getInheritedFontSize(entryElement)

  parseDOMNode(entryElement, entryElementClone)

  return entryElementClone
}

const defaultStylesToBeCoppied = [
  "color",
  "display",
  "box-sizing",
  "box-shadow",

  "visibility",
  "z-index",
  "position",

  "max-width",
  "min-width",
  "max-height",
  "min-height",

  "flex-direction",
  "flex-wrap",
  "flex-flow",
  "justify-content",
  "align-items",
  "align-content",
  "gap",
  "row-gap",
  "column-gap",
  "order",
  "flex-grow",
  "flex-shrink",
  "flex-basis",
  "flex",
  "align-self",

  "grid-template-columns",
  "grid-template-areas",
  "grid-template",
  "column-gap",
  "row-gap",
  "gap",
  "justify-items",
  "align-items",
  "place-items",
  "justify-content",
  "align-content",
  "place-content",
  "grid-auto-columns",
  "grid-auto-rows",
  "grid-auto-flow",
  "grid",
  "grid-column-start",
  "grid-column-end",
  "grid-row-start",
  "grid-row-end",
  "grid-column",
  "grid-row",
  "grid-area",
  "justify-self",
  "align-self",
  "place-self",

  "font-size",
  "font-style",
  "font-family",
  "font-weight",
  "overflow-wrap",
  "contain",
  "line-height",
  "tab-size",
  "text-size-adjust",
  "text-transform",
  "letter-spacing",
  "vertical-align",
  "text-decoration",

  "border-color",
  "border-width",
  "border-style",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-image-outset",
  "border-image-repeat",
  "border-image-slice",
  "border-image-source",
  "border-image-width",

  "padding-top",
  "padding-right",
  "padding-left",
  "padding-bottom",

  "margin-top",
  "margin-right",
  "margin-left",
  "margin-bottom",

  "background-color",

  "overflow-x",
  "overflow-y",

  "list-style-image",
  "list-style-position",
  "list-style-type"
]

const sizingStylesToBeCoppied = [
  "padding-right",
  "padding-left",

  "margin-right",
  "margin-left",

  "gap"
]

const INSERTION_VIEWPORT_WIDTH = 1000

const parseGridTemplateColumns = (original: string): string => {
  const split = original.split(" ")

  split.forEach((val, i) => {
    if (val.includes("px")) {
      let viewPortWidth = parseInt(
        window
          .getComputedStyle(document.body)
          .getPropertyValue("width")
          .slice(0, -2)
      )
      let pxVal = parseInt(val.slice(0, -2))
      split[i] = `${Math.floor((pxVal / viewPortWidth) * 100)}%`
    }
  })

  return split.join(" ")
}

const parseDOMNode = (
  realElement: HTMLElement | null,
  clonedElement: HTMLElement | null
) => {
  if (
    realElement?.nodeType === Node.ELEMENT_NODE &&
    window
      .getComputedStyle(realElement as Element)
      .getPropertyValue("visibility") !== "hidden"
  ) {
    // we have as a given here that the elements ARE actual html elements
    clonedElement = clonedElement as HTMLElement

    // remove id
    if (realElement?.id) {
      clonedElement?.removeAttribute("id")
    }

    // remove class
    if (realElement?.className) {
      clonedElement?.removeAttribute("class")
    }

    // here happens cloning of classes

    let styleAttributes = ""

    defaultStylesToBeCoppied.forEach((value) => {
      styleAttributes = appendStyle(
        styleAttributes,
        value,
        window.getComputedStyle(realElement as Element).getPropertyValue(value)
      )
      clonedElement?.setAttribute("style", styleAttributes)
    })

    // gets the value of a given size prop as a number in px
    let viewPortWidth = parseInt(
      window
        .getComputedStyle(document.body)
        .getPropertyValue("width")
        .slice(0, -2)
    )

    // gets the calculated size of an x-axis margin/padding and sets it as a fraction of vw
    sizingStylesToBeCoppied.forEach((value) => {
      // gets the value of a given size prop as a number in px
      let sizingOfElementPx = parseInt(
        window
          .getComputedStyle(realElement as Element)
          .getPropertyValue(value)
          .slice(0, -2)
      )
      styleAttributes = appendStyle(
        styleAttributes,
        value,
        `${Math.floor((sizingOfElementPx / viewPortWidth) * INSERTION_VIEWPORT_WIDTH)}px`
      )
      clonedElement?.setAttribute("style", styleAttributes)
    })

    if (
      window
        .getComputedStyle(realElement as Element)
        .getPropertyValue("display") === "grid"
    ) {
      clonedElement.style.gridTemplateColumns = parseGridTemplateColumns(
        window
          .getComputedStyle(realElement)
          .getPropertyValue("grid-template-columns")
      )
    }

    clonedElement.style.backgroundColor =
      getInheritedBackgroundColor(realElement)

    clonedElement.style.minWidth = "fit-content"
    clonedElement.style.minHeight = "fit-content"
    clonedElement.style.overflowX = "hidden"

    if (clonedElement.nodeName === "IMG") {
      const imgPath = (realElement as HTMLImageElement).getAttribute("src")

      if (imgPath) {
        const isAbsoluteUrl =
          imgPath.indexOf("://") > 0 || imgPath.indexOf("//") === 0

        console.log(isAbsoluteUrl) // Output: true
        if (!isAbsoluteUrl) {
          const origin = location.origin

          const newUrl = origin + imgPath

          ;(clonedElement as HTMLImageElement).setAttribute("src", newUrl)
        } else {
        }
      }
    }
    console.log(clonedElement.nodeName)
    if (clonedElement.nodeName === "A") {
      const imgPath = (realElement as HTMLImageElement).getAttribute("href")

      if (imgPath) {
        const isAbsoluteUrl =
          imgPath.indexOf("://") > 0 || imgPath.indexOf("//") === 0

        if (!isAbsoluteUrl) {
          const origin = location.origin

          const newUrl = origin + imgPath

          ;(clonedElement as HTMLImageElement).setAttribute("href", newUrl)
        } else {
        }
      }
    }
    if (clonedElement.nodeName === "SOURCE") {
      const imgPath = (realElement as HTMLImageElement).getAttribute("srcset")

      if (imgPath) {
        const isAbsoluteUrl =
          imgPath.indexOf("://") > 0 || imgPath.indexOf("//") === 0

        if (!isAbsoluteUrl) {
          const origin = location.origin

          const newUrl = origin + imgPath

          ;(clonedElement as HTMLImageElement).setAttribute("srcset", newUrl)
        } else {
        }
      }
    }

    if (
      clonedElement.nodeName === "SOURCE" ||
      clonedElement.nodeName === "LINK" ||
      clonedElement.nodeName === "IMG" ||
      clonedElement.nodeName === "A"
    ) {
      clonedElement.setAttribute("target", "_blank")
    }

    if (
      clonedElement.nodeName === "IMG" ||
      clonedElement.nodeName === "svg" ||
      clonedElement.nodeName === "I" ||
      clonedElement.nodeName === "path"
    ) {
      if (realElement?.getAttribute("width")) {
        clonedElement?.removeAttribute("width")
      }
      if (realElement?.getAttribute("height")) {
        clonedElement?.removeAttribute("height")
      }
      clonedElement.style.width = window
        .getComputedStyle(realElement as Element)
        .getPropertyValue("width")
      clonedElement.style.height = window
        .getComputedStyle(realElement as Element)
        .getPropertyValue("height")
    }
  }

  realElement?.childNodes.forEach((childNode, key) => {
    parseDOMNode(
      childNode as HTMLElement,
      clonedElement?.childNodes.item(key) as HTMLElement
    )
  })
}

const appendStyle = (
  styleString: string,
  styleToBeAppended: string,
  value: string
) => {
  return `${styleString}${styleToBeAppended}: ${value}; `
}

function getInheritedBackgroundColor(el: HTMLElement): string {
  var defaultStyle = "rgba(0, 0, 0, 0)"

  var backgroundColor = window.getComputedStyle(el).backgroundColor

  if (backgroundColor != defaultStyle && backgroundColor != "rgba(0, 0, 0)")
    return backgroundColor

  if (el.parentNode)
    return getInheritedBackgroundColor(el.parentNode as HTMLElement)

  return defaultStyle
}

function getInheritedFontFamily(el: HTMLElement): string {
  var defaultStyle = "Times New Roman"

  var fontFamily = window.getComputedStyle(el).fontFamily

  if (fontFamily != defaultStyle) return fontFamily

  if (el.parentNode) return getInheritedFontFamily(el.parentNode as HTMLElement)

  return defaultStyle
}

function getInheritedFontSize(el: HTMLElement): string {
  var defaultSize = "16px"

  if (el?.nodeType === Node.ELEMENT_NODE) {
    var fontSize = window.getComputedStyle(el).fontSize

    if (fontSize != defaultSize) return fontSize

    if (el.parentNode) return getInheritedFontSize(el.parentNode as HTMLElement)
  }

  return defaultSize
}
