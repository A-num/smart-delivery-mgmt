import Partner from "../models/partnerModel";
import dayjs from "dayjs";
import Order from "../models/orderModel";
import Assignment from "../models/assignmentModel";

const MIN_TIME_TO_STALE = 15; // min time for order to count as stale
const MAX_STALENESS_FACTOR = 2; // Max time for staleness order age/ MAX_STALENESS
const WEIGHTS = {
  areaPreference: 5, //Adjust preference for closest area in areas of partner
  staleness: 4, //Adjust weightage of staleness
};

/* Currently, this assignOrders is only running at every new order creation only.
   However, if desired, can run this for every instance where an order is completed, or a new partner
   is available (partner registered/set status to active/ set a different shift timing/ new area/ etc)
   or can keep count of these above mentioned events and once it crosses a threshold we call this
   assign orders function then.
*/
export const assignOrders = async () => {
  try {
    const orders = await Order.find({ status: "pending" });
    if (orders.length === 0) {
      return { success: false, reason: "No available partners" };
    }

    for (const order of orders) {
      const availablePartners = await Partner.find({
        status: "active",
        currentLoad: { $lt: 3 },
        areas: order.area,
        shift: {
          $exists: true,
          $not: { $size: 0 }, // Ensure shift is defined
        },
        $expr: {
          $and: [
            { $lte: ["$shift.start", order.scheduledFor] },
            { $gte: ["$shift.end", order.scheduledFor] },
          ],
        },
      });
      if (availablePartners.length === 0) {
        continue;
      }

      // Calculate score for each partner
      let bestPartner = null;
      let highestScore = -Infinity;
      for (const partner of availablePartners) {
        //Assuming order.area can never be null, else skip order criteria and give highest score, i.e 4
        const areaIndex = partner.areas.indexOf(order.area!);
        /* We are getting the relative priority of the area of a particular partner
         This is so the 3rd preference out of 4 of a partner isnt of the same value/weight
         of the 3rd preference out of 10 of a partner. i.e 0.7 > 0.25 */
        const areaPreferenceScore = 1 - areaIndex / partner.areas.length;

        const orderAgeInMinutes = dayjs().diff(
          dayjs(order.createdAt),
          "minute"
        );
        const stalenessFactor = Math.min(
          orderAgeInMinutes / MIN_TIME_TO_STALE,
          MAX_STALENESS_FACTOR
        );

        // Scoring Formula
        const score =
          WEIGHTS.areaPreference * areaPreferenceScore +
          WEIGHTS.staleness * stalenessFactor;

        if (score > highestScore) {
          highestScore = score;
          bestPartner = partner;
        }
      }

      if (bestPartner) {
        //Here we can add a threshold saying MIN_SCORE and compare to the highest score.
        //If order is not too stale, we can choose to not assign the order and wait until this
        //function is called the next time. (Any of the ways mentioned at the start of this function)
        // Assign order to the best partner

        const newAssignment = new Assignment({
          orderId: order._id,
          partnerId: bestPartner._id,
          timestamp: Date.now,
          status: "pending",
        });
        const assignment = await newAssignment.save();
        if (assignment) {
          //if saved then make changes to order and partner
          order.status = "assigned";
          order.assignedTo = bestPartner._id;
          await order.save();

          // Update partner load
          bestPartner.currentLoad += 1;
          await bestPartner.save();
        }
      }
    }
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: console.error() };
  }
};
