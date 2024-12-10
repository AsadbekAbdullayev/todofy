import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalFormComponent } from '../modal-form/modal-form.component';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  standalone: false,
})
export class CardComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() task: any;
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  loading = false;

  constructor(
    private dialog: MatDialog,
    public apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}
  onEdit(data: any): void {
    this.dialog.open(ModalFormComponent, {
      data: {
        title: data?.author,
        description: data?.title,
        id: data?._id,
        publishYear: data?.publishYear,
      },
    });
  }

  onDelete(id: string) {
    this.loading = true;

    this.apiService.deleteData(`books/${id}`).subscribe(
      (response) => {
        this.snackBar.open('Task deleted successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.loading = false;
        this.getData();
      },
      (error) => {
        this.loading = false;
        this.snackBar.open(
          'An error occurred while deleting the task.',
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          }
        );
      }
    );
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
}
