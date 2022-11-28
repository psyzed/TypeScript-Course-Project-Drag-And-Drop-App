var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("models/project-model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Project = exports.ProjectStatus = void 0;
    var ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = exports.ProjectStatus || (exports.ProjectStatus = {}));
    class Project {
        constructor(id, title, description, people, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.people = people;
            this.status = status;
        }
    }
    exports.Project = Project;
});
define("state/project-state", ["require", "exports", "models/project-model"], function (require, exports, project_model_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.projectState = exports.ProjectState = void 0;
    class State {
        constructor() {
            this.listeners = [];
        }
        addListener(listenerFn) {
            this.listeners.push(listenerFn);
        }
    }
    class ProjectState extends State {
        constructor() {
            super();
            this.projects = [];
        }
        static getInstance() {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new ProjectState();
            return this.instance;
        }
        addProject(title, description, numOfPeople) {
            const newProject = new project_model_js_1.Project(Math.random().toString(), title, description, numOfPeople, project_model_js_1.ProjectStatus.Active);
            this.projects.push(newProject);
            this.updateListeners();
        }
        moveProject(projectId, newStatus) {
            const project = this.projects.find((prj) => prj.id === projectId);
            if (project && project.status !== newStatus) {
                project.status = newStatus;
                this.updateListeners();
            }
        }
        updateListeners() {
            for (const listenerFn of this.listeners) {
                listenerFn(this.projects.slice());
            }
        }
    }
    exports.ProjectState = ProjectState;
    exports.projectState = ProjectState.getInstance();
});
define("decorators/autobind-this-decorator", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BindThis = void 0;
    function BindThis(_1, _2, descriptor) {
        const originalMethod = descriptor.value;
        const configuredDescriptor = {
            configurable: true,
            enumerable: false,
            get() {
                const boundThisFunction = originalMethod.bind(this);
                return boundThisFunction;
            },
        };
        return configuredDescriptor;
    }
    exports.BindThis = BindThis;
});
define("components/base-components", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Component = void 0;
    class Component {
        constructor(templateId, hostElementId, insertAtStart, newElementId) {
            this.templateElement = document.getElementById(templateId);
            this.hostElement = document.getElementById(hostElementId);
            const importedNode = document.importNode(this.templateElement.content, true);
            this.element = importedNode.firstElementChild;
            if (newElementId) {
                this.element.id = newElementId;
            }
            this.attach(insertAtStart);
        }
        attach(insertAtBeggining) {
            this.hostElement.insertAdjacentElement(insertAtBeggining ? "afterbegin" : "beforeend", this.element);
        }
    }
    exports.Component = Component;
});
define("util/validation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validate = void 0;
    function validate(ValitableInput) {
        let isValid = true;
        if (ValitableInput.required) {
            isValid = isValid && ValitableInput.value.toString().trim().length !== 0;
        }
        if (ValitableInput.minLength != null &&
            typeof ValitableInput.value === "string") {
            isValid =
                isValid && ValitableInput.value.length >= ValitableInput.minLength;
        }
        if (ValitableInput.maxLength != null &&
            typeof ValitableInput.value === "string") {
            isValid =
                isValid && ValitableInput.value.length <= ValitableInput.maxLength;
        }
        if (ValitableInput.minNumber != null &&
            typeof ValitableInput.value === "number") {
            isValid = isValid && ValitableInput.value >= ValitableInput.minNumber;
        }
        if (ValitableInput.maxNumber != null &&
            typeof ValitableInput.value === "number") {
            isValid = isValid && ValitableInput.value <= ValitableInput.maxNumber;
        }
        return isValid;
    }
    exports.validate = validate;
});
define("components/project-input", ["require", "exports", "state/project-state", "decorators/autobind-this-decorator", "components/base-components", "util/validation"], function (require, exports, project_state_js_1, autobind_this_decorator_js_1, base_components_js_1, validation_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectInput = void 0;
    class ProjectInput extends base_components_js_1.Component {
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
            if (!validation_js_1.validate(titleValidatble) ||
                !validation_js_1.validate(descriptionValidatble) ||
                !validation_js_1.validate(peopleValidatble)) {
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
                project_state_js_1.projectState === null || project_state_js_1.projectState === void 0 ? void 0 : project_state_js_1.projectState.addProject(title, desc, people);
            }
            this.clearInputs();
        }
    }
    __decorate([
        autobind_this_decorator_js_1.BindThis
    ], ProjectInput.prototype, "submitHandler", null);
    exports.ProjectInput = ProjectInput;
});
define("models/drag-drop-interfaces", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/project-item", ["require", "exports", "decorators/autobind-this-decorator", "components/base-components"], function (require, exports, autobind_this_decorator_js_2, base_components_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectItem = void 0;
    class ProjectItem extends base_components_js_2.Component {
        constructor(hostId, project) {
            super("single-project", hostId, false, project.id);
            this.project = project;
            this.configure();
            this.renderContent();
        }
        get people() {
            if (this.project.people === 1) {
                return "1 person";
            }
            else {
                return `${this.project.people} people`;
            }
        }
        dragStartHandler(event) {
            event.dataTransfer.setData("text/plain", this.project.id);
            event.dataTransfer.effectAllowed = "move";
        }
        dragEndHandler(_) {
        }
        configure() {
            this.element.addEventListener("dragstart", this.dragStartHandler);
            this.element.addEventListener("dragend", this.dragEndHandler);
        }
        renderContent() {
            this.element.querySelector("h2").textContent = this.project.title;
            this.element.querySelector("h3").textContent =
                this.people + " assigned.";
            this.element.querySelector("p").textContent = this.project.description;
        }
    }
    __decorate([
        autobind_this_decorator_js_2.BindThis
    ], ProjectItem.prototype, "dragStartHandler", null);
    exports.ProjectItem = ProjectItem;
});
define("components/project-list", ["require", "exports", "state/project-state", "models/project-model", "components/base-components", "decorators/autobind-this-decorator", "components/project-item"], function (require, exports, project_state_js_2, project_model_js_2, base_components_js_3, autobind_this_decorator_js_3, project_item_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectList = void 0;
    class ProjectList extends base_components_js_3.Component {
        constructor(type) {
            super("project-list", "app", false, `${type}-projects`);
            this.type = type;
            this.assignedProjects = [];
            this.configure();
            this.renderContent();
        }
        dragOverHandler(event) {
            if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
                event.preventDefault();
                const ulListEl = this.element.querySelector("ul");
                ulListEl.classList.add("droppable");
            }
        }
        dropHandler(event) {
            const prjId = event.dataTransfer.getData("text/plain");
            project_state_js_2.projectState.moveProject(prjId, this.type === "active" ? project_model_js_2.ProjectStatus.Active : project_model_js_2.ProjectStatus.Finished);
        }
        dragLeaveHandler(_) {
            const ulListEl = this.element.querySelector("ul");
            ulListEl.classList.remove("droppable");
        }
        configure() {
            this.element.addEventListener("dragover", this.dragOverHandler);
            this.element.addEventListener("dragleave", this.dragLeaveHandler);
            this.element.addEventListener("drop", this.dropHandler);
            project_state_js_2.projectState.addListener((projects) => {
                const relevantProjects = projects.filter((prj) => {
                    if (this.type === "active") {
                        return prj.status === project_model_js_2.ProjectStatus.Active;
                    }
                    return prj.status === project_model_js_2.ProjectStatus.Finished;
                });
                this.assignedProjects = relevantProjects;
                this.renderProjects();
            });
        }
        renderContent() {
            const listId = `${this.type}-projects-list`;
            this.element.querySelector("ul").id = listId;
            this.element.querySelector("h2").textContent =
                this.type.toUpperCase() + " PROJECTS";
        }
        renderProjects() {
            const listEl = document.getElementById(`${this.type}-projects-list`);
            listEl.innerHTML = "";
            for (const prjItem of this.assignedProjects) {
                new project_item_js_1.ProjectItem(this.element.querySelector("ul").id, prjItem);
            }
        }
    }
    __decorate([
        autobind_this_decorator_js_3.BindThis
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        autobind_this_decorator_js_3.BindThis
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        autobind_this_decorator_js_3.BindThis
    ], ProjectList.prototype, "dragLeaveHandler", null);
    exports.ProjectList = ProjectList;
});
define("app", ["require", "exports", "components/project-input", "components/project-list"], function (require, exports, project_input_js_1, project_list_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    new project_input_js_1.ProjectInput();
    new project_list_js_1.ProjectList("active");
    new project_list_js_1.ProjectList("finished");
});
//# sourceMappingURL=bundle.js.map