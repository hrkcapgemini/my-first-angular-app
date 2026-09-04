import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubjectbehaviorsubjectService {
  
  protected subjectdata = new Subject();
  subjectdata$ = this.subjectdata.asObservable();


  protected behaviorSubject = new BehaviorSubject(null)
    behaviorSubjectData$ = this.behaviorSubject.asObservable();


  sendSubjectData(data:any){
    this.subjectdata.next(data)
  }

  sendBehaviorSubjectData(data:any){
   this.behaviorSubject.next(data)
  }
}
