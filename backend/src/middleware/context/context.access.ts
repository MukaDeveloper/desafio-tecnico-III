import { AsyncLocalStorage } from 'node:async_hooks';

export type AppContext = {
  user: { id: string; name: string; type: string; email: string };
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
        'AppContext não definido. Use ContextAccess.run(...) para inicializar.',
      );
    }
    return store;
  }

  static get user(): AppContext['user'] {
    return this.Ctx.user;
  }

  static get url(): string {
    return this.Ctx.url;
  }

  static get userName(): string {
    return this.user.name;
  }

  static setUser(user: AppContext['user']) {
    const store = this.als.getStore();
    if (!store) {
      throw new Error(
        'AppContext não definido. Não é possível setar o usuário.',
      );
    }
    store.user = user;
  }
}
