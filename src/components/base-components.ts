  //COMPONENT BASE CLASS
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  //we use generic types so that we can use specific types for the properties in the place where we inherit them
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }
    this.attach(insertAtStart);
  }
  private attach(insertAtBeggining: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeggining ? "afterbegin" : "beforeend",
      this.element
    ); //This method enables us to insert a html element, the first argument tells defines where the content will be insertet, (after the opening tag)
  }
  abstract configure(): void;
  abstract renderContent(): void;
}