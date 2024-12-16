import axios from 'axios'
import { xml2js } from 'xml-js'

const base_url = 'https://www.finnkino.fi/xml'

const getAll = async (theaterId, date) => {
    try {
        const response = await axios.get(base_url + '/Schedule/?area=' + theaterId + '&dt=' + date)
        const convertToJson = xml2js(response.data, {compact: true, spaces: 2})

        const xmlDoc = convertToJson.Schedule?.Shows?.Show || []

        const movieData1 = xmlDoc.map(show => ({
            title: show.Title?._text,
            theatre: show.Theatre?._text,
            image: show.Images?.EventLargeImagePortrait?._text,
            auditorium: show.TheatreAuditorium?._text,
            genre: show.Genres?._text || "Not specified",
            link: show.EventURL?._text || "#",
            minutes: show.LengthInMinutes?._text,
            time: show.dttmShowStart?._text,
            time2: show.dttmShowEnd?._text
        }))

        const movieData2 = movieData1.map(movie => {
            let formattedTime = "Not available"
            let formattedTime2 = "Not available"
            
            if (movie.time) {
                const dateObject = new Date(movie.time)
                if (!isNaN(dateObject)) {
                    const hours = dateObject.getHours().toString().padStart(2, '0')
                    const minutes = dateObject.getMinutes().toString().padStart(2, '0')
                    formattedTime = (hours + ':' + minutes)
                }
            }
            if (movie.time2) {
                const dateObject2 = new Date(movie.time2)
                if(!isNaN(dateObject2)) {
                    const hours = dateObject2.getHours().toString().padStart(2, '0')
                    const minutes = dateObject2.getMinutes().toString().padStart(2, '0')
                    formattedTime2 = (hours + ':' + minutes)
                }
            }
            return { ...movie, formattedTime, formattedTime2}
        })

        return movieData2
    } catch (error) {
        throw error
    }
}


//------------------------------------------------------------------------------------

const getDate = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 4; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear())
    }
    return dates
  }

export { getAll, getDate }

