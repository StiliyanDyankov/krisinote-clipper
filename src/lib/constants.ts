export const SelectionContainerId = "krisinote-clipper-selection-container"
export const ContainerPlusButtonId = "krisinote-clipper-article-plus-button"
export const ContainerMinusButtonId = "krisinote-clipper-article-minus-button"

export const UnviableElements = [
  "SPAN",
  "A",
  "I",
  "IFRAME",
  "B",
  "svg",
  "PATH",
  "HR",
  "SUP",
  "ellipse",
  "circle",
  "g"
]

export enum WrapperTypes {
  hover = "hover",
  selection = "selection"
}

export enum MultiSelectionTypes {
  ALL = "ALL",
  PARAGRAPH = "PARAGRAPH"
}

export type StyleDeclaration = {
  [key: string]: string
}

// TODO: make this work in some bright future
// export type StyleDeclaration2 = Partial<
//   Record<
//     keyof Exclude<keyof CSSStyleDeclaration, number | typeof Symbol.iterator>,
//     string
//   >
// >;

export const PlusIconStyles: StyleDeclaration = {
  width: "20px",
  height: "20px",
  borderRadius: "2px 0 0 2px",
  backgroundColor: "#292e4c",
  boxShadow: "0 0 0 2px #292e4c",
  position: "relative",
  margin: "auto"
}

export const PlusLineHorizontalStyles: StyleDeclaration = {
  width: "10px",
  height: "2px",
  backgroundColor: "white",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)"
}

export const PlusLineVerticalStyles: StyleDeclaration = {
  width: "2px",
  height: "10px",
  backgroundColor: "white",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)"
}

export const ButtonStyles: StyleDeclaration = {
  width: "27px",
  height: "24px",
  cursor: "pointer"
}

export const MinusIconStyles: StyleDeclaration = {
  width: "20px",
  height: "20px",
  borderRadius: "0 2px 2px 0",
  backgroundColor: "#292e4c",
  boxShadow: "0 0 0 2px #292e4c",
  position: "relative",
  margin: "auto"
}

export const MinusLineStyles: StyleDeclaration = {
  width: "10px",
  height: "2px",
  backgroundColor: "white",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)"
}

export const TopElementStyles: StyleDeclaration = {
  position: "absolute",
  top: "-12px",
  left: "50%",
  width: "54px",
  height: "24px",
  display: "flex",
  flexDirection: "row",
  pointerEvents: "all"
}

export const HoverWrapperStyles: StyleDeclaration = {
  border: "3px solid #8c93c0",
  backgroundColor: "rgba(0,0,0,0.3)",
  position: "absolute",
  zIndex: "99998"
}

export const ResultWindowStyles: StyleDeclaration = {
  position: "fixed",
  left: "12px",
  top: "12px",
  padding: "5px",
  width: "1200px",
  height: "900px",
  overflowY: "scroll",
  overflowX: "scroll",
  zIndex: "99999",
  backgroundColor: "#ffffff"
}

export const RootElementStyles: StyleDeclaration = {
  position: "fixed",
  right: "12px",
  top: "12px",
  width: "300px",
  height: "auto",
  zIndex: "99999"
}

export enum SelectType {
  ARTICLE = "ARTICLE",
  FULL_PAGE = "FULL_PAGE",
  SIMPLIFIED_ARTICLE = "SIMPLIFIED_ARTICLE"
}

export type TracingDirection = "up" | "down"

export const DefaultStylesToBeCoppied = [
  "color",
  "display",
  "box-sizing",
  "box-shadow",

  "visibility",
  "z-index",
  "position",

  "max-width",
  "min-width",
  "max-height",
  "min-height",

  "flex-direction",
  "flex-wrap",
  "flex-flow",
  "justify-content",
  "align-items",
  "align-content",
  "gap",
  "row-gap",
  "column-gap",
  "order",
  "flex-grow",
  "flex-shrink",
  "flex-basis",
  "flex",
  "align-self",

  "grid-template-columns",
  "grid-template-areas",
  "grid-template",
  "column-gap",
  "row-gap",
  "gap",
  "justify-items",
  "align-items",
  "place-items",
  "justify-content",
  "align-content",
  "place-content",
  "grid-auto-columns",
  "grid-auto-rows",
  "grid-auto-flow",
  "grid",
  "grid-column-start",
  "grid-column-end",
  "grid-row-start",
  "grid-row-end",
  "grid-column",
  "grid-row",
  "grid-area",
  "justify-self",
  "align-self",
  "place-self",

  "font-size",
  "font-style",
  "font-family",
  "font-weight",
  "overflow-wrap",
  "contain",
  "line-height",
  "tab-size",
  "text-size-adjust",
  "text-transform",
  "letter-spacing",
  "vertical-align",
  "text-decoration",

  "border-color",
  "border-width",
  "border-style",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-image-outset",
  "border-image-repeat",
  "border-image-slice",
  "border-image-source",
  "border-image-width",

  "padding-top",
  "padding-right",
  "padding-left",
  "padding-bottom",

  "margin-top",
  "margin-right",
  "margin-left",
  "margin-bottom",

  "background-color",

  "overflow-x",
  "overflow-y",

  "list-style-image",
  "list-style-position",
  "list-style-type"
]

export const SizingStylesToBeCoppied = [
  "padding-right",
  "padding-left",

  "margin-right",
  "margin-left",

  "gap"
]

export const INSERTION_VIEWPORT_WIDTH = 1000
