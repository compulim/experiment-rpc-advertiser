import { forGenerator } from 'message-port-rpc';
import { RespondableEvent } from 'respondable-event';
import { safeParse } from 'valibot';
import { advertisementSchema } from './advertisementSchema';

class ProductList extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.dispatchEvent(
      new RespondableEvent('discover', data => {
        const advertisementResult = safeParse(advertisementSchema, data);

        if (!advertisementResult.success) {
          return;
        }

        const { output: advertisement } = advertisementResult;

        const listElement = document.createElement('ul');

        this.shadowRoot?.append(listElement);

        const iterateState = forGenerator<() => Iterator<{ readonly text: string }>>(
          advertisement.dataProvider.iterateToDoItemPort
        );

        (async () => {
          // TODO: Need to fix bad type inference.
          const iterator = iterateState() as AsyncIterableIterator<{ readonly text: string }>;

          for await (const product of iterator) {
            const itemElement = document.createElement('li');

            itemElement.textContent = product.text;
            listElement.appendChild(itemElement);
          }
        })();
      })
    );
  }
}

customElements.define('product-list', ProductList);
