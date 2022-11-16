//PROJECT TYPE

enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

//PROJECT STATE MANAGMENT

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  //this will be a singleton class so we can make only one instance of it and use it in the whole app, it well manage the apps state and store the apps data

  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    //this is a static method, when used it does not create a new instance of the class
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );
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
    isValid =
      isValid && ValitableInput.value.length >= ValitableInput.minLength;
  }
  if (
    ValitableInput.maxLength != null &&
    typeof ValitableInput.value === "string"
  ) {
    isValid =
      isValid && ValitableInput.value.length <= ValitableInput.maxLength;
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

//COMPONENT BASE CLASS

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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

//PROJECT ITEM CLASS

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
  private project: Project;

  get people() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} people`;
    }
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  configure() {}

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.people + " assigned.";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

//PROJECT LIST CLASS

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  configure(): void {
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const prjItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
    }
  }
}

//PROJECT INPUT CLASS

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
    this.renderContent();
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler.bind(this)); //we use the bind method to bind the this keyword to the class inside the submithandler method
  }
  renderContent(): void {}

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
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
