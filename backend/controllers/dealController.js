const db = require("../config/db");

// ============================================================
// CREATE DEAL
// POST /api/deals
// ============================================================

const createDeal = async (req, res) => {
  try {
    const buyerId = req.user.id;

    const {
      offer_id,
      crop_id,
      farmer_id,
      quantity,
      agreed_price,
      message,
    } = req.body;

    if (!offer_id || !crop_id || !farmer_id) {
      return res.status(400).json({
        success: false,
        message: "offer_id, crop_id and farmer_id are required",
      });
    }

    // --------------------------------------------------------
    // Check if deal already exists
    // --------------------------------------------------------

    const [existingDeals] = await db.query(
      `
      SELECT id
      FROM deals
      WHERE offer_id = ?
      LIMIT 1
      `,
      [offer_id]
    );

    if (existingDeals.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Deal already exists for this offer",
        deal_id: existingDeals[0].id,
      });
    }

    // --------------------------------------------------------
    // Create deal
    // --------------------------------------------------------

    const [result] = await db.query(
      `
      INSERT INTO deals
      (
        offer_id,
        buyer_id,
        farmer_id,
        crop_id,
        quantity,
        agreed_price,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, 'accepted')
      `,
      [
        offer_id,
        buyerId,
        farmer_id,
        crop_id,
        quantity || 0,
        agreed_price || 0,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Deal created successfully",
      deal_id: result.insertId,
    });
  } catch (error) {
    console.error("CREATE DEAL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create deal",
      error: error.message,
    });
  }
};

// ============================================================
// GET BUYER DEALS
// GET /api/deals/buyer
// ============================================================

const getBuyerDeals = async (req, res) => {
  try {
    const buyerId = req.user.id;

    console.log("=================================");
    console.log("GET BUYER DEALS");
    console.log("BUYER ID:", buyerId);
    console.log("=================================");

    const [rows] = await db.query(
      `
      SELECT
        d.id,
        d.offer_id,
        d.buyer_id,
        d.farmer_id,
        d.crop_id,
        d.quantity,
        d.agreed_price,
        d.status,
        d.created_at,
        d.updated_at,

        c.crop_name,
        c.crop_variety,
        c.quantity_unit,

        COALESCE(
          CONCAT(fp.first_name, ' ', fp.last_name),
          CONCAT(u.first_name, ' ', u.last_name),
          u.name,
          'Farmer'
        ) AS farmer_name

      FROM deals d

      LEFT JOIN crops c
        ON c.id = d.crop_id

      LEFT JOIN users u
        ON u.id = d.farmer_id

      LEFT JOIN farmer_profiles fp
        ON fp.user_id = d.farmer_id

      WHERE d.buyer_id = ?

      ORDER BY d.created_at DESC
      `,
      [buyerId]
    );

    console.log("BUYER DEALS:", rows.length);

    return res.status(200).json({
      success: true,
      deals: rows,
    });
  } catch (error) {
    console.error("GET BUYER DEALS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch buyer deals",
      error: error.message,
    });
  }
};

// ============================================================
// GET FARMER DEALS
// GET /api/deals/farmer
// ============================================================

const getFarmerDeals = async (req, res) => {
  try {
    const farmerId = req.user.id;

    console.log("=================================");
    console.log("GET FARMER DEALS");
    console.log("FARMER ID:", farmerId);
    console.log("=================================");

    const [rows] = await db.query(
      `
      SELECT
        d.id,
        d.offer_id,
        d.buyer_id,
        d.farmer_id,
        d.crop_id,
        d.quantity,
        d.agreed_price,
        d.status,
        d.created_at,
        d.updated_at,

        c.crop_name,
        c.crop_variety,
        c.quantity_unit,

        COALESCE(
          CONCAT(bp.first_name, ' ', bp.last_name),
          CONCAT(u.first_name, ' ', u.last_name),
          u.name,
          'Buyer'
        ) AS buyer_name

      FROM deals d

      LEFT JOIN crops c
        ON c.id = d.crop_id

      LEFT JOIN users u
        ON u.id = d.buyer_id

      LEFT JOIN buyer_profiles bp
        ON bp.user_id = d.buyer_id

      WHERE d.farmer_id = ?

      ORDER BY d.created_at DESC
      `,
      [farmerId]
    );

    console.log("FARMER DEALS:", rows.length);

    return res.status(200).json({
      success: true,
      deals: rows,
    });
  } catch (error) {
    console.error("GET FARMER DEALS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch farmer deals",
      error: error.message,
    });
  }
};

// ============================================================
// GET SINGLE DEAL
// GET /api/deals/:id
// ============================================================

const getDealById = async (req, res) => {
  try {
    const dealId = req.params.id;
    const userId = req.user.id;
    const role = req.user.role;

    const [rows] = await db.query(
      `
      SELECT
        d.*,

        c.crop_name,
        c.crop_variety,
        c.quantity_unit,

        COALESCE(
          CONCAT(bp.first_name, ' ', bp.last_name),
          CONCAT(u.first_name, ' ', u.last_name)
        ) AS buyer_name,

        COALESCE(
          CONCAT(fp.first_name, ' ', fp.last_name),
          CONCAT(fu.first_name, ' ', fu.last_name)
        ) AS farmer_name

      FROM deals d

      LEFT JOIN crops c
        ON c.id = d.crop_id

      LEFT JOIN users u
        ON u.id = d.buyer_id

      LEFT JOIN buyer_profiles bp
        ON bp.user_id = d.buyer_id

      LEFT JOIN users fu
        ON fu.id = d.farmer_id

      LEFT JOIN farmer_profiles fp
        ON fp.user_id = d.farmer_id

      WHERE d.id = ?
      LIMIT 1
      `,
      [dealId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    const deal = rows[0];

    // --------------------------------------------------------
    // Authorization
    // --------------------------------------------------------

    if (
      (role === "buyer" && deal.buyer_id !== userId) ||
      (role === "farmer" && deal.farmer_id !== userId)
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this deal",
      });
    }

    return res.status(200).json({
      success: true,
      deal,
    });
  } catch (error) {
    console.error("GET DEAL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch deal",
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE DEAL STATUS
// PATCH /api/deals/:id/status
// ============================================================

const updateDealStatus = async (req, res) => {
  try {
    const dealId = req.params.id;
    const userId = req.user.id;

    const { status } = req.body;

    const allowedStatuses = [
      "accepted",
      "payment_pending",
      "paid",
      "completed",
      "cancelled",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Allowed values: accepted, payment_pending, paid, completed, cancelled",
      });
    }

    const [deals] = await db.query(
      `
      SELECT *
      FROM deals
      WHERE id = ?
      LIMIT 1
      `,
      [dealId]
    );

    if (deals.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    const deal = deals[0];

    if (
      Number(deal.buyer_id) !== Number(userId) &&
      Number(deal.farmer_id) !== Number(userId)
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this deal",
      });
    }

    await db.query(
      `
      UPDATE deals
      SET status = ?
      WHERE id = ?
      `,
      [status, dealId]
    );

    return res.status(200).json({
      success: true,
      message: "Deal status updated successfully",
    });
  } catch (error) {
    console.error("UPDATE DEAL STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update deal status",
      error: error.message,
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createDeal,
  getBuyerDeals,
  getFarmerDeals,
  getDealById,
  updateDealStatus,
};