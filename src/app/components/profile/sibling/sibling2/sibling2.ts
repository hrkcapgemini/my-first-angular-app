import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { SubjectbehaviorsubjectService } from '../../../../services/subjectbehaviorsubject.service';

@Component({
  selector: 'app-sibling2',
  imports: [],
  template: `
    <section class="sibling-card">
      <p class="eyebrow">Sibling 2</p>
      <h2>Received date</h2>

      @if (receivedData) {
        <p class="date-value">{{ receivedData}}</p>
        <p class="raw-date">Selected value: {{ receivedData }}</p>
      } @else {
        <p class="empty-state">Choose and send a date from Sibling 1.</p>
      }
    </section>
  `,
  styles: `
    :host { display: block; margin-top: 1rem; }
    .sibling-card {
      padding: 1.5rem;
      border: 1px solid #bbf7d0;
      border-radius: 14px;
      background: #f0fdf4;
    }
    .eyebrow {
      margin: 0 0 0.4rem;
      color: #15803d;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    h2 { margin: 0 0 0.75rem; color: #14532d; font-size: 1.25rem; }
    .date-value { margin: 0; color: #166534; font-size: 1.5rem; font-weight: 700; }
    .raw-date, .empty-state { margin: 0.5rem 0 0; color: #4d7c0f; }
  `,
})
export class Sibling2 implements OnInit {

  protected receivedData:any;

   private subjectService = inject(SubjectbehaviorsubjectService);

   ngOnInit() {
     this.subjectService.subjectdata$.subscribe( (resp:any) => {
       this.receivedData = resp;
     })
   }



}

