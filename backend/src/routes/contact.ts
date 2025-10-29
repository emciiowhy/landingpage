// backend/src/routes/contact.ts
// API route for handling contact form submissions

import { Router, Request, Response } from 'express';
import { db } from '../db';
import { contactMessages } from '../db/schema';

const router = Router();

// POST /api/contact - Handle contact form submission
router.post('/', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    // Insert into database
    const result = await db.insert(contactMessages).values({
      firstName,
      lastName,
      email,
      message,
    }).returning();

    console.log('✅ Contact saved for', email);

    // ✅ IMPORTANT: Send response immediately after saving to database
    // Don't wait for email sending to complete
    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: result[0],
    });

    // Note: If you want to send emails, do it AFTER sending the response
    // This prevents timeout issues from blocking the user

  } catch (error) {
    console.error('❌ Error saving contact message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again.',
    });
  }
});

// GET /api/contact - Get all contact messages
router.get('/', async (req: Request, res: Response) => {
  try {
    const messages = await db.select().from(contactMessages).orderBy(contactMessages.createdAt);
    
    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
    });
  }
});

export default router;