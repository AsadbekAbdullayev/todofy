import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalFormComponent } from '../modal-form/modal-form.component';
import { TaskItem, computeTaskFinancials } from '../store/models';
import { deleteTask } from '../store/todofy.actions';

@Component({
  selector: 'app-card',
  standalone: false,
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input({ required: true }) task!: TaskItem;

  constructor(
    private dialog: MatDialog,
    private store: Store,
    private snackBar: MatSnackBar
  ) {}

  totals(): ReturnType<typeof computeTaskFinancials> {
    return computeTaskFinancials(this.task);
  }

  onEdit(): void {
    this.dialog.open(ModalFormComponent, {
      width: 'min(98vw, 880px)',
      maxWidth: '98vw',
      height: 'min(94dvh, 920px)',
      maxHeight: '96dvh',
      panelClass: 'todofy-form-panel',
      data: { task: this.task },
    });
  }

  onDelete(): void {
    this.store.dispatch(deleteTask({ id: this.task.id }));
    this.snackBar.open('Workstream removed', 'OK', { duration: 2200 });
  }
}
