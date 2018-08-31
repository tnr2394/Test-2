import request from 'superagent';
import Config from '../config';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default {
    addNewProject: (data) => {
        return request
        .post(`${Config.apiUrl}/project`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', cookies.get('token'))
    },
    fetchAllProjects: (data) => {
        return request
        .get(`${Config.apiUrl}/project`)
        .set('Accept', 'application/json')
        .set('authorization', cookies.get('token'))
    },
    deleteProject: (id) => {
        return request
        .delete(`${Config.apiUrl}/project/${id}`)
        .set('Accept', 'application/json')
        .set('authorization', cookies.get('token'))
    },
    updateProject: (data, id) => {
        return request
        .post(`${Config.apiUrl}/project/${id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', cookies.get('token'))
    }
}