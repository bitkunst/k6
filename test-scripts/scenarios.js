import http from 'k6/http';
import { check } from 'k6';
import { sleep } from 'k6';
import exec from 'k6/execution';

export const options = {
    vus: 10,
    duration: '10s',
    thresholds: {
        http_req_duration: ['p(95)<200'], // p(95) needs to be under 200ms
        http_req_duration: ['max<2000'], // max needs to be under 2000ms
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        http_reqs: ['count>20'],
        http_reqs: ['rate>4'],
        vus: ['value>9'],
        checks: ['rate>=0.98'],
    },
};

export default function () {
    // exec.scenario.iterationInTest - the number of iteration
    const response = http.get(
        'https://test.k6.io/' +
            (exec.scenario.iterationInTest === 1 ? 'foo' : ''),
    );

    check(response, {
        'status is 200': (res) => res.status === 200,
        'page is startpage': (res) =>
            res.body.includes(
                'Collection of simple web-pages suitable for load testing.',
            ),
    });
    sleep(2);
}
