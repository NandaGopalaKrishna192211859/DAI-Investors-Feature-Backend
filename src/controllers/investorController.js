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

// old
// export async function sendProjectPackage(req, res) {
//   try {
//     console.log("SEND API CALLED");
//     console.log("RAW BODY >>>", req.body);

//     const founder_uid = req.user.uid;

//     const {
//       investorIds = [],
//       projectId,
//       businessNote = "",
//       is_hub = false,
//       dev_status = "ongoing"
//     } = req.body;

//     // ===============================
//     // 1️⃣ Validate input
//     // ===============================
//     if (!Array.isArray(investorIds)) {
//       return res.status(400).json({
//         error: "investorIds must be an array"
//       });
//     }

//     if (!is_hub && investorIds.length === 0) {
//       return res.status(400).json({
//         error: "Select Investor Hub or at least one investor"
//       });
//     }

//     // ===============================
//     // 2️⃣ Fetch project + founder
//     // ===============================
//     const [rows] = await db.query(
//       `
//       SELECT 
//         p.pid,
//         p.project_title,
//         p.category_id,
//         p.explanation,
//         p.full_input,
//         p.image_path,
//         p.uml_path,
//         p.modification_version,
//         u.uid AS founder_uid,
//         u.name AS founder_name,
//         u.email AS founder_email,
//         u.phone AS founder_phone
//       FROM projects p
//       JOIN users u ON p.uid = u.uid
//       WHERE p.pid = ? AND p.uid = ?
//       `,
//       [projectId, founder_uid]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ error: "Project not found" });
//     }

//     const p = rows[0];

//     // ===============================
//     // 3️⃣ Build FINAL PACKAGE JSON
//     // ===============================
//     const packageJSON = {
//       project: {
//         pid: p.pid,
//         title: p.project_title,
//         category: p.category_id,
//         version: p.modification_version
//       },
//       founder: {
//         uid: p.founder_uid,
//         name: p.founder_name,
//         email: p.founder_email,
//         phone: p.founder_phone
//       },
//       contents: {
//         summary: p.explanation,
//         lld: p.full_input,
//         image_path: p.image_path,
//         uml_path: p.uml_path
//       },
//       business_advantage: businessNote,
//       sent_at: new Date().toISOString()
//     };

//     let insertedCount = 0;
//     let skipped = [];

//     // ===============================
//     // 4️⃣ HUB BROADCAST (is_hub = 1)
//     // ===============================

//     // existing part
    


//     if (is_hub) {
//   const [allInvestors] = await db.query(
//     "SELECT uid FROM users WHERE is_investor = 1"
//   );

//   for (const inv of allInvestors) {

//     // 🔍 DUPLICATE CHECK (columns 2 → 9)
//     const [exists] = await db.query(
//       `
//       SELECT id FROM project_requests
//       WHERE pid = ?
//         AND requestby_uid = ?
//         AND responseby_uid = ?
//         AND title = ?
//         AND category = ?
//         AND package = ?
//         AND is_hub = 1
//         AND dev_status = ?
//       LIMIT 1
//       `,
//       [
//         p.pid,
//         founder_uid,
//         inv.uid,
//         p.project_title,
//         p.category_id,
//         JSON.stringify(packageJSON),
//         dev_status
//       ]
//     );

//     if (exists.length > 0) {
//       skipped.push({ investorId: inv.uid, reason: "Already sent" });
//       continue;
//     }

//     // ✅ INSERT ONLY IF NOT EXISTS
//     await db.query(
//       `
//       INSERT INTO project_requests
//       (pid, requestby_uid, responseby_uid, title, category, package, is_hub, dev_status, response_status)
//       VALUES (?, ?, ?, ?, ?, ?, 1, ?, 'pending')
//       `,
//       [
//         p.pid,
//         founder_uid,
//         inv.uid,
//         p.project_title,
//         p.category_id,
//         JSON.stringify(packageJSON),
//         dev_status
//       ]
//     );

