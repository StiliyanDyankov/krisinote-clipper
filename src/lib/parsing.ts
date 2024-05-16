import {
  ResultWindowStyles,
  DefaultStylesToBeCoppied,
  SizingStylesToBeCoppied,
  INSERTION_VIEWPORT_WIDTH
} from "./constants"
import { applyStyles } from "./lib"

// here happens the magic

export const parseDomTree = async (
  el: HTMLElement | Map<Number, HTMLElement>,
  multiselect: boolean = false
) => {
  const resultWindow = document.createElement("div")
  applyStyles(resultWindow, ResultWindowStyles)
  document.body.appendChild(resultWindow)

  if (multiselect) {
    ;(el as Map<Number, HTMLElement>).forEach((el) => {
      const cloned = krisinoteDOMParser(el as HTMLElement)

      const xmls = new XMLSerializer()
      const stringified = xmls.serializeToString(cloned)

      // just for testing purposes

      resultWindow.insertAdjacentHTML(
        "afterbegin",
        xmls.serializeToString(cloned)
      )
      const link = document.querySelectorAll("head link")

      console.log(
        performance
          .getEntries()
          .map((entry) => {
            return entry.name
          })
          .filter((url) => {
            return url.includes(".woff") || url.includes("font")
          })
      )

      const fontArr = performance
        .getEntries()
        .map((entry) => {
          return entry.name
        })
        .filter((url) => {
          return url.includes(".woff") || url.includes("font")
        })

      console.log("font array", fontArr)

      const result = fontArr.map(
        (font) => `<link href="${font}" type="text/css" rel="stylesheet"/>`
      )

      console.log("final result", result)

      const finalRes = result.join("") + stringified
      console.log(finalRes)
    })
  } else {
    const cloned = krisinoteDOMParser(el as HTMLElement)

    const xmls = new XMLSerializer()
    const stringified = xmls.serializeToString(cloned)

    // just for testing purposes

    resultWindow.insertAdjacentHTML(
      "afterbegin",
      xmls.serializeToString(cloned)
    )
    const link = document.querySelectorAll("head link")

    console.log(
      performance
        .getEntries()
        .map((entry) => {
          return entry.name
        })
        .filter((url) => {
          return url.includes(".woff") || url.includes("font")
        })
    )

    const fontArr = performance
      .getEntries()
      .map((entry) => {
        return entry.name
      })
      .filter((url) => {
        return url.includes(".woff") || url.includes("font")
      })

    console.log("font array", fontArr)

    const result = fontArr.map(
      (font) => `<link href="${font}" type="text/css" rel="stylesheet"/>`
    )

    console.log("final result", result)

    const finalRes = result.join("") + stringified
    console.log(finalRes)
  }

  // testBox.appendChild(cloned);

  // try to get all link elements
}

export const krisinoteDOMParser = (entryElement: HTMLElement) => {
  const entryElementClone = entryElement.cloneNode(true) as HTMLElement

  entryElementClone.style.all = "initial"

  entryElementClone.style.backgroundColor =
    getInheritedBackgroundColor(entryElement)
  entryElementClone.style.fontFamily = getInheritedFontFamily(entryElement)
  entryElementClone.style.fontSize = getInheritedFontSize(entryElement)

  parseDOMNode(entryElement, entryElementClone)

  return entryElementClone
}

const parseGridTemplateColumns = (original: string): string => {
  const split = original.split(" ")

  split.forEach((val, i) => {
    if (val.includes("px")) {
      let viewPortWidth = parseInt(
        window
          .getComputedStyle(document.body)
          .getPropertyValue("width")
          .slice(0, -2)
      )
      let pxVal = parseInt(val.slice(0, -2))
      split[i] = `${Math.floor((pxVal / viewPortWidth) * 100)}%`
    }
  })

  return split.join(" ")
}

