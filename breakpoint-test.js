import http from 'k6/http';
import { sleep } from 'k6';

// additional options
export const options = {
    stages: [
        // only one stage
        {
            duration: '2h',
            target: 1000000000, // something that the application will never be able to handle
        },
    ],
};

export default function () {
    http.get('https://test.k6.io');
    sleep(1);
}