//     insertedCount++;
//   }
// }



//     // ===============================
//     // 5️⃣ DIRECT INVESTOR SEND (is_hub = 0)
//     // ===============================

//     // existing part
    


//     if (investorIds.length > 0) {
//   for (const rawInvestorId of investorIds) {

//     const investorId = Number(rawInvestorId);
//     if (!Number.isInteger(investorId)) continue;

//     // 🔍 DUPLICATE CHECK (columns 2 → 9)
//     const [exists] = await db.query(
//       `
//       SELECT id FROM project_requests
//       WHERE pid = ?
//         AND requestby_uid = ?
//         AND responseby_uid = ?
//         AND title = ?
//         AND category = ?
//         AND package = ?
//         AND is_hub = 0
//         AND dev_status = ?
//       LIMIT 1
//       `,
//       [
//         p.pid,
//         founder_uid,
//         investorId,
//         p.project_title,
//         p.category_id,
//         JSON.stringify(packageJSON),
//         dev_status
//       ]
//     );

//     if (exists.length > 0) {
//       skipped.push({ investorId, reason: "Already sent" });
//       continue;
//     }

//     // ✅ INSERT ONLY IF NOT EXISTS
//     await db.query(
//       `
//       INSERT INTO project_requests
//       (pid, requestby_uid, responseby_uid, title, category, package, is_hub, dev_status, response_status)
//       VALUES (?, ?, ?, ?, ?, ?, 0, ?, 'pending')
//       `,
//       [
//         p.pid,
//         founder_uid,
//         investorId,
//         p.project_title,
//         p.category_id,
//         JSON.stringify(packageJSON),
//         dev_status
//       ]
//     );

//     insertedCount++;
//   }
// }

//     // ===============================
//     // 6️⃣ Final response
//     // ===============================
//     return res.json({
//       success: true,
//       is_hub,
//       dev_status,
//       sent_to_investors: insertedCount,
//       skipped
//     });

//   } catch (err) {
//     console.error("SEND PACKAGE ERROR >>>", err);
//     return res.status(500).json({
//       error: "Failed to send project package"
//     });
//   }
// }


