const { create } = require("@wppconnect-team/wppconnect");
const QRCode = require("qrcode");
const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const sessions = {};
const qrCodeDir = path.join(__dirname, "../../public/whatsapp/qr-codes");

if (!fs.existsSync(qrCodeDir)) {
  fs.mkdirSync(qrCodeDir);
}

/**
 * Initializes a WhatsApp session. Returns a URL to access the QR code if the session is not yet authenticated.
 */
const initializeSession = async (sessionName) => {
  if (sessions[sessionName]) {
    return { status: "active", message: "Session is already active." };
  }

  return new Promise((resolve, reject) => {
    create({
      session: sessionName,
      catchQR: (qrCode) => {
        console.log("QR Code:", qrCode);

        const qrCodePath = path.join(qrCodeDir, `${sessionName}.png`);
        const base64Data = qrCode.replace(/^data:image\/png;base64,/, "");
        fs.writeFileSync(qrCodePath, base64Data, "base64");

        const qrCodeUrl = `http://localhost:3000/whatsapp/qr-codes/${sessionName}.png`;
        resolve({ qrCodeUrl });
      },
      statusFind: (status) => {
        console.log(`Session ${sessionName} status:`, status);

        if (status === "qrReadSuccess" || status === "connected") {
          const qrCodePath = path.join(qrCodeDir, `${sessionName}.png`);
          if (fs.existsSync(qrCodePath)) {
            fs.unlinkSync(qrCodePath);
            console.log(`QR code file for session ${sessionName} deleted.`);
          }
        }

        if (status === "timeout" || status === "desconnectedMobile") {
          const qrCodePath = path.join(qrCodeDir, `${sessionName}.png`);
          if (fs.existsSync(qrCodePath)) {
            fs.unlinkSync(qrCodePath);
            console.log(
              `QR code file for session ${sessionName} deleted due to timeout/disconnected.`
            );
          }
        }
      },
    })
      .then((client) => {
        sessions[sessionName] = client;
        resolve({ status: "active", message: "Session successfully created." });
      })
      .catch((error) => {
        console.error(`Error creating session ${sessionName}:`, error.message);
        reject(new Error("Failed to initialize session."));
      });
  });
};

/**
 * Gets the status of a WhatsApp session.
 */
const getSessionStatus = async (sessionName) => {
  const session = sessions[sessionName];
  if (!session) {
    return { status: "inactive", message: "Session not found." };
  }
  return { status: "active", message: "Session is active." };
};

/**
 * Sends a text message.
 */
const sendTextMessage = async (sessionName, to, message) => {
  const session = sessions[sessionName];
  if (!session) throw new Error("Session not found.");

  return await session.sendText(to, message);
};

/**
 * Sends bulk text messages.
 */
const sendBulkMessages = async (sessionName, recipients, message) => {
  const session = sessions[sessionName];
  if (!session) throw new Error("Session not found.");

  const results = [];
  for (const recipient of recipients) {
    results.push(await session.sendText(recipient, message));
  }
  return results;
};

/**
 * Sends a media message.
 */
const sendMediaMessage = async (
  sessionName,
  to,
  mediaUrl,
  type,
  caption = ""
) => {
  const session = sessions[sessionName];
  if (!session) throw new Error("Session not found.");

  switch (type.toLowerCase()) {
    case "image":
      return await session.sendImage(to, mediaUrl, "image", caption);
    case "video":
      return await session.sendVideoAsGif(to, mediaUrl, "video", caption);
    case "audio":
      return await session.sendVoice(to, mediaUrl);
    case "document":
      return await session.sendFile(to, mediaUrl, "document", caption);
    default:
      throw new Error("Unsupported media type.");
  }
};

/**
 * Sends a poll message.
 * @param {string} sessionName - The name of the WhatsApp session.
 * @param {string} to - The recipient's chat ID (e.g., '1234567890@c.us').
 * @param {string} pollName - The name of the poll.
 * @param {Array} choices - The options for the poll (e.g., ['Option 1', 'Option 2']).
 * @param {Object} [options] - Optional settings for the poll, like selectableCount.
 */
const sendPollMessage = async (
  sessionName,
  to,
  pollName,
  choices,
  options = {}
) => {
  const session = sessions[sessionName];
  if (!session) throw new Error("Session not found.");

  // Ensure choices are an array and have at least two options
  if (!Array.isArray(choices) || choices.length < 2) {
    throw new Error("A poll requires at least two choices.");
  }

  try {
    // Send the poll message using the sendPollMessage method
    const result = await session.sendPollMessage(
      to,
      pollName,
      choices,
      options
    );
    return result;
  } catch (error) {
    console.error("Error sending poll message:", error.message);
    throw new Error("Failed to send poll message.");
  }
};

/**
 * Sends an order message with product or custom items.
 * @param {string} sessionName - The name of the WhatsApp session.
 * @param {string} to - The recipient's chat ID (e.g., '1234567890@c.us').
 * @param {Array} items - The list of items to send in the order message.
 * @param {Object} [options] - Optional order options like tax, shipping, and discount.
 */
const sendOrderMessage = async (sessionName, to, items, options = {}) => {
  const session = sessions[sessionName];
  if (!session) throw new Error("Session not found.");

  // Ensure items is an array and has at least one item
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("An order message requires at least one item.");
  }

  try {
    // Send the order message using the sendOrderMessage method
    const result = await session.sendOrderMessage(to, items, options);
    return result;
  } catch (error) {
    console.error("Error sending order message:", error.message);
    throw new Error("Failed to send order message.");
  }
};

/**
 * Sends a message with additional options (e.g., buttons, interactive elements).
 * @param {string} sessionName - The name of the WhatsApp session.
 * @param {string} to - The recipient's chat ID (e.g., '1234567890@c.us').
 * @param {string} content - The content of the message.
 * @param {Object} [options] - Optional settings, like buttons, quick replies, etc.
 */
const sendMessageWithOptions = async (
  sessionName,
  to,
  content,
  options = {}
) => {
  const session = sessions[sessionName];
  if (!session) throw new Error("Session not found.");

  try {
    // Send the message with additional options like buttons
    const result = await session.sendMessageOptions(to, content, options);
    return result;
  } catch (error) {
    console.error("Error sending message with options:", error.message);
    throw new Error("Failed to send message with options.");
  }
};

/**
 * Sends a list message.
 * @param {string} sessionName - The name of the WhatsApp session.
 * @param {string} to - The recipient's chat ID (e.g., '1234567890@c.us').
 * @param {Object} options - Options for the list message, including button text, description, and sections.
 */
const sendListMessage = async (sessionName, to, options) => {
  const session = sessions[sessionName];
  if (!session) throw new Error("Session not found.");

  try {
    // Send the list message
    const result = await session.sendListMessage(to, options);
    return result;
  } catch (error) {
    console.error("Error sending list message:", error.message);
    throw new Error("Failed to send list message.");
  }
};

/**
 * Lists the chats for a given session.
 * @param {string} sessionName - The name of the WhatsApp session.
 * @param {Object} options - Options for filtering the list of chats.
 * @returns {Promise<Chat[]>} - A list of chats.
 */
const listChats = async (sessionName, options = {}) => {
  const session = sessions[sessionName];
  if (!session) throw new Error("Session not found.");

  try {
    // List the chats with the provided options
    const chats = await session.listChats(options);
    return chats;
  } catch (error) {
    console.error("Error listing chats:", error.message);
    throw new Error("Failed to list chats.");
  }
};

/**
 * Marks messages as read in a given session.
 * @param {string} sessionName - The name of the WhatsApp session.
 * @param {string} messageId - The ID of the message to mark as read.
 */
const sendReadStatus = async (sessionName, messageId) => {
  const session = sessions[sessionName];
  if (!session) throw new Error("Session not found.");

  try {
    // Mark the message as read
    const result = await session.sendReadStatus(messageId);
    return result;
  } catch (error) {
    console.error("Error marking message as read:", error.message);
    throw new Error("Failed to send read status.");
  }
};

/**
 * Converts an image URL or path to a Base64-encoded string.
 * @param {string} imageSource - URL or path to the image file.
 * @returns {string} Base64-encoded image string.
 */
const encodeImageToBase64 = async (imageSource) => {
  try {
    let imageBuffer;

    // Check if it's a URL (starts with http/https)
    if (
      imageSource.startsWith("http://") ||
      imageSource.startsWith("https://")
    ) {
      const response = await axios.get(imageSource, {
        responseType: "arraybuffer",
      });
      imageBuffer = Buffer.from(response.data, "binary");
    }
    // Check if it's a local path
    else if (fs.existsSync(imageSource)) {
      imageBuffer = fs.readFileSync(imageSource);
    }
    // Check if it's already Base64
    else if (/^data:image\/[a-z]+;base64,/.test(imageSource)) {
      return imageSource; // Already in Base64 format
    } else {
      throw new Error(
        "Invalid image source format. Provide a valid URL, path, or Base64 string."
      );
    }

    const extname = path.extname(imageSource).slice(1);
    return `data:image/${extname};base64,${imageBuffer.toString("base64")}`;
  } catch (error) {
    throw new Error("Failed to encode image to Base64: " + error.message);
  }
};

/**
 * Creates a new newsletter with an image (URL, path, or Base64).
 */
const createNewsletter = async (sessionName, name, options = {}) => {
  const session = sessions[sessionName];
  if (!session) throw new Error("Session not found.");

  console.log("Initial Options:", options);

  if (options.picture) {
    try {
      options.picture = await encodeImageToBase64(options.picture);
      console.log("Picture encoded to Base64 successfully.");
      console.log("Base64 Encoded Picture:", options.picture);
    } catch (err) {
      console.error("Failed to encode picture:", err.message);
      throw new Error("Invalid picture format.");
    }
  }

  try {
    const result = await session.createNewsletter(name, options);
    console.log("Server Response:", result);

    return {
      success: true,
      newsletter: {
        id: result.id,
        name: result.name,
        description: result.description || options.description,
        picture: result.picture || options.picture,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      },
    };
  } catch (error) {
    console.error("Error from server:", error.response?.data || error.message);
    throw new Error("Failed to create newsletter.");
  }
};

/**
 * Deletes an existing newsletter.
 */
const destroyNewsletter = async (sessionName, id) => {
  const session = sessions[sessionName];
  if (!session) throw new Error("Session not found.");

  try {
    const result = await session.destroyNewsletter(id);
    return result;
  } catch (error) {
    console.error("Error destroying newsletter:", error.message);
    throw new Error("Failed to destroy newsletter.");
  }
};

/**
 * Edits an existing newsletter with an image (URL, path, or Base64).
 */
const editNewsletter = async (sessionName, id, opts = {}) => {
  const session = sessions[sessionName];
  if (!session) throw new Error("Session not found.");

  if (opts.picture) {
    opts.picture = await encodeImageToBase64(opts.picture);
  }

  try {
    const result = await session.editNewsletter(id, opts);

    // Return additional information after editing
    return {
      success: true,
      newsletter: {
        id: result.id,
        name: result.name,
        description: result.description || opts.description,
        picture: result.picture || opts.picture,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      },
    };
  } catch (error) {
    console.error("Error editing newsletter:", error.message);
    throw new Error("Failed to edit newsletter.");
  }
};

/**
 * Mutes notifications for a newsletter.
 */
const muteNewsletter = async (sessionName, id) => {
  const session = sessions[sessionName];
  if (!session) throw new Error("Session not found.");

  try {
    const result = await session.muteNewsletter(id);
    return result;
  } catch (error) {
    console.error("Error muting newsletter:", error.message);
    throw new Error("Failed to mute newsletter.");
  }
};

/**
 * Mendapatkan informasi grup dari link undangan atau ID undangan.
 * @param {string} inviteCode - Kode undangan atau link undangan.
 * @returns {Promise<Object>} Objek yang berisi informasi grup.
 */
const getGroupInfoFromInviteLink = async (sessionName, inviteCode) => {
  const session = sessions[sessionName];
  if (!session) throw new Error("Session not found.");

  try {
    // Mendapatkan informasi grup
    const groupInfo = await session.getGroupInfoFromInviteLink(inviteCode);

    // Mengembalikan informasi grup dalam format yang lebih terstruktur
    return {
      id: groupInfo.id,
      subject: groupInfo.subject,
      size: groupInfo.size,
      owner: groupInfo.owner,
      participants: groupInfo.participants.map((p) => ({
        id: p.id,
        isAdmin: p.isAdmin,
        isSuperAdmin: p.isSuperAdmin,
      })),
      description: groupInfo.desc,
      status: groupInfo.status,
      createdAt: new Date(groupInfo.creation * 1000).toLocaleString(),
    };
  } catch (error) {
    console.error("Error getting group info:", error.message);
    throw new Error("Failed to retrieve group information.");
  }
};

/**
 * Mengambil daftar grup yang umum antara pengguna dan kontak tertentu.
 * @param {string} wid - WhatsApp ID dari kontak.
 * @returns {Promise<WAJS.whatsapp.Wid[]>} - Daftar grup yang umum.
 */
const getCommonGroups = async (sessionName, wid) => {
  const session = sessions[sessionName];
  if (!session) throw new Error("Session not found.");

  try {
    const groups = await session.getCommonGroups(wid); // Mendapatkan grup umum
    return groups; // Mengembalikan daftar grup
  } catch (error) {
    console.error("Error fetching common groups:", error.message);
    throw new Error("Failed to fetch common groups.");
  }
};

module.exports = {
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
  getGroupInfoFromInviteLink,
  createNewsletter,
  destroyNewsletter,
  editNewsletter,
  muteNewsletter,
  getCommonGroups,
};
