import Axios from 'axios'

const Api = Axios.create({
    'baseURL': 'http://pg.lgpt.io/api/v1',
    // Auth here when needed
})

export default Api