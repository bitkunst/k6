## Scenarios

-   In order to make http-request, we need to import http library from 'k6/http'
-   In order to write assertions, we need to import `check` function from 'k6'

```ts
import http from 'k6/http';
import { check } from 'k6';

export default function () {
    const res = http.get('https://test.k6.io');
    console.log(res.status);

    // first parameter : some data that we want to have access to
    // then we need to pass an object which contains different checks
    check(true, {
        'true is true': (value) => value === true,
    });
    // property name -> name of the assertion
    // value of the property -> function
    // we have access to the value through the parameter of function
}
```

### Threshold

-   With threshold, we can tell k6 what is acceptable or not and k6 can raise the alarm when something unexpected happens without us having to dig through the metrics with every execution
-   To configure threshold, we need to define the `options` variable

```ts
export const options = {
    vus: 10,
    duration: '10s',
    thresholds: {
        http_req_duration: ['p(95)<200'], // p(95) needs to be under 200ms
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    },
};
```

-   Using thresholds in combination with the checks is key for performance test automation

### Metric types

-   https://k6.io/docs/using-k6/metrics/reference/
-   Counter
    -   A counter simply keeps track of something during a period of time
    -   Supported aggregation methods: `count`, `rate`
    -   e.g. 'count>20'
-   Rate
    -   Rate type shows how frequently a non-zero value occurs for something
    -   It is calculated by dividing the number of successful events by the total number of events
    -   The value of rate is something between 0.00 and 1.00
    -   Supported aggregation methods: `rate`
    -   e.g. 'rate<0.01'
-   Gauge
    -   A gauge represents like an instant value of something at a particular point in time
    -   Supported aggregation methods: `value`
    -   e.g. 'value>9'
-   Trend
    -   Trend calculates different statistics and different values
    -   It will calculate average, min, max, median, percentile
    -   Supported aggregation methods: `avg`, `min`, `max`, `med`, `p`

### Custom metrics

-   We can define a custom metric of one of the types supported by k6
    -   Counter, Rate, Guage, Trend

```ts
import { Counter } from 'k6/metrics';

const myCounter = new Counter('my_counter');
```

### Tags

-   In reality we're going to have a lot of requests. And you may not know exactly which of these requests is actually responsible for failure
-   In k6, one of the ways that you can use to drill into results is to use tags
-   By default, k6 already has some tags
    -   https://k6.io/docs/using-k6/tags-and-groups/
    -   By default, all the requests that are being sent out are tagged
    -   `System tags`
        -   status, method, url, name ...
-   Mocky
    -   https://designer.mocky.io/
    -   this service allows us to create mock endpoints
    -   they're not real endpoints, but we can control this endpoints and they can help us simulate something in k6
    -   Arbitrary Delay
        -   Add the `?mocky-delay=100ms` paramater to your mocky URL to delay the response. Maximum delay: 60s.

### Custom tags

-   The default tags offered by k6 are simply not enough to categorize the different k6 entities involved in a test
-   You can tag different entities in k6, and then you can use those tags later on in thresholds

```ts
res = http.get(
    'https://run.mocky.io/v3/35b852c2-06be-4ea6-83f6-6ad9b47afdae?mocky-delay=2000ms',
    {
        tags: {
            page: 'order',
        },
    },
);
```

### Groups

-   In k6, we can use a concept which is called groups
-   Essentially with groups, we can `organize multiple requests`
    -   organize things by user actions
-   We can define thresholds for a specific group based on the `group_duration` metric
    -   Under the entire group is the sum of all the requests that we have within the group
    -   If we want to try to understand how long it takes for the entire page to load, then we're going to have to look at group_duration and see everything as a whole

```ts
import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
    thresholds: {
        http_req_duration: ['p(95)<250'],
    },
};

export default function () {
    group('group_name', () => {
        // Code belongs to the group
    });
}
```

-   You can ideally use tags for your requests if you need to tag the request in a specific way
-   Groups would be more for grouping things together or grouping code together

### http_req_duration { expected_response }

-   { expected_response:true }
    -   this is a `tag` on the http_req_duration metric
    -   this exists because `it filters out any responses that contain errors`
    -   Why is this important?
        -   Quite often a response with an error can be significantly faster than the response that is the result of some processing that happens in the background
        -   Maybe doing some heavy work in the background takes a few seconds, but an error page can be generated in milliseconds
        -   Putting everything inside the http_req_duration metric is not really a good idea
-   http_req_duration
    -   normal http_req_duration which includes failures
-   http_req_duration{expected_response:true}
    -   http_req_duration of all the requests that have been successful (status 200 ~ 399)

<br>

## Structure of k6 script

### Lifecycle

1. init stage
2. setup stage
3. vu code stage
4. teardown stage

### Init stage

-   init stage doesn't have a function
-   importing the different modules that we need
-   init stage also has options variable
    -   where we define the different options
-   we may also load some files from the local file system
-   `Anything that is not inside the pre-defined k6 lifecycle function is part of the init stage`

### Setup stage

-   if we want to use the setup function, we need to call it exactly "setup"
-   it also needs to have the "export" keyword infront of it
-   the name needs to be all in lowercase
-   in the setup function, sometimes we may want to send some http requests to fetch some data
    -   `the default function allows us to define a parameter`
    -   k6 take the return value of setup function and put it as an argument to the default function
-   we can even use an API call to start an environment and then wait a bit until that environment is ready and then continue with the rest of the code
-   `when we're doing something in the setup and we're waiting there, the rest of the tests will not start`
-   `the setup function will only be called once per test execution`
    -   it doesn't matter how many iterations we're doing
    -   it doesn't matter how many virtual users we are having

```ts
export function setup() {
    console.log('-- setup stage --');
    const data = { foo: 'bar' };
    return data;
}

export default function (data) {
    console.log('-- VU stage --');
    console.log(data); // { foo: 'bar' }
}
```

### VU stage

-   virtual user code stage
-   the code inside here is executed for every virtual user
-   once the virtual user is at the end of the default function script (done witt it), it's starting the function once again
    -   never stopping for "duration"
    -   `iteration` : the execution of the default function, the virtual user stage

```ts
// The default function is always mandatory
export default function () {
    console.log('-- VU stage --');
}
```

### Teardown stage

-   after we have executed all the tests and we have done everything, we also may need to clean up things
-   let's say in the beginning we have started a new environment, we have executed some tests and now that environment is running there, but maybe we don't need it anymore -> we can use some API calls and essentially tear down that environment
-   it needs to have the "export" keyword in the beginning and it needs to be written all in lowercase exactly as "teardown"
-   `teardown function also has access to the data that we have from the setup`
-   `teardown is also executed only once per test execution, at the end of the execution`
    -   it doesn't matter how many virtual users we are having

```ts
export function setup() {
    console.log('-- setup stage --');
    const data = { foo: 'bar' };
    return data;
}

export function teardown(data) {
    console.log('-- teardown stage --');
    console.log(data); // { foo: 'bar' }
}
```

### Aborting test

-   we can `use the setup stage` to check if the application is running
    -   some applications have like a status page where we can simply call a status endpoint and see if all services are running
    -   that is already a precondition for us to let a performance test run

```ts
import http from 'k6/http';
import exec from 'k6/execution';

// called before the VU stage
export function setup() {
    let res = http.get('https://test.k6.local/status');
    if (res.error) {
        // if there's an error abort the execution
        exec.test.abort('Aborting test. Application is DOWN');
    }
}
```
