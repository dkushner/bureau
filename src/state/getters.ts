import { GetterTree } from 'vuex'
import { BureauState, FieldState, RootFormState, RootState } from './index'

export const getters: GetterTree<BureauState, RootState> = {
  getRegisteredForms(state): Record<string, RootFormState> {
    return state.forms
  },

  getForm(state): (form: string) => RootFormState {
    return (form: string) => state.forms[form]
  },

  getFormFields(state, { getForm }): (form: string) => Record<string, FieldState> {
    return form => getForm(form).fields
  },

  getFormField(state, { getFormFields }): (form: string, field: string) => FieldState {
    return (form, field) => getFormFields(form)[field]
  },

  getFormValues(state, { getForm }): (form: string) => Record<string, any> {
    return form => getForm(form).formState.values
  },
}
