## APIs

-   API is an interface to some data stored somewhere remotely on a different server
-   APIs are designed to be used from programs

### JSON

-   We use JSON to transfer data
-   JSON format
    -   JSON has a simple key-value format

### public test-api address

-   https://test-api.k6.io

## k6 commands

-   we can debug http requests and responses directly from k6

```sh
$ k6 run --http-debug [filename].js
$ k6 run --http-debug="full" [filename].js

```
