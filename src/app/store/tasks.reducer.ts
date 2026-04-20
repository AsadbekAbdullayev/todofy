import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { TaskItem } from './models';
import * as Actions from './todofy.actions';

export const tasksAdapter = createEntityAdapter<TaskItem>({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

export type TasksState = EntityState<TaskItem>;

export const initialTasksState: TasksState = tasksAdapter.getInitialState();

export const tasksReducer = createReducer(
  initialTasksState,
  on(Actions.addTask, (state, { task }) => tasksAdapter.addOne(task, state)),
  on(Actions.updateTask, (state, { task }) => tasksAdapter.updateOne({ id: task.id, changes: task }, state)),
  on(Actions.deleteTask, (state, { id }) => tasksAdapter.removeOne(id, state))
);
