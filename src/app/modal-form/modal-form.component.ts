import { Component, EventEmitter, Output, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  standalone: false,
  styleUrls: ['./modal-form.component.css'],
})
export class ModalFormComponent {
  @Output() taskAdded = new EventEmitter<any>();
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
      description: [data?.description || '', [Validators.required]],
    });
  }

  getData() {
    this.apiService.loading = true;
    this.apiService.getData().subscribe(
      (response) => {
        this.apiService.task_data = response.data;
        this.apiService.loading = false;
      },
      (error) => {
        this.apiService.loading = false;
        this.snackBar.open('An error occurred. Please try again.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        console.error(error);
      }
    );
  }

  sendData() {
    this.loading = true;
    this.apiService
      .postData('books', {
        author: this.form.value.title,
        title: this.form.value.description,
        publishYear: 2000,
      })
      .subscribe(
        (response) => {
          console.log('Response from server:', response);
          this.loading = false;
          this.dialogRef.close();
          this.taskAdded.emit();
          this.snackBar.open('Task added successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.getData();
        },
        (error) => {
          this.loading = false;
          this.snackBar.open('An error occurred. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          console.error('Error occurred:', error);
        }
      );
  }

  onSubmit() {
    if (this.isEditMode) {
      this.loading = true;
      this.apiService
        .putData(`books/${this.data.id}`, {
          author: this.form.value.title,
          title: this.form.value.description,
          publishYear: this.data.publishYear,
        })
        .subscribe(
          (response) => {
            console.log('Response from server:', response);
            this.loading = false;
            this.dialogRef.close();
            this.taskAdded.emit();
            this.snackBar.open('Task Edited successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            this.getData();
          },
          (error) => {
            this.loading = false;
            this.snackBar.open(
              'An error occurred. Please try again.',
              'Close',
              {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
              }
            );
            console.error('Error occurred:', error);
          }
        );
    } else {
      this.sendData();
    }
  }
}
