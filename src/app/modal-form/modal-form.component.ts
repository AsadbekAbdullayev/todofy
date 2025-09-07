import { Component, EventEmitter, Output, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.css'],
  standalone: false,
})
export class ModalFormComponent {
  @Output() taskChanged = new EventEmitter<void>();
  form: FormGroup;
  loading = false;
  isEditMode = false;

  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<ModalFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data;

    this.form = this.fb.group({
      title: [data?.title || '', Validators.required],
      description: [data?.description || '', Validators.required],
    });
  }

  private showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  private handleSuccess(message: string) {
    this.loading = false;
    this.dialogRef.close();
    this.taskChanged.emit();
    this.showMessage(message);
    this.apiService.refreshData(); // ApiService ichida getData() umumlashtiriladi
  }

  private handleError(error: any, message: string) {
    this.loading = false;
    this.showMessage(message);
    console.error('Error:', error);
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;

    const payload = {
      author: this.form.value.title,
      title: this.form.value.description,
      publishYear: this.isEditMode ? this.data.publishYear : 2000,
    };

    const request$ = this.isEditMode
      ? this.apiService.putData(`books/${this.data.id}`, payload)
      : this.apiService.postData('books', payload);

    request$.subscribe(
      () =>
        this.handleSuccess(
          this.isEditMode ? 'Task updated successfully!' : 'Task added successfully!'
        ),
      (err) =>
        this.handleError(
          err,
          this.isEditMode
            ? 'Error updating task. Please try again.'
            : 'Error adding task. Please try again.'
        )
    );
  }
}
