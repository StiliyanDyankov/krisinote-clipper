import {
  ContainerMinusButtonId,
  ContainerPlusButtonId,
  SelectionContainerId,
  WrapperTypes,
  UnviableElements,
  HoverWrapperStyles,
  PlusIconStyles,
  PlusLineHorizontalStyles,
  PlusLineVerticalStyles,
  ButtonStyles,
  MinusIconStyles,
  MinusLineStyles,
  TopElementStyles,
  SelectionWrapperId
} from "./constants"
import { applyStyles } from "./lib"

export {}

export const removeWrappers = (): void => {
  const selectionContainer = document.getElementById(SelectionContainerId)
  if (selectionContainer) {
    selectionContainer.childNodes.forEach((wrapper) => {
      selectionContainer.removeChild(wrapper)
    })
  }
}

export const isElementViable = (element: Element): HTMLElement | undefined => {
  if (
    element instanceof HTMLElement &&
    window.getComputedStyle(element).getPropertyValue("display") !== "inline" &&
    !UnviableElements.includes(element.nodeName) &&
    element.id !== SelectionContainerId
  ) {
    return element
  }
}

export const getViableElementOrParent = (element: HTMLElement): HTMLElement => {
  if (isElementViable(element)) {
    return element
  } else return getViableElementOrParent(element.parentElement as HTMLElement)
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

export const createNewElementWrapper = (
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
    `${SelectionWrapperId}-${keyOfChild}`
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
    `${SelectionWrapperId}-${id}`
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

export const createNewTracingElementWrapper = (
  outlinedElement: HTMLElement,
  selectionContainer: HTMLElement,
  id: number,
  eventHandlers: {
    handlePlusButtonClick: () => void
    handleMinusButtonClick: () => void
  }
) => {
  // get current wrapper
  const currentTracingElementWrapper =
    selectionContainer?.firstElementChild as HTMLElement

  if (currentTracingElementWrapper) {
    document
      .getElementById(ContainerPlusButtonId)
      ?.removeEventListener("click", eventHandlers.handlePlusButtonClick)
    document
      .getElementById(ContainerMinusButtonId)
      ?.removeEventListener("click", eventHandlers.handleMinusButtonClick)
    document
      .getElementById(SelectionContainerId)
      ?.removeChild(currentTracingElementWrapper)
  }

  createNewElementWrapper(
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

export const getParentTracingElement = (
  element: HTMLElement
): HTMLElement | undefined => {
  const parent = element.parentElement

  if (parent && parent.nodeName !== "BODY") {
    return parent
  }
}

export const getChildTracingElement = (
  element: HTMLElement
): HTMLElement | undefined => {
  const child = element.firstElementChild

  if (child) {
    return isElementViable(child)
  }
}

export const getSelectionContainer = (): HTMLElement | null => {
  return document.getElementById(SelectionContainerId)
}
