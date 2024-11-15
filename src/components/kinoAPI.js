import axios from 'axios'
import { xml2js } from 'xml-js'

const base_url = 'https://www.finnkino.fi/xml'

const getMovieByTheaterAndDate = async(theaterId, date) => { //general finnkino API function format
    try {
        const response = await axios.get(base_url + '/Schedule/?area=' + theaterId + '&dt=' + date)
        const convertToJson = xml2js(response.data, {compact: true, spaces: 2}) //xml - json
        const xmlDoc = convertToJson.Schedule?.Shows?.Show?.map(show => show.Title?._text) //json filter
        const noDuplicates = [...new Set(xmlDoc)] //no duplicate movies
        return noDuplicates
    } catch (error) {
        throw error
    }
}

const getTheaterName = async(theaterName) => {
    try {
        const response = await axios.get(base_url + '/Schedule/?area=' + theaterName)
        const convertToJson = xml2js(response.data, {compact: true, spaces: 2})
        const xmlDoc = convertToJson.Schedule?.Shows?.Show?.map(show => show.Theatre?._text)
        return xmlDoc
    } catch (error) {
        throw error
    }
}

const getMovieStartTime = async(theaterId, date) => {
    try {
        const response = await axios.get(base_url + '/Schedule/?area=' + theaterId + '&dt=' + date)
        const convertToJson = xml2js(response.data, {compact: true, spaces: 2})
        const xmlDoc = convertToJson.Schedule?.Shows?.Show?.map(show => show.dttmShowStart?._text)
        const noDuplicates = [...new Set(xmlDoc)]
        return noDuplicates
    } catch (error) {
        throw error
    }
}

export { getMovieByTheaterAndDate, getMovieStartTime, getTheaterName }

