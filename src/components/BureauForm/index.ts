import { FieldState } from '../../state';
import BureauForm from './BureauForm'

export interface FormProxy {
  registerField (fieldName: string, validators: any[]): void
  unregisterField (fieldName: string): void
  change (fieldName: string, value: any): void
  focus (fieldName: string): void
  blur (fieldName: string): void
  getFieldState (fieldName: string): FieldState
  getValue (fieldName: string): any
}

export { BureauForm }
export default BureauForm