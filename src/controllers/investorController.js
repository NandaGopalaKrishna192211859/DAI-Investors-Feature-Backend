import db from "../config/db.js";
console.log("SEND API CALLED");

/**
 * GET /api/investors/category/:categoryName
 * Returns all investors who prefer this category
 */
export async function getInvestorsByCategory(req, res) {
  try {
    const { categoryName } = req.params;

    if (!categoryName) {
      return res.status(400).json({ error: "Category name is required." });
    }

    const [rows] = await db.query(
      `
      SELECT 
        uid,
        name,
        email,
        phone,
        profile_image,
        company_name,
        linkedin_url,
        website_url,
        bio,
        past_investments,
        investment_type,
        min_investment,
        max_investment,
        preferred_categories
      FROM users
      WHERE is_investor = 1
        AND preferred_categories IS NOT NULL
        AND LOWER(preferred_categories) LIKE LOWER(CONCAT('%', ?, '%'))
      ORDER BY name ASC
      `,
      [categoryName.trim()]
    );

    return res.json({
      category: categoryName,
      count: rows.length,
      investors: rows
    });

  } catch (err) {
    console.error("GET INVESTORS BY CATEGORY ERROR >>>", err);
    return res.status(500).json({ error: "Failed to fetch investors by category." });
  }
}

/**
 * GET /api/investors/all
 * Returns all investors in the platform (community)
 */
