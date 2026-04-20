import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideMockStore } from '@ngrx/store/testing';
import { CardComponent } from './card.component';
import { SumUzsPipe } from '../pipes/sum-uzs.pipe';
import { TaskItem } from '../store/models';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  const mockTask: TaskItem = {
    id: 't1',
    title: 'Test',
    description: 'Desc',
    priority: 'low',
    department: 'Engineering',
    billableRate: 1000,
    estimatedHours: 2,
    expenses: [],
    taxPercent: 0,
    bonus: 0,
    status: 'todo',
    dueDate: null,
    createdAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardComponent, SumUzsPipe],
      imports: [MatIconModule, MatButtonModule, MatSnackBarModule],
      providers: [
        provideMockStore(),
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => ({ subscribe: () => {} }) }) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    component.task = mockTask;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
