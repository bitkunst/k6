import http from 'k6/http';

export const options = {
    thresholds: {
        http_req_duration: ['p(95)<1000'],
        'http_req_duration{status:200}': ['p(95)<1000'], // apply a tag filter to this metric
        'http_req_duration{status:201}': ['p(95)<1000'], // apply a tag filter to this metric
    },
};

export default function () {
    http.get('https://run.mocky.io/v3/9a9b473a-b13e-4f75-8ce8-139484ca5e02'); // status 200
    http.get(
        'https://run.mocky.io/v3/35b852c2-06be-4ea6-83f6-6ad9b47afdae?mocky-delay=2000ms', // status 201
    );
}