const parseDOMNode = (
  realElement: HTMLElement | null,
  clonedElement: HTMLElement | null
) => {
  if (
    realElement?.nodeType === Node.ELEMENT_NODE &&
    window
      .getComputedStyle(realElement as Element)
      .getPropertyValue("visibility") !== "hidden"
  ) {
    // we have as a given here that the elements ARE actual html elements
    clonedElement = clonedElement as HTMLElement

    // remove id
    if (realElement?.id) {
      clonedElement?.removeAttribute("id")
    }

    // remove class
    if (realElement?.className) {
      clonedElement?.removeAttribute("class")
    }

    // here happens cloning of classes

    let styleAttributes = ""

    DefaultStylesToBeCoppied.forEach((value) => {
      styleAttributes = appendStyle(
        styleAttributes,
        value,
        window.getComputedStyle(realElement as Element).getPropertyValue(value)
      )
      clonedElement?.setAttribute("style", styleAttributes)
    })

    // gets the value of a given size prop as a number in px
    let viewPortWidth = parseInt(
      window
        .getComputedStyle(document.body)
        .getPropertyValue("width")
        .slice(0, -2)
    )

    // gets the calculated size of an x-axis margin/padding and sets it as a fraction of vw
    SizingStylesToBeCoppied.forEach((value) => {
      // gets the value of a given size prop as a number in px
      let sizingOfElementPx = parseInt(
        window
          .getComputedStyle(realElement as Element)
          .getPropertyValue(value)
          .slice(0, -2)
      )
      styleAttributes = appendStyle(
        styleAttributes,
        value,
        `${Math.floor((sizingOfElementPx / viewPortWidth) * INSERTION_VIEWPORT_WIDTH)}px`
      )
      clonedElement?.setAttribute("style", styleAttributes)
    })

    if (
      window
        .getComputedStyle(realElement as Element)
        .getPropertyValue("display") === "grid"
    ) {
      clonedElement.style.gridTemplateColumns = parseGridTemplateColumns(
        window
          .getComputedStyle(realElement)
          .getPropertyValue("grid-template-columns")
      )
    }

    clonedElement.style.backgroundColor =
      getInheritedBackgroundColor(realElement)

    clonedElement.style.minWidth = "fit-content"
    clonedElement.style.minHeight = "fit-content"
    clonedElement.style.overflowX = "hidden"

    if (clonedElement.nodeName === "IMG") {
      const imgPath = (realElement as HTMLImageElement).getAttribute("src")

      if (imgPath) {
        const isAbsoluteUrl =
          imgPath.indexOf("://") > 0 || imgPath.indexOf("//") === 0

        console.log(isAbsoluteUrl) // Output: true
        if (!isAbsoluteUrl) {
          const origin = location.origin

          const newUrl = origin + imgPath

          ;(clonedElement as HTMLImageElement).setAttribute("src", newUrl)
        } else {
        }
      }
    }
    console.log(clonedElement.nodeName)
    if (clonedElement.nodeName === "A") {
      const imgPath = (realElement as HTMLImageElement).getAttribute("href")

      if (imgPath) {
        const isAbsoluteUrl =
          imgPath.indexOf("://") > 0 || imgPath.indexOf("//") === 0

        if (!isAbsoluteUrl) {
          const origin = location.origin

          const newUrl = origin + imgPath

          ;(clonedElement as HTMLImageElement).setAttribute("href", newUrl)
        } else {
        }
      }
    }
    if (clonedElement.nodeName === "SOURCE") {
      const imgPath = (realElement as HTMLImageElement).getAttribute("srcset")

      if (imgPath) {
        const isAbsoluteUrl =
          imgPath.indexOf("://") > 0 || imgPath.indexOf("//") === 0

        if (!isAbsoluteUrl) {
          const origin = location.origin

          const newUrl = origin + imgPath

          ;(clonedElement as HTMLImageElement).setAttribute("srcset", newUrl)
        } else {
        }
      }
    }

    if (
      clonedElement.nodeName === "SOURCE" ||
      clonedElement.nodeName === "LINK" ||
      clonedElement.nodeName === "IMG" ||
      clonedElement.nodeName === "A"
    ) {
      clonedElement.setAttribute("target", "_blank")
    }

    if (
      clonedElement.nodeName === "IMG" ||
      clonedElement.nodeName === "svg" ||
      clonedElement.nodeName === "I" ||
      clonedElement.nodeName === "path"
    ) {
      if (realElement?.getAttribute("width")) {
        clonedElement?.removeAttribute("width")
      }
      if (realElement?.getAttribute("height")) {
        clonedElement?.removeAttribute("height")
      }
      clonedElement.style.width = window
        .getComputedStyle(realElement as Element)
        .getPropertyValue("width")
      clonedElement.style.height = window
        .getComputedStyle(realElement as Element)
        .getPropertyValue("height")
    }
  }

  realElement?.childNodes.forEach((childNode, key) => {
    parseDOMNode(
      childNode as HTMLElement,
      clonedElement?.childNodes.item(key) as HTMLElement
    )
  })
}

const appendStyle = (
  styleString: string,
  styleToBeAppended: string,
  value: string
) => {
  return `${styleString}${styleToBeAppended}: ${value}; `
}

function getInheritedBackgroundColor(el: HTMLElement): string {
  var defaultStyle = "rgba(0, 0, 0, 0)"

  var backgroundColor = window.getComputedStyle(el).backgroundColor

  if (backgroundColor != defaultStyle && backgroundColor != "rgba(0, 0, 0)")
    return backgroundColor

  if (el.parentNode)
    return getInheritedBackgroundColor(el.parentNode as HTMLElement)

  return defaultStyle
}

function getInheritedFontFamily(el: HTMLElement): string {
  var defaultStyle = "Times New Roman"

  var fontFamily = window.getComputedStyle(el).fontFamily

  if (fontFamily != defaultStyle) return fontFamily

  if (el.parentNode) return getInheritedFontFamily(el.parentNode as HTMLElement)

  return defaultStyle
}

function getInheritedFontSize(el: HTMLElement): string {
  var defaultSize = "16px"

  if (el?.nodeType === Node.ELEMENT_NODE) {
    var fontSize = window.getComputedStyle(el).fontSize

    if (fontSize != defaultSize) return fontSize

    if (el.parentNode) return getInheritedFontSize(el.parentNode as HTMLElement)
  }

  return defaultSize
}
