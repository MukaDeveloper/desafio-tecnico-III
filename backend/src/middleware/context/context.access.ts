import { AsyncLocalStorage } from 'node:async_hooks';

export type AppContext = {
  patient: { id: string; name: string; type: string; email: string };
  url: string;
};

export class ContextAccess {
  private static als = new AsyncLocalStorage<AppContext>();

  static run<T>(ctx: AppContext, fn: () => T): T {
    return this.als.run(ctx, fn);
  }

  static get Ctx(): AppContext {
    const store = this.als.getStore();
    if (!store) {
      throw new Error(
        'AppContext não definido. Use ContextStore.run(...) para inicializar.',
      );
    }
    return store;
  }

  static get Patient(): AppContext['patient'] {
    return this.Ctx.patient;
  }

  static get Url(): string {
    return this.Ctx.url;
  }

  static get PatientName(): string {
    return this.Patient.name;
  }

  static setPatient(patient: AppContext['patient']) {
    const store = this.als.getStore();
    if (!store) {
      throw new Error(
        'AppContext não definido. Não é possível setar o usuário.',
      );
    }
    store.patient = patient;
  }
}
