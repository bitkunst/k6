# Performance testing

-   Performance testing is an umbrella term for different types of tests we run against our app.

### Load test

-   We are simulating multiple users accessing the system concurrently
-   It is like simulating traffic on the bridge even at peak hours

### Stress test

-   We push the system to its breaking point
-   It is like seeing how much weight a bridge can hold before it starts to wobble

### Spike test

-   We suddenly increase and decrease the load on the system
-   Imagine a bridge with low traffic where only cars pass. Suddenly a group of heavy trucks decided to cross. This unexpected weight is a spike
-   Spike testing checks how the bridge handles this sudden load and if it stays stable afterward

<br>
<br>

## Scaling concepts

### Vertical Scaling (Scaling Up)

-   When you boost the capacity of a single server by adding more memory or using a faster CPU
    -   additional RAM memory
    -   faster CPU
-   With vertical scaling, there are physical limits in terms of how much we can scale vertically. Also, the higher you go, the more expensive it is. At one point it makes no sense to continue scaling vertically

### Horizontal Scaling (Scaling Out)

-   You add more servers to handle the increased load, distributing the traffic among them
-   Scaling horizontally allows you to use multiple reasonably sized servers. When you have a higher load, you just use more servers. When the load decreases, you can simply use fewer servers
-   While horizontal scaling sounds very tempting, things are not so easy in practice. In particular, older applications tend to have a `monolithic architecture` meaning that all components of the application are tightly coupled and can only be deployed together on a server. So monolithic application can't be easily deployed to multiple servers.
    -   Monolithic architecture -> difficult to scale horizontally
-   Microservices are another architectural approach where an application is made out of loosely coupled components or services. This has the advantage that each server can be scaled up or down as needed.
    -   Microservice architecture -> relatively easy to scale horizontally

### Elastic Scaling

-   Cloud providers make this relatively easy to scale up or down and pay only for the resources actually used. It is often called `Elastic scaling`.

<br>
<br>

## Smoke testing

-   A smoke test is run with a minimal load, typically using 1 to 3 virtual users (VUs) for a short duration (from 30 seconds to a few minutes) to verify that the test script and the application are functioning and to establish baseline performance values.
-   Low throughput, breif duration

<br>
<br>

## Load testing

-   With load testing, we are testing the application under a typical load.
-   With the load test, we need to wait a bit to understand how the application performs during a sustained period of time under a typical load. Because of this, it does not make sense to run such a test only for a few minutes. Some issues tend to occur only after a while. So it is not uncommon to have a load test running for 30 minutes or even longer
-   In reality, users don't just show up all of the sudden. They increase and decrease over time. So when designing such a test, we should also gradually increase the number of users. By doing so, we are simulating the way users typically behave.

<image width='750px' src='./public/load-testing.png' />

-   A load test is designed to test the application under typical conditions that occur in production
-   A load test is not designed to break the system
-   The goal is to understand if the application's performance has degraded or not compared to the previos version
-   A load test will not have a constant load during the duration of a load test. Rather we have stages. We have a ramp up until we get to the desired value, then we stay at that desired value for most of the test duration, and then we ramp down to allow the application to scale down
-   Finally, we should run a load test every time a new version of the application is about to be deployed or after doing infrastructure changes, regardless of how minor they may seem

<br>
<br>

## Stress testing

-   The type of test that puts a higher than average load on the application is called a stress test
    -   If we were testing a bridge, we would have the most heavy trucks we can find drive on it
-   `The primary purpose of stress testing is to assess application's performance under heavier than usual loads`
-   The way a stress test is constructed resembles a load test. The main difference is the increased load. Executing such a test makes sense because it helps us understand how the application will perform under demanding conditions which are above average

<image width='750px' src='./public/stress-testing.png' />

-   We should run a stress test only after the successful completion of a load test
-   The aim of the stress test is to test the application under above average conditions

<br>
<br>

## Spike testing

-   Our application might need to handle expected or unexpected events that lead to a sudden spike in the number of users
    -   A spike test is like dropping a huge heavy truck from a plane on the bridge so the bridge will take a sudden hit
-   `To simulate a scenario where an application experiences a sudden and enormous increase in users, way beyond its normal traffic, without a significant ramp-up time. This test evaluates the system's ability to handle such abrupt load and how it recovers from it`
-   All of the sudden the application will need to handle a sudden spike that will go above the limit set even for stress testing. So in this case, the ramp up time is practically inexistent

<image width='750px' src='./public/spike-testing.png' />

-   Running a spike test is by no means a normal occurrence
    -   We don't do this every time we deploy a new version of the application
-   The ramp up stage is very steep and the ramp down stage is also very steep
-   four times what you have for the stress test is a good starting poingt for such a spike test
-   Because the load is so high and so sudden and so unexpected for the system, we expect the system to crash. So this is something that should not surprise us
-   It's also important to understand like what is happening afterward. So after the system crashes or some parts of the system crash, can it automatically recover after a while or is there a need for manual intervention to the engineers

<br>
<br>

## Breakpoint testing

-   What is the load that our application can handle without crashing?
    -   To find out, we need to run a breakpoint test
-   With breakpoint test, we can determine the maximum capacity of the application
-   This test gradually increases the load from 0, up to a very high value. The idea is to find the point where the application starts breaking
    -   If we were testing a bridge, we would be adding a load to it until it collapses
-   The load needs to be gradually increased, similar to a load or a stress test. However, this breakpoint test has only one stage, which is essentially an almost infinite scale up
-   We need to closely monitor the application and notice the point when the error rate is very high or the response times are unacceptable
-   `A breakpoint test in k6 is performed to determine the maximum capacity of an application by gradually ramping up the load to a high value until the application starts breaking, and it usually needs to be stopped manually when issues arise`

<image width='750px' src='./public/breakpoint-testing.png' />

-   A breakpoint test is designed to determine the maximum capacity of an application. Because we expect the application to crash, this test should not be done on a production environment unless the autoscaling capabilities of a production system need to be tested at a maximum. Apart from this, it only makes sense to run a breakpoint test after the successful completion of a load test and of a stress test

<br>
<br>

## Soak testing

-   We don't know how the application will perform if placed under load for an extended period of time
    -   For example, just because a bridge can hold a load for an hour it does not mean it will be able to hold it for a day or longer. Cracks can form, but only after an extended period of time
-   To test this scenario as well, we need to run a soak test, also known as an endurance test
-   Essentially, a soak test is a variation of a load test. To put it in simpler terms, we take a load test and simply stretch its duration
-   The question is what kind of issues can a soak test detect that a load test couldn't ?
    -   Some problems tend to occur after a long period of time. One example for that would be memory leaks
    -   The memory leak can occur when a program keeps holding onto the memory it doesn't need anymore and it's simply slowing down the system over time. At one point, the system can run out of memory and crash
-   `The primary purpose of a soak test is to identify issues like memory leaks and resource depletion that may only appear after prolonged periods of continuous use`

<image width='750px' src='./public/soak-testing.png' />

-   A soak test can help us identify issues that occur only after an extended period. Such a test should be executed after the successful completion of a load test
