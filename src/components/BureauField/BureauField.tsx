import { Component, Vue, Prop, Inject, Watch } from "vue-property-decorator";
import { FormProxy } from '../BureauForm'
import { CreateElement, VNode } from "vue";

@Component
export default class BureauField extends Vue {
  @Prop({ type: String, required: true }) name!: string
  @Prop([Array, Function]) validate!: []
  @Prop(Function) normalize!: any
  @Prop(Function) format!: any

  @Inject('form') form!: FormProxy

  get inputListeners() {
    const instance = this

    return Object.assign({ }, this.$listeners, {
      input (event) {
        instance.$emit('input', event)
      },
      change (event) {
        let value = event.target.value

        if (instance.normalize) {
          value = instance.normalize(instance.name, value)
        }

        instance.form.change(instance.name, value)
        instance.$emit('change', event)
      },
      focus (event) {
        instance.form.focus(instance.name)
        instance.$emit('focus', event)
      },
      blur (event) {
        instance.form.blur(instance.name)
        instance.$emit('blur', event)
      }
    })
  }

  get active() {
    const field = this.form.getFieldState(this.name)
    return field ? field.active : false
  }

  get value() {
    return this.form.getValue(this.name)
  }

  @Watch('name')
  onNameChanged (newValue: string, oldValue: string) {
    this.form.unregisterField(this.name)
    this.form.registerField(this.name, this.validate)
  }

  mounted () {
    this.form.registerField(this.name, this.validate)
  }

  beforeDestroy () {
    this.form.unregisterField(this.name)
  }

  render (h: CreateElement): VNode {
    const bindings = {
      props: {
        field: {
          value: this.value
        },
        listeners: this.inputListeners,
        form: this.form
      }
    }
    
    return (
      <slot { ...bindings }></slot>
    )
  }
}