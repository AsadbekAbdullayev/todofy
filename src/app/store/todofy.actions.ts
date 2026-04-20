import { createAction, props } from '@ngrx/store';
import { TaskItem } from './models';

export const addTask = createAction('[Tasks] Add', props<{ task: TaskItem }>());
export const updateTask = createAction('[Tasks] Update', props<{ task: TaskItem }>());
export const deleteTask = createAction('[Tasks] Delete', props<{ id: string }>());
