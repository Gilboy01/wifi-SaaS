// services/router.service.js

const RouterOSAPI = require("node-routeros").RouterOSAPI;

const config = require("../config/router.config");


const Hotspot = require("../models/hotspot.model");


// connect to router
// const connectRouter = async () => {
//   const conn = new RouterOSAPI({
//     host: config.host,
//     user: config.user,
//     password: config.password,
//     port: config.port
//   });
//   await conn.connect();
//   return conn;
// };

const connectRouter = async (hotspotId) => {

  // find hotspot
  const hotspot = await Hotspot.findById( hotspotId);

  if (!hotspot) {
    throw new Error( "Hotspot not found");

  }

  const conn = new RouterOSAPI({
      host: hotspot.routerHost,
      user: hotspot.routerUser,
      password:hotspot.routerPassword,
      port: hotspot.routerPort
    });

  await conn.connect();

  return conn;

};

// grant internet access

// exports.grantInternetAccess = async ({ macAddress }) => {
//   const conn = await connectRouter();
//   try {
//     await conn.write(
//       "/ip/hotspot/ip-binding/add",
//       [
//         "=mac-address=" + macAddress,
//         "=type=bypassed",
//         "=comment=wifi-saas"
//       ]
//     );
//     console.log("Internet granted to", macAddress);
//   } catch (error) {
//     console.log("Router grant access error", error);
//   } finally {
//     conn.close();
//   }
// };

exports.grantInternetAccess =  async ({
    hotspotId,
    macAddress
  }) => {

  const conn = await connectRouter(hotspotId);

  try {

    await conn.write(
      "/ip/hotspot/ip-binding/add",
      [
        "=mac-address=" + macAddress,
        "=type=bypassed",
        "=comment=wifi-saas"
      ]
    );

    console.log( `Internet granted to MAC - ${macAddress}`);

  } catch (error) {
    console.log("Grant access error", error );
  } finally {
    conn.close();
  }

};

// Revoke internet access

// exports.revokeInternetAccess = async ({ macAddress }) => {
//   const conn = await connectRouter();
//   try {
//     // find binding
//     const bindings = await conn.write(
//         "/ip/hotspot/ip-binding/print",
//         [
//           "?mac-address=" + macAddress
//         ]
//       );
//     if (bindings.length > 0) {
//       await conn.write(
//         "/ip/hotspot/ip-binding/remove",
//         [
//           "=.id=" + bindings[0][".id"]
//         ]
//       );
//     }
//     console.log(
//       "Internet revoked for", macAddress
//     );
//   } catch (error) {
//     console.log(
//       "Router revoke error",
//       error
//     );
//   } finally {
//     conn.close();
//   }
// };

exports.revokeInternetAccess = async ({
    hotspotId,
    macAddress
  }) => {

  const conn = await connectRouter( hotspotId );

  try {

    const bindings = await conn.write("/ip/hotspot/ip-binding/print",
        [
          "?mac-address=" + macAddress
        ]
      );

    if (bindings.length > 0) {
      await conn.write("/ip/hotspot/ip-binding/remove", 
        [
          "=.id=" +
            bindings[0][".id"]
        ]

      );

    }

    console.log( `Internet revoked for MAC - ${macAddress}`);

  } catch (error) {

    console.log( "Revoke error", error);

  } finally {

    conn.close();

  }

};