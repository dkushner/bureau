import Vuex from 'vuex'
import { mount, createLocalVue, Wrapper } from '@vue/test-utils';
import { mockStore, Overrides } from '../../index'
import BureauField from '../../../src/components/BureauField'
import { BureauForm, FormProxy } from '../../../src/components/BureauForm';

const mockFormProxy = (overrides: Partial<FormProxy> = { }): FormProxy => ({
  blur: jest.fn(),
  change: jest.fn(),
  focus: jest.fn(),
  getFieldState: jest.fn(),
  registerField: jest.fn(),
  getValue: jest.fn(),
  unregisterField: jest.fn(),
  ...(overrides || { })
})

describe('BureauField', () => {

  test('registers the field to the form context', () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)

    const propsData = {
      name: 'test'
    }

    const form: FormProxy = mockFormProxy()

    const wrapper = mount(BureauField, {
      localVue,
      propsData,
      provide: { form },
      scopedSlots: {
        default: `
        <span slot-scope='props'>
          {{ props }}
        </span>
        `
      }
    })

    const span = wrapper.find('span')
    expect(span.exists()).toBeTruthy()
    expect(span.text()).toMatch(/form/)
    expect(span.text()).toMatch(/field/)
    expect(span.text()).toMatch(/listeners/)
    expect(form.registerField).toBeCalled()
  })

  test('emits when bound input changes', () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)

    const propsData = {
      name: 'test'
    }

    const form: FormProxy = mockFormProxy({
      getValue: jest.fn(name => name)
    })

    const wrapper = mount(BureauField, {
      localVue,
      propsData,
      provide: { form },
      scopedSlots: {
        default: `
        <span slot-scope="{ field, listeners }">
          <input type="text" :value="field.value" v-on="listeners" />
        </span>
        `
      }
    })

    wrapper.find('input').trigger('change')

    expect(form.change).toBeCalled()
    expect(form.change).toBeCalledWith('test', 'test')
    expect(wrapper.emitted()).toHaveProperty('change')
    expect(wrapper.emitted().change).toHaveLength(1)
  })

  test('emits when bound input is focused', () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)

    const propsData = {
      name: 'test'
    }

    const form: FormProxy = mockFormProxy()

    const wrapper = mount(BureauField, {
      localVue,
      propsData,
      provide: { form },
      scopedSlots: {
        default: `
        <span slot-scope="{ field, listeners }">
          <input type="text" :value="field.value" v-on="listeners" />
        </span>
        `
      }
    })

    wrapper.find('input').trigger('focus')

    expect(form.focus).toBeCalled()
    expect(form.focus).toBeCalledWith('test')
    expect(wrapper.emitted()).toHaveProperty('focus')
    expect(wrapper.emitted().focus).toHaveLength(1)
  })

  test('emits when bound input is modified', () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)

    const propsData = {
      name: 'test'
    }

    const form: FormProxy = mockFormProxy()

    const wrapper = mount(BureauField, {
      localVue,
      propsData,
      provide: { form },
      scopedSlots: {
        default: `
        <span slot-scope="{ field, listeners }">
          <input type="text" :value="field.value" v-on="listeners" />
        </span>
        `
      }
    })

    wrapper.find('input').trigger('input')
    expect(wrapper.emitted()).toHaveProperty('input')
    expect(wrapper.emitted().input).toHaveLength(1)
  })


  test('emits when bound input is blurred', () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)

    const propsData = {
      name: 'test'
    }

    const form: FormProxy = mockFormProxy()

    const wrapper = mount(BureauField, {
      localVue,
      propsData,
      provide: { form },
      scopedSlots: {
        default: `
        <span slot-scope="{ field, listeners }">
          <input type="text" :value="field.value" v-on="listeners" />
        </span>
        `
      }
    })

    wrapper.find('input').trigger('blur')

    expect(form.blur).toBeCalled()
    expect(form.blur).toBeCalledWith('test')
    expect(wrapper.emitted()).toHaveProperty('blur')
    expect(wrapper.emitted().blur).toHaveLength(1)
  })

  test('renders as expected', () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)

    const propsData = {
      name: 'test'
    }

    const form: FormProxy = mockFormProxy({
      getValue: jest.fn(name => name)
    })

    const wrapper = mount(BureauField, {
      localVue,
      propsData,
      provide: { form },
      scopedSlots: {
        default: `
        <span slot-scope="{ field, listeners }">
          <input type="text" :value="field.value" v-on="listeners" />
        </span>
        `
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})