import { BindThis } from '../decorators/autobind-this-decorator.js'
import { Component } from './base-components.js';
import { Project } from '../models/project-model.js';
import { Draggable } from '../models/drag-drop-interfaces.js';

//PROJECT ITEM CLASS
  export class ProjectItem
    extends Component<HTMLUListElement, HTMLLIElement>
    implements Draggable
  {
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

    @BindThis
    dragStartHandler(event: DragEvent): void {
      event.dataTransfer!.setData("text/plain", this.project.id); //The data transfer property exists on drag events, it takes 2 arguments, the 1 argument is an identifier of the format of the data being transfered
      event.dataTransfer!.effectAllowed = "move"; //The effectAlowed method enables us to configure what will happen to the moved element, e.g. we move it or we copy it
    }

    dragEndHandler(_: DragEvent): void {
    }

    configure() {
      this.element.addEventListener("dragstart", this.dragStartHandler);
      this.element.addEventListener("dragend", this.dragEndHandler);
    }

    renderContent() {
      this.element.querySelector("h2")!.textContent = this.project.title;
      this.element.querySelector("h3")!.textContent =
        this.people + " assigned.";
      this.element.querySelector("p")!.textContent = this.project.description;
    }
  }

