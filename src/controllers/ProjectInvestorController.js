import db from "../config/db.js";

// founder and investor 
export async function cancelProjectRequest(req, res) {
  try {
    const uid = req.user.uid;
    const { request_id } = req.body;

    if (!request_id) {
      return res.status(400).json({ error: "request_id is required" });
    }

    const [result] = await db.query(
      `
      DELETE FROM project_requests
      WHERE id = ?
      AND (requestby_uid = ? OR responseby_uid = ?)
      `,
      [request_id, uid, uid]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Request not found or not authorized" });
    }

    return res.json({ success: true, message: "Request cancelled" });
  } catch (err) {
    console.error("CANCEL REQUEST ERROR >>>", err);
    return res.status(500).json({ error: "Failed to cancel request" });
  }
}

// founder side
export async function listSentProjectRequests(req, res) {
  try {
    const uid = req.user.uid;

    const [rows] = await db.query(
      `
      SELECT 
        pr.id,
        pr.pid,
        pr.title,
        pr.category,
        pr.response_status,

        u.uid            AS investor_id,
        u.name           AS name,
        u.company_name   AS company_name,
        u.bio            AS bio,
        u.min_investment AS min_investment,
        u.max_investment AS max_investment,
        u.profile_image  AS profile_image

      FROM project_requests pr
      JOIN users u
        ON pr.responseby_uid = u.uid

      WHERE pr.requestby_uid = ?
      ORDER BY pr.created_at DESC
      `,
      [uid]
    );

    return res.json({
      success: true,
      requests: rows
    });

  } catch (err) {
    console.error("LIST SENT REQUESTS ERROR >>>", err);
    return res.status(500).json({
      error: "Failed to fetch sent requests"
    });
  }
}



// investor side
export async function listReceivedProjectRequests(req, res) {
  try {
    const uid = req.user.uid;

    const [rows] = await db.query(
      `
      SELECT
        pr.id,
        pr.pid,
        pr.title,
        pr.category,
        pr.response_status,
        pr.chat_access,
        pr.is_invested,
        pr.created_at,
        u.uid AS founder_uid,
        u.name AS founder_name,
        u.email,
        u.phone
      FROM project_requests pr
      JOIN users u ON u.uid = pr.requestby_uid
      WHERE pr.responseby_uid = ?
      ORDER BY pr.created_at DESC
      `,
      [uid]
    );

    return res.json({ success: true, requests: rows });
  } catch (err) {
    console.error("LIST RECEIVED REQUESTS ERROR >>>", err);
    return res.status(500).json({ error: "Failed to fetch received requests" });
  }
}

//investor side
export async function updateRequestStatus(req, res) {
  try {
    const uid = req.user.uid;
    const { request_id, status } = req.body;

    const chatAccess = status === "accepted" ? 1 : 0;

    await db.query(
      `
      UPDATE project_requests
      SET response_status = ?, chat_access = ?
      WHERE id = ? AND responseby_uid = ?
      `,
      [status, chatAccess, request_id, uid]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("UPDATE REQUEST STATUS ERROR >>>", err);
    return res.status(500).json({ error: "Failed to update request" });
  }
}
