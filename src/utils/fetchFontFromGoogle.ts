import axios from 'axios'

async function fetchFontFromGoogle(fontFamily: string): Promise<string | null> {
  try {
    const res = await axios.get(
      'https://fonts.googleapis.com/css2?family=' +
        fontFamily.replace(' ', '+') +
        '&display=swap' +
        ':wght@500',
    )

    const stylesheet: string = res.data
    // Regular expression pattern to match the URL
    const urlPattern = /src:\s*url\((.*?)\)/
    // Use the exec method to find the URL in the string
    const matches = urlPattern.exec(stylesheet)

    // Check if a match was found
    if (matches && matches.length > 1) {
      const url = matches[1]

      // Only ttf fonts are supported
      if (stylesheet.indexOf('truetype') < 0) {
        return null
      }
      return url
    }
    console.error('No match found')
  } catch (e) {
    console.error(e)
  }
  return null
}

export default fetchFontFromGoogle
