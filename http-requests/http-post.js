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
}
