class Deferred<T> {
  public promise: Promise<T>;

  public pending: boolean;

  private res?: (value: T) => void;

  private rej?: (reason: any) => void;

  constructor() {
    this.pending = true;
    this.promise = new Promise<T>((resolve, reject) => {
      this.res = resolve;
      this.rej = reject;
    });
  }

  resolve(value: T) {
    this.pending = false;
    return this.res!(value);
  }

  reject(reason: any) {
    this.pending = false;
    return this.rej!(reason);
  }
}

export default Deferred;
