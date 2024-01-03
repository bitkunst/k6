import http from 'k6/http';
import { sleep } from 'k6';
import exec from 'k6/execution';

export const options = {
    vus: 10,
    duration: '60s',
};

// called before the VU stage
export function setup() {
    let res = http.get('https://test.k6.local/status');
    if (res.error) {
        // if there's an error abort the execution
        exec.test.abort('Aborting test. Application is DOWN');
    }
}

export default function () {
    http.get('https://test.k6.local/some-page');

    sleep(1);
}
