class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  formElement: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

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
    this.formElement.id = "user-input"; //adding id to the element for styiling
    this.titleInputElement = this.formElement.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.formElement.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.formElement.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private submitHandler(event: Event) {
    event.preventDefault(); //preventing http request.
    console.log(this.titleInputElement.value);
  }

  private configure() {
    this.formElement.addEventListener("submit", this.submitHandler.bind(this)); //we use the bind method to bind the this keyword to the class inside the submithandler method
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.formElement); //This method enables us to insert a html element, the first argument tells defines where the content will be insertet, (after the opening tag)
  }
}

const prjInput = new ProjectInput();
