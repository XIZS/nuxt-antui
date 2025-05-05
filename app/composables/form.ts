// import type { FormItemType } from "../components/global/Form";
// import { AForm, AFormItem, AInput, ASelect, AInputNumber, LineOutlined, ASwitch, ATextarea, ARadio } from "#components"

// export const FormComs = {
//     input: (form: any, item: FormItemType) =>
//         h(AInput, {
//             value: form[item.key as string],
//             'onUpdate:value': (val: any) => (form[item.key as string] = val)
//         }),

//     textarea: (form: any, item: FormItemType) =>
//         h(ATextarea, {
//             value: form[item.key as string],
//             'onUpdate:value': (val: any) => (form[item.key as string] = val)
//         }),

//     inputNumber: (form: any, item: FormItemType) =>
//         h(AInputNumber, {
//             ...item.bind,
//             value: form[item.key as string],
//             'onUpdate:value': (val: any) => (form[item.key as string] = val)
//         }),

//     inputNumberRange: (form: any, item: FormItemType) =>
//         h(
//             'div',
//             { class: 'flex items-center gap-2' },
//             [
//                 h(AInputNumber, {
//                     class: 'flex-1',
//                     ...item.bind[0],
//                     value: form[item.key[0] as string],
//                     'onUpdate:value': (val: any) => (form[item.key[0] as string] = val)
//                 }),
//                 h(LineOutlined),
//                 h(AInputNumber, {
//                     class: 'flex-1',
//                     ...item.bind[1],
//                     value: form[item.key[1] as string],
//                     'onUpdate:value': (val: any) => (form[item.key[1] as string] = val)
//                 })
//             ]
//         ),

//     select: (form: any, item: FormItemType) =>
//         h(ASelect, {
//             value: form[item.key as string],
//             options: item.bind.options,
//             'onUpdate:value': (val: any) => (form[item.key as string] = val)
//         }),

//     countrySelect: (form: any, item: FormItemType) =>
//         h(ASelect, {
//             value: form[item.key as string],
//             options: Const.CountrySelectList(),
//             'onUpdate:value': (val: any) => (form[item.key as string] = val)
//         }),

//     switch: (form: any, item: FormItemType) =>
//         h(ASwitch, {
//             ...item.bind,
//             checked: form[item.key as string],
//             'onUpdate:checked': (val: any) => (form[item.key as string] = val)
//         }),

//     radio: (form: any, item: FormItemType) =>
//         h(ARadio, {
//             ...item.bind,
//             checked: form[item.key as string],
//             'onUpdate:checked': (val: any) => (form[item.key as string] = val)
//         }),

//     // upload: (form: any, item: FormItemType) =>
//     //   h(UploadImg, {
//     //     ...item.bind
//     //   })
// }