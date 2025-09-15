
export const useRouteInfo = (menuItems: any[]) =>
    useState('routeName', () => {
        const info = ref({
            name: '',
            names: [] as string[],
            paths: [] as string[],
        })
        console.log(menuItems)

        const route = useRoute()
        console.log(route)

        const findPath = (
            items: any[],
            targetPath: string,
            parents: { title: string; path: string }[] = []
        ): { titles: string[]; paths: string[] } | null => {
            for (const item of items) {
                const current = [...parents, { title: item.title, path: item.path }]
                if (item.path === targetPath) {
                    return {
                        titles: current.map((i) => i.title),
                        paths: current.map((i) => i.path),
                    }
                }
                if (item.children) {
                    const result = findPath(item.children, targetPath, current)
                    if (result) return result
                }
            }
            return null
        }

        watch(
            () => route.fullPath,
            () => {
                let path = route.path
                console.log(path)
                if (path.endsWith('/')) {
                    path = path.slice(0, -1)
                }
                const match = findPath(menuItems, path)
                info.value.name= match?.titles?.at(-1) ?? ''
                info.value.names= match?.titles??[]
                info.value.paths= match?.paths??[]
            },
            { immediate: true }
        )

        return info
    })