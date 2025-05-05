import { ABadge, ACard, ADropdown, AMenu, ATag, EllipsisOutlined } from "#components";
import type { TablePropsType } from "../components/global/FormTable";
import FormTableCom from "../components/global/FormTable";


export const FormTable = (props: TablePropsType) => {

    const attribute = reactive({
        selectItems: [],
        selectKeys: [],
        page: 1,
        pageSize: 10
    })

    const control = {
        refresh: () => { }
    }

    return {
        com: h(FormTableCom, { ...props, attribute, control }),
        attribute,
        control
    }
}

export const TablePage = (props: TablePropsType) => {
    let TableParams = FormTable(props)

    return {
        ...TableParams,
        com: h(ACard, { class: "absolute top-0 left-0 right-0 bottom-0 h-full", bodyStyle: "height:100%" }, TableParams.com)

    }
}
