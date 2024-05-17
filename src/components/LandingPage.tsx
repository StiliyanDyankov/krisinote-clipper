import { useEffect, useRef, useState } from "react"
import { Button, CircularProgress, Divider } from "@mui/material"
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined"
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined"
import NewspaperOutlinedIcon from "@mui/icons-material/NewspaperOutlined"
import { colorsTailwind } from "../App"
import CheckRoundedIcon from "@mui/icons-material/CheckRounded"
import { SelectType } from "../lib/constants"
import { parseDomTree } from "../lib/parsing"
import { SelectionManager } from "../lib/SelectionManager"

const LandingPage = ({
  onMultiSelectClick
}: {
  onMultiSelectClick: () => void
}) => {
  const [selectionType, setSelectionType] = useState<SelectType>(
    SelectType.ARTICLE
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const selectionManagerInstance = useRef<SelectionManager | undefined>(
    undefined
  )

  useEffect(() => {
    if (isLoading) {
      parseDomTree(
        selectionManagerInstance.current?.selectedElementsMap.get(
          selectionManagerInstance.current?.currentSelectedElementKey
        ) as HTMLElement
      )
    }
  }, [isLoading])

  useEffect(() => {
    selectionManagerInstance.current = new SelectionManager()

    return () => {
      if (selectionManagerInstance.current) {
        selectionManagerInstance.current.cleanup()
      }
    }
  }, [])

  useEffect(() => {
    if (selectionManagerInstance.current) {
      selectionManagerInstance.current.setSelectionType(selectionType)
    }
  }, [selectionType])

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
