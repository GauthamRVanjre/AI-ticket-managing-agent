import { inngest } from "../inngest/index.js";
import Ticket from "../models/ticket.js";

export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const newTicket = Ticket.create({
      title,
      description,
      createdBy: req.user._id.toString(),
    });

    await inngest.send({
      name: "ticket/created",
      data: {
        ticketId: (await newTicket)._id.toString(),
        title,
        description,
        createdBy: req.user._id.toString(),
      },
    });

    return res.status(201).json({
      message: "Ticket created and processing started",
      newTicket,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const getTickets = async (req, res) => {
  try {
    const user = req.user;
    let tickets = [];
    if (user.role !== "user") {
      tickets = await Ticket.find({})
        .populate("assignedTo", ["email", "_id"])
        .sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find({ createdBy: user._id })
        .select("title description status createdAt")
        .sort({ createdAt: -1 });
    }

    return res.status(200).json(tickets);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// complete this function to fetch tickets and add pagination by using skip and take
export const getTicketsForAdmin = async (req, res) => {
  console.log("getTicketsForAdmin");
  try {
    console.log(req.query);
    const { skip = 0, take = 10 } = req.query;
    const skipNum = parseInt(skip);
    const takeNum = parseInt(take);

    // Get total count for pagination
    const totalTickets = await Ticket.countDocuments({});

    const tickets = await Ticket.find({})
      .populate("assignedTo", ["email", "_id"])
      .populate("createdBy", ["email", "_id"])
      .skip(skipNum)
      .limit(takeNum)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      tickets,
      pagination: {
        total: totalTickets,
        skip: skipNum,
        take: takeNum,
        hasMore: skipNum + takeNum < totalTickets,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server: ${error.message}`,
    });
  }
};

// New function to get KPIs for admin dashboard
export const getKPIs = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get total tickets
    const totalTickets = await Ticket.countDocuments({});

    // Get tickets created in last 30 days
    const recentTickets = await Ticket.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Get tickets by status
    const ticketsByStatus = await Ticket.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Calculate average resolution time (for completed tickets)
    const completedTickets = await Ticket.find({ status: "COMPLETED" });
    let avgResolutionTime = 0;

    if (completedTickets.length > 0) {
      const totalResolutionTime = completedTickets.reduce((total, ticket) => {
        // For now, we'll use a simple calculation based on creation time
        // In a real app, you'd track when tickets are completed
        const resolutionTime =
          now.getTime() - new Date(ticket.createdAt).getTime();
        return total + resolutionTime;
      }, 0);
      avgResolutionTime = Math.round(
        totalResolutionTime / completedTickets.length / (1000 * 60 * 60 * 24)
      ); // in days
    }

    // Get moderator performance (tickets assigned to moderators)
    const moderatorTickets = await Ticket.countDocuments({
      assignedTo: { $exists: true, $ne: null },
    });

    const kpis = {
      totalTickets,
      recentTickets,
      avgResolutionTime,
      moderatorPerformance: moderatorTickets,
      ticketsByStatus: ticketsByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };

    return res.status(200).json(kpis);
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const getTicket = async (req, res) => {
  try {
    const user = req.user;
    let ticket;

    if (user.role !== "user") {
      ticket = await Ticket.findById(req.params.id).populate("assignedTo", [
        "email",
        "_id",
      ]);
    } else {
      ticket = await Ticket.findOne({
        createdBy: user._id,
        _id: req.params.id,
      }).select("title description status createdAt");
    }

    if (!ticket) {
      return res.status(404).json({ message: "Ticket Not Found" });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    let ticket;
    const id = req.params.id;

    ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket Not Found" });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (assignedTo) updateData.assignedTo = assignedTo;

    const updatedTicket = await Ticket.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("assignedTo", ["email", "_id"]);

    return res.status(200).json(updatedTicket);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// New function to assign ticket to moderator
export const assignTicket = async (req, res) => {
  try {
    const { ticketId, moderatorId } = req.body;

    if (!ticketId || !moderatorId) {
      return res.status(400).json({
        message: "Ticket ID and Moderator ID are required",
      });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket Not Found" });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      { assignedTo: moderatorId },
      { new: true }
    ).populate("assignedTo", ["email", "_id"]);

    return res.status(200).json({
      message: "Ticket assigned successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
};
