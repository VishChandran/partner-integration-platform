const test = require("node:test");
const assert = require("node:assert/strict");

const validators = require("../validators/partnerValidators");

test("partner creation requires a partner id and name", () => {
  const errors = validators.validatePartnerRequest({
    requestedProducts: "cards"
  });

  assert.deepEqual(errors, [
    "partnerId is required",
    "partnerName is required",
    "requestedProducts must be an array"
  ]);
});

test("partner status is restricted to supported lifecycle states", () => {
  assert.deepEqual(
    validators.validatePartnerStatusRequest({
      status: "UNKNOWN"
    }),
    [
      "status must be one of: REQUESTED, APPROVED, REJECTED, SUSPENDED"
    ]
  );
});

test("testing metrics must be non-negative numbers", () => {
  const errors = validators.validateTestingRequest({
    status: "PASSED",
    totalTestCases: 10,
    passed: 9,
    failed: -1
  });

  assert.deepEqual(errors, [
    "failed must be a non-negative number"
  ]);
});
