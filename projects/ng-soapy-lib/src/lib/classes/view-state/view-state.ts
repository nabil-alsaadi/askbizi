import { BehaviorSubject, Observable, of, pipe, switchMap } from 'rxjs';
import { ViewState } from './view-state.interface';

export class ViewStateSubject<
  State extends ViewState
> extends BehaviorSubject<State> {
  constructor(initialState: State) {
    super(initialState);
  }

  get pipes() {
    return {
      set: <Source, StateKeys extends keyof State>(subState: {
        [StateKey in StateKeys]: State[StateKey];
      }) => {
        return pipe<Observable<Source>, Observable<Source>>(
          switchMap((source) => {
            this.next({ ...this.value, ...subState });
            return of(source);
          })
        );
      },
      setLoading: <Source>() => {
        return this.pipes.set<Source, 'loading'>({ loading: true });
      },
      resetLoading: <Source>() => {
        return this.pipes.set<Source, 'loading'>({ loading: false });
      },
      setError: <Source>(errorMessage: string) => {
        return this.pipes.set<Source, 'error'>({ error: errorMessage });
      },
      resetError: <Source>() => {
        return this.pipes.set<Source, 'error'>({ error: '' });
      }
    };
  }

  public set<StateKeys extends keyof State>(subState: {
    [StateKey in StateKeys]: State[StateKey];
  }) {
    this.next({ ...this.value, ...subState });
  }

  public setLoading() {
    this.set({ loading: true });
  }

  public resetLoading() {
    this.set({ loading: false });
  }

  public setError(errorMessage: string) {
    this.set({ error: errorMessage });
  }

  public resetError() {
    this.set({ error: '' });
  }
}