export async function getAllInvestors(req, res) {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        uid,
        name,
        email,
        phone,
        profile_image,
        company_name,
        linkedin_url,
        website_url,
        bio,
        past_investments,
        investment_type,
        min_investment,
        max_investment,
        preferred_categories,
        verified_investor
      FROM users
      WHERE is_investor = 1
      ORDER BY verified_investor DESC, name ASC
      `
    );

    return res.json({
      count: rows.length,
      investors: rows
    });

  } catch (err) {
    console.error("GET ALL INVESTORS ERROR >>>", err);
    return res.status(500).json({ error: "Failed to fetch investors." });
  }
}


/**
 * POST /api/project/send-package
 * Body: { investorIds: [], projectId, isHub }
 */
export async function sendProjectPackage(req, res) {
  try {
    console.log("SEND PACKAGE HIT >>>", req.body, req.user.uid);

    const founder_uid = req.user.uid;
    const { investorIds = [], projectId } = req.body;

    console.log("INVESTOR IDS >>>", investorIds);
    
    const [projectRows] = await db.query(
      "SELECT * FROM projects WHERE pid = ? AND uid = ?",
      [projectId, founder_uid]
    );

    if (projectRows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = projectRows[0];
    const projectCategoryName = project.category_id; // ✅ already a name

    let insertedCount = 0;
    let skipped = [];

    for (const investor_uid of investorIds) {

      const [investorRows] = await db.query(
        "SELECT preferred_categories FROM users WHERE uid = ? AND is_investor = 1",
        [investor_uid]
      );

      if (investorRows.length === 0) {
        skipped.push({ investor_uid, reason: "Investor not found" });
        continue;
      }

      let investorCategories = [];
      try {
        investorCategories = JSON.parse(investorRows[0].preferred_categories || "[]");
      } catch { }

      // if (!investorCategories.includes(projectCategoryName)) {
      //   skipped.push({ investor_uid, reason: "Category mismatch" });
      //   continue;
      // }

      // ✅ CORRECT INSERT
      try {
        await db.query(
          `
    INSERT INTO project_requests
    (pid, requestby_uid, responseby_uid, title, category, package, response_status)
    VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `,
          [
            project.pid,
            founder_uid,
            investor_uid,
            project.project_title,
            projectCategoryName,
            project.explanation
          ]
        );
        console.log("INSERTED FOR >>>", investor_uid);
      } catch (e) {
        console.error("INSERT FAILED >>>", e.sqlMessage);
      }


      insertedCount++;

      console.log(
        "MATCH CHECK >>>",
        projectCategoryName,
        investorCategories
      );

    }

    return res.json({
      success: true,
      sent_to_investors: insertedCount,
      skipped
    });

  } catch (err) {
    console.error("SEND PROJECT PACKAGE ERROR >>>", err);
    return res.status(500).json({ error: "Failed to send project package" });
  }
}



/**
 * GET /api/project/my-connectors
 * Shows all investors a founder has sent project requests to.
 */
export async function getMyConnectors(req, res) {
  try {
    const founder_uid = req.user.uid;

    // 1️⃣ Fetch all requests made by this founder
    const [rows] = await db.query(
      `
      SELECT 
        ir.id,
        ir.investor_uid,
        ir.project_id,
        ir.status,
        ir.source_type,
        ir.created_at,
        u.name AS investor_name,
        u.profile_image,
        u.company_name,
        u.linkedin_url
      FROM investor_requests ir
      LEFT JOIN users u 
        ON ir.investor_uid = u.uid
      WHERE ir.founder_uid = ?
      ORDER BY ir.created_at DESC
      `,
      [founder_uid]
    );

    return res.json({
      success: true,
      count: rows.length,
      connectors: rows
    });

  } catch (err) {
    console.error("GET MY CONNECTORS ERROR >>>", err);
    return res.status(500).json({ error: "Failed to fetch connectors." });
  }
}

/**
 * GET /api/investors/inbox
 * Shows all project requests received by an investor
 */
export async function getInvestorInbox(req, res) {
  try {
    const investor_uid = req.user.uid;

    // 1️⃣ Fetch all incoming requests for this investor
    const [rows] = await db.query(
      `
      SELECT 
        ir.id AS request_id,
        ir.project_id,
        ir.founder_uid,
        ir.status,
        ir.source_type,
        ir.created_at,

        u.name AS founder_name,
        u.profile_image AS founder_profile,
        u.company_name AS founder_company,
        u.linkedin_url AS founder_linkedin,

        p.project_title,
        p.category_id,
        p.package_path

      FROM investor_requests ir
      LEFT JOIN users u ON ir.founder_uid = u.uid
      LEFT JOIN projects p ON ir.project_id = p.pid

      WHERE ir.investor_uid = ?
      ORDER BY ir.created_at DESC
      `,
      [investor_uid]
    );

    return res.json({
      success: true,
      count: rows.length,
      requests: rows
    });

  } catch (err) {
    console.error("GET INVESTOR INBOX ERROR >>>", err);
    return res.status(500).json({ error: "Failed to fetch investor inbox." });
  }
}

/**
 * POST /api/investors/respond
 * Investor accepts, rejects, or invests in a request
 */
export async function respondToRequest(req, res) {
  try {
    const investor_uid = req.user.uid;
    const { request_id, action } = req.body;

    if (!request_id || !action) {
      return res.status(400).json({ error: "request_id and action are required." });
    }

    const validActions = ["accept", "reject", "invest"];

    if (!validActions.includes(action)) {
      return res.status(400).json({
        error: "Invalid action. Allowed: accept, reject, invest"
      });
    }

    // Ensure request belongs to this investor
    const [rows] = await db.query(
      `
      SELECT * FROM investor_requests
      WHERE id = ? AND investor_uid = ?
      `,
      [request_id, investor_uid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Request not found for this investor." });
    }

    // Map actions to database status
    const actionToStatus = {
      accept: "accepted",
      reject: "rejected",
      invest: "invested"
    };

    const newStatus = actionToStatus[action];

    // Update status
    await db.query(
      `
      UPDATE investor_requests
      SET status = ?
      WHERE id = ? AND investor_uid = ?
      `,
      [newStatus, request_id, investor_uid]
    );

    return res.json({
      success: true,
      message: `Request ${newStatus}`,
      updated_status: newStatus
    });

  } catch (err) {
    console.error("RESPOND REQUEST ERROR >>>", err);
    return res.status(500).json({ error: "Failed to update request status." });
  }
}

/**
 * GET /api/projects/chat/check-access?project_id=11
 * Check if founder or investor can open chat
 */
export async function checkChatAccess(req, res) {
  try {
    const user_uid = req.user.uid;
    const { project_id } = req.query;

    if (!project_id) {
      return res.status(400).json({ error: "project_id is required." });
    }

    // Fetch matching accepted request
    const [rows] = await db.query(
      `
      SELECT * FROM investor_requests
      WHERE project_id = ?
        AND status = 'accepted'
      LIMIT 1
      `,
      [project_id]
    );

    // 1️⃣ No accepted request → chat not allowed
    if (rows.length === 0) {
      return res.json({
        allowed: false,
        message: "Chat not allowed. Investor has not accepted yet."
      });
    }

    const reqData = rows[0];

    // 2️⃣ Check if logged-in user is allowed (founder or investor)
    const allowed =
      reqData.founder_uid === user_uid ||
      reqData.investor_uid === user_uid;

    if (!allowed) {
      return res.json({
        allowed: false,
        message: "You are not part of this project chat."
      });
    }

    // 3️⃣ Everything OK → allow chat
    return res.json({
      allowed: true,
      message: "Chat access granted."
    });

  } catch (err) {
    console.error("CHAT ACCESS ERROR >>>", err);
    return res.status(500).json({ error: "Failed to check chat access." });
  }
}

/**
 * GET /api/investors/investor/profile/:uid
 */
export async function getInvestorProfile(req, res) {
  try {
    const { uid } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
        uid, name, email, phone,
        profile_image, company_name,
        linkedin_url, website_url,
        bio, past_investments,
        investment_type, min_investment, max_investment,
        preferred_categories,
        verified_investor
      FROM users
      WHERE uid = ? AND is_investor = 1
      `,
      [uid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Investor not found." });
    }

    let categories = [];
    try {
      categories = JSON.parse(rows[0].preferred_categories || "[]");
    } catch { }

    return res.json({
      success: true,
      investor: {
        ...rows[0],
        preferred_categories: categories
      }
    });

  } catch (err) {
    console.error("INVESTOR PROFILE ERROR >>>", err);
    return res.status(500).json({ error: "Failed to fetch investor profile." });
  }
}

