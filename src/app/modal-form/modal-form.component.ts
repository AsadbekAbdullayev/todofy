import { Component, Inject, Optional } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  DEPARTMENTS,
  ExpenseLine,
  TaskItem,
  computeTaskFinancials,
} from '../store/models';
import { addTask, updateTask } from '../store/todofy.actions';

export interface ModalFormDialogData {
  task?: TaskItem;
}

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.scss'],
  standalone: false,
})
export class ModalFormComponent {
  readonly departments = [...DEPARTMENTS];
  readonly priorities = ['low', 'medium', 'high'] as const;
  readonly statuses = ['todo', 'in_progress', 'done'] as const;

  form: FormGroup;
  isEditMode = false;

  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private store: Store,
    private dialogRef: MatDialogRef<ModalFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ModalFormDialogData | null
  ) {
    const task = this.data?.task;
    this.isEditMode = !!task;

    this.form = this.fb.group({
      title: [task?.title ?? '', [Validators.required, Validators.maxLength(200)]],
      description: [
        task?.description ?? '',
        [Validators.required, Validators.maxLength(4000)],
      ],
      priority: [task?.priority ?? 'medium', Validators.required],
      department: [task?.department ?? 'Engineering', Validators.required],
      billableRate: [
        task?.billableRate ?? 0,
        [Validators.required, Validators.min(0)],
      ],
      estimatedHours: [
        task?.estimatedHours ?? 8,
        [Validators.required, Validators.min(0.25), Validators.max(2000)],
      ],
      taxPercent: [task?.taxPercent ?? 12, [Validators.min(0), Validators.max(100)]],
      bonus: [task?.bonus ?? 0, [Validators.min(0)]],
      status: [task?.status ?? 'todo', Validators.required],
      dueDate: [task?.dueDate ?? ''],
      expenses: this.fb.array(
        (task?.expenses?.length ? task.expenses : [{ id: '', label: '', amount: 0 }]).map(
          (e) => this.createExpenseGroup(e as ExpenseLine)
        )
      ),
    });
  }

  get expenses(): FormArray {
    return this.form.get('expenses') as FormArray;
  }

  invalidTouched(name: string): boolean {
    const c = this.form.get(name);
    return !!(c && c.invalid && c.touched);
  }

  createExpenseGroup(e?: Partial<ExpenseLine>): FormGroup {
    return this.fb.group({
      id: [e?.id || this.newId()],
      label: [e?.label ?? '', [Validators.required, Validators.maxLength(120)]],
      amount: [e?.amount ?? 0, [Validators.required, Validators.min(0)]],
    });
  }

  addExpenseRow(): void {
    this.expenses.push(this.createExpenseGroup());
  }

  removeExpenseRow(index: number): void {
    if (this.expenses.length > 1) {
      this.expenses.removeAt(index);
    }
  }

  setPriority(p: (typeof this.priorities)[number]): void {
    this.form.get('priority')?.setValue(p);
    this.form.get('priority')?.markAsTouched();
  }

  setStatus(s: (typeof this.statuses)[number]): void {
    this.form.get('status')?.setValue(s);
    this.form.get('status')?.markAsTouched();
  }

  previewTotals(): ReturnType<typeof computeTaskFinancials> {
    const v = this.form.getRawValue();
    const draft: TaskItem = {
      id: 'preview',
      title: v.title || '—',
      description: v.description || '—',
      priority: v.priority,
      department: v.department,
      billableRate: Number(v.billableRate) || 0,
      estimatedHours: Number(v.estimatedHours) || 0,
      taxPercent: Number(v.taxPercent) || 0,
      bonus: Number(v.bonus) || 0,
      status: v.status,
      dueDate: v.dueDate || null,
      createdAt: '',
      expenses: (v.expenses as { id: string; label: string; amount: number }[]).map(
        (row) => ({
          id: row.id || this.newId(),
          label: row.label,
          amount: Number(row.amount) || 0,
        })
      ),
    };
    return computeTaskFinancials(draft);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const expenses: ExpenseLine[] = v.expenses.map(
      (row: { id: string; label: string; amount: number }) => ({
        id: row.id || this.newId(),
        label: row.label,
        amount: Number(row.amount) || 0,
      })
    );

    const task: TaskItem = {
      id: this.isEditMode ? this.data!.task!.id : this.newId(),
      title: v.title,
      description: v.description,
      priority: v.priority,
      department: v.department,
      billableRate: Number(v.billableRate),
      estimatedHours: Number(v.estimatedHours),
      expenses,
      taxPercent: Number(v.taxPercent),
      bonus: Number(v.bonus),
      status: v.status,
      dueDate: v.dueDate ? String(v.dueDate) : null,
      createdAt: this.isEditMode
        ? this.data!.task!.createdAt
        : new Date().toISOString(),
    };

    if (this.isEditMode) {
      this.store.dispatch(updateTask({ task }));
      this.snackBar.open('Workstream updated', 'OK', { duration: 2500 });
    } else {
      this.store.dispatch(addTask({ task }));
      this.snackBar.open('Workstream captured', 'OK', { duration: 2500 });
    }
    this.dialogRef.close(true);
  }

  private newId(): string {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}
