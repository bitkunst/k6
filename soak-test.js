import http from 'k6/http';
import { sleep } from 'k6';

// additional options
export const options = {
    stages: [
        {
            duration: '5m',
            target: 100,
        },
        {
            // only stretching this stage
            // what we are testing is how the application will perform during this part of the test with a constant load for a long period of time
            duration: '24h',
            target: 100,
        },
        {
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
