import { ACard, ADropdown, AMenu, EllipsisOutlined } from "#components";
import type { TablePropsType } from "../components/global/FormTable";
import  FormTableCom from "../components/global/FormTable";


export const FormTable = (props:TablePropsType)=>{

    const attribute = reactive({
        selectItems:[],
        selectKeys:[],
        page:1,
        pageSize:10
    })

    return {
        com:h(FormTableCom,{...props,attribute}),
        
    }
}

export const TablePage = (props:TablePropsType)=>{
    let TableParams =  FormTable(props)

    return {
        com: h(ACard,{class:"absolute top-0 left-0 right-0 bottom-0 h-full",bodyStyle:"height:100%"},TableParams.com)
    }
}

export const TableCell = {
    Dropdown:(params:{label:string,icon:string,onClick:()=>void}[])=>{
        // return h(EllipsisOutlined,{class:"mr-2"},{default:()=>{
        //     return h()
        // }})

        return h('div',{style:{'min-width':'50px'}},h(ADropdown,{},{
            default:()=>{
                return h(EllipsisOutlined,{class:"mr-2"})
            },
            overlay:()=>{
                return h(AMenu,{items:params.map(item=>{
                    return {
                        label:item.label,
                        icon:()=>item.icon,
                        onClick:item.onClick
                    }
                })})
            }
        }))
    },
    Tenant:(params:{name:string,id:string})=>{
        return h('div',{class:"flex flex-col"},[
            h('span',{class:"mr-2"},params.name),
            h('span',{class:"mr-2 whitespace-nowrap"},`ID: ${params.id}`)
        ])
    },
}