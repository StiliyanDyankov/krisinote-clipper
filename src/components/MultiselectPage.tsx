import { useEffect, useRef, useState } from "react"
import { Button, CircularProgress, Divider } from "@mui/material"
import { colorsTailwind } from "../App"
import CodeRoundedIcon from "@mui/icons-material/CodeRounded"
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined"
import CheckRoundedIcon from "@mui/icons-material/CheckRounded"
import { MultiSelectionTypes, SelectionType } from "../lib/constants"
import { parseDomTree } from "../lib/parsing"
import { SelectionManager } from "../lib/SelectionManager"

const MultiselectPage = () => {
  const [multiSelectionTypePseudo, setMultiSelectionTypePseudo] =
    useState<MultiSelectionTypes>(MultiSelectionTypes.ALL)

  // stores outlined elements in state
  const [selectedElements, setSelectedElements] = useState<
    Map<number, HTMLElement>
  >(new Map())

  const [selectionType, setSelectionType] = useState<SelectionType>(
    SelectionType.MULTISELECT_ALL
  )

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const selectionManagerInstance = useRef<SelectionManager | undefined>(
    undefined
  )

  const onSelectionPress = (selectionType: SelectionType) => {
    setSelectionType(selectionType)
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
    if (isLoading) {
      parseDomTree(selectedElements, true)
      setIsLoading(false)
    }
  }, [isLoading])

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
            onSelectionPress(SelectionType.MULTISELECT_ALL)
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
            onSelectionPress(SelectionType.MULTISELECT_PARAGRAPH)
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
