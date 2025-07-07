import { AForm, AFormItem, AInput, ASelect, AInputNumber, LineOutlined, ASwitch, ATextarea, ARadioGroup, AButton, AInputPassword } from '#components'

export type FormItemType = {
  label: string,
  key: string | string[],
  value: any,
  is: string | ((formData: any) => VNode),
  bind: any,
  rules: any[],
  show?: boolean
}

export type FormPropsType = {
  form: FormItemType[],
  submit: (formData: any) => void,
  showSubmit?: boolean,
  defaultFormData?: Record<string, any>
}

export class Form {
  static FormComs: Record<string, (form: any, item: FormItemType) => VNode> = {
    input: (form, item) => <AInput v-model:value={form[item.key as string]} />,
    password: (form, item) => <AInputPassword v-model:value={form[item.key as string]} />,
    button: (form, item) => <AButton {...item.bind}>{item.bind?.content}</AButton>,
    textarea: (form, item) => <ATextarea v-model:value={form[item.key as string]} />,
    inputNumber: (form, item) => <AInputNumber v-model:value={form[item.key as string]} {...item.bind} />,
    inputNumberRange: (form, item) => (
      <div class="flex items-center gap-2">
        <AInputNumber class="flex-1" v-model:value={form[item.key[0] as string]} {...item.bind[0]} />
        <LineOutlined />
        <AInputNumber class="flex-1" v-model:value={form[item.key[1] as string]} {...item.bind[1]} />
      </div>
    ),
    select: (form, item) => <ASelect v-model:value={form[item.key as string]} options={item.bind.options} />,
    switch: (form, item) => <ASwitch v-model:checked={form[item.key as string]} {...item.bind} />,
    radio: (form, item) => <ARadioGroup v-model:value={form[item.key as string]} {...item.bind} />
  }

  static addFormCom(name: string, comp: (form: any, item: FormItemType) => VNode) {
    Form.FormComs[name] = comp
  }

  static createComponent() {
    return defineComponent({
      props: {
        form: {
          type: Array as () => FormPropsType['form'],
          required: true
        },
        submit: {
          type: Function as unknown as () => FormPropsType['submit'],
          required: true
        },
        showSubmit: {
          type: Boolean,
          default: true
        },
        defaultFormData: {
          type: Object,
          default: () => ({})
        }
      },
      setup(props, { expose }) {
        const { t: $t } = useI18n()
        const thisRef = ref()
        const formData = ref<Record<string, any>>({ ...props.defaultFormData })
        const rules = ref<Record<string, any>>({})

        props.form.forEach(item => {
          if (item.key == null) return
          if (Array.isArray(item.key)) {
            item.key.forEach((key, idx) => {
              formData.value[key] = item.value?.[idx] ?? ''
              rules.value[key] = item.rules ?? []
            })
          } else {
            formData.value[item.key] = item.value ?? ''
            rules.value[item.key] = item.rules ?? []
          }
        })

        const loading = ref(false)

        const submit = async () => {
          if (loading.value) throw new Error('loading')
          loading.value = true
          try {
            await thisRef.value.validate()
            await props.submit(formData.value)
          } finally {
            loading.value = false
          }
        }

        expose({ submit, loading })

        return () => (
          <AForm
            ref={thisRef}
            model={formData.value}
            rules={rules.value}
            label-col={{ span: 8 }}
            wrapper-col={{ span: 16 }}
          >
            {ADParse(props.form,formData.value).map(item => {
              const node =
                typeof item.is === 'function'
                  ? item.is(formData.value)
                  : Form.FormComs[item.is]?.(formData.value, item)

              if (item.label == null) return node

              return (
                <AFormItem
                  key={Array.isArray(item.key) ? item.key.join(',') : item.key}
                  name={item.key}
                  {...item.bind}
                  class={{ hidden: item.show === false }}
                  v-slots={{
                    label: () => <span class="whitespace-break-spaces">{$t(item.label)}</span>
                  }}
                >
                  {node}
                </AFormItem>
              )
            })}
          </AForm>
        )
      }
    })
  }
}


export default Form.createComponent()
