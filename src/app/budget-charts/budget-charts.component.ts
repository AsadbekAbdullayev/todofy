import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  selectAllTasks,
  selectDepartmentSpend,
  selectTasksCountByPriority,
} from '../store/selectors';

Chart.register(...registerables);

@Component({
  selector: 'app-budget-charts',
  standalone: false,
  templateUrl: './budget-charts.component.html',
  styleUrls: ['./budget-charts.component.scss'],
})
export class BudgetChartsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('priorityCanvas') priorityCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('departmentCanvas') departmentCanvas!: ElementRef<HTMLCanvasElement>;

  private destroy$ = new Subject<void>();
  private priorityChart: Chart | null = null;
  private departmentChart: Chart | null = null;

  constructor(private store: Store) {}

  ngAfterViewInit(): void {
    combineLatest([
      this.store.select(selectTasksCountByPriority),
      this.store.select(selectDepartmentSpend),
      this.store.select(selectAllTasks),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([prio, deptSpend, tasks]) => {
        this.renderPriority(prio);
        this.renderDepartments(deptSpend, tasks.length === 0);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.priorityChart?.destroy();
    this.departmentChart?.destroy();
  }

  private renderPriority(prio: { low: number; medium: number; high: number }): void {
    const canvas = this.priorityCanvas?.nativeElement;
    if (!canvas) return;
    this.priorityChart?.destroy();
    const cfg: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: ['High', 'Medium', 'Low'],
        datasets: [
          {
            data: [prio.high, prio.medium, prio.low],
            backgroundColor: ['#f43f5e', '#f59e0b', '#22c55e'],
            borderWidth: 0,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#e2e8f0', boxWidth: 10 } },
          title: {
            display: true,
            text: 'Priority mix',
            color: '#f8fafc',
            font: { size: 13, weight: 'bold' },
          },
        },
      },
    };
    this.priorityChart = new Chart(canvas, cfg);
  }

  private renderDepartments(
    deptSpend: { department: string; total: number }[],
    empty: boolean
  ): void {
    const canvas = this.departmentCanvas?.nativeElement;
    if (!canvas) return;
    this.departmentChart?.destroy();
    const labels = empty ? ['No data'] : deptSpend.map((d) => d.department);
    const values = empty ? [0] : deptSpend.map((d) => d.total);
    const cfg: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Portfolio (UZS)',
            data: values,
            backgroundColor: '#38bdf8',
            borderRadius: 6,
            maxBarThickness: 36,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: { color: '#94a3b8', maxRotation: 35, minRotation: 0 },
            grid: { color: 'rgba(148,163,184,0.12)' },
          },
          y: {
            ticks: {
              color: '#94a3b8',
              callback: (v) => Number(v) / 1_000_000 + 'M',
            },
            grid: { color: 'rgba(148,163,184,0.12)' },
          },
        },
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Spend by department',
            color: '#f8fafc',
            font: { size: 13, weight: 'bold' },
          },
        },
      },
    };
    this.departmentChart = new Chart(canvas, cfg);
  }
}
