const test = require("node:test");
const assert = require("node:assert/strict");

test("processEvent awaits notification persistence", async () => {
  const calls = [];
  const servicePath = require.resolve("../services/notificationService");
  const handlerPath = require.resolve("../services/notificationEventHandler");

  require.cache[servicePath] = {
    id: servicePath,
    filename: servicePath,
    loaded: true,
    exports: {
      createNotification: async () => {
        await new Promise(resolve => setImmediate(resolve));
        calls.push("persisted");
      }
    }
  };

  delete require.cache[handlerPath];
  const handler = require("../services/notificationEventHandler");

  await handler.processEvent({
    eventType: "PARTNER_CERTIFIED",
    payload: {
      partnerId: "P-1"
    }
  });

  assert.deepEqual(calls, ["persisted"]);
});
