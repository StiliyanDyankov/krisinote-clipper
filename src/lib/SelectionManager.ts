import {
  ContainerMinusButtonId,
  ContainerPlusButtonId,
  SelectType,
  SelectionContainerId
} from "./constants"
import {
  createNewTracingElementWrapper,
  createSelectionContainer,
  getArticleSelectionEl,
  isElementViable,
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
    if (
      document.getElementById(SelectionContainerId) &&
      document.getElementById(SelectionContainerId)?.children.length
    ) {
      removeSelectionContainer()
    }
  }

  handleInitialSelectionContainerCreation = () => {
    if (document.getElementById(SelectionContainerId)) {
      document.body.removeChild(
        document.getElementById(SelectionContainerId) as Node
      )
    }

    return createSelectionContainer()
  }

  handlePlusButtonClick = () => {
    const currentSelectedEl = this.getCurrentSelectedTracingElement()

    if (!currentSelectedEl) {
      return
    }

    let nextElement: HTMLElement

    this.currentSelectedElementKey++

    if (this.selectedElementsMap.has(this.currentSelectedElementKey)) {
      nextElement = this.selectedElementsMap.get(
        this.currentSelectedElementKey
      ) as HTMLElement
    } else if (
      currentSelectedEl.parentNode &&
      currentSelectedEl.parentNode.nodeName !== "BODY"
    ) {
      nextElement = currentSelectedEl.parentNode as HTMLElement

      this.selectedElementsMap.set(this.currentSelectedElementKey, nextElement)
    } else {
      return
    }

    createNewTracingElementWrapper(
      nextElement,
      this.selectionContainer as HTMLElement,
      this.currentSelectedElementKey,
      {
        handlePlusButtonClick: this.handlePlusButtonClick,
        handleMinusButtonClick: this.handleMinusButtonClick
      }
    )
  }

  handleMinusButtonClick = () => {
    const currentSelectedEl = this.getCurrentSelectedTracingElement()

    if (!currentSelectedEl) {
      return
    }

    let nextElement: HTMLElement

    this.currentSelectedElementKey--

    if (this.selectedElementsMap.has(this.currentSelectedElementKey - 1)) {
      nextElement = this.selectedElementsMap.get(
        this.currentSelectedElementKey
      ) as HTMLElement
    } else if (
      currentSelectedEl.firstChild &&
      isElementViable(currentSelectedEl.firstChild as HTMLElement)
    ) {
      nextElement = currentSelectedEl.firstChild as HTMLElement

      this.selectedElementsMap.set(this.currentSelectedElementKey, nextElement)
    } else {
      return
    }

    createNewTracingElementWrapper(
      nextElement,
      this.selectionContainer as HTMLElement,
      this.currentSelectedElementKey,
      {
        handlePlusButtonClick: this.handlePlusButtonClick,
        handleMinusButtonClick: this.handleMinusButtonClick
      }
    )
  }

  setSelectionType = (selectionType: SelectType) => {
    if (this.selectionContainer) {
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
    }

    this.selectionType = selectionType
  }

  getCurrentSelectedTracingElement = () => {
    return this.selectedElementsMap.get(this.currentSelectedElementKey)
  }
}
