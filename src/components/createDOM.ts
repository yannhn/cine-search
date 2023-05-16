export class CreateDOM {
  private container: HTMLDivElement;

  constructor() {
    this.container = document.createElement("div");
  }

  createElement(
    tagName: string,
    attributes: Record<string, string> = {},
    classes: string[] = [],
    parentElement: HTMLElement | null = null
  ) {
    const element = document.createElement(tagName);

    if (attributes !== undefined && typeof attributes === "object") {
      for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
      }
    }

    if (
      classes !== undefined &&
      Array.isArray(classes) &&
      classes.length !== 0
    ) {
      element.classList.add(...classes);
    }

    if (parentElement !== null) {
      parentElement.appendChild(element);
    }

    return element;
  }
}
