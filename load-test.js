import http from 'k6/http';
import { sleep } from 'k6';

// additional options
export const options = {
    stages: [
        {
            // for a duration of 5m, k6 will ramp up the traffic from 0 to 100
            duration: '5m',
            target: 100,
        },
        {
            // staying at 100 for 30m
            duration: '30m',
            target: 100,
        },
        {
            // in 5m, go from 100 to 0
            duration: '5m',
            target: 0,
        },
    ],
};

export default function () {
    http.get('https://test.k6.io');
    sleep(1);
    http.get('https://test.k6.io/contacts.php');
    sleep(2);
    http.get('https://test.k6.io/news.php');
    sleep(2);
}
