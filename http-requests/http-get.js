import http from 'k6/http';
import { check } from 'k6';

export default function () {
    let response = http.get('https://test-api.k6.io/public/crocodiles/');
    const crocodiles = response.json();
    const crocodileId = crocodiles[0].id;
    const crocodileName = crocodiles[0].name;

    response = http.get(
        `https://test-api.k6.io/public/crocodiles/${crocodileId}/`,
    );

    console.log(response.headers);
    console.log(response.headers.Allow);
    console.log(response.headers['Content-Type']);

    check(response, {
        'status is 200': (res) => res.status === 200,
        'crocodile is Sobek': (res) => res.body.includes('Sobek'), // res.body is text (string type)
        'crocodile name': (res) => res.json().name === crocodileName,
    });
}
