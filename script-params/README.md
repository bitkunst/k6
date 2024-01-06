## Tips

### Using environment variables in scripts

```sh
$ k6 run -e BASE_URL=https://test-api.k6.io env-var.js
```

```ts
import http from 'k6/http';

export default function () {
    console.log(__ENV.BASE_URL);

    http.get(`${__ENV.BASE_URL}/public/crocodiles/`);
}
```

### Random sleep

-   Not to have a hard coded number in sleep function, but to have something random between some reasonable intervals
-   Users are not robots. They are not so predictable and hard coding a fix sleep value is counter productive
-   https://k6.io/docs/javascript-api/jslib/utils/randomintbetween/

```ts
import { sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function () {
    // code ...

    sleep(randomIntBetween(1, 5)); // sleep between 1 and 5 seconds.
}
```

### Random string

-   Use `Date.now()` (timestamp)
    -   Problems: Once we have more than 1 VU, Date.now() can be duplicated
-   https://k6.io/docs/javascript-api/jslib/utils/randomstring/

```ts
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function () {
    const randomFirstName = randomString(8);
    console.log(`Hello, my first name is ${randomFirstName}`);

    const randomLastName = randomString(10, `aeioubcdfghijpqrstuv`);
    console.log(`Hello, my last name is ${randomLastName}`);

    const randomCharacterWeighted = randomString(1, `AAAABBBCCD`);
    console.log(`Chose a random character ${randomCharacterWeighted}`);
}
```

### Random item in an array

-   https://k6.io/docs/javascript-api/jslib/utils/randomitem/

```ts
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const names = ['John', 'Jane', 'Bert', 'Ed'];

export default function () {
    const randomName = randomItem(names);
    console.log(`Hello, my name is ${randomName}`);
}
```

### Using external JSON file

-   When we are trying to work with external data files, we don't want every virtual user to load an external file
    -   Because, it will cause a memory issue
    -   For this reason, we're going to use a concept called `shared array`
-   Shared array is an array that is created as a result of reading data from a file and this array is shared by all VUs

```ts
import { SharedArray } from 'k6/data';

const userCredentials = new SharedArray('users with credentials', () => {
    return JSON.parse(open('./assets/users.json')).users;
```

### Useful utility libs for k6 scripts

-   https://jslib.k6.io/
