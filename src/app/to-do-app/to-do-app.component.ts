import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../api.service';
import { ModalFormComponent } from '../modal-form/modal-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-to-do-app',
  standalone: false,
  templateUrl: './to-do-app.component.html',
  styleUrl: './to-do-app.component.css',
})
export class ToDoAppComponent implements OnInit {
  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public apiService: ApiService
  ) {}
  loading = false;
  ngOnInit() {
    this.getData();
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

  openFormModal() {
    const dialogRef = this.dialog.open(ModalFormComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Form Data:', result);
      }
    });
  }
}
