import request from 'superagent';
import Config from '../config';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default {
    addNewImage: (data, projectId) => {
        return request
        .post(`${Config.apiUrl}/image/${projectId}`)
        .field(data)
        .set('authorization', cookies.get('token'))
    },
    fetchAllImages: (projectId) => {
        return request
        .get(`${Config.apiUrl}/image/${projectId}`)
        .set('Accept', 'application/json')
        .set('authorization', cookies.get('token'))
    },
    deleteImage: (id) => {
        return request
        .delete(`${Config.apiUrl}/image/${id}`)
        .set('Accept', 'application/json')
        .set('authorization', cookies.get('token'))
    },
    getUnTaggedUser: (imageId) => {
        return request
        .get(`${Config.apiUrl}/image/untaggeduser/${imageId}`)
        .set('Accept', 'application/json')
        .set('authorization', cookies.get('token'))
    },
    addNewTaggedUser: (data, imageId) => {
        return request
        .post(`${Config.apiUrl}/image/taggedUser/${imageId}`)
        .send(data)
        .set('authorization', cookies.get('token'))
    },
    deleteTaggedUser: (imageId,userId) => {
        return request
        .delete(`${Config.apiUrl}/image/taggedUser/${imageId}/${userId}`)
        .set('Accept', 'application/json')
        .set('authorization', cookies.get('token'))
    },
}