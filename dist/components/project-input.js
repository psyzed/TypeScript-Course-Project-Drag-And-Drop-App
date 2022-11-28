var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { projectState } from '../state/project-state.js';
import { BindThis } from '../decorators/autobind-this-decorator.js';
import { Component } from './base-components.js';
import * as Validation from '../util/validation.js';
export class ProjectInput extends Component {
    constructor() {
        super("project-input", "app", true, "user-input");
        this.titleInputElement = this.element.querySelector("#title");
        this.descriptionInputElement = this.element.querySelector("#description");
        this.peopleInputElement = this.element.querySelector("#people");
        this.configure();
        this.renderContent();
    }
    configure() {
        this.element.addEventListener("submit", this.submitHandler.bind(this));
    }
    renderContent() { }
    gatherUserInput() {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;
        const titleValidatble = {
            value: enteredTitle,
            required: true,
            minLength: 3,
        };
        const descriptionValidatble = {
            value: enteredDescription,
            required: true,
            minLength: 5,
            maxLength: 20,
        };
        const peopleValidatble = {
            value: +enteredPeople,
            required: true,
            minNumber: 1,
            maxNumber: 5,
        };
        if (!Validation.validate(titleValidatble) ||
            !Validation.validate(descriptionValidatble) ||
            !Validation.validate(peopleValidatble)) {
            alert("Invalid Input!");
            return;
        }
        else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }
    clearInputs() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            projectState === null || projectState === void 0 ? void 0 : projectState.addProject(title, desc, people);
        }
        this.clearInputs();
    }
}
__decorate([
    BindThis
], ProjectInput.prototype, "submitHandler", null);
//# sourceMappingURL=project-input.js.map