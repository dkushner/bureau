import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Bureau from '@/index'

describe('installing Vue plugin', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(Bureau, { store: new Vuex.Store({ }) })

  const components = Object.keys(localVue.options.components).sort()

  it('should register all components', () => {
    expect(components).toMatchSnapshot()
  })

  it('should register all components in PascalCase', () => {
    components.forEach(name => {
      expect(name).toMatch(/^(?:[A-Z][a-z]*)+$/)
    })
  })
})