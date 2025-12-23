import { forGenerator } from 'message-port-rpc';
import { RespondableEvent } from 'respondable-event';
import { parse } from 'valibot';
import { advertisementSchema } from './advertisementSchema';

class DataProvider extends HTMLElement {
  constructor() {
    super();

    const iterateToDoItemMessageChannel = new MessageChannel();

    const iterateToDoItem = (): Iterator<{ readonly text: string }> =>
      (function* () {
        yield { text: 'Buy eggs' };
      })();

    forGenerator(iterateToDoItemMessageChannel.port1, iterateToDoItem);

    this.iterateToDoItemPort = iterateToDoItemMessageChannel.port2;
  }

  iterateToDoItemPort: MessagePort;

  connectedCallback() {
    this.addEventListener(
      'discover',
      event => {
        if (!(event instanceof RespondableEvent)) {
          return;
        }

        event.stopPropagation();

        // TODO: Not sure how to have multiple provider up the DOM tree.
        //       If not possible, maybe we need to have a more specific event.
        event.respondWith(
          parse(advertisementSchema, { dataProvider: { iterateToDoItemPort: this.iterateToDoItemPort } })
        );
      },
      { capture: true } // Only available in capture phase.
    );
  }
}

customElements.define('data-provider', DataProvider);
