import { expect } from 'chai';
import { createQueue } from '..';
import { QueueData, QueueError } from '../types';

describe('Queue', async () => {
  it('should create 101 functions and execute them in queue, last queue should be error', async () => {
    const queue = createQueue<string>();
    const queues: QueueData<string>[] = [];
    for (let i = 0; i < 100; i++) {
      queues.push(
        queue({
          name: '' + i,
          async handler() {
            return '' + i;
          },
        }),
      );
    }
    queues.push(
      queue({
        name: 'error',
        async handler() {
          throw Error('Error queue');
        },
      }),
    );
    for (let i = 0; i < queues.length; i++) {
      const result = await queues[i].wait;
      if (i === 100) {
        const err = result as QueueError;
        // eslint-disable-next-line no-console
        console.log(err);
        expect(err)
          .to.have.property('error')
          .to.have.property('message')
          .to.eq('Error queue');
      } else {
        if (result instanceof QueueError) {
          throw result.error;
        } else {
          // eslint-disable-next-line no-console
          console.log(result);
          expect(result.data).to.eq('' + i);
        }
      }
    }
  });
});
