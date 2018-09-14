import { Module } from 'vuex'
import { mutations } from './mutations'
import { getters } from './getters'

export interface RootState {
  [key: string]: any
}

export interface FieldState {
  active: boolean
  initial: any
  last: any | undefined
  name: string
  touched: boolean
  valid: boolean
  visited: boolean
}

export interface FormState {
  recentDirty: boolean
  errors: Record<string, string>
  initials: Record<string, any>
  invalid: boolean
  pristine: boolean
  submitting: boolean
  submitFailed: boolean
  submitSucceeded: boolean
  valid: boolean
  validating: number
  values: Record<string, any> | { }
}

export interface RootFormState {
  fields: Record<string, FieldState>
  form: FormState
}

export interface BureauState {
  forms: Record<string, RootFormState>
  version: string
}

export const state: BureauState = {
  forms: { },
  version: __BUREAU_VERSION__
}

const namespaced: boolean = true

export const bureauModule: Module<BureauState, RootState> = {
  namespaced,
  state,
  mutations,
  getters
}