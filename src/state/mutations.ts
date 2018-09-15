import * as _ from 'lodash'
import { MutationTree } from 'vuex'
import { getIn, setIn } from '../utilities'
import { BureauState, FormState, RootFormState } from './index'

export interface FormPayload { formName: string }
export type FieldPayload = FormPayload & { fieldName: string }

export type ChangePayload = FieldPayload & { value: any }
export type InitializePayload = FormPayload & { values: Record<string, any>, keepDirty: boolean }
export type RegisterFieldPayload = FieldPayload
export type UnregisterFieldPayload = FieldPayload & { destroy: boolean }
export type FocusPayload = FieldPayload
export type BlurPayload = FieldPayload

export const mutations: MutationTree<BureauState> = {
  change (state, { formName, fieldName, value }: ChangePayload) {
    const { formState, fields } = getIn(state, `forms.${formName}`)
    const fieldNames = Object.keys(fields)

    let resultForm = setIn(formState, `values.${fieldName}`, value)

    // Update field state first.
    let resultFields = setIn(fields, `${fieldName}.touched`, true)
    resultFields = setIn(resultFields, `${fieldName}.visited`, true)

    const dirty = !resultForm.pristine || _.isEqual(getIn(resultForm.values, fieldName), getIn(resultForm.initials, fieldName))
    resultFields = setIn(resultFields, `${fieldName}.dirty`, dirty)

    // Now that field is updated, check form status.
    const sanity = fieldNames.reduce((result: Record<string, any>, name: string): any => {
      const fieldDirty = _.isEqual(getIn(formState.values, name), getIn(formState.initials, name))
      const recentDirty = _.isEqual(getIn(formState.values, name), getIn(formState.lastSubmitted, name)) || undefined

      result.dirty = result.dirty || fieldDirty
      result.recentDirty = result.recentDirty || recentDirty
      result.pristine = !!result.pristine && !fieldDirty

      return result
    }, { })

    resultForm = { ...resultForm, ...sanity }
    state.forms[formName] = { form: resultForm, fields: resultFields }
  },
  initialize (state, { formName, values, keepDirty }: InitializePayload) {
    const { fields, form }: RootFormState = getIn(state, `forms.${formName}`) || {
      fields: { },
      form: {
        errors: { },
        initials: values && { ...values },
        invalid: false,
        pristine: true,
        recentDirty: false,
        submitFailed: false,
        submitSucceeded: false,
        submitting: false,
        valid: true,
        validating: 0,
        values: values ? { ...values } : { }
      }
    }

    if (!keepDirty && !_.isEmpty(values)) {
      form.values = values
    }

    Object.keys(fields).forEach(key => {
      const field = fields[key]
      field.touched = false
      field.visited = false

      if (keepDirty) {
        const pristine = _.isEqual(_.get(form.values, key), _.get(form.initials, key))

        if (pristine) {
          form.values = setIn(form.values, key, getIn(values, key))
        }
      }
    })

    form.initials = values
    
    const result = setIn(state.forms, formName, { form, fields })
    state.forms = result
  },
  registerField (state, { formName, fieldName }: RegisterFieldPayload) {
    const { fields, form } = getIn(state, `forms.${formName}`)
    const fieldState = getIn(fields, fieldName)

    if (!fieldState) {
      const initial = form.initials ?
        getIn(form.initials, fieldName) : undefined

      state.forms[formName].fields = setIn(fields, fieldName, {
        active: false,
        initial,
        last: undefined,
        name,
        touched: false,
        valid: true,
        visited: false
      })
    }
  },
  unregisterField (state, { formName, fieldName, destroy }: UnregisterFieldPayload) {
    const { fields, form }: RootFormState = getIn(state, `forms.${formName}`)

    const resultFields = { ...(_.omit(fields, fieldName)) }
    const resultForm: FormState = {
      ...form,
      errors: setIn(form.errors, fieldName, undefined) || { },
      values: destroy ? (setIn(form.values, fieldName, undefined) || { }) : form.values
    }

    state.forms[formName] = { fields: resultFields, form: resultForm }
  },
  focus (state, { formName, fieldName }: FocusPayload) {
    let { fields } = getIn(state, `forms.${formName}`)

    fields = setIn(fields, `${fieldName}.active`, true)
    fields = setIn(fields, `${fieldName}.visited`, true)

    state.forms = setIn(state.forms, `${formName}.fields`, fields)
  },
  blur (state, { formName, fieldName }: BlurPayload) {
    let { fields } = getIn(state, `forms.${formName}`)
    fields = setIn(fields, `${fieldName}.active`, false)
    state.forms = setIn(state.forms, `${formName}.fields`, fields)
  }
}