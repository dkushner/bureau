import { Component, Vue, Prop, Provide } from 'vue-property-decorator'
import { VNode, CreateElement } from 'vue'
import { namespace } from 'vuex-class'
import { FormProxy } from './index'

const Bureau = namespace('bureau')

@Component
export default class BureauForm extends Vue {
  @Prop({ type: String, required: true }) name!: string
  @Prop([Array, Function]) validate!: []
  @Prop(Function) onSubmit!: () => void
  @Prop(Boolean) eagerDestroy: boolean = false
  @Prop(Boolean) keepDirty: boolean = false
  @Prop(Object) initialValues!: { [key: string]: any }

  @Bureau.Getter getRegisteredForms!: any
  @Bureau.Getter getForm!: any
  @Bureau.Getter getFormFields!: any
  @Bureau.Getter getFormField!: any
  @Bureau.Getter getFormValues!: any
  @Bureau.Mutation change!: any
  @Bureau.Mutation initialize!: any
  @Bureau.Mutation registerField!: any
  @Bureau.Mutation unregisterField!: any
  @Bureau.Mutation focus!: any
  @Bureau.Mutation blur!: any

  @Provide()
  form: FormProxy = {
    registerField: (fieldName, validators) => {
      this.registerField({ formName: this.name, fieldName })

      if (validators) {
        this.validators[fieldName] = validators
      }
    },
    unregisterField: (fieldName: string) => {
      delete this.validators[fieldName]
      this.unregisterField({ 
        formName: this.name, 
        fieldName, 
        destroy: this.eagerDestroy 
      })
    },
    change: (fieldName: string, value: any) => {
      this.change({ formName: this.name, fieldName, value })
    },
    focus: (fieldName: string) => {
      this.focus({ formName: this.name, fieldName })
    },
    blur: (fieldName: string) => {
      this.blur({ formName: this.name, fieldName })
    },
    getFieldState: (fieldName: string) => {
      return this.getFormField(this.name, fieldName)
    },
    getValue: (fieldName: string) => {
      return this.getFormValues(this.name)[fieldName]
    }
  }

  validators: { [key: string]: any } = { }

  handleSubmit () {
    this.onSubmit()
  }

  created () {
    this.initialize({
      formName: this.name,
      values: this.initialValues,
      keepDirty: this.keepDirty
    })
  }

  render (h: CreateElement): VNode {
    const bindings = {
      on: {
        submit: this.handleSubmit
      }
    }

    return (
      <form { ...bindings }>
        { this.$slots.default }
      </form>
    )
  }
 }