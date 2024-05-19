import { useEffect, useRef, useState } from "react"
import { Button, CircularProgress, Divider } from "@mui/material"
import { colorsTailwind } from "../App"
import CodeRoundedIcon from "@mui/icons-material/CodeRounded"
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined"
import CheckRoundedIcon from "@mui/icons-material/CheckRounded"
import {
  MultiSelectionTypes,
  SelectionContainerId,
  SelectionWrapperId,
  WrapperTypes
} from "../lib/constants"
import { parseDomTree } from "../lib/parsing"
import {
  createSelectionContainer,
  createNewElementWrapper,
  removeHoverWrapper,
  findAndAnnihilateChildren,
  getElementDepth,
  getViableParent,
  removeSelectionContainer
} from "../lib/selection"
import { SelectionManager } from "../lib/SelectionManager"

const MultiselectPage = () => {
  const [selectionContainer, setSelectionContainer] =
    useState<HTMLElement | null>(() => {
      if (document.getElementById(SelectionContainerId)) {
        document.body.removeChild(
          document.getElementById(SelectionContainerId) as Node
        )
      }
      return createSelectionContainer()
    })

  let multiSelectionType = useRef<MultiSelectionTypes>(MultiSelectionTypes.ALL)

  const [multiSelectionTypePseudo, setMultiSelectionTypePseudo] =
    useState<MultiSelectionTypes>(MultiSelectionTypes.ALL)

  // stores outlined elements in state
  const [selectedElements, setSelectedElements] = useState<
    Map<number, HTMLElement>
  >(new Map())

  const [selectedElementsDepth, setSelectedElementsDepth] = useState<
    Map<number, number>
  >(new Map())

  let counterAutoIncr = useRef(1)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleMouseOverEvent = (event: MouseEvent): void => {
    let hoveredElement = event.target as HTMLElement
    if (
      !hoveredElement.id.startsWith(SelectionWrapperId) &&
      // last two checks for ignoring pop-up selection
      !hoveredElement.id.startsWith("react-chrome-app") &&
      !(hoveredElement.nodeName === "IFRAME")
    ) {
      let outlinedElement: HTMLElement | null =
        getViableOutlinedElement(hoveredElement)
      if (!outlinedElement) return

      createNewElementWrapper(
        outlinedElement,
        selectionContainer as HTMLElement,
        WrapperTypes.hover
      )
    }
  }

  const handleMouseOutEvent = (event: MouseEvent): void => {
    removeHoverWrapper(selectionContainer as HTMLElement)
  }

  const handleClickEvent = (event: MouseEvent): void => {
    event.preventDefault()
    let outlinedElement: HTMLElement | null = getViableOutlinedElement(
      event.target as HTMLElement
    )

    if (!outlinedElement) return

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
      selectedElements.delete(keyOfSavedElement)
      selectedElementsDepth.delete(keyOfSavedElement)
      setSelectedElements(selectedElements)
      setSelectedElementsDepth(selectedElementsDepth)
      document
        .getElementById(SelectionContainerId)
        ?.removeChild(outlinedElement)
    } else {
      // executed on initial selection of an element
      findAndAnnihilateChildren(selectedElements, selectedElementsDepth, {
        element: outlinedElement,
        depth: getElementDepth(outlinedElement)
      })

      // this logic should remain the same whether selected is parent or not
      setSelectedElements(
        new Map(selectedElements.set(counterAutoIncr.current, outlinedElement))
      )
      setSelectedElementsDepth(
        new Map(
          selectedElementsDepth.set(
            counterAutoIncr.current,
            getElementDepth(outlinedElement)
          )
        )
      )
      createNewElementWrapper(
        outlinedElement,
        selectionContainer as HTMLElement,
        WrapperTypes.selection,
        counterAutoIncr.current
      )

      counterAutoIncr.current = counterAutoIncr.current + 1
    }
  }

  const getViableOutlinedElement = (
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
    const outlinedElement = getViableParent(hoveredElement)
    if (!isOutside) {
      return null
    } else if (multiSelectionType.current === MultiSelectionTypes.ALL) {
      return outlinedElement
    } else if (multiSelectionType.current === MultiSelectionTypes.PARAGRAPH) {
      return outlinedElement.nodeName === "P" ||
        outlinedElement.id.startsWith(SelectionWrapperId)
        ? outlinedElement
        : null
    } else return null
  }

  // that's the working version - version 2 of event handlers is the initial one
  useEffect(() => {
    document.addEventListener("mouseover", handleMouseOverEvent)
    document.addEventListener("mouseout", handleMouseOutEvent)
    document.addEventListener("click", handleClickEvent)

    return () => {
      // clean-up
      document.removeEventListener("mouseover", handleMouseOverEvent)
      document.removeEventListener("mouseout", handleMouseOutEvent)
      document.removeEventListener("click", handleClickEvent)
      if (selectionContainer) {
        removeSelectionContainer()
      }
    }
  }, [])

  useEffect(() => {
    if (isLoading) {
      parseDomTree(selectedElements, true)
      setIsLoading(false)
    }
  }, [isLoading])

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          fontSize: "16px"
        }}
      >
        <Button
          color="primary"
          variant="contained"
          disabled={!(selectedElements.size >= 1) || isLoading}
          onClick={() => {
            setIsLoading(true)
          }}
          style={{
            fontWeight: "700",
            color: "#fff",
            fontSize: "16px",
            position: "relative"
          }}
          endIcon={
            isLoading ? (
              <CircularProgress
                color="secondary"
                style={{ position: "absolute", right: "16px" }}
              />
            ) : null
          }
        >
          Save {selectedElements.size}{" "}
          {selectedElements.size > 1
            ? "Selections"
            : selectedElements.size === 1
              ? "Selection"
              : ""}
        </Button>

        <Divider
          style={{
            margin: "20px 0",
            backgroundColor: colorsTailwind["d-300-chips"]
          }}
        />

        <p
          style={{
            fontWeight: "500",
            color: "#fff",
            fontSize: "16px"
          }}
        >
          Selection Modes:
        </p>

        <Button
          color="secondary"
          onClick={() => {
            multiSelectionType.current = MultiSelectionTypes.ALL
            setMultiSelectionTypePseudo(MultiSelectionTypes.ALL)
          }}
          style={{
            justifyContent: "flex-start",
            textTransform: "none",
            fontSize: "16px",
            paddingLeft: "16px"
          }}
          startIcon={<CodeRoundedIcon />}
          sx={{
            backgroundColor:
              multiSelectionTypePseudo === MultiSelectionTypes.ALL
                ? "rgba(255,255,255,0.1)"
                : "initial"
          }}
          endIcon={
            multiSelectionTypePseudo === MultiSelectionTypes.ALL ? (
              <CheckRoundedIcon />
            ) : null
          }
        >
          <span style={{ flexGrow: 3, justifyContent: "flex-start" }}>
            All elements
          </span>
        </Button>

        <Button
          color="secondary"
          onClick={() => {
            multiSelectionType.current = MultiSelectionTypes.PARAGRAPH
            setMultiSelectionTypePseudo(MultiSelectionTypes.PARAGRAPH)
          }}
          style={{
            justifyContent: "flex-start",
            textTransform: "none",
            fontSize: "16px",
            paddingLeft: "16px"
          }}
          sx={{
            backgroundColor:
              multiSelectionTypePseudo === MultiSelectionTypes.PARAGRAPH
                ? "rgba(255,255,255,0.1)"
                : "initial"
          }}
          startIcon={<NotesOutlinedIcon />}
          endIcon={
            multiSelectionTypePseudo === MultiSelectionTypes.PARAGRAPH ? (
              <CheckRoundedIcon />
            ) : null
          }
        >
          <span style={{ flexGrow: 3, justifyContent: "flex-start" }}>
            Paragraphs only
          </span>
        </Button>
      </div>
    </>
  )
}

export default MultiselectPage
