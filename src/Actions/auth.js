import request from 'superagent';
import Config from '../config';

export default {
    signupWithEmail: (data) => {
        return request
        .post(`${Config.apiUrl}/signup`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
    },
    loginWithEmail: (data) => {
        return request
        .post(`${Config.apiUrl}/login`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
    },
    socialSignin: (data) => {
        return request
        .post(`${Config.apiUrl}/socialSignin`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
    }
};
