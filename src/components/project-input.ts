import { projectState } from '../state/project-state.js'
import { BindThis } from '../decorators/autobind-this-decorator.js'
import { Component } from './base-components.js'
import * as Validation from '../util/validation.js'

  //PROJECT INPUT CLASS

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

    const titleValidatble: Validation.ValitableObject = {
      value: enteredTitle,
      required: true,
      minLength: 3,
    };
    const descriptionValidatble: Validation.ValitableObject = {
      value: enteredDescription,
      required: true,
      minLength: 5,
      maxLength: 20,
    };
    const peopleValidatble: Validation.ValitableObject = {
      value: +enteredPeople,
      required: true,
      minNumber: 1,
      maxNumber: 5,
    };

    if (
      !Validation.validate(titleValidatble) ||
      !Validation.validate(descriptionValidatble) ||
      !Validation.validate(peopleValidatble)
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