/**
 * GET /api/projects/founder/profile/:uid
 */
export async function getFounderProfile(req, res) {
  try {
    const { uid } = req.params;

    // Founder basic info
    const [users] = await db.query(
      `
      SELECT 
        uid, name, email, phone,
        profile_image, linkedin_url,
        website_url, bio
      FROM users
      WHERE uid = ? AND is_investor = 0
      `,
      [uid]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "Founder not found." });
    }

    // Founder projects list
    const [projects] = await db.query(
      `
      SELECT pid, project_title, category_id
      FROM projects
      WHERE uid = ?
      ORDER BY created_at DESC
      `,
      [uid]
    );

    return res.json({
      success: true,
      founder: {
        ...users[0],
        projects
      }
    });

  } catch (err) {
    console.error("FOUNDER PROFILE ERROR >>>", err);
    return res.status(500).json({ error: "Failed to fetch founder profile." });
  }
}

/**
 * POST /api/projects/chat/send
 * Body: { project_id, message_text, receiver_uid (optional) }
 */
export async function sendMessage(req, res) {
  try {
    const sender_uid = req.user.uid;
    const { project_id, message_text, receiver_uid = null } = req.body;

    // 🔥 DEBUG LOGS (to check if receiver_uid is coming correctly)
    console.log("🔥 RECEIVER UID RECEIVED:", receiver_uid);
    console.log("🔥 FULL BODY RECEIVED:", req.body);

    if (!project_id || !message_text) {
      return res.status(400).json({ error: "project_id and message_text are required." });
    }

    // Check if chat is allowed
    const [accepted] = await db.query(
      `SELECT * FROM investor_requests WHERE project_id = ? AND status = 'accepted' LIMIT 1`,
      [project_id]
    );

    if (accepted.length === 0) {
      return res.status(403).json({ error: "Chat not allowed. Request not accepted yet." });
    }

    const reqData = accepted[0];

    if (reqData.founder_uid !== sender_uid && reqData.investor_uid !== sender_uid) {
      return res.status(403).json({ error: "You are not part of this chat." });
    }

    // Insert message
    const [result] = await db.query(
      `INSERT INTO messages (project_id, sender_uid, receiver_uid, message_text)
       VALUES (?, ?, ?, ?)`,
      [project_id, sender_uid, receiver_uid, message_text]
    );

    // Insert notification only if receiver_uid exists
    if (!receiver_uid) {
      console.log("❌ Notification not created — receiver_uid missing");
    } else {
      console.log("🔔 Creating notification for user:", receiver_uid);

      await db.query(
        `
        INSERT INTO notifications (user_uid, type, meta)
        VALUES (?, 'chat_message', ?)
        `,
        [receiver_uid, JSON.stringify({ project_id, sender_uid })]
      );
    }

    return res.json({
      success: true,
      message_id: result.insertId,
      message: "Message sent"
    });

  } catch (err) {
    console.error("SEND MESSAGE ERROR >>>", err);
    return res.status(500).json({ error: "Failed to send message." });
  }
}


