import { instance, object } from 'valibot';

const advertisementSchema = object({
  dataProvider: object({
    iterateToDoItemPort: instance(MessagePort)
  })
});

export { advertisementSchema };
