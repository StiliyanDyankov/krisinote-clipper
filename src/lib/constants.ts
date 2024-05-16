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

export const TestBoxStyles: StyleDeclaration = {
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
