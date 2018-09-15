import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Bureau from '@/index'
import BureauForm from '@/components/BureauForm'
import { mockStore, Overrides } from '../../index'

describe('BureauForm', () => {
  
  test('calls provided submit handler on submit', () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)

    const store = mockStore()

    const propsData = {
      name: 'test',
      onSubmit: jest.fn()
    }

    const wrapper = mount(BureauForm, { 
      localVue, 
      store,
      propsData
    })

    const form = wrapper.find('form')
    form.trigger('submit')

    expect(propsData.onSubmit).toBeCalled()
  })

  test('registers form state on creation', () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)

    const mutations = {
      initialize: jest.fn()
    }

    const store = mockStore({ mutations })

    const propsData = {
      name: 'test'
    }

    const wrapper = mount(BureauForm, {
      localVue,
      store,
      propsData
    })

    expect(mutations.initialize).toBeCalled()
    expect(store.state).toHaveProperty('bureau.forms')
  })

  test('renders as expected', () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)

    const store = mockStore()

    const propsData = {
      name: 'test'
    }

    const wrapper = mount(BureauForm, {
      localVue,
      store,
      propsData
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})