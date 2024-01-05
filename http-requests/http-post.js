import http from 'k6/http';
import { check } from 'k6';

export default function () {
    const credentials = {
        username: 'test_' + Date.now(),
        password: 'mypassword',
    };

    http.post(
        'https://test-api.k6.io/user/register/',
        JSON.stringify(credentials),
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );

    let response = http.post(
        'https://test-api.k6.io/auth/token/login/',
        JSON.stringify({
            username: credentials.username,
            password: credentials.password,
        }),
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );

    const accessToken = response.json().access;
    console.log('accessToken', accessToken);

    http.get('https://test-api.k6.io/my/crocodiles/', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    response = http.post(
        'https://test-api.k6.io/my/crocodiles/',
        JSON.stringify({
            name: 'k6-croc',
            sex: 'M',
            date_of_birth: '2024-01-06',
        }),
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        },
    );

    const newCrocodileId = response.json().id;

    response = http.get(
        `https://test-api.k6.io/my/crocodiles/${newCrocodileId}/`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );

    check(response, {
        'status is 200': (res) => res.status === 200,
        'crocodile id': (res) => res.json().id === newCrocodileId,
    });

    // PUT
    response = http.put(
        `https://test-api.k6.io/my/crocodiles/${newCrocodileId}/`,
        JSON.stringify({
            name: 'updated-k6-croc',
            sex: 'M',
            date_of_birth: '2024-01-06',
        }),
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        },
    );

    // PATCH
    response = http.patch(
        `https://test-api.k6.io/my/crocodiles/${newCrocodileId}/`,
        JSON.stringify({
            sex: 'F',
        }),
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        },
    );

    // DELETE
    response = http.del(
        `https://test-api.k6.io/my/crocodiles/${newCrocodileId}/`,
        null,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );
}
