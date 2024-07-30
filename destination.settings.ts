export const DESTINATION_SETTINGS = {
    appName: "DataCynical" as const,
    appPath: "data-cynical" as const,
    get repoUrl() {
        return `https://github.com/arksouthern/${this.appPath}` as const
    },
    get runUrl() {
        return `http://arksouthern.com/app/${this.appPath}` as const
    },
    version: "v3.1.2"
} satisfies {
    /** GITHUB SAFE APP NAME, LETTERS ONLY */
    appName: string
    appPath: string
    repoUrl: string
    runUrl: string
    version: `v${any}`
}