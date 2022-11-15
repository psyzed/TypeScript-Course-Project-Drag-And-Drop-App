class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  formElement: HTMLFormElement;
  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(
      //import node is a method that will take the point in the dom in which we want to render some content
      this.templateElement.content,
      true //the second argument of import node tells if we want to render all the levels of nesting "Deep Clone"
    );
    this.formElement = importedNode.firstElementChild as HTMLFormElement;
    this.formElement.id = 'user-input'; //adding id to the element for styiling
    this.attach();
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.formElement); //This method enables us to insert a html element, the first argument tells defines where the content will be insertet, (after the opening tag)
  }
}


const prjInput = new ProjectInput()