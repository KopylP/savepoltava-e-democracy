import { PersistentVector } from 'near-sdk-as';

@nearBindgen
export class PersistentList<T> {
  private _vector: PersistentVector<T>;

  constructor(prefix: string) {
    this._vector = new PersistentVector<T>("_vector_in_list" + prefix);
  }

  get size(): i32 {
    return this._vector.length;
  }

  add(item: T): void {
    this._vector.push(item);
  }

  replace(index: i32, item: T) {
      this._vector.replace(index, item);
  }

  clear(): void {
    while (this._vector.length > 0) {
      this._vector.popBack();
    }
  }

  delete(predicate: (element: T, index: number, array?: T[] | undefined) => bool): void {
    const index = this.values().findIndex(predicate);
    if (index !== -1) {
        this._vector.swap_remove(index);
    }
  }

  /**
   *
   * @returns
   */
  values(): T[] {
    let values: T[] = new Array<T>();

    for (let i = 0; i < this._vector.length; i++) {
      const item = this._vector[i];
      values.push(item);
    }

    return values;
  }
}