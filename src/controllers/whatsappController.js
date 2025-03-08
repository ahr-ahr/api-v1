const {
  initializeSession,
  getSessionStatus,
  sendTextMessage,
  sendBulkMessages,
  sendMediaMessage,
  sendPollMessage,
  sendOrderMessage,
  sendMessageWithOptions,
  sendListMessage,
  listChats,
  sendReadStatus,
  createNewsletter,
  destroyNewsletter,
  editNewsletter,
  muteNewsletter,
  getGroupInfoFromInviteLink,
  getCommonGroups,
} = require("../services/whatsappService");
const { sendResponse } = require("../utils/responseHelper");

/**
 * Handles WhatsApp session and message operations.
 */
const whatsappHandler = async (req, res) => {
  const { platform, operation, session, payload } = req.body;

  if (!platform || !operation || !session) {
    return sendResponse(
      res,
      400,
      false,
      null,
      "Platform, Operation, and session name are required."
    );
  }

  try {
    let result;

    switch (operation.toLowerCase()) {
      case "create-session":
        try {
          result = await initializeSession(session);
          if (result.qrCode) {
            sendResponse(
              res,
              200,
              true,
              { qrCode: result.qrCode },
              "Scan the QR code to activate the session."
            );
          } else {
            sendResponse(
              res,
              200,
              true,
              { sessionStatus: result },
              "Session is already active."
            );
          }
        } catch (error) {
          console.error("Error creating session:", error.message);
          sendResponse(res, 500, false, null, "Failed to create session.");
        }
        break;

      case "get-status":
        try {
          result = await getSessionStatus(session);
          sendResponse(
            res,
            200,
            true,
            { sessionStatus: result },
            "Session status retrieved."
          );
        } catch (error) {
          console.error("Error getting session status:", error.message);
          sendResponse(res, 500, false, null, "Failed to get session status.");
        }
        break;

      case "send-text":
        try {
          if (!payload || !payload.to || !payload.message) {
            return sendResponse(
              res,
              400,
              false,
              null,
              "Recipient and message are required for sending text."
            );
          }
          result = await sendTextMessage(
            session,
            payload.to,
            payload.message,
            {}
          );
          sendResponse(res, 200, true, result, "Message sent successfully.");
        } catch (error) {
          console.error("Error sending text message:", error.message);
          sendResponse(res, 500, false, null, "Failed to send text message.");
        }
        break;

      case "send-bulk":
        try {
          if (!payload || !payload.recipients || !payload.message) {
            return sendResponse(
              res,
              400,
              false,
              null,
              "Recipients and message are required for bulk messages."
            );
          }
          result = await sendBulkMessages(
            session,
            payload.recipients,
            payload.message
          );
          sendResponse(
            res,
            200,
            true,
            result,
            "Bulk messages sent successfully."
          );
        } catch (error) {
          console.error("Error sending bulk messages:", error.message);
          sendResponse(res, 500, false, null, "Failed to send bulk messages.");
        }
        break;

      case "send-media":
        try {
          if (!payload || !payload.to || !payload.mediaUrl || !payload.type) {
            return sendResponse(
              res,
              400,
              false,
              null,
              "Recipient, media URL, and type are required for media messages."
            );
          }
          result = await sendMediaMessage(
            session,
            payload.to,
            payload.mediaUrl,
            payload.type,
            payload.caption
          );
          sendResponse(res, 200, true, result, "Media sent successfully.");
        } catch (error) {
          console.error("Error sending media message:", error.message);
          sendResponse(res, 500, false, null, "Failed to send media message.");
        }
        break;

      case "send-poll":
        try {
          if (
            !payload ||
            !payload.to ||
            !payload.pollName ||
            !payload.choices
          ) {
            return sendResponse(
              res,
              400,
              false,
              null,
              "Recipient, poll name, and choices are required for sending a poll."
            );
          }
          result = await sendPollMessage(
            session,
            payload.to,
            payload.pollName,
            payload.choices,
            payload.options
          );
          sendResponse(res, 200, true, result, "Poll sent successfully.");
        } catch (error) {
          console.error("Error sending poll message:", error.message);
          sendResponse(res, 500, false, null, "Failed to send poll message.");
        }
        break;

      case "send-order":
        try {
          if (!payload || !payload.to || !payload.items) {
            return sendResponse(
              res,
              400,
              false,
              null,
              "Recipient and items are required for sending an order."
            );
          }
          result = await sendOrderMessage(
            session,
            payload.to,
            payload.items,
            payload.options
          );
          sendResponse(res, 200, true, result, "Order sent successfully.");
        } catch (error) {
          console.error("Error sending order message:", error.message);
          sendResponse(res, 500, false, null, "Failed to send order message.");
        }
        break;

      case "send-message-with-options":
        try {
          if (!payload || !payload.to || !payload.content) {
            return sendResponse(
              res,
              400,
              false,
              null,
              "Recipient and content are required for sending a message with options."
            );
          }
          result = await sendMessageWithOptions(
            session,
            payload.to,
            payload.content,
            payload.options
          );
          sendResponse(
            res,
            200,
            true,
            result,
            "Message with options sent successfully."
          );
        } catch (error) {
          console.error("Error sending message with options:", error.message);
          sendResponse(
            res,
            500,
            false,
            null,
            "Failed to send message with options."
          );
        }
        break;

      case "send-list-message":
        try {
          if (!payload || !payload.to || !payload.options) {
            return sendResponse(
              res,
              400,
              false,
              null,
              "Recipient and options are required for sending a list message."
            );
          }
          result = await sendListMessage(session, payload.to, payload.options);
          sendResponse(
            res,
            200,
            true,
            result,
            "List message sent successfully."
          );
        } catch (error) {
          console.error("Error sending list message:", error.message);
          sendResponse(res, 500, false, null, "Failed to send list message.");
        }
        break;

      case "list-chats":
        try {
          if (!payload || !payload.options) {
            return sendResponse(
              res,
              400,
              false,
              null,
              "Options for listing chats are required."
            );
          }
          result = await listChats(session, payload.options);
          sendResponse(res, 200, true, result, "Chats listed successfully.");
        } catch (error) {
          console.error("Error listing chats:", error.message);
          sendResponse(res, 500, false, null, "Failed to list chats.");
        }
        break;

      case "send-read-status":
        try {
          if (!payload || !payload.chatId || !payload.statusId) {
            return sendResponse(
              res,
              400,
              false,
              null,
              "Chat ID and Status ID are required for marking as read."
            );
          }
          await sendReadStatus(session, payload.chatId, payload.statusId);
          sendResponse(
            res,
            200,
            true,
            null,
            "Status marked as read successfully."
          );
        } catch (error) {
          console.error("Error marking status as read:", error.message);
          sendResponse(res, 500, false, null, "Failed to mark status as read.");
        }
        break;

      case "create-newsletter":
        try {
          console.log("Payload Received:", payload);

          if (!payload || !payload.name) {
            console.error("Missing payload name.");
            return sendResponse(
              res,
              400,
              false,
              null,
              "Newsletter name is required."
            );
          }

          const result = await createNewsletter(
            session,
            payload.name,
            payload.options
          );
          console.log("Newsletter Created Successfully:", result);

          // Send detailed response
          sendResponse(
            res,
            200,
            true,
            result.newsletter,
            "Newsletter created successfully."
          );
        } catch (error) {
          console.error("Create Newsletter Error:", error.message);
          sendResponse(res, 500, false, null, "Failed to create newsletter.");
        }
        break;

      case "destroy-newsletter":
        try {
          if (!payload || !payload.id) {
            return sendResponse(
              res,
              400,
              false,
              null,
              "Newsletter ID is required."
            );
          }

          result = await destroyNewsletter(session, payload.id);
          sendResponse(
            res,
            200,
            true,
            result,
            "Newsletter destroyed successfully."
          );
        } catch (error) {
          console.error("Error destroying newsletter:", error.message);
          sendResponse(res, 500, false, null, "Failed to destroy newsletter.");
        }
        break;

      case "edit-newsletter":
        try {
          if (!payload || !payload.id) {
            return sendResponse(
              res,
              400,
              false,
              null,
              "Newsletter ID is required."
            );
          }

          // Call the editNewsletter function
          const result = await editNewsletter(
            session,
            payload.id,
            payload.opts
          );

          // Send response with detailed information about the edited newsletter
          sendResponse(
            res,
            200,
            true,
            {
              id: result.newsletter.id,
              name: result.newsletter.name,
              description: result.newsletter.description,
              picture: result.newsletter.picture,
              createdAt: result.newsletter.createdAt,
              updatedAt: result.newsletter.updatedAt,
            },
            "Newsletter edited successfully."
          );
        } catch (error) {
          console.error("Error editing newsletter:", error.message);
          sendResponse(res, 500, false, null, "Failed to edit newsletter.");
        }
        break;

      case "mute-newsletter":
        try {
          if (!payload || !payload.id) {
            return sendResponse(
              res,
              400,
              false,
              null,
              "Newsletter ID is required."
            );
          }

          result = await muteNewsletter(session, payload.id);
          sendResponse(
            res,
            200,
            true,
            result,
            "Newsletter muted successfully."
          );
        } catch (error) {
          console.error("Error muting newsletter:", error.message);
          sendResponse(res, 500, false, null, "Failed to mute newsletter.");
        }
        break;

      case "get-group-info":
        try {
          if (!payload || !payload.inviteCode) {
            return sendResponse(
              res,
              400,
              false,
              null,
              "Invite code is required."
            );
          }

          // Mengambil informasi grup berdasarkan kode undangan
          const groupInfo = await getGroupInfoFromInviteLink(
            session,
            payload.inviteCode
          );

          // Kirimkan respon dengan informasi grup yang lebih terstruktur
          sendResponse(
            res,
            200,
            true,
            groupInfo,
            "Group information retrieved successfully."
          );
        } catch (error) {
          console.error("Error getting group info:", error.message);
          sendResponse(
            res,
            500,
            false,
            null,
            "Failed to get group information."
          );
        }
        break;

      case "get-common-groups":
        try {
          if (!payload || !payload.wid) {
            return sendResponse(res, 400, false, null, "Wid is required.");
          }

          const groups = await getCommonGroups(session, payload.wid);

          if (groups.length === 0) {
            return sendResponse(
              res,
              404,
              false,
              null,
              "No common groups found."
            );
          }

          sendResponse(
            res,
            200,
            true,
            { groups },
            "Common groups fetched successfully."
          );
        } catch (error) {
          console.error("Error fetching common groups:", error.message);
          sendResponse(res, 500, false, null, "Failed to fetch common groups.");
        }
        break;

      default:
        sendResponse(res, 400, false, null, `Invalid operation: ${operation}`);
    }
  } catch (error) {
    console.error("Error processing request:", error.message);
    sendResponse(res, 500, false, null, error.message);
  }
};

module.exports = { whatsappHandler };
