import { createLocalVue } from '@vue/test-utils'
import { Getter, Action, Mutation, Store } from 'vuex'
import Bureau, { BureauState } from '@/index'
import { getters as defaultGetters } from '@/state/getters'
import { mutations as defaultMutations } from '@/state/mutations'

type RootState = { [key: string]: any }

type Getters = { [key: string]: Getter<BureauState, { }> }
type Actions = { [key: string]: Action<BureauState, { }> }
type Mutations = { [key: string]: Mutation<BureauState> }

export interface Overrides { 
  getters?: Getters
  actions?: Actions
  mutations?: Mutations 
}

export function mockStore (overrides: Overrides = { }): Store<RootState> {
  const getters = { ...defaultGetters, ...overrides.getters }
  const actions = { ...overrides.actions }
  const mutations = { ...defaultMutations, ...overrides.mutations }

  return new Store({
    modules: {
      bureau: {
        namespaced: true,
        actions,
        getters,
        mutations,
        state: {
          forms: { }
        }
      }
    }
  })
}