import { ActionReducer } from '@ngrx/store';
import { RootState } from './selectors';

/** Bump when persisted shape changes (e.g. removed dashboard slice). */
export const TODOFY_STORAGE_KEY = 'todofy_ngrx_persist_v4';

export function localStorageMetaReducer(
  reducer: ActionReducer<RootState>
): ActionReducer<RootState> {
  return (state, action) => {
    const next = reducer(state, action);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(TODOFY_STORAGE_KEY, JSON.stringify(next));
      }
    } catch {
      /* ignore */
    }
    return next;
  };
}

export function readPersistedRootState(): RootState | undefined {
  try {
    if (typeof localStorage === 'undefined') return undefined;
    const raw = localStorage.getItem(TODOFY_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as RootState;
    if (!parsed || typeof parsed !== 'object') return undefined;
    if (!parsed.tasks || !Array.isArray(parsed.tasks.ids)) return undefined;
    return parsed;
  } catch {
    return undefined;
  }
}
