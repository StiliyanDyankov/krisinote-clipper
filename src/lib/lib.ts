import { StyleDeclaration } from "./constants"

export const applyStyles = (
  element: HTMLDivElement,
  styles: StyleDeclaration
): void => {
  Object.keys(styles).forEach((key) => {
    element.style[key as any] = styles[key]
  })
}
