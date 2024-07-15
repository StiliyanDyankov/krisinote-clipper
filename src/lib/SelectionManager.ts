import {
  ContainerMinusButtonId,
  ContainerPlusButtonId,
  HoverWrapperId,
  SelectionContainerId,
  SelectionType,
  SelectionWrapperId,
  TracingDirection,
  WrapperTypes
} from "./constants"
import {
  createNewElementWrapper,
  createNewTracingElementWrapper,
  createSelectionContainer,
  deleteCurrentTracingWrapper,
  findAndAnnihilateChildren,
  getArticleSelectionEl,
  getChildTracingElement,
  getElementDepth,
  getParentTracingElement,
  getSelectionContainer,
  getViableElementOrParent,
  validateSelectionElement,
  removeHoverWrapper,
  removeSelectionContainer,
  isElementInClipper
} from "./selection"
import { assertNever } from "./utils"

export class SelectionManager {
  private selectionType: SelectionType = SelectionType.ARTICLE
  private selectionContainer: HTMLElement | null = null

  private hasAttachedTracingListeners = false
  public currentTracingSelectedElementKey = 9999
  public tracingElements: Map<number, HTMLElement> = new Map()

  private hasAttachedMultiselectListeners = false
  private multiSelectCounter = 1
  private multiSelectSelectedElements: Map<number, HTMLElement> = new Map()
  private multiSelectElementsDepth: Map<number, number> = new Map()
  private multiSelectPressCb: ((numberOfElements: number) => void) | undefined =
    undefined

  constructor() {
    this.selectionContainer = this.handleInitialSelectionContainerCreation()

    this.setSelectionType(this.selectionType)
  }

  setSelectionType = (selectionType: SelectionType) => {
    switch (selectionType) {
      case SelectionType.ARTICLE:
      case SelectionType.FULL_PAGE: {
        this.cleanupMultiSelectTypeMode()
        this.initTracingTypeMode(selectionType)
        break
      }
      case SelectionType.MULTISELECT_ALL:
      case SelectionType.MULTISELECT_PARAGRAPH: {
        this.cleanupTracingTypeMode()
        this.initMultiSelectTypeMode()
        break
      }
      default: {
        assertNever(selectionType)
      }
    }

    this.selectionType = selectionType
  }

  handleInitialSelectionContainerCreation = () => {
    const selectionContainer = getSelectionContainer()

    if (selectionContainer) {
      document.body.removeChild(selectionContainer as Node)
    }

    return createSelectionContainer()
  }

  // -------------- tracing selection start -------------

  handlePlusButtonClick = () => {
    this.handleTracingButtonPress("up")
  }

  handleMinusButtonClick = () => {
    this.handleTracingButtonPress("down")
  }

  handleTracingButtonPress = (direction: TracingDirection) => {
    if (!this.selectionContainer) {
      return
    }

    const nextElement = this.getNextTracingElement(direction)

    if (!nextElement) {
      return
    }

    const tracingDelta = direction === "up" ? 1 : -1

    this.currentTracingSelectedElementKey += tracingDelta

    this.tracingElements.set(this.currentTracingSelectedElementKey, nextElement)

    createNewTracingElementWrapper(nextElement, this.selectionContainer, {
      handlePlusButtonClick: this.handlePlusButtonClick,
      handleMinusButtonClick: this.handleMinusButtonClick
    })
  }

  getNextTracingElement = (direction: TracingDirection) => {
    const depthDelta = direction === "up" ? 1 : -1

    const nextCachedElement = this.tracingElements.get(
      this.currentTracingSelectedElementKey + depthDelta
    )

    if (nextCachedElement) {
      return nextCachedElement
    }

    const currentSelectedEl = this.getCurrentSelectedTracingElement()

    if (!currentSelectedEl) {
      return
    }

    return direction === "up"
      ? getParentTracingElement(currentSelectedEl)
      : getChildTracingElement(currentSelectedEl)
  }

  getCurrentSelectedTracingElement = () => {
    return this.tracingElements.get(this.currentTracingSelectedElementKey)
  }

  initTracingTypeMode = (selectionType: SelectionType) => {
    if (!this.selectionContainer) {
      return
    }

    if (!this.hasAttachedTracingListeners) {
      document
        .getElementById(ContainerPlusButtonId)
        ?.addEventListener("click", this.handlePlusButtonClick)
      document
        .getElementById(ContainerMinusButtonId)
        ?.addEventListener("click", this.handleMinusButtonClick)
    }

    this.hasAttachedTracingListeners = true

    let selectionElement: HTMLElement

    if (selectionType === SelectionType.ARTICLE) {
      selectionElement = getArticleSelectionEl()
    } else if (selectionType === SelectionType.FULL_PAGE) {
      selectionElement = document.body
    } else {
      return
    }

    this.tracingElements.set(
      this.currentTracingSelectedElementKey,
      selectionElement
    )

    createNewTracingElementWrapper(selectionElement, this.selectionContainer, {
      handlePlusButtonClick: this.handlePlusButtonClick,
      handleMinusButtonClick: this.handleMinusButtonClick
    })
  }

