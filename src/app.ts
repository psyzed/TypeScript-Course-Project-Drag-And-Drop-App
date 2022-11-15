//THIS KEYWORD BIND DECORATOR

function BindThis(_1: any, _2: any, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const configuredDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundThisFunction = originalMethod.bind(this);
      return boundThisFunction;
    },
  };
  return configuredDescriptor;
}

//PROJECT INPUT CLASS

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

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    if (
      enteredTitle.trim().length === 0 ||
      enteredDescription.trim().length === 0 ||
      enteredPeople.trim().length === 0
    ) {
      alert("Invalid Input!");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @BindThis
  private submitHandler(event: Event) {
    event.preventDefault(); //preventing http request.
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      console.log(userInput);
    }
    this.clearInputs();
  }

  private configure() {
    this.formElement.addEventListener("submit", this.submitHandler.bind(this)); //we use the bind method to bind the this keyword to the class inside the submithandler method
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.formElement); //This method enables us to insert a html element, the first argument tells defines where the content will be insertet, (after the opening tag)
  }
}

const prjInput = new ProjectInput();
