import { useEffect, useRef, useState } from "react"
import {
  SelectType,
  createNewSpecialWrapper,
  createSelectionContainer,
  getArticleSelectionEl,
  isElementViable,
  parseDomTree,
  removeSelectionContainer
} from "../../utils/lib"
import { Button, CircularProgress, Divider } from "@mui/material"
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined"
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined"
import NewspaperOutlinedIcon from "@mui/icons-material/NewspaperOutlined"
import { colorsTailwind } from "../../App"
import CheckRoundedIcon from "@mui/icons-material/CheckRounded"
import {
  ContainerMinusButtonId,
  ContainerPlusButtonId,
  SelectionContainerId
} from "../../utils/constants"

const LandingPage = ({
  onMultiSelectClick
}: {
  onMultiSelectClick: () => void
}) => {
  const [selectionType, setSelectionType] = useState<SelectType>(
    SelectType.ARTICLE
  )

  const [selectionContainer, setSelectionContainer] =
    useState<HTMLElement | null>(() => {
      if (document.getElementById(SelectionContainerId)) {
        document.body.removeChild(
          document.getElementById(SelectionContainerId) as Node
        )
      }
      return createSelectionContainer()
    })

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const currentSelectedElementKey = useRef(9999)

  const [selectedElements, setSelectedElements] = useState<
    Map<number, HTMLElement>
  >(() => {
    const selEl = new Map<number, HTMLElement>()
    selEl.set(currentSelectedElementKey.current, getArticleSelectionEl())
    return selEl
  })

  const handlePlusButtonClick = () => {
    const currentSelectedEl = selectedElements.get(
      currentSelectedElementKey.current
    )
    // check if a parent element has been traced before
    if (selectedElements.has(currentSelectedElementKey.current + 1)) {
      currentSelectedElementKey.current++
      createNewSpecialWrapper(
        selectedElements.get(currentSelectedElementKey.current) as HTMLElement,
        selectionContainer as HTMLElement,
        currentSelectedElementKey.current,
        { handlePlusButtonClick, handleMinusButtonClick }
      )
      // check if element has a parent and it's not body
    } else if (
      currentSelectedEl?.parentNode &&
      currentSelectedEl?.parentNode.nodeName !== "BODY"
    ) {
      currentSelectedElementKey.current++
      selectedElements.set(
        currentSelectedElementKey.current,
        currentSelectedEl?.parentNode as HTMLElement
      )
      createNewSpecialWrapper(
        currentSelectedEl.parentNode as HTMLElement,
        selectionContainer as HTMLElement,
        currentSelectedElementKey.current,
        { handlePlusButtonClick, handleMinusButtonClick }
      )
    }
  }

  const handleMinusButtonClick = () => {
    const currentSelectedEl = selectedElements.get(
      currentSelectedElementKey.current
    )
    // check if a child element has been traced before
    if (selectedElements.has(currentSelectedElementKey.current - 1)) {
      currentSelectedElementKey.current--
      createNewSpecialWrapper(
        selectedElements.get(currentSelectedElementKey.current) as HTMLElement,
        selectionContainer as HTMLElement,
        currentSelectedElementKey.current,
        { handlePlusButtonClick, handleMinusButtonClick }
      )
      //check if element has a child and it's a viable element
    } else if (
      currentSelectedEl?.firstChild &&
      isElementViable(currentSelectedEl?.firstChild as HTMLElement)
    ) {
      currentSelectedElementKey.current--
      selectedElements.set(
        currentSelectedElementKey.current,
        currentSelectedEl?.firstChild as HTMLElement
      )
      createNewSpecialWrapper(
        currentSelectedEl.firstChild as HTMLElement,
        selectionContainer as HTMLElement,
        currentSelectedElementKey.current,
        { handlePlusButtonClick, handleMinusButtonClick }
      )
    }
  }

  useEffect(() => {
    if (selectionContainer) {
      if (selectionType === SelectType.ARTICLE) {
        setSelectedElements(
          new Map<number, HTMLElement>().set(
            currentSelectedElementKey.current,
            getArticleSelectionEl()
          )
        )
        createNewSpecialWrapper(
          getArticleSelectionEl(),
          selectionContainer as HTMLElement,
          currentSelectedElementKey.current,
          { handlePlusButtonClick, handleMinusButtonClick }
        )
      } else if (selectionType === SelectType.FULL_PAGE) {
        setSelectedElements(
          new Map<number, HTMLElement>().set(
            currentSelectedElementKey.current,
            document.body
          )
        )
        createNewSpecialWrapper(
          document.body,
          selectionContainer as HTMLElement,
          currentSelectedElementKey.current,
          { handlePlusButtonClick, handleMinusButtonClick }
        )
      }
    }
  }, [selectionType])

  useEffect(() => {
    if (selectionContainer) {
      document
        .getElementById(ContainerPlusButtonId)
        ?.addEventListener("click", handlePlusButtonClick)
      document
        .getElementById(ContainerMinusButtonId)
        ?.addEventListener("click", handleMinusButtonClick)
    }
    return () => {
      document
        .getElementById(ContainerPlusButtonId)
        ?.removeEventListener("click", handlePlusButtonClick)
      document
        .getElementById(ContainerMinusButtonId)
        ?.removeEventListener("click", handleMinusButtonClick)
      if (
        document.getElementById(SelectionContainerId) &&
        document.getElementById(SelectionContainerId)?.children.length
      ) {
        removeSelectionContainer()
      }
    }
  }, [])

  useEffect(() => {
    if (isLoading) {
      parseDomTree(
        selectedElements.get(currentSelectedElementKey.current) as HTMLElement
      ).then(() => {
        setIsLoading(false)
      })
    }
  }, [isLoading])

  const handleClick = () => {
    setIsLoading(true)
  }

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
          disabled={isLoading}
          onClick={handleClick}
          style={{
            fontWeight: "700",
            color: "#fff",
            fontSize: "16px",
            position: "relative"
          }}
        >
          {isLoading ? "Loading..." : "Save Clip"}
          {isLoading ? <CircularProgress color="secondary" /> : null}
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
            onMultiSelectClick()
          }}
          style={{
            justifyContent: "flex-start",
            textTransform: "none",
            fontSize: "16px",
            paddingLeft: "16px"
          }}
          startIcon={<LibraryAddOutlinedIcon />}
        >
          Multi-Select
        </Button>

        <Button
          color="secondary"
          onClick={() => {
            setSelectionType(SelectType.ARTICLE)
          }}
          style={{
            justifyContent: "flex-start",
            textTransform: "none",
            fontSize: "16px",
            paddingLeft: "16px"
          }}
          startIcon={<NewspaperOutlinedIcon />}
          sx={{
            backgroundColor:
              selectionType === SelectType.ARTICLE
                ? "rgba(255,255,255,0.1)"
                : "initial"
          }}
          endIcon={
            selectionType === SelectType.ARTICLE ? <CheckRoundedIcon /> : null
          }
        >
          <span style={{ flexGrow: 3, justifyContent: "flex-start" }}>
            Article
          </span>
        </Button>

        <Button
          color="secondary"
          onClick={() => {
            setSelectionType(SelectType.FULL_PAGE)
          }}
          style={{
            justifyContent: "flex-start",
            textTransform: "none",
            fontSize: "16px",
            paddingLeft: "16px"
          }}
          startIcon={<ArticleOutlinedIcon />}
          sx={{
            backgroundColor:
              selectionType === SelectType.FULL_PAGE
                ? "rgba(255,255,255,0.1)"
                : "initial"
          }}
          endIcon={
            selectionType === SelectType.FULL_PAGE ? <CheckRoundedIcon /> : null
          }
        >
          <span style={{ flexGrow: 3, justifyContent: "flex-start" }}>
            Full Page
          </span>
        </Button>
      </div>
    </>
  )
}

export default LandingPage
