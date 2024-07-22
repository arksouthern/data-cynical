export const DESTINATION_SETTINGS = {
    appName: "DataCynical" as const,
    repoUrl: "https://github.com/arksouthern/data-cynical" as const,
    version: "v3.1.2"
} satisfies {
    /** GITHUB SAFE APP NAME, LETTERS ONLY */
    appName: string
    repoUrl: string
    version: `v${any}`
}
