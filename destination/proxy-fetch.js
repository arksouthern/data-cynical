// @ts-ignore
function proxyFetch(origin, url, method, body, extra) {
    return new Promise((resolve, reject) => {
        const requestId = Math.random().toString(36).substr(2);
        const message = [requestId, method, url, body, extra]

        window.addEventListener('message', function listener(event) {
            if (event.origin !== origin) return
            const [evReqId, response] = event.data
            if (evReqId !== requestId) return 
            window.removeEventListener('message', listener)
            
            if (response && typeof response == "object" && Object.getPrototypeOf(response).constructor.name == "Blob")
                resolve(response)
            else
                reject(response)
        })

        // @ts-ignore Send the request to the iframe
        iframe.contentWindow.postMessage(JSON.stringify(message), origin);
    })
}
window.addEventListener("message", async (e) => {
    if (e.origin != "http://arksouthern.com" && e.origin != "http://localhost:3000") return
    if (!e.data) var message = proxyFetch.toString()
    else {
        const [reqId, method, url, body, extra] = JSON.parse(e.data)
        try {
            const response = await fetch(url, {method, body, ...extra})
            const blob = await response.blob()
            // @ts-ignore
            var message = [reqId, blob]
        } catch (error) {
            // @ts-ignore
            var message = [reqId, error]
        }
    }
    // @ts-ignore
    e.source.postMessage(message, e.origin)
})