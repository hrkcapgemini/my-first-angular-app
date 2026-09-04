import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { SubjectbehaviorsubjectService } from '../../../../services/subjectbehaviorsubject.service';
@Component({
  selector: 'app-sibling1',
  standalone: true,
  imports: [],
  template: ` 
              <section class="sibling-card">
              <p>sibling1 works!</p>
      <p class="eyebrow">Sibling 1</p>
      <p class="helper-text">Send a date to Sibling 2.</p>
      <div class="date-row">
        <input id="shared-date" #text />
        <button type="button" (click)="sendSibling2(text.value)" >
          Send date
        </button>
      </div>
    </section>
              
            `,
  styles: `:host { display: block; }
    .sibling-card {
      padding: 1.5rem;
      border: 1px solid #dbe4f0;
      border-radius: 14px;
      background: #ffffff;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
    }
    .eyebrow {
      margin: 0 0 0.4rem;
      color: #2563eb;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    h2 { margin: 0; color: #0f172a; font-size: 1.25rem; }
    .helper-text { margin: 0.5rem 0 1rem; color: #64748b; }
    label { display: block; margin-bottom: 0.4rem; color: #334155; font-weight: 600; }
    .date-row { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    input, button { min-height: 2.75rem; border-radius: 8px; font: inherit; }
    input { flex: 1 1 12rem; min-width: 0; padding: 0 0.75rem; border: 1px solid #cbd5e1; color: #0f172a; }
    button { padding: 0 1rem; border: 0; background: #2563eb; color: #ffffff; font-weight: 700; cursor: pointer; }
    button:disabled { background: #94a3b8; cursor: not-allowed; }`,
})
export class Sibling1 {

  private subjectService = inject(SubjectbehaviorsubjectService)

  sendSibling2(data:any){
    this.subjectService.sendSubjectData(data)
  }
}