  cleanupTracingTypeMode = () => {
    if (this.hasAttachedTracingListeners) {
      document
        .getElementById(ContainerPlusButtonId)
        ?.removeEventListener("click", this.handlePlusButtonClick)
      document
        .getElementById(ContainerMinusButtonId)
        ?.removeEventListener("click", this.handleMinusButtonClick)

      deleteCurrentTracingWrapper()
    }

    this.hasAttachedTracingListeners = false
  }

  // -------------- tracing selection end -------------

  // -------------- multi selection start -------------

  setMultiSelectPressCallback = (cb: (numberOfElements: number) => void) => {
    this.multiSelectPressCb = cb
  }

  handleMultiSelectMouseOver = (event: MouseEvent): void => {
    if (!this.selectionContainer || !event.target) {
      return
    }

    const hoveredElement = validateSelectionElement(event.target)

    if (!hoveredElement || hoveredElement.id.startsWith(HoverWrapperId)) {
      return
    }

    const viableHoveredElement = this.getViableHoveredElement(hoveredElement)

    if (!viableHoveredElement) {
      return
    }

    createNewElementWrapper(
      viableHoveredElement,
      this.selectionContainer,
      WrapperTypes.HOVER
    )
  }

  handleMultiSelectMouseOut = (): void => {
    if (!this.selectionContainer) {
      return
    }

    removeHoverWrapper(this.selectionContainer)
  }

  handleMultiSelectElementPress = (event: MouseEvent) => {
    event.preventDefault()

    const targetElement = event.target

    if (!targetElement || !(targetElement instanceof HTMLElement)) {
      return
    }

    const viableHoveredElement = this.getViableHoveredElement(targetElement)

    if (!viableHoveredElement) {
      return
    }

    if (viableHoveredElement.id.startsWith(SelectionWrapperId)) {
      // executes on second time selection of an element - removes the selected el

      const keyOfSavedElement = parseInt(viableHoveredElement.id.split("-")[4])
      this.multiSelectSelectedElements.delete(keyOfSavedElement)
      this.multiSelectElementsDepth.delete(keyOfSavedElement)
      this.selectionContainer?.removeChild(viableHoveredElement)
    } else {
      const hoverWrapper = document.getElementById(HoverWrapperId)

      if (hoverWrapper) {
        this.selectionContainer?.removeChild(hoverWrapper)
      }

      // executed on initial selection of an element
      findAndAnnihilateChildren(
        this.multiSelectSelectedElements,
        this.multiSelectElementsDepth,
        {
          element: viableHoveredElement,
          depth: getElementDepth(viableHoveredElement)
        }
      )

      this.multiSelectSelectedElements.set(
        this.multiSelectCounter,
        viableHoveredElement
      )
      this.multiSelectElementsDepth.set(
        this.multiSelectCounter,
        getElementDepth(viableHoveredElement)
      )

      if (!this.selectionContainer) {
        return
      }

      createNewElementWrapper(
        viableHoveredElement,
        this.selectionContainer,
        WrapperTypes.SELECTION,
        this.multiSelectCounter
      )

      this.multiSelectCounter++
    }

    this.multiSelectPressCb?.(this.multiSelectSelectedElements.size)
  }

  getViableHoveredElement = (
    hoveredElement: HTMLElement
  ): HTMLElement | undefined => {
    if (isElementInClipper(hoveredElement)) {
      return
    }

    let isElementSelected = false

    this.multiSelectSelectedElements.forEach((element) => {
      if (element === hoveredElement) {
        isElementSelected = true
        return
      }
    })

    if (isElementSelected) {
      return
    }

    const outlinedElement = getViableElementOrParent(hoveredElement)

    if (this.selectionType === SelectionType.MULTISELECT_ALL) {
      return outlinedElement
    } else if (this.selectionType === SelectionType.MULTISELECT_PARAGRAPH) {
      return outlinedElement.nodeName === "P" ||
        outlinedElement.id.startsWith(SelectionWrapperId)
        ? outlinedElement
        : undefined
    } else {
      return
    }
  }

  initMultiSelectTypeMode = () => {
    if (!this.hasAttachedMultiselectListeners) {
      document.addEventListener("mouseover", this.handleMultiSelectMouseOver)
      document.addEventListener("mouseout", this.handleMultiSelectMouseOut)
      document.addEventListener("click", this.handleMultiSelectElementPress)
    }

    this.hasAttachedMultiselectListeners = true
  }

  cleanupMultiSelectTypeMode = () => {
    if (this.hasAttachedMultiselectListeners) {
      document.removeEventListener("mouseover", this.handleMultiSelectMouseOver)
      document.removeEventListener("mouseout", this.handleMultiSelectMouseOut)
      document.removeEventListener("click", this.handleMultiSelectElementPress)
    }

    this.hasAttachedMultiselectListeners = false
  }

  // -------------- multi selection end -------------

  cleanup = () => {
    if (this.selectionContainer && this.selectionContainer?.children.length) {
      removeSelectionContainer()
    }

    this.cleanupMultiSelectTypeMode()
    this.cleanupTracingTypeMode()
  }
}
