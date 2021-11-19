import { v4 as uuidv4 } from 'uuid';
import { Queue, QueueError, QueueResult } from './types';

export function createQueue<Output>(): Queue<Output> {
  let busy = false;

  const items: {
    [id: string]: { name: string; handler(callback: () => void): void };
  } = {};

  function nextItem() {
    const id = Object.keys(items)[0];
    if (id) {
      const data = items[id];
      data.handler(() => {
        delete items[id];
        nextItem();
      });
    } else {
      busy = false;
    }
  }

  return (data) => {
    const id = uuidv4();

    let resolve: (value: QueueResult<Output> | QueueError) => void;
    const promise = new Promise<QueueResult<Output> | QueueError>((res) => {
      resolve = res;
    });

    items[id] = {
      name: data.name,
      handler: (callback) => {
        data
          .handler()
          .then((value) => {
            resolve(new QueueResult<Output>(value));
            callback();
          })
          .catch((error) => {
            resolve(new QueueError(error));
            callback();
          });
      },
    };
    promise.catch((error) => {
      // eslint-disable-next-line no-console
      console.error(data.name, error);
    });
    if (!busy) {
      busy = true;
      nextItem();
    }
    return {
      wait: promise,
    };
  };
}
