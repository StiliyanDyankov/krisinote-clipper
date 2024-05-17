import {
  ContainerMinusButtonId,
  ContainerPlusButtonId,
  SelectType,
  SelectionContainerId,
  TracingDirection
} from "./constants"
import {
  createNewTracingElementWrapper,
  createSelectionContainer,
  getArticleSelectionEl,
  getChildTracingElement,
  getParentTracingElement,
  getSelectionContainer,
  removeSelectionContainer
} from "./selection"

export class SelectionManager {
  public currentSelectedElementKey = 9999
  public selectedElementsMap: Map<number, HTMLElement> = new Map()
  private selectionContainer: HTMLElement | null = null
  private selectionType: SelectType = SelectType.ARTICLE

  constructor() {
    this.selectionContainer = this.handleInitialSelectionContainerCreation()

    this.selectedElementsMap.set(
      this.currentSelectedElementKey,
      getArticleSelectionEl()
    )

    if (this.selectionContainer) {
      document
        .getElementById(ContainerPlusButtonId)
        ?.addEventListener("click", this.handlePlusButtonClick)
      document
        .getElementById(ContainerMinusButtonId)
        ?.addEventListener("click", this.handleMinusButtonClick)
    }
  }

  cleanup = () => {
    document
      .getElementById(ContainerPlusButtonId)
      ?.removeEventListener("click", this.handlePlusButtonClick)
    document
      .getElementById(ContainerMinusButtonId)
      ?.removeEventListener("click", this.handleMinusButtonClick)

    if (this.selectionContainer && this.selectionContainer?.children.length) {
      removeSelectionContainer()
    }
  }

  handleInitialSelectionContainerCreation = () => {
    const selectionContainer = getSelectionContainer()

    if (selectionContainer) {
      document.body.removeChild(selectionContainer as Node)
    }

    return createSelectionContainer()
  }

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

    this.currentSelectedElementKey += tracingDelta

    this.selectedElementsMap.set(this.currentSelectedElementKey, nextElement)

    createNewTracingElementWrapper(
      nextElement,
      this.selectionContainer,
      this.currentSelectedElementKey,
      {
        handlePlusButtonClick: this.handlePlusButtonClick,
        handleMinusButtonClick: this.handleMinusButtonClick
      }
    )
  }

  getNextTracingElement = (direction: TracingDirection) => {
    const depthDelta = direction === "up" ? 1 : -1

    const nextCachedElement = this.selectedElementsMap.get(
      this.currentSelectedElementKey + depthDelta
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

  setSelectionType = (selectionType: SelectType) => {
    if (!this.selectionContainer) {
      return
    }

    let selectionElement: HTMLElement

    if (selectionType === SelectType.ARTICLE) {
      selectionElement = getArticleSelectionEl()
    } else if (selectionType === SelectType.FULL_PAGE) {
      selectionElement = document.body
    } else {
      return
    }

    this.selectedElementsMap.set(
      this.currentSelectedElementKey,
      selectionElement
    )

    createNewTracingElementWrapper(
      selectionElement,
      this.selectionContainer,
      this.currentSelectedElementKey,
      {
        handlePlusButtonClick: this.handlePlusButtonClick,
        handleMinusButtonClick: this.handleMinusButtonClick
      }
    )

    this.selectionType = selectionType
  }

  getCurrentSelectedTracingElement = () => {
    return this.selectedElementsMap.get(this.currentSelectedElementKey)
  }
}
