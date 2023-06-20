import { Connector, WidgetRenderState } from 'instantsearch.js';
import { noop } from 'instantsearch.js/es/lib/utils';
import { useConnector } from 'react-instantsearch-hooks-web';

import { VIRTUAL_TOGGLE_FILTERS } from '@sorare/core/src/lib/filters';

export type VirtualToggleConnectorParams = {
  name: string;
};

export type VirtualToggleRenderState<T> = {
  toggle(v?: T): void;
  currentRefinement: T;
};

export type VirtualToggleWidgetDescription<T> = {
  $$type: 'sorare.toggle';
  renderState: VirtualToggleRenderState<T>;
  indexRenderState: {
    virtualToggle: {
      [name: string]: WidgetRenderState<
        VirtualToggleRenderState<T>,
        VirtualToggleConnectorParams
      >;
    };
  };
  indexUiState: {
    virtualToggle: {
      [name: string]: T;
    };
  };
};

export type VirtualToggleConnector<T> = Connector<
  VirtualToggleWidgetDescription<T>,
  VirtualToggleConnectorParams
>;

const states: {
  [name: string]: any;
} = {};

export const clearAll = () => {
  Object.keys(states)
    .filter(k => {
      const filter = Object.values(VIRTUAL_TOGGLE_FILTERS).find(
        ({ name }) => name === k
      )!;
      return !('skipClear' in filter) || !filter?.skipClear;
    })
    .forEach(k => delete states[k]);
};

function connectVirtualToggle<T>(
  renderFn: any,
  unmountFn = noop
): ReturnType<VirtualToggleConnector<T>> {
  return widgetParams => {
    const { name } = widgetParams || {};

    return {
      $$type: 'sorare.toggle',

      init(initOptions) {
        const { instantSearchInstance, uiState } = initOptions;
        const indexState = uiState[instantSearchInstance.indexName] || {};

        const v: any = (indexState as any).virtualToggle?.[name];
        states[name] = v === 'true' ? true : v;

        renderFn(
          {
            ...this.getWidgetRenderState(initOptions),
            instantSearchInstance,
          },
          true
        );
      },

      render(renderOptions) {
        const { instantSearchInstance } = renderOptions;

        renderFn(
          {
            ...this.getWidgetRenderState(renderOptions),
            instantSearchInstance,
          },
          false
        );
      },

      dispose({ state: s }) {
        unmountFn();

        delete states[name];

        return s;
      },

      getWidgetUiState(uiState) {
        if (!states[name]) {
          return uiState;
        }

        return {
          ...uiState,
          virtualToggle: {
            ...uiState.virtualToggle,
            [name]: states[name],
          },
        };
      },

      getWidgetSearchParameters(searchParameters) {
        return searchParameters;
      },

      getWidgetRenderState({ helper }) {
        return {
          toggle: (v?: T) => {
            if (v === undefined || v !== states[name]) {
              if (v === undefined) {
                states[name] = !states[name];
              } else {
                states[name] = v;
              }
              helper.search();
            }
          },
          currentRefinement: states[name],
          widgetParams,
        };
      },

      getRenderState(renderState, renderOptions) {
        return {
          ...renderState,
          virtualToggle: {
            ...renderState.virtualToggle,
            [name]: this.getWidgetRenderState(renderOptions),
          },
        };
      },
    };
  };
}

function useVirtualToggle<T>(props: VirtualToggleConnectorParams) {
  return useConnector<
    VirtualToggleConnectorParams,
    VirtualToggleWidgetDescription<T>
  >(connectVirtualToggle as any, props);
}

export default useVirtualToggle;
