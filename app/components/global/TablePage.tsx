import { ACard } from "#components"
import { FormTableProps } from "./FormTable"

export default defineComponent({

    props:FormTableProps,

    setup(props){
        const {com,params} = FormTable(props)

        return ()=><ACard class="absolute top-0 left-0 right-0 bottom-0 h-full" bodyStyle="height:100%">
            <com></com>
        </ACard>
    }
})