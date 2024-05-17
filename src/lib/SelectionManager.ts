import {
  ContainerMinusButtonId,
  ContainerPlusButtonId,
  SelectType,
  SelectionContainerId
} from "./constants"
import {
  createNewSpecialWrapper,
  createSelectionContainer,
  getArticleSelectionEl,
  isElementViable,
  removeSelectionContainer
} from "./selection"

export class SelectionManager {
  public currentSelectedElementKey: number = 9999
  public selectedElementsMap: Map<number, HTMLElement> = new Map()
  private currentSelectedElementContainer: HTMLElement | null = null
  private selectionType: SelectType = SelectType.ARTICLE

  constructor() {
    this.currentSelectedElementContainer =
      this.handleInitialSelectionContainerCreation()

    this.selectedElementsMap.set(
      this.currentSelectedElementKey,
      getArticleSelectionEl()
    )

    if (this.currentSelectedElementContainer) {
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
    const currentSelectedEl = this.selectedElementsMap.get(
      this.currentSelectedElementKey
    )
    // check if a parent element has been traced before
    if (this.selectedElementsMap.has(this.currentSelectedElementKey + 1)) {
      this.currentSelectedElementKey++
      createNewSpecialWrapper(
        this.selectedElementsMap.get(
          this.currentSelectedElementKey
        ) as HTMLElement,
        this.currentSelectedElementContainer as HTMLElement,
        this.currentSelectedElementKey,
        {
          handlePlusButtonClick: this.handlePlusButtonClick,
          handleMinusButtonClick: this.handleMinusButtonClick
        }
      )
      // check if element has a parent and it's not body
    } else if (
      currentSelectedEl?.parentNode &&
      currentSelectedEl?.parentNode.nodeName !== "BODY"
    ) {
      this.currentSelectedElementKey++
      this.selectedElementsMap.set(
        this.currentSelectedElementKey,
        currentSelectedEl?.parentNode as HTMLElement
      )
      createNewSpecialWrapper(
        currentSelectedEl.parentNode as HTMLElement,
        this.currentSelectedElementContainer as HTMLElement,
        this.currentSelectedElementKey,
        {
          handlePlusButtonClick: this.handlePlusButtonClick,
          handleMinusButtonClick: this.handleMinusButtonClick
        }
      )
    }
  }

  handleMinusButtonClick = () => {
    const currentSelectedEl = this.selectedElementsMap.get(
      this.currentSelectedElementKey
    )
    // check if a child element has been traced before
    if (this.selectedElementsMap.has(this.currentSelectedElementKey - 1)) {
      this.currentSelectedElementKey--
      createNewSpecialWrapper(
        this.selectedElementsMap.get(
          this.currentSelectedElementKey
        ) as HTMLElement,
        this.currentSelectedElementContainer as HTMLElement,
        this.currentSelectedElementKey,
        {
          handlePlusButtonClick: this.handlePlusButtonClick,
          handleMinusButtonClick: this.handleMinusButtonClick
        }
      )
      //check if element has a child and it's a viable element
    } else if (
      currentSelectedEl?.firstChild &&
      isElementViable(currentSelectedEl?.firstChild as HTMLElement)
    ) {
      this.currentSelectedElementKey--
      this.selectedElementsMap.set(
        this.currentSelectedElementKey,
        currentSelectedEl?.firstChild as HTMLElement
      )
      createNewSpecialWrapper(
        currentSelectedEl.firstChild as HTMLElement,
        this.currentSelectedElementContainer as HTMLElement,
        this.currentSelectedElementKey,
        {
          handlePlusButtonClick: this.handlePlusButtonClick,
          handleMinusButtonClick: this.handleMinusButtonClick
        }
      )
    }
  }

  setSelectionType = (selectionType: SelectType) => {
    if (this.currentSelectedElementContainer) {
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
      createNewSpecialWrapper(
        selectionElement,
        this.currentSelectedElementContainer,
        this.currentSelectedElementKey,
        {
          handlePlusButtonClick: this.handlePlusButtonClick,
          handleMinusButtonClick: this.handleMinusButtonClick
        }
      )
    }

    this.selectionType = selectionType
  }
}
