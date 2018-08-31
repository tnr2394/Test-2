import request from 'superagent';
import Config from '../config';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default {
    addNewSubGroup: (data, projectId) => {
        return request
        .post(`${Config.apiUrl}/sub-group/${projectId}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', cookies.get('token'))
    },
    fetchAllSubGroup: (projectId) => {
        return request
        .get(`${Config.apiUrl}/sub-group/${projectId}`)
        .set('Accept', 'application/json')
        .set('authorization', cookies.get('token'))
    },
    deleteSubGroup: (id) => {
        return request
        .delete(`${Config.apiUrl}/sub-group/${id}`)
        .set('Accept', 'application/json')
        .set('authorization', cookies.get('token'))
    },
    updateSubGroup: (data, id) => {
        return request
        .post(`${Config.apiUrl}/sub-group/${id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', cookies.get('token'))
    },
    getUnTaggedUser: (subGroupId) => {
        return request
        .get(`${Config.apiUrl}/sub-group/untaggeduser/${subGroupId}`)
        .set('Accept', 'application/json')
        .set('authorization', cookies.get('token'))
    },
    addNewTaggedUser: (data, subGroupId) => {
        return request
        .post(`${Config.apiUrl}/sub-group/taggedUser/${subGroupId}`)
        .send(data)
        .set('authorization', cookies.get('token'))
    },
    deleteTaggedUser: (subGroupId, userId) => {
        return request
        .delete(`${Config.apiUrl}/sub-group/taggedUser/${subGroupId}/${userId}`)
        .set('Accept', 'application/json')
        .set('authorization', cookies.get('token'))
    },
}