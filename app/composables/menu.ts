
export const useRouteInfo = (menuItems: any[]) =>
    useState('routeName', () => {
        const info = ref({
            name: '',
            names: [] as string[],
            paths: [] as string[],
        })

        const route = useRoute()

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
                const match = findPath(menuItems, route.path)
                if (match) {
                    info.value = {
                        name: match.titles.at(-1) || '',
                        names: match.titles,
                        paths: match.paths,
                    }
                } else {
                    info.value = {
                        name: '',
                        names: [],
                        paths: [],
                    }
                }
            },
            { immediate: true }
        )

        return info
    })