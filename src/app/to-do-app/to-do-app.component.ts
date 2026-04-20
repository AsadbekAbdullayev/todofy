import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ModalFormComponent } from '../modal-form/modal-form.component';
import { selectAllTasks, selectTasksTotalGrand } from '../store/selectors';

@Component({
  selector: 'app-to-do-app',
  standalone: false,
  templateUrl: './to-do-app.component.html',
  styleUrl: './to-do-app.component.scss',
  animations: [
    trigger('listStagger', [
      transition('* => *', [
        query(
          'app-card',
          [
            style({ opacity: 0, transform: 'translateY(18px)' }),
            stagger(
              52,
              animate(
                '400ms cubic-bezier(0.22, 1, 0.36, 1)',
                style({ opacity: 1, transform: 'none' })
              )
            ),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class ToDoAppComponent {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);

  readonly tasks$ = this.store.select(selectAllTasks);
  readonly portfolio$ = this.store.select(selectTasksTotalGrand);

  /** Explicit view switching (no mat-tab-group) so no stale tab content. */
  activeView: 'pipeline' | 'analytics' = 'pipeline';

  selectView(view: 'pipeline' | 'analytics'): void {
    this.activeView = view;
  }

  openFormModal(): void {
    this.dialog.open(ModalFormComponent, {
      width: 'min(98vw, 880px)',
      maxWidth: '98vw',
      height: 'min(94dvh, 920px)',
      maxHeight: '96dvh',
      panelClass: 'todofy-form-panel',
    });
  }
}
