import type { QueueError, QueueResult } from '.';

export interface QueueHandler<Output> {
  (): Promise<Output>;
}

export interface QueueData<Output> {
  wait: Promise<QueueError | QueueResult<Output>>;
}

export interface Queue<Output> {
  (data: { name: string; handler: QueueHandler<Output> }): QueueData<Output>;
}
