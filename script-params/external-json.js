import http from 'k6/http';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { check } from 'k6';
import { SharedArray } from 'k6/data';

const userCredentials = new SharedArray('users with credentials', () => {
    return JSON.parse(open('./assets/users.json')).users;
});

export default function () {
    // Register users
    // userCredentials.forEach((item) => {
    //     const credentials = {
    //         username: item.username,
    //         password: item.password,
    //     };
    //     let res = http.post(
    //         'https://test-api.k6.io/user/register/',
    //         JSON.stringify(credentials),
    //         {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         },
    //     );
    //     check(res, {
    //         'status is 201': (r) => r.status === 201,
    //     });
    // });

    const randomCredential = randomItem(userCredentials);
    let res = http.post(
        'https://test-api.k6.io/auth/token/login/',
        JSON.stringify({
            username: randomCredential.username,
            password: randomCredential.password,
        }),
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
    check(res, {
        'status is 200': (r) => r.status === 200,
        'has access token': (r) => r.json() !== undefined,
    });
}
