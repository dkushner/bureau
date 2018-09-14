import Vue, { VueConstructor, VNode, PluginFunction } from 'vue'
import BureauForm from './components/BureauForm';
import { Store } from 'vuex'
import { error } from './utilities/logging';
import { bureauModule, RootState } from './state';

declare global {
  interface Window {
    Vue: VueConstructor
  }

  interface HTMLCollection {
    [Symbol.iterator](): IterableIterator<Element>
  }

  interface Element {
    getElementsByClassName(classNames: string): NodeListOf<HTMLElement>
  }

  export const __BUREAU_VERSION__: string

  namespace JSX {
    interface Element extends VNode { }
    interface ElementClass extends Vue { }
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}

export interface Bureau {
  install: PluginFunction<BureauPluginOptions>
  version: string
}

export interface BureauPluginOptions {
  store: Store<RootState>
}

export interface BureauObject extends Vue { 
  version: string
}

declare module 'vue/types/vue' {
  export interface Vue {
    $bureau: BureauObject
  }

  interface VueConstructor<
    V extends Vue = Vue,
    Options = Record<string, any>
  > {
    version: string
    options: Options
  }
}

const Bureau: Bureau = {
  install (Vue: VueConstructor, args?: BureauPluginOptions): void { 
    const options = { 
      store: undefined,
      ...args 
    }

    if (!options.store) {
      error('Bureau requires a Vuex store instance to be passed in the plugin options.')
      return
    }

    Vue.component('BureauForm', BureauForm)

    console.log(Boolean(options.store.state['bureau']))
    options.store.registerModule('bureau', bureauModule, {
      preserveState: Boolean(options.store.state['bureau'])
    })

    Vue.prototype.$bureau = {
      version: __BUREAU_VERSION__
    } as BureauObject
  },
  version: __BUREAU_VERSION__
}

export default Bureau