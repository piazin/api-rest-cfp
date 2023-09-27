export type Either<F, S> = Failed<F, S> | Success<F, S>;

class Failed<F, S> {
  readonly value: F;

  constructor(value: F) {
    this.value = value;
  }

  isFailed(): this is Failed<F, S> {
    return true;
  }

  isSuccess(): this is Success<F, S> {
    return false;
  }
}

class Success<F, S> {
  readonly value: S;

  constructor(value: S) {
    this.value = value;
  }

  isFailed(): this is Failed<F, S> {
    return false;
  }

  isSuccess(): this is Success<F, S> {
    return true;
  }
}

export const failed = <F, S>(l: F): Either<F, S> => {
  return new Failed(l);
};

export const success = <F, S>(r: S): Either<F, S> => {
  return new Success(r);
};
