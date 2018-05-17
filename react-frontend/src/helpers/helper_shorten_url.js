/*
 * Shortens url if it's too long
 *
 * @param   {string}    url URL to be shorten
 * @return  {string}    Shortened URL
 */
export const shortenUrl = (url) => {
    if(url.length < 33) {
        return url
    } else {
        const urlEnd = url.slice(-6)
        const urlStart = url.slice(0, 23)
        return urlStart + '...'  + urlEnd
    }
}