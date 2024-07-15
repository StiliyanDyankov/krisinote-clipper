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
  SelectionWrapperId,
  TracingWrapperId,
  ClipperRootElementId,
  HoverWrapperId
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

export const validateSelectionElement = (
  element: Element | EventTarget
): HTMLElement | undefined => {
  if (
    element instanceof HTMLElement &&
    window.getComputedStyle(element).getPropertyValue("display") !== "inline" &&
    !UnviableElements.includes(element.nodeName) &&
    element.id !== SelectionContainerId &&
    !isElementClipper(element) &&
    !isElementInClipper(element)
  ) {
    return element
  }
}

export const getViableElementOrParent = (element: HTMLElement): HTMLElement => {
  if (validateSelectionElement(element)) {
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
  const wrapper = document.createElement("div")

  wrapper.id = `krisinote-clipper-${type}-wrapper${id ? "-" + id : ""}`

  applyStyles(wrapper, HoverWrapperStyles)

  if (!id) {
    wrapper.style.pointerEvents = "none"
  } else {
    wrapper.style.pointerEvents = "all"
  }

  wrapper.style.height = window.getComputedStyle(outlinedElement).height
  wrapper.style.width = window.getComputedStyle(outlinedElement).width
  wrapper.style.top = `${outlinedElement.getBoundingClientRect().top + window.scrollY}px`
  wrapper.style.left = `${outlinedElement.getBoundingClientRect().left + window.scrollX}px`

  selectionContainer.appendChild(wrapper)

  return wrapper
}

export const removeHoverWrapper = (selectionContainer: HTMLElement): void => {
  const hoverWrapper = document.getElementById(HoverWrapperId)

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

export const putButtons = (): void => {
  const tracingWrapper = getCurrentTracingWrapper()

  if (!tracingWrapper) {
    return
  }

  tracingWrapper.style.position = "absolute"

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

  tracingWrapper.appendChild(topElement)
}

export const createNewTracingElementWrapper = (
  outlinedElement: HTMLElement,
  selectionContainer: HTMLElement,
  eventHandlers: {
    handlePlusButtonClick: () => void
    handleMinusButtonClick: () => void
  }
) => {
  // get current wrapper
  const currentTracingElementWrapper = getCurrentTracingWrapper()

  if (currentTracingElementWrapper) {
    document
      .getElementById(ContainerPlusButtonId)
      ?.removeEventListener("click", eventHandlers.handlePlusButtonClick)
    document
      .getElementById(ContainerMinusButtonId)
      ?.removeEventListener("click", eventHandlers.handleMinusButtonClick)

    deleteCurrentTracingWrapper()
  }

  createNewElementWrapper(
    outlinedElement,
    selectionContainer as HTMLElement,
    WrapperTypes.TRACING
  )

  putButtons()

  document
    .getElementById(ContainerPlusButtonId)
    ?.addEventListener("click", eventHandlers.handlePlusButtonClick)
  document
    .getElementById(ContainerMinusButtonId)
    ?.addEventListener("click", eventHandlers.handleMinusButtonClick)
}

export const getCurrentTracingWrapper = (): HTMLElement | undefined => {
  const selectionContainer = getSelectionContainer()

  if (!selectionContainer) {
    return
  }

  const tracingWrapper = selectionContainer.querySelector(
    `[id^=${TracingWrapperId}`
  )

  return tracingWrapper instanceof HTMLElement ? tracingWrapper : undefined
}

export const deleteCurrentTracingWrapper = (): void => {
  const selectionContainer = getSelectionContainer()
  const tracingWrapper = getCurrentTracingWrapper()

  if (!selectionContainer || !tracingWrapper) {
    return
  }

  selectionContainer.removeChild(tracingWrapper)
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
    return validateSelectionElement(child)
  }
}

export const getSelectionContainer = (): HTMLElement | null => {
  return document.getElementById(SelectionContainerId)
}

export const isElementClipper = (element: HTMLElement): boolean => {
  return element.id.startsWith(ClipperRootElementId)
}

export const isElementInClipper = (element: HTMLElement): boolean => {
  let isInClipper = false

  document
    .querySelectorAll(`#${ClipperRootElementId} * , #${ClipperRootElementId}`)
    .forEach((node) => {
      if (node === element) {
        isInClipper = true
        return
      }
    })

  return isInClipper
}
