import { Contact, SupportTicket } from '../models/Contact.js';
import Notification from '../models/Notification.js';

// @desc    Submit public contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const contact = await Contact.create({ firstName, lastName, email, message });

    // TODO: Send email notification to admin (via nodemailer)

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      contact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit support ticket (dashboard)
// @route   POST /api/contact/ticket
// @access  Private
export const submitSupportTicket = async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    const ticketData = {
      user: req.user._id,
      fullName,
      email,
      subject,
      message,
    };

    // Handle file attachments
    if (req.files && req.files.length > 0) {
      ticketData.attachments = req.files.map(file => ({
        filename: file.originalname,
        path: `/uploads/${file.filename}`,
        mimetype: file.mimetype,
      }));
    }

    const ticket = await SupportTicket.create(ticketData);

    // Send notification
    await Notification.create({
      user: req.user._id,
      title: 'Support Ticket Created',
      message: `Your ticket #${ticket._id.toString().slice(-6)} has been submitted.`,
      type: 'system',
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket submitted successfully!',
      ticket,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's support tickets
// @route   GET /api/contact/tickets
// @access  Private
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all contacts (admin)
// @route   GET /api/contact/admin/contacts
// @access  Private/Admin
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all support tickets (admin)
// @route   GET /api/contact/admin/tickets
// @access  Private/Admin
export const getAllTickets = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const tickets = await SupportTicket.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update ticket status (admin)
// @route   PUT /api/contact/admin/tickets/:id
// @access  Private/Admin
export const updateTicketStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Notify user
    await Notification.create({
      user: ticket.user,
      title: 'Ticket Status Updated',
      message: `Your support ticket status has been updated to: ${status}`,
      type: 'system',
    });

    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
