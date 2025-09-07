import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalFormComponent } from '../modal-form/modal-form.component';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() task: any;
  loading = false;

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  onEdit(task: any): void {
    this.dialog.open(ModalFormComponent, {
      data: {
        title: task?.author,
        description: task?.title,
        id: task?._id,
        publishYear: task?.publishYear,
      },
    });
  }

  onDelete(id: string): void {
    this.loading = true;
    this.apiService.deleteData(`books/${id}`).subscribe({
      next: () => {
        this.showSnack('Task deleted successfully');
        this.loading = false;
        this.getData();
      },
      error: () => {
        this.loading = false;
        this.showSnack('An error occurred while deleting the task.');
      },
    });
  }

  private getData(): void {
    this.apiService.loading = true;
    this.apiService.getData().subscribe({
      next: (response) => {
        this.apiService.task_data = response.data;
        this.apiService.loading = false;
      },
      error: (error) => {
        this.apiService.loading = false;
        this.showSnack('An error occurred. Please try again.');
        console.error(error);
      },
    });
  }

  private showSnack(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
