import express from 'express';
import { body, validationResult } from 'express-validator';
import Note from '../models/Note.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all notes for the authenticated user
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      message: 'Failed to fetch notes',
    });
  }
});

// Create a new note
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content is required'),
  body('category').optional().trim().isLength({ max: 50 }).withMessage('Category must be less than 50 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const { title, content, category } = req.body;

    const note = new Note({
      title,
      content,
      category: category || '',
      userId: req.user.userId,
    });

    await note.save();

    res.status(201).json(note);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      message: 'Failed to create note',
    });
  }
});

// Update a note
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be less than 200 characters'),
  body('content').optional().trim().isLength({ min: 1 }).withMessage('Content cannot be empty'),
  body('category').optional().trim().isLength({ max: 50 }).withMessage('Category must be less than 50 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const updates = req.body;

    const note = await Note.findOne({ _id: id, userId: req.user.userId });
    if (!note) {
      return res.status(404).json({
        message: 'Note not found',
      });
    }

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        note[key] = updates[key];
      }
    });

    await note.save();

    res.json(note);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      message: 'Failed to update note',
    });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOneAndDelete({ _id: id, userId: req.user.userId });
    if (!note) {
      return res.status(404).json({
        message: 'Note not found',
      });
    }

    res.json({
      message: 'Note deleted successfully',
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      message: 'Failed to delete note',
    });
  }
});

// Get a specific note
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOne({ _id: id, userId: req.user.userId });
    if (!note) {
      return res.status(404).json({
        message: 'Note not found',
      });
    }

    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      message: 'Failed to fetch note',
    });
  }
});

export default router;