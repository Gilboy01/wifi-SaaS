// services/router.service.js

const RouterOSAPI = require("node-routeros").RouterOSAPI;

const config = require("../config/router.config");


// connect to router
const connectRouter = async () => {

  const conn = new RouterOSAPI({

    host: config.host,

    user: config.user,

    password: config.password,

    port: config.port

  });

  await conn.connect();

  return conn;

};

// grant internet access

exports.grantInternetAccess = async ({ macAddress }) => {

  const conn = await connectRouter();

  try {

    await conn.write(

      "/ip/hotspot/ip-binding/add",

      [

        "=mac-address=" + macAddress,

        "=type=bypassed",

        "=comment=wifi-saas"

      ]

    );

    console.log("Internet granted to", macAddress);

  } catch (error) {

    console.log("Router grant access error", error);

  } finally {

    conn.close();

  }

};

// Revoke internet access
exports.revokeInternetAccess = async ({ macAddress }) => {

  const conn = await connectRouter();

  try {

    // find binding
    const bindings = await conn.write(

        "/ip/hotspot/ip-binding/print",

        [
          "?mac-address=" + macAddress
        ]

      );

    if (bindings.length > 0) {

      await conn.write(

        "/ip/hotspot/ip-binding/remove",

        [
          "=.id=" + bindings[0][".id"]
        ]

      );

    }

    console.log(
      "Internet revoked for", macAddress
    );

  } catch (error) {

    console.log(
      "Router revoke error",
      error
    );

  } finally {

    conn.close();

  }

};