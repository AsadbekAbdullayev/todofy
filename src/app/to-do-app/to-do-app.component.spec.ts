import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { provideMockStore } from '@ngrx/store/testing';
import { SumUzsPipe } from '../pipes/sum-uzs.pipe';
import { ToDoAppComponent } from './to-do-app.component';

@Component({ selector: 'app-card', template: '', standalone: false })
class StubCardComponent {}

@Component({ selector: 'app-budget-charts', template: '', standalone: false })
class StubChartsComponent {}

describe('ToDoAppComponent', () => {
  let component: ToDoAppComponent;
  let fixture: ComponentFixture<ToDoAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ToDoAppComponent,
        StubCardComponent,
        StubChartsComponent,
        SumUzsPipe,
      ],
      imports: [
        NoopAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
      ],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(ToDoAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
