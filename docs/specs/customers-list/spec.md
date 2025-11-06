
# Spec: Paginated GET /customers with filtering

## Outcome & business value
Enable listing of customers to support CS agents with fast filtering by city and signup date.

## User stories
- As a CS agent, I can list customers and filter by city and signup date range.

## Constraints & principles
- Response within 200ms p95 for 10k rows (dev data).
- No PII beyond name & city.

## Acceptance criteria
- Given customers exist, when I GET `/customers?page=1&pageSize=10` then I receive 10 items and a total count.
- Filtering by `city=Malmö` returns only Malmö customers.
- `from` and `to` parameters constrain by `signupDate`.

## Test plan
- Unit & integration tests for endpoint and filtering.
- Seed 3 customers and validate results.

## Telemetry
- Count: `customers.list.requests`
- Histogram: `customers.list.duration_ms`
