import type { QueueError, QueueResult } from '.';

export interface QueueHandler<Output> {
  (): Promise<Output>;
}

export interface QueueData<Output> {
  wait: Promise<QueueError | QueueResult<Output>>;
  stop: () => void;
}

export interface Queue<Output> {
  (data: {
    name: string;
    priority?: boolean;
    handler: QueueHandler<Output>;
  }): QueueData<Output>;
}