/**
 * GET /api/projects/chat/messages?project_id=11
 */
export async function getMessages(req, res) {
  try {
    const user_uid = req.user.uid;
    const { project_id } = req.query;

    if (!project_id) {
      return res.status(400).json({ error: "project_id is required." });
    }

    // Check if chat allowed same as send
    const [accepted] = await db.query(
      `SELECT * FROM investor_requests WHERE project_id = ? AND status = 'accepted' LIMIT 1`,
      [project_id]
    );

    if (accepted.length === 0) {
      return res.status(403).json({ error: "Chat not allowed." });
    }

    const reqData = accepted[0];
    if (reqData.founder_uid !== user_uid && reqData.investor_uid !== user_uid) {
      return res.status(403).json({ error: "You are not part of this chat." });
    }

    // Fetch messages
    const [rows] = await db.query(
      `
      SELECT 
        m.id,
        m.project_id,
        m.sender_uid,
        m.receiver_uid,
        m.message_text,
        m.created_at,
        u.name AS sender_name,
        u.profile_image AS sender_profile
      FROM messages m
      LEFT JOIN users u ON m.sender_uid = u.uid
      WHERE m.project_id = ?
      ORDER BY m.created_at ASC
      `,
      [project_id]
    );

    return res.json({
      success: true,
      count: rows.length,
      messages: rows
    });

  } catch (err) {
    console.error("GET MESSAGES ERROR >>>", err);
    return res.status(500).json({ error: "Failed to fetch messages." });
  }
}

/**
 * GET /api/notifications
 */
export async function getNotifications(req, res) {
  try {
    const user_uid = req.user.uid;

    const [rows] = await db.query(
      `
      SELECT id, type, meta, is_read, created_at
      FROM notifications
      WHERE user_uid = ?
      ORDER BY created_at DESC
      LIMIT 200
      `,
      [user_uid]
    );

    // Parse meta JSON
    const notifications = rows.map(n => {
      let meta = null;
      try { meta = JSON.parse(n.meta || "{}"); } catch { }
      return { ...n, meta };
    });

    return res.json({
      success: true,
      count: notifications.length,
      notifications
    });

  } catch (err) {
    console.error("GET NOTIFICATIONS ERROR >>>", err);
    return res.status(500).json({ error: "Failed to fetch notifications." });
  }
}

/**
 * POST /api/notifications/mark-read
 * Body: { id: 5 } or { ids: [1,2,3] }
 */
export async function markNotificationsRead(req, res) {
  try {
    const user_uid = req.user.uid;
    let { id, ids = [] } = req.body;

    if (id) ids = [id];
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "id or ids is required." });
    }

    await db.query(
      `
      UPDATE notifications 
      SET is_read = 1 
      WHERE id IN (?) AND user_uid = ?
      `,
      [ids, user_uid]
    );

    return res.json({
      success: true,
      message: "Notifications marked as read"
    });

  } catch (err) {
    console.error("MARK NOTIFICATIONS ERROR >>>", err);
    return res.status(500).json({ error: "Failed to mark notifications read." });
  }
}


/**
 * GET /api/investors/hub-feed
 * Returns all hub-published projects
 */
export async function getHubFeed(req, res) {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        ir.id AS post_id,
        ir.project_id,
        ir.created_at AS published_at,

        p.project_title,
        p.category_id,
        p.package_path,
        p.image_path,
        p.uml_path,

        c.category_name,

        u.uid AS founder_uid,
        u.name AS founder_name,
        u.profile_image AS founder_profile
      FROM investor_requests ir
      JOIN projects p ON ir.project_id = p.pid
      JOIN users u ON p.uid = u.uid
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ir.source_type = 'hub'
      ORDER BY ir.created_at DESC
      `
    );

    return res.json({
      success: true,
      count: rows.length,
      feed: rows
    });

  } catch (err) {
    console.error("HUB FEED ERROR >>>", err);
    return res.status(500).json({ error: "Failed to load hub feed." });
  }
}
