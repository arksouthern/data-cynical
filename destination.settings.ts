export const DESTINATION_SETTINGS = {
    appName: "DataCynical" as const,
    appPath: "data-cynical" as const,
    appScheme: "DataCynical" as const,
    get repoUrl() {
        return `https://github.com/arksouthern/${this.appPath}` as const
    },
    get runUrl() {
        return `http://arksouthern.com/app/${this.appPath}` as const
    },
    version: "v3.6.1"
} satisfies {
    /** GITHUB SAFE APP NAME, LETTERS ONLY */
    appName: string
    appPath: string
    /** Will be prefixed by `ArkDestination` */
    appScheme: string
    repoUrl: string
    runUrl: string
    version: `v${any}`
}