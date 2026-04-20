import { createFeatureSelector, createSelector } from '@ngrx/store';
import { tasksAdapter, TasksState } from './tasks.reducer';
import { computeTaskFinancials } from './models';

export const TASKS_KEY = 'tasks';

export interface RootState {
  [TASKS_KEY]: TasksState;
}

export const selectTasksState = createFeatureSelector<TasksState>(TASKS_KEY);

const { selectAll } = tasksAdapter.getSelectors(selectTasksState);

export const selectAllTasks = selectAll;

export const selectTasksTotalGrand = createSelector(selectAllTasks, (tasks) =>
  tasks.reduce((sum, t) => sum + computeTaskFinancials(t).grand, 0)
);

export const selectTasksCountByPriority = createSelector(selectAllTasks, (tasks) => {
  const acc = { low: 0, medium: 0, high: 0 };
  for (const t of tasks) {
    acc[t.priority]++;
  }
  return acc;
});

export const selectDepartmentSpend = createSelector(selectAllTasks, (tasks) => {
  const map = new Map<string, number>();
  for (const t of tasks) {
    const grand = computeTaskFinancials(t).grand;
    map.set(t.department, (map.get(t.department) || 0) + grand);
  }
  return Array.from(map.entries())
    .map(([department, total]) => ({ department, total }))
    .sort((a, b) => b.total - a.total);
});
