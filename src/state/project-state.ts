import { Project, ProjectStatus } from '../models/project-model'

//PROJECT STATE MANAGMENT

  type Listener<T> = (items: T[]) => void;

  class State<T> {
    protected listeners: Listener<T>[] = [];
  
    addListener(listenerFn: Listener<T>) {
      this.listeners.push(listenerFn);
    }
  }
  
  export class ProjectState extends State<Project> {
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
      this.updateListeners();
    }
  
    moveProject(projectId: string, newStatus: ProjectStatus) {
      const project = this.projects.find((prj) => prj.id === projectId);
      if (project && project.status !== newStatus) {
        project.status = newStatus;
        this.updateListeners();
      }
    }
  
    private updateListeners() {
      for (const listenerFn of this.listeners) {
        listenerFn(this.projects.slice());
      }
    }
  }
  
  export const projectState = ProjectState.getInstance(); //created a global instance so we can use its methods in other classes

