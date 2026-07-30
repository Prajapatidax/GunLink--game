import { EnemyAIState } from '@gunlink/shared';

export interface FSMTransition {
  from: EnemyAIState;
  to: EnemyAIState;
  condition: () => boolean;
}

export class EnemyFSM {
  private currentState: EnemyAIState = 'IDLE';
  private stateTimer = 0;

  constructor(initialState: EnemyAIState = 'IDLE') {
    this.currentState = initialState;
    this.stateTimer = Date.now();
  }

  getState(): EnemyAIState {
    return this.currentState;
  }

  setState(newState: EnemyAIState) {
    if (this.currentState !== newState) {
      this.currentState = newState;
      this.stateTimer = Date.now();
    }
  }

  getTimeInState(): number {
    return Date.now() - this.stateTimer;
  }
}
