//PROJECT STATE MANAGMENT

class ProjectState {
  //this will be a singleton class so we can make only one instance of it and use it in the whole app, it well manage the apps state and store the apps data
  private listeners: any[] = [];
  private projects: any[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance() {
    //this is a static method, when used it does not create a new instance of the class
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFn: Function) {
    this.listeners.push(listenerFn);
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = {
      id: Math.random().toString(),
      title: title,
      description: description,
      people: numOfPeople,
    };
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance(); //created a global instance so we can use its methods in other classes

//VALIDATION

interface ValitableObject {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minNumber?: number;
  maxNumber?: number;
}

function validate(ValitableInput: ValitableObject) {
  let isValid = true;

  if (ValitableInput.required) {
    isValid = isValid && ValitableInput.value.toString().trim().length !== 0;
  }
  if (
    ValitableInput.minLength != null &&
    typeof ValitableInput.value === "string"
  ) {
    isValid = isValid && ValitableInput.value.length >= ValitableInput.minLength;
  }
  if (
    ValitableInput.maxLength != null &&
    typeof ValitableInput.value === "string"
  ) {
    isValid = isValid && ValitableInput.value.length <= ValitableInput.maxLength;
  }
  if (
    ValitableInput.minNumber != null &&
    typeof ValitableInput.value === "number"
  ) {
    isValid = isValid && ValitableInput.value >= ValitableInput.minNumber;
  }
  if (
    ValitableInput.maxNumber != null &&
    typeof ValitableInput.value === "number"
  ) {
    isValid = isValid && ValitableInput.value <= ValitableInput.maxNumber;
  }
  return isValid;
}

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

//PROJECT LIST CLASS

class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  listElement: HTMLElement;
  assignedProjects: any[];

  constructor(private type: "active" | "finished") {
    this.templateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    this.assignedProjects = [];

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.listElement = importedNode.firstElementChild as HTMLElement;
    this.listElement.id = `${this.type}-projects`;

    projectState.addListener((projects: any[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement("li");
      listItem.textContent = prjItem.title;
      listEl?.appendChild(listItem);
    }
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.listElement.querySelector("ul")!.id = listId;
    this.listElement.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.listElement); //This method enables us to insert a html element, the first argument tells defines where the content will be insertet, (after the opening tag)
  }
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

    const titleValidatble: ValitableObject = {
      value: enteredTitle,
      required: true,
      minLength: 3,
    };
    const descriptionValidatble: ValitableObject = {
      value: enteredDescription,
      required: true,
      minLength: 5,
      maxLength: 20,
    };
    const peopleValidatble: ValitableObject = {
      value: +enteredPeople,
      required: true,
      minNumber: 1,
      maxNumber: 5,
    };

    if (
      !validate(titleValidatble) ||
      !validate(descriptionValidatble) ||
      !validate(peopleValidatble)
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
      projectState?.addProject(title, desc, people);
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
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
