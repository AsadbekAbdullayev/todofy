import { ActionReducerMap } from '@ngrx/store';
import { initialTasksState, tasksAdapter, tasksReducer } from './tasks.reducer';
import { RootState, TASKS_KEY } from './selectors';
import { readPersistedRootState } from './local-storage.metareducer';
import { TaskItem } from './models';

function seedDemoTasks(): TaskItem[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'seed-task-hr-1',
      title: 'Executive hiring runway',
      description: 'Model recruiter capacity vs funnel for Q3 leadership roles.',
      priority: 'high',
      department: 'People & Culture',
      billableRate: 420_000,
      estimatedHours: 36,
      expenses: [
        { id: 'seed-exp-1', label: 'Assessment vendor', amount: 18_500_000 },
        { id: 'seed-exp-2', label: 'Relocation pool', amount: 9_200_000 },
      ],
      taxPercent: 12,
      bonus: 4_000_000,
      status: 'in_progress',
      dueDate: null,
      createdAt: now,
    },
    {
      id: 'seed-task-eng-1',
      title: 'Platform reliability OKRs',
      description: 'SLO burn-down, error budgets, and incident taxonomy refresh.',
      priority: 'medium',
      department: 'Engineering',
      billableRate: 310_000,
      estimatedHours: 120,
      expenses: [{ id: 'seed-exp-3', label: 'Observability uplift', amount: 55_000_000 }],
      taxPercent: 12,
      bonus: 0,
      status: 'todo',
      dueDate: null,
      createdAt: now,
    },
  ];
}

export const reducers: ActionReducerMap<RootState> = {
  [TASKS_KEY]: tasksReducer,
};

export function buildInitialRootState(): RootState {
  const saved = readPersistedRootState();
  if (saved) {
    return {
      tasks: {
        ...initialTasksState,
        ...saved.tasks,
        ids: Array.isArray(saved.tasks.ids)
          ? (saved.tasks.ids as string[]).map(String)
          : [],
        entities: { ...saved.tasks.entities },
      },
    };
  }
  return {
    tasks: tasksAdapter.addMany(seedDemoTasks(), initialTasksState),
  };
}
