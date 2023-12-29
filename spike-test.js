import http from 'k6/http';
import { sleep } from 'k6';

// additional options
export const options = {
    stages: [
        // the idea is we have a sudden increase in the number of users and this is happening very fast
        {
            duration: '2m',
            target: 10000,
        },
        {
            duration: '1m',
            target: 0,
        },
    ],
};

export default function () {
    // it's possible that these people do not go through all the pages that typical users see
    http.get('https://test.k6.io');
    sleep(1);
}
