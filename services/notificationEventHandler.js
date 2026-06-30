const notificationService =
  require("./notificationService");

const processEvent = async (event) => {

  if (
    event.eventType ===
    "PARTNER_CERTIFIED"
  ) {
    await notificationService.createNotification(
      "EMAIL",
      "partner-operations@bank.com",
      `Partner ${event.payload.partnerId} certified`,
      event
    );
  }

  if (
    event.eventType ===
    "PARTNER_READY_FOR_GO_LIVE"
  ) {
    await notificationService.createNotification(
      "EMAIL",
      "production-readiness@bank.com",
      `Partner ${event.payload.partnerId} ready for go-live`,
      event
    );
  }

};

module.exports = {
  processEvent
};
