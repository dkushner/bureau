import Vue, { PluginFunction, VNode, VueConstructor } from 'vue'
import { Store } from 'vuex'
import BureauForm from './components/BureauForm'
import { bureauModule, RootState } from './state'
import { error } from './utilities/logging'

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
    type Element = VNode
    type ElementClass = Vue
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}

export interface BureauPlugin {
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

export const Bureau: BureauPlugin = {
  install (vue: VueConstructor, args?: BureauPluginOptions): void { 
    const options = { 
      store: undefined,
      ...args 
    }

    if (!options.store) {
      error('Bureau requires a Vuex store instance to be passed in the plugin options.')
      return
    }

    vue.component('BureauForm', BureauForm)

    options.store.registerModule('bureau', bureauModule, {
      preserveState: Boolean(options.store.state.bureau)
    })

    vue.prototype.$bureau = {
      version: __BUREAU_VERSION__
    }
  },
  version: __BUREAU_VERSION__
}

