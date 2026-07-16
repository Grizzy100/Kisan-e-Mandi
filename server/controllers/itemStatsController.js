//server\controllers\itemStatsController.js
import Item from "../models/Item.js";
import { ITEM_STATUS } from "../utils/itemStateMachine.js";

// Returns counts for all item statuses for the current user (admin or farmer)
export const getItemStatusCounts = async (req, res) => {
  try {
    const user = req.user;
    const isAdmin = user.role === "admin";
    const match = isAdmin ? {} : { sellerId: user._id };

    // Aggregate counts for each status
    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          outOfStock: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ["$status", ITEM_STATUS.PUBLISHED] },
                  { $lte: ["$quantity", 0] }
                ] },
                1, 0
              ]
            }
          }
        }
      }
    ];
    const results = await Item.aggregate(pipeline);
    // Build response object
    const counts = {
      all: 0,
      live: 0,
      shelved: 0,
      added: 0,
      outOfStock: 0,
      rejected: 0
    };
    results.forEach(r => {
      counts.all += r.count;
      if (r._id === ITEM_STATUS.PUBLISHED) counts.live = r.count;
      if (r._id === ITEM_STATUS.SHELVED) counts.shelved = r.count;
      if (r._id === ITEM_STATUS.APPROVED_HIDDEN) counts.added = r.count;
      if (r._id === ITEM_STATUS.REJECTED) counts.rejected = r.count;
      if (r._id === ITEM_STATUS.PUBLISHED) counts.outOfStock += r.outOfStock;
    });
    return res.json(counts);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch item status counts", error: err.message });
  }
};


//ANALYTIC ENGINE
//This file is to display stats of the 
// Count the total number of items (all). 
// Count live/published items (live). 
// Count shelved items (shelved). 
// Count approved but hidden items (added). 
// Count rejected items (rejected). 
// Count published items that are out of stock (outOfStock). 
// Return a summarized statistics object for use in the frontend dashboard cards/charts.


// "I separated the item logic into two controllers based on read/write patterns. itemController.js handles all transactional mutations—creating, updating, publishing, and shelving individual items. itemStatsController.js handles analytical aggregations. I wrote the stats controller specifically for the dashboard load-moment; by using MongoDB aggregation pipelines on the backend, I avoid sending massive arrays of data to the frontend just to count item statuses, which drastically improves dashboard load times."

