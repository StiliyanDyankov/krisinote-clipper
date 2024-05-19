import { useEffect, useRef, useState } from "react"
import { Button, CircularProgress, Divider } from "@mui/material"
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined"
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined"
import NewspaperOutlinedIcon from "@mui/icons-material/NewspaperOutlined"
import { colorsTailwind } from "../App"
import CheckRoundedIcon from "@mui/icons-material/CheckRounded"
import { SelectionType } from "../lib/constants"
import { parseDomTree } from "../lib/parsing"
import { SelectionManager } from "../lib/SelectionManager"

const LandingPage = ({
  onMultiSelectClick
}: {
  onMultiSelectClick: () => void
}) => {
  const [selectionType, setSelectionType] = useState<SelectionType>(
    SelectionType.ARTICLE
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const selectionManagerInstance = useRef<SelectionManager | undefined>(
    undefined
  )

  const parseElement = () => {
    const manager = selectionManagerInstance.current

    if (!manager) {
      return
    }

    const selectedElement = manager.selectedElementsMap.get(
      manager.currentSelectedElementKey
    )

    if (!selectedElement) {
      return
    }

    parseDomTree(selectedElement)
  }

  const onSelectionPress = (selectionType: SelectionType) => {
    setSelectionType(selectionType)
  }

  const handleParse = () => {
    setIsLoading(true)
    parseElement()
  }

  useEffect(() => {
    selectionManagerInstance.current = new SelectionManager()

    return () => {
      if (selectionManagerInstance.current) {
        selectionManagerInstance.current.cleanup()
      }

      selectionManagerInstance.current = undefined
    }
  }, [])

  useEffect(() => {
    if (selectionManagerInstance.current) {
      selectionManagerInstance.current.setSelectionType(selectionType)
    }
  }, [selectionType])

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
          onClick={handleParse}
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
            onSelectionPress(SelectionType.ARTICLE)
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
              selectionType === SelectionType.ARTICLE
                ? "rgba(255,255,255,0.1)"
                : "initial"
          }}
          endIcon={
            selectionType === SelectionType.ARTICLE ? (
              <CheckRoundedIcon />
            ) : null
          }
        >
          <span style={{ flexGrow: 3, justifyContent: "flex-start" }}>
            Article
          </span>
        </Button>

        <Button
          color="secondary"
          onClick={() => {
            onSelectionPress(SelectionType.FULL_PAGE)
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
              selectionType === SelectionType.FULL_PAGE
                ? "rgba(255,255,255,0.1)"
                : "initial"
          }}
          endIcon={
            selectionType === SelectionType.FULL_PAGE ? (
              <CheckRoundedIcon />
            ) : null
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
