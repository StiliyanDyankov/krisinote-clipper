import {
  ContainerMinusButtonId,
  ContainerPlusButtonId,
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
  removeHoverWrapper,
  removeSelectionContainer
} from "./selection"
import { assertNever } from "./utils"

export class SelectionManager {
  private selectionType: SelectionType = SelectionType.ARTICLE
  private selectionContainer: HTMLElement | null = null

  private hasAttachedTracingListeners = false
  public currentTracingSelectedElementKey = 9999
  public tracingElementsMap: Map<number, HTMLElement> = new Map()

  private hasAttachedMultiselectListeners = false
  private msCounter = 1
  private msSelectedElements: Map<number, HTMLElement> = new Map()
  private msElementsDepth: Map<number, number> = new Map()
  private msPressCb: ((numberOfElements: number) => void) | undefined =
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

    const tracingDelta = direction === "up" ? 1 : -1

    const nextElement = this.getNextTracingElement(direction)

    if (!nextElement) {
      return
    }

    this.currentTracingSelectedElementKey += tracingDelta

    this.tracingElementsMap.set(
      this.currentTracingSelectedElementKey,
      nextElement
    )

    createNewTracingElementWrapper(nextElement, this.selectionContainer, {
      handlePlusButtonClick: this.handlePlusButtonClick,
      handleMinusButtonClick: this.handleMinusButtonClick
    })
  }

  getNextTracingElement = (direction: TracingDirection) => {
    const depthDelta = direction === "up" ? 1 : -1

    const nextCachedElement = this.tracingElementsMap.get(
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
    return this.tracingElementsMap.get(this.currentTracingSelectedElementKey)
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

    this.tracingElementsMap.set(
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

  setMsPressCb = (cb: (numberOfElements: number) => void) => {
    this.msPressCb = cb
  }

  handleMouseOverEvent = (event: MouseEvent): void => {
    if (!this.selectionContainer) {
      return
    }

    let hoveredElement = event.target as HTMLElement

    if (
      !hoveredElement.id.startsWith(SelectionWrapperId) &&
      // last two checks for ignoring pop-up selection
      !hoveredElement.id.startsWith("react-chrome-app") &&
      !(hoveredElement.nodeName === "IFRAME")
    ) {
      let outlinedElement: HTMLElement | null =
        this.getViableOutlinedElement(hoveredElement)
      if (!outlinedElement) return

      createNewElementWrapper(
        outlinedElement,
        this.selectionContainer,
        WrapperTypes.HOVER
      )
    }
  }

  handleMouseOutEvent = (): void => {
    if (!this.selectionContainer) {
      return
    }

    removeHoverWrapper(this.selectionContainer)
  }

  handleMultiSelectElementPress = (event: MouseEvent) => {
    event.preventDefault()

    let outlinedElement: HTMLElement | null = this.getViableOutlinedElement(
      event.target as HTMLElement
    )

    if (!outlinedElement) {
      return
    }

    if (
      outlinedElement.id.startsWith("react-chrome-app") &&
      outlinedElement.nodeName === "IFRAME"
    ) {
      //
      // empty - no behaviour if selected element is the clipper itself
      //
    } else if (outlinedElement.id.startsWith(SelectionWrapperId)) {
      // executes on second time selection of an element - removes the selected el

      const keyOfSavedElement = parseInt(outlinedElement.id.split("-")[4])
      this.msSelectedElements.delete(keyOfSavedElement)
      this.msElementsDepth.delete(keyOfSavedElement)
      document
        .getElementById(SelectionContainerId)
        ?.removeChild(outlinedElement)
    } else {
      // executed on initial selection of an element
      findAndAnnihilateChildren(this.msSelectedElements, this.msElementsDepth, {
        element: outlinedElement,
        depth: getElementDepth(outlinedElement)
      })

      this.msSelectedElements.set(this.msCounter, outlinedElement)
      this.msElementsDepth.set(this.msCounter, getElementDepth(outlinedElement))

      if (!this.selectionContainer) {
        return
      }

      createNewElementWrapper(
        outlinedElement,
        this.selectionContainer,
        WrapperTypes.SELECTION,
        this.msCounter
      )

      this.msCounter++
    }

    this.msPressCb?.(this.msSelectedElements.size)
  }

  getViableOutlinedElement = (
    hoveredElement: HTMLElement
  ): HTMLElement | null => {
    let isOutside = true
    document
      .querySelectorAll("#react-chrome-app * , #react-chrome-app")
      .forEach((node) => {
        if (node === hoveredElement) {
          isOutside = false
          return
        }
      })
    const outlinedElement = getViableElementOrParent(hoveredElement)
    if (!isOutside) {
      return null
    } else if (this.selectionType === SelectionType.MULTISELECT_ALL) {
      return outlinedElement
    } else if (this.selectionType === SelectionType.MULTISELECT_PARAGRAPH) {
      return outlinedElement.nodeName === "P" ||
        outlinedElement.id.startsWith(SelectionWrapperId)
        ? outlinedElement
        : null
    } else return null
  }

  initMultiSelectTypeMode = () => {
    if (!this.hasAttachedMultiselectListeners) {
      document.addEventListener("mouseover", this.handleMouseOverEvent)
      document.addEventListener("mouseout", this.handleMouseOutEvent)
      document.addEventListener("click", this.handleMultiSelectElementPress)
    }

    this.hasAttachedMultiselectListeners = true
  }

  cleanupMultiSelectTypeMode = () => {
    if (this.hasAttachedMultiselectListeners) {
      document.removeEventListener("mouseover", this.handleMouseOverEvent)
      document.removeEventListener("mouseout", this.handleMouseOutEvent)
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