// new - no duplicates too
export async function sendProjectPackage(req, res) {
  try {
    console.log("SEND API CALLED");
    console.log("RAW BODY >>>", req.body);

    const founder_uid = req.user.uid;

    const {
      investorIds = [],
      projectId,
      businessNote = "",
      is_hub = false,
      dev_status = "ongoing"
    } = req.body;

    // ===============================
    // 1️⃣ Validate input
    // ===============================
    if (!Array.isArray(investorIds)) {
      return res.status(400).json({
        error: "investorIds must be an array"
      });
    }

    if (!is_hub && investorIds.length === 0) {
      return res.status(400).json({
        error: "Select Investor Hub or at least one investor"
      });
    }

    // ===============================
    // 2️⃣ Fetch project + founder
    // ===============================
    const [rows] = await db.query(
      `
      SELECT 
        p.pid,
        p.project_title,
        p.category_id,
        p.explanation,
        p.full_input,
        p.image_path,
        p.uml_path,
        p.modification_version,
        u.uid AS founder_uid,
        u.name AS founder_name,
        u.email AS founder_email,
        u.phone AS founder_phone
      FROM projects p
      JOIN users u ON p.uid = u.uid
      WHERE p.pid = ? AND p.uid = ?
      `,
      [projectId, founder_uid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const p = rows[0];

    // ===============================
    // 3️⃣ BUILD STABLE PACKAGE (NO sent_at)
    // ===============================
    const stablePackageJSON = {
      project: {
        pid: p.pid,
        title: p.project_title,
        category: p.category_id,
        version: p.modification_version
      },
      founder: {
        uid: p.founder_uid,
        name: p.founder_name,
        email: p.founder_email,
        phone: p.founder_phone
      },
      contents: {
        summary: p.explanation,
        lld: p.full_input,
        image_path: p.image_path,
        uml_path: p.uml_path
      },
      business_advantage: businessNote
    };

    const packageJSON = JSON.stringify(stablePackageJSON);

    let insertedCount = 0;
    let skipped = [];

    // ===============================
    // 4️⃣ HUB BROADCAST (is_hub = 1)
    // ===============================
    if (is_hub) {
      const [allInvestors] = await db.query(
        "SELECT uid FROM users WHERE is_investor = 1"
      );

      for (const inv of allInvestors) {

        const [exists] = await db.query(
          `
          SELECT id FROM project_requests
          WHERE pid = ?
            AND requestby_uid = ?
            AND responseby_uid = ?
            AND title = ?
            AND category = ?
            AND package = ?
            AND is_hub = 1
            AND dev_status = ?
          LIMIT 1
          `,
          [
            p.pid,
            founder_uid,
            inv.uid,
            p.project_title,
            p.category_id,
            packageJSON,
            dev_status
          ]
        );

        if (exists.length > 0) {
          skipped.push({ investorId: inv.uid, reason: "Already sent" });
          continue;
        }

        await db.query(
          `
          INSERT INTO project_requests
          (pid, requestby_uid, responseby_uid, title, category, package, is_hub, dev_status, response_status)
          VALUES (?, ?, ?, ?, ?, ?, 1, ?, 'pending')
          `,
          [
            p.pid,
            founder_uid,
            inv.uid,
            p.project_title,
            p.category_id,
            packageJSON,
            dev_status
          ]
        );

        insertedCount++;
      }
    }

    // ===============================
    // 5️⃣ DIRECT INVESTOR SEND (is_hub = 0)
    // ===============================
    if (investorIds.length > 0) {
      for (const rawInvestorId of investorIds) {

        const investorId = Number(rawInvestorId);
        if (!Number.isInteger(investorId)) continue;

        const [exists] = await db.query(
          `
          SELECT id FROM project_requests
          WHERE pid = ?
            AND requestby_uid = ?
            AND responseby_uid = ?
            AND title = ?
            AND category = ?
            AND package = ?
            AND is_hub = 0
            AND dev_status = ?
          LIMIT 1
          `,
          [
            p.pid,
            founder_uid,
            investorId,
            p.project_title,
            p.category_id,
            packageJSON,
            dev_status
          ]
        );

        if (exists.length > 0) {
          skipped.push({ investorId, reason: "Already sent" });
          continue;
        }

        await db.query(
          `
          INSERT INTO project_requests
          (pid, requestby_uid, responseby_uid, title, category, package, is_hub, dev_status, response_status)
          VALUES (?, ?, ?, ?, ?, ?, 0, ?, 'pending')
          `,
          [
            p.pid,
            founder_uid,
            investorId,
            p.project_title,
            p.category_id,
            packageJSON,
            dev_status
          ]
        );

        insertedCount++;
      }
    }

    // ===============================
    // 6️⃣ Final response
    // ===============================
    return res.json({
      success: true,
      is_hub,
      dev_status,
      sent_to_investors: insertedCount,
      skipped
    });

  } catch (err) {
    console.error("SEND PACKAGE ERROR >>>", err);
    return res.status(500).json({
      error: "Failed to send project package"
    });
  }
}



















export async function getProjectRequestPackage(req, res) {
  try {
    const requestId = req.params.requestId;
    const userId = req.user.uid;

    const [rows] = await db.query(
      `
      SELECT 
        pr.id,
        pr.is_hub,
        pr.dev_status,
        pr.package,
        pr.requestby_uid,
        pr.responseby_uid
      FROM project_requests pr
      WHERE pr.id = ?
        AND (pr.requestby_uid = ? OR pr.responseby_uid = ?)
      `,
      [requestId, userId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    const row = rows[0];

    return res.json({
      request_id: row.id,
      is_hub: row.is_hub === 1,
      dev_status: row.dev_status,
      package: JSON.parse(row.package)
    });

  } catch (err) {
    console.error("GET REQUEST PACKAGE ERROR >>>", err);
    res.status(500).json({ error: "Failed to load request package" });
  }
}

export async function getInvestorFeed(req, res) {
  try {
    const investorUid = req.user.uid;

    const [rows] = await db.query(
      `
      SELECT
        pr.id AS request_id,
        pr.pid,
        pr.title,
        pr.category,
        pr.dev_status,
        pr.is_hub
      FROM project_requests pr
      WHERE pr.responseby_uid = ?
        AND pr.is_hub = 1
      ORDER BY pr.created_at DESC
      `,
      [investorUid]
    );

    return res.json({
      feed: rows
    });

  } catch (err) {
    console.error("INVESTOR FEED ERROR >>>", err);
    res.status(500).json({ error: "Failed to load feed" });
  }
}

export async function getDirectSentProjects(req, res) {
  try {
    const founder_uid = req.user.uid;

    const [rows] = await db.query(
      `
      SELECT 
        pr.id AS request_id,
        pr.pid,
        pr.title,
        pr.category,
        pr.dev_status,
        MIN(pr.created_at) AS sent_at
      FROM project_requests pr
      WHERE pr.requestby_uid = ?
        AND pr.is_hub = 0
      GROUP BY pr.pid, pr.title, pr.category, pr.dev_status
      ORDER BY sent_at DESC
      `,
      [founder_uid]
    );

    return res.json(rows);

  } catch (err) {
    console.error("GET DIRECT SENT PROJECTS ERROR >>>", err);
    return res.status(500).json({
      error: "Failed to fetch direct sent projects"
    });
  }
}

export async function getHubSentProjects(req, res) {
  try {
    const founder_uid = req.user.uid;

    const [rows] = await db.query(
      `
      SELECT
      pr.id AS request_id,
  pr.pid,
  pr.title,
  pr.category,
  pr.dev_status,
  pr.created_at,
  MIN(pr.id) AS hub_request_id
FROM project_requests pr
WHERE pr.requestby_uid = ?
  AND pr.is_hub = 1
GROUP BY pr.pid, pr.created_at
ORDER BY pr.created_at DESC

      `,
      [founder_uid]
    );

    return res.json(rows);

  } catch (err) {
    console.error("GET HUB SENT PROJECTS ERROR >>>", err);
    return res.status(500).json({
      error: "Failed to fetch hub sent projects"
    });
  }
}

export async function getDirectProjectInvestors(req, res) {
  try {
    const founder_uid = req.user.uid;
    const { projectId } = req.params;

    const [rows] = await db.query(
      `
      SELECT DISTINCT
        pr.id AS request_id,
        u.uid,
        u.name,
        u.company_name,
        u.bio,
        pr.category,
        u.min_investment,
        u.max_investment,
        u.profile_image,
        pr.response_status
      FROM project_requests pr
      JOIN users u
        ON pr.responseby_uid = u.uid
      WHERE pr.pid = ?
        AND pr.requestby_uid = ?
        AND pr.is_hub = 0
        AND u.is_investor = 1
      ORDER BY pr.created_at DESC
      `,
      [projectId, founder_uid]
    );

    return res.json(rows);

  } catch (err) {
    console.error("GET DIRECT PROJECT INVESTORS ERROR >>>", err);
    return res.status(500).json({
      error: "Failed to fetch project investors"
    });
  }
}

// GET /investors/requests/founder
export async function getFounderRequests(req, res) {
  try {
    const investor_uid = req.user.uid;

    const [rows] = await db.query(
      `
      SELECT
        pr.id AS request_id,
        p.project_title,
        p.category_id AS category,
        pr.dev_status,
        u.name AS founder_name,
        pr.response_status 
      FROM project_requests pr
      JOIN projects p ON pr.pid = p.pid
      JOIN users u ON pr.requestby_uid = u.uid
      WHERE pr.responseby_uid = ?
        AND pr.is_hub = 0  
        AND pr.response_status IN ('pending', 'accepted')
      ORDER BY pr.created_at DESC
      `,
      [investor_uid]
    );

    return res.json({ requests: rows });

  } catch (err) {
    console.error("GET FOUNDER REQUESTS ERROR >>>", err);
    res.status(500).json({ error: "Failed to fetch founder requests" });
  }
}


// old - investor send to founder
// export async function sendInvestorRequest(req, res) {
//   try {
//     const investor_uid = req.user.uid;
//     const { request_id } = req.body;

//     if (!request_id) {
//       return res.status(400).json({ error: "request_id required" });
//     }

//     // 1️⃣ Get original package + founder
//     const [rows] = await db.query(
//       `
//       SELECT 
//         pr.pid,
//         pr.package,
//         p.project_title,
//         p.category_id,
//         p.uid AS founder_uid
//       FROM project_requests pr
//       JOIN projects p ON pr.pid = p.pid
//       WHERE pr.id = ?
//       `,
//       [request_id]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ error: "Invalid request" });
//     }

//     const r = rows[0];

//     // 2️⃣ Create NEW request (Investor ➜ Founder)
//     await db.query(
//       `
//       INSERT INTO project_requests
//       (pid, requestby_uid, responseby_uid, title, category, package, is_hub, response_status)
//       VALUES (?, ?, ?, ?, ?, ?, 1, 'pending')
//       `,
//       [
//         r.pid,
//         investor_uid,
//         r.founder_uid,
//         r.project_title,
//         r.category_id,
//         r.package
//       ]
//     );

//     return res.json({ success: true });

//   } catch (e) {
//     console.error("INVESTOR REQUEST ERROR", e);
//     res.status(500).json({ error: "Server error" });
//   }
// }


// new - investor send to founder
export async function sendInvestorRequest(req, res) {
  try {
    const investor_uid = req.user.uid;
    const { request_id } = req.body;

    if (!request_id) {
      return res.status(400).json({ error: "request_id required" });
    }

    // 1️⃣ Get original package + founder
    const [rows] = await db.query(
      `
      SELECT 
        pr.pid,
        pr.package,
        p.project_title,
        p.category_id,
        p.uid AS founder_uid
      FROM project_requests pr
      JOIN projects p ON pr.pid = p.pid
      WHERE pr.id = ?
      `,
      [request_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Invalid request" });
    }

    const r = rows[0];

    // 2️⃣ DUPLICATE CHECK (same table)
    const [exists] = await db.query(
      `
      SELECT id FROM project_requests
      WHERE pid = ?
        AND requestby_uid = ?
        AND responseby_uid = ?
        AND title = ?
        AND category = ?
        AND package = ?
        AND is_hub = 1
      LIMIT 1
      `,
      [
        r.pid,
        investor_uid,
        r.founder_uid,
        r.project_title,
        r.category_id,
        r.package
      ]
    );

    if (exists.length > 0) {
      return res.json({
        success: false,
        duplicate: true
      });
    }

    // 3️⃣ INSERT (only if not duplicate)
    await db.query(
      `
      INSERT INTO project_requests
      (pid, requestby_uid, responseby_uid, title, category, package, is_hub, response_status)
      VALUES (?, ?, ?, ?, ?, ?, 1, 'pending')
      `,
      [
        r.pid,
        investor_uid,
        r.founder_uid,
        r.project_title,
        r.category_id,
        r.package
      ]
    );

    return res.json({
      success: true,
      duplicate: false
    });

  } catch (e) {
    console.error("INVESTOR REQUEST ERROR", e);
    res.status(500).json({ error: "Server error" });
  }
}



export async function getInvestorMyRequests(req, res) {
  try {
    const investor_uid = req.user.uid;

    const [rows] = await db.query(
      `
      SELECT
        pr.id,
        pr.title,
        pr.category,
        pr.dev_status,
        u.name AS founder_name,
        pr.response_status
      FROM project_requests pr
      JOIN users u ON pr.responseby_uid = u.uid
      WHERE pr.requestby_uid = ?
      ORDER BY pr.created_at DESC
      `,
      [investor_uid]
    );

    return res.json({
      success: true,
      requests: rows
    });

  } catch (err) {
    console.error("GET INVESTOR REQUESTS ERROR >>>", err);
    return res.status(500).json({ error: "Failed to fetch requests" });
  }
}

export async function getInvestorRequestsForProject(req, res) {
  try {
    const founder_uid = req.user.uid;
    const { pid } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        pr.id,
        u.name,
        u.company_name,
        u.profile_image,
        u.bio,
        pr.response_status,    
        CONCAT('₹', FORMAT(u.min_investment, 0), ' - ₹', FORMAT(u.max_investment, 0)) AS investment_range,
        pr.category
      FROM project_requests pr
      JOIN users u ON pr.requestby_uid = u.uid
      WHERE pr.pid = ?
        AND pr.responseby_uid = ?
        AND pr.is_hub = 1
        AND pr.response_status IN ('pending', 'accepted')
      ORDER BY pr.created_at DESC
      `,
      [pid, founder_uid]
    );

    return res.json({ investors: rows });

  } catch (err) {
    console.error("INVESTOR REQUESTS ERROR", err);
    return res.status(500).json({
      error: "Failed to load investor requests"
    });
  }
}




































/**
 * ❌ Cancel SINGLE direct investor request
 * Used from ViewInvestorsActivity
 */
export async function cancelSingleDirectRequest(req, res) {
  try {
    const founder_uid = req.user.uid;
    const { requestId, pid, investorUid } = req.body;

    console.log("CANCEL DIRECT >>>", {
      requestId,
      pid,
      founder_uid,
      investorUid
    });

    const [result] = await db.query(
      `
      DELETE FROM project_requests
      WHERE id = ?
        AND pid = ?
        AND requestby_uid = ?
        AND responseby_uid = ?
        AND is_hub = 0
      `,
      [requestId, pid, founder_uid, investorUid]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "No matching request found to cancel"
      });
    }

    res.json({
      success: true,
      deleted: result.affectedRows
    });

  } catch (err) {
    console.error("CANCEL ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
}


/**
 * ❌ Cancel ALL direct requests for a project
 * Used from YourDirectRequestsActivity
 */
export async function cancelAllDirectRequests(req, res) {
  try {
    const founder_uid = req.user.uid;
    const { pid } = req.body;

    const [result] = await db.query(
      `
      DELETE FROM project_requests
      WHERE pid = ?
        AND requestby_uid = ?
        AND is_hub = 0
      `,
      [pid, founder_uid]
    );

    return res.json({
      success: true,
      deleted: result.affectedRows
    });

  } catch (err) {
    console.error("Cancel all direct requests error:", err);
    res.status(500).json({ error: "Server error" });
  }
}


export async function cancelInvestorMyRequest(req, res) {
  try {
    const investor_uid = req.user.uid;
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({ error: "requestId required" });
    }

    const [result] = await db.query(
      `
      DELETE FROM project_requests
      WHERE id = ?
        AND requestby_uid = ?
        AND is_hub = 1
      `,
      [requestId, investor_uid]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "No request found to cancel"
      });
    }

    return res.json({ success: true });

  } catch (err) {
    console.error("CANCEL INVESTOR REQUEST ERROR >>>", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// controllers/projectController.js
export async function cancelHubProject(req, res) {
  try {
    const founder_uid = req.user.uid;
    const { pid } = req.body;

    if (!pid) {
      return res.status(400).json({ error: "pid required" });
    }

    const [result] = await db.query(
      `
      DELETE FROM project_requests
      WHERE pid = ?
        AND requestby_uid = ?
        AND is_hub = 1
      `,
      [pid, founder_uid]
    );

    return res.json({
      success: true,
      deleted: result.affectedRows
    });

  } catch (err) {
    console.error("CANCEL HUB ERROR >>>", err);
    return res.status(500).json({ error: "Server error" });
  }
}








































export async function updateInvestorRequestStatus(req, res) {
  try {
    const founder_uid = req.user.uid;
    const { requestId, action } = req.body;

    if (!requestId || !["accepted", "rejected"].includes(action)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const chatAccess = action === "accepted" ? 1 : 0;

const [result] = await db.query(
  `
  UPDATE project_requests
  SET response_status = ?, chat_access = ?
  WHERE id = ?
    AND responseby_uid = ?
  `,
  [action, chatAccess, requestId, founder_uid]
);


    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "No matching request found"
      });
    }

    return res.json({ success: true });

  } catch (err) {
    console.error("UPDATE REQUEST STATUS ERROR >>>", err);
    return res.status(500).json({ error: "Server error" });
  }
}


export async function deleteInvestorRequest(req, res) {
  try {
    const investor_uid = req.user.uid;
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({ error: "requestId required" });
    }

    const [result] = await db.query(
      `
      DELETE FROM project_requests
      WHERE id = ?
        AND requestby_uid = ?
      `,
      [requestId, investor_uid]
    );

    return res.json({
      success: true,
      deleted: result.affectedRows
    });

  } catch (err) {
    console.error("DELETE REQUEST ERROR >>>", err);
    return res.status(500).json({ error: "Server error" });
  }
}


export async function getFounderConnectors(req, res) {
  try {
    const founder_uid = req.user.uid;

    
    const [rows] = await db.query(
      `
      SELECT
        pr.id AS request_id,
        pr.category,
        u.uid,
        u.name,
        u.profile_image,
        u.company_name,
        u.bio,
        u.min_investment,
        u.max_investment
      FROM project_requests pr
      JOIN users u
        ON u.uid =
           CASE
             WHEN pr.requestby_uid = ? THEN pr.responseby_uid
             ELSE pr.requestby_uid
           END
      WHERE pr.response_status = 'accepted'
        AND pr.chat_access = 1
        AND (pr.requestby_uid = ? OR pr.responseby_uid = ?)
      ORDER BY pr.created_at DESC
      `,
      [founder_uid, founder_uid, founder_uid]
    );


    const connectors = rows.map(r => ({
      request_id: r.request_id,
      uid: r.uid,
      name: r.name,
      company_name: r.company_name,
      profile_image: r.profile_image,
      bio: r.bio,
      category: r.category,
      investment_range:
        r.min_investment && r.max_investment
          ? `₹${parseInt(r.min_investment)} – ₹${parseInt(r.max_investment)}`
          : "—"
    }));

    return res.json(connectors);

  } catch (err) {
    console.error("GET FOUNDER CONNECTORS ERROR >>>", err);
    return res.status(500).json({ error: "Server error" });
  }
}


export async function getAcceptedConnectors(req, res) {
  try {
    const uid = req.user.uid;
    const [rows] = await db.query(
      `
      SELECT
        pr.id AS request_id,
        pr.title AS project_title,
        pr.category,
        pr.dev_status,
        u.uid AS founder_uid,
        u.name AS name,
        u.profile_image
      FROM project_requests pr
      JOIN users u
        ON u.uid = 
           CASE 
             WHEN pr.requestby_uid = ? THEN pr.responseby_uid
             ELSE pr.requestby_uid
           END
      WHERE pr.response_status = 'accepted'
        AND (pr.requestby_uid = ? OR pr.responseby_uid = ?)
      ORDER BY pr.created_at DESC
      `,
      [uid, uid, uid]
    );

    return res.json({ connectors: rows });

  } catch (err) {
    console.error("GET ACCEPTED CONNECTORS ERROR >>>", err);
    res.status(500).json({ error: "Server error" });
  }
}





// Filter:::

export async function getInvestorFeedFiltered(req, res) {
  try {
    const investorUid = req.user.uid;
    const category = req.query.category || "ALL";

    let sql = `
      SELECT 
        pr.id AS request_id,
        pr.title,
        pr.category,
        pr.dev_status
      FROM project_requests pr
      WHERE pr.is_hub = 1                -- ✅ HUB ONLY
        AND pr.responseby_uid = ? 
    `;

    const params = [investorUid];

    // ✅ Apply filter ONLY if not ALL
    if (category !== "ALL") {
      sql += ` AND pr.category = ?`;
      params.push(category);
    }

    sql += ` ORDER BY pr.id DESC`;

    const [rows] = await db.query(sql, params);

    res.json({
      feed: rows
    });

  } catch (err) {
    console.error("INVESTOR FEED FILTER ERROR >>>", err);
    res.status(500).json({ error: "Failed to load feed" });
  }
}




















































export async function getOrCreateChat(req, res) {
  try {
    const user_uid = req.user.uid;
    const { requestId } = req.params;

    // 1. Verify request + permission
    const [reqRows] = await db.query(
      `
      SELECT id, requestby_uid, responseby_uid, chat_access
      FROM project_requests
      WHERE id = ?
      `,
      [requestId]
    );

    if (reqRows.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    const reqData = reqRows[0];

    if (reqData.chat_access !== 1) {
      return res.status(403).json({ error: "Chat not allowed" });
    }

    if (
      user_uid !== reqData.requestby_uid &&
      user_uid !== reqData.responseby_uid
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // 2. Check if chat already exists
    const [chatRows] = await db.query(
      `SELECT * FROM chats WHERE request_id = ?`,
      [requestId]
    );

    if (chatRows.length > 0) {
      return res.json({ chat: chatRows[0] });
    }

    // 3. Create chat
    const [result] = await db.query(
      `
      INSERT INTO chats (request_id, requestby_uid, responseby_uid)
      VALUES (?, ?, ?)
      `,
      [
        requestId,
        reqData.requestby_uid,
        reqData.responseby_uid
      ]
    );

    return res.json({
      chat: {
        chat_id: result.insertId,
        request_id: requestId,
        requestby_uid: reqData.requestby_uid,
        responseby_uid: reqData.responseby_uid
      }
    });

  } catch (err) {
    console.error("GET OR CREATE CHAT ERROR >>>", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function sendChatMessage(req, res) {
  try {
    const sender_uid = req.user.uid;
    const { chatId, message } = req.body;

    if (!chatId || !message?.trim()) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // 1. Verify chat + user
    const [chatRows] = await db.query(
      `
      SELECT requestby_uid, responseby_uid
      FROM chats
      WHERE chat_id = ?
      `,
      [chatId]
    );

    if (chatRows.length === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const chat = chatRows[0];

    if (
      sender_uid !== chat.requestby_uid &&
      sender_uid !== chat.responseby_uid
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // 2. Insert message
    await db.query(
      `
      INSERT INTO chat_messages (chat_id, sender_uid, message)
      VALUES (?, ?, ?)
      `,
      [chatId, sender_uid, message]
    );

    return res.json({ success: true });

  } catch (err) {
    console.error("SEND CHAT MESSAGE ERROR >>>", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getChatMessages(req, res) {
  try {
    const user_uid = req.user.uid;
    const { chatId } = req.params;

    // 1. Verify chat access
    const [chatRows] = await db.query(
      `
      SELECT requestby_uid, responseby_uid
      FROM chats
      WHERE chat_id = ?
      `,
      [chatId]
    );

    if (chatRows.length === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const chat = chatRows[0];

    if (
      user_uid !== chat.requestby_uid &&
      user_uid !== chat.responseby_uid
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // 2. Fetch messages
    const [messages] = await db.query(
      `
      SELECT message_id, sender_uid, message, created_at
      FROM chat_messages
      WHERE chat_id = ?
      ORDER BY created_at ASC
      `,
      [chatId]
    );

    return res.json({ messages });

  } catch (err) {
    console.error("GET CHAT MESSAGES ERROR >>>", err);
    res.status(500).json({ error: "Server error" });
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
