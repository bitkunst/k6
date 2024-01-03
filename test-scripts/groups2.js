import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
    thresholds: {
        http_req_duration: ['p(95)<250'],
        'group_duration{group:::Main page}': ['p(95)<8000'], // every name in the group is prefixed by two colons
        'group_duration{group:::News page}': ['p(95)<6000'],
        'group_duration{group:::Main page::Assets}': ['p(95)<3000'],
    },
};

export default function () {
    group('Main page', () => {
        let res = http.get(
            'https://run.mocky.io/v3/9a9b473a-b13e-4f75-8ce8-139484ca5e02?mocky-delay=5000ms',
        );
        check(res, { 'status is 200': (r) => r.status === 200 });

        // Sub-groups
        group('Assets', () => {
            // static assets
            http.get(
                'https://run.mocky.io/v3/9a9b473a-b13e-4f75-8ce8-139484ca5e02?mocky-delay=1000ms',
            );
            http.get(
                'https://run.mocky.io/v3/9a9b473a-b13e-4f75-8ce8-139484ca5e02?mocky-delay=1000ms',
            );
        });
    });

    group('News page', () => {
        http.get(
            'https://run.mocky.io/v3/9a9b473a-b13e-4f75-8ce8-139484ca5e02?mocky-delay=5000ms',
        );
    });

    sleep(1);
}
