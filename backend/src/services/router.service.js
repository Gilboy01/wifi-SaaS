// services/router.service.js


const RouterOSAPI = require("node-routeros").RouterOSAPI;

const config = require("../config/router.config");


const Hotspot = require("../models/hotspot.model");

const isRouterMockEnabled = () => {
  return ["true", "1", "yes"].includes(String(process.env.ROUTER_MOCK).toLowerCase());
};

const ensureHotspotExists = async (hotspotId) => {
  const hotspot = await Hotspot.findById(hotspotId);

  if (!hotspot) {
    throw new Error("Hotspot not found");
  }

  return hotspot;
};

// connect to router
const connectRouter = async (hotspotId) => {

  // find hotspot
  const hotspot = await ensureHotspotExists(hotspotId);

  if (!hotspot.routerIp || !hotspot.routerUsername || !hotspot.routerPassword) {
    throw new Error("Router connection details are incomplete for this hotspot");
  }

  const routerHost = hotspot.routerIp.trim();
  const routerPort = Number(hotspot.routerPort || config.defaultPort || 8728);
  const timeout = Math.ceil((config.connectionTimeout || 10000) / 1000);

  const conn = new RouterOSAPI({
      host: routerHost,
      user: hotspot.routerUsername,
      password:hotspot.routerPassword,
      port: routerPort,
      timeout
    });

  try {
    await conn.connect();
  } catch (error) {
    error.message = `Failed to connect to RouterOS API at ${routerHost}:${routerPort} (${error.message})`;
    throw error;
  }

  return conn;

};

// grant internet access

exports.grantInternetAccess =  async ({
    hotspotId,
    macAddress
  }) => {

  if (isRouterMockEnabled()) {
    await ensureHotspotExists(hotspotId);
    console.log(`[Router mock] Internet granted to MAC - ${macAddress}`);
    return;
  }

  let conn;

  try {
    conn = await connectRouter(hotspotId);

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
    throw error;
  } finally {
    if (conn) {
      conn.close();
    }
  }

};

// Revoke internet access

exports.revokeInternetAccess = async ({
    hotspotId,
    macAddress
  }) => {

  if (isRouterMockEnabled()) {
    await ensureHotspotExists(hotspotId);
    console.log(`[Router mock] Internet revoked for MAC - ${macAddress}`);
    return;
  }

  let conn;

  try {
    conn = await connectRouter( hotspotId );

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
    throw error;

  } finally {

    if (conn) {
      conn.close();
    }

  }

};
