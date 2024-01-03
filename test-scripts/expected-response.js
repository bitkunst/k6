import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
    thresholds: {
        http_req_duration: ['p(95)<1000'], // normal http_req_duration (include failures)
        'http_req_duration{expected_response:true}': ['p(95)<1000'], // http_req_duration of all the requests that have been successful (status 200 ~ 399)
        'group_duration{group:::Main page}': ['p(95)<3000'], // every name in the group is prefixed by two colons
        'group_duration{group:::News page}': ['p(95)<1000'],
        'group_duration{group:::Main page::Assets}': ['p(95)<1000'],
    },
};

export default function () {
    group('Main page', () => {
        let res = http.get(
            'https://run.mocky.io/v3/9a9b473a-b13e-4f75-8ce8-139484ca5e02?mocky-delay=900ms',
        );
        check(res, { 'status is 200': (r) => r.status === 200 });

        // Sub-groups
        group('Assets', () => {
            // static assets
            http.get(
                'https://run.mocky.io/v3/9a9b473a-b13e-4f75-8ce8-139484ca5e02?mocky-delay=900ms',
            );
            http.get(
                'https://run.mocky.io/v3/9a9b473a-b13e-4f75-8ce8-139484ca5e02?mocky-delay=900ms',
            );
        });
    });

    group('News page', () => {
        http.get(
            'https://run.mocky.io/v3/ab312421-7dfc-4b48-88cd-faabe199a049', // status 503
        );
    });

    sleep(1);
}
