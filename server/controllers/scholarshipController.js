const ScholarshipApplication = require('../models/ScholarshipApplication');
const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });
};

// POST /api/scholarship-applications - Submit application
exports.submitApplication = async (req, res) => {
  try {
    const { name, email, college, phone, year, field, cgpa, whyDeserving, familyBackground, financialNeed, achievements } = req.body;

    if (!name || !email || !whyDeserving) {
      return res.status(400).json({ message: 'Name, email, and why deserving are required' });
    }

    const application = await ScholarshipApplication.create({
      name,
      email,
      college,
      phone,
      year,
      field,
      cgpa,
      whyDeserving,
      familyBackground,
      financialNeed,
      achievements,
    });

    // Send confirmation email to applicant
    try {
      await sendEmail({
        to: email,
        subject: 'Mudita – Scholarship Application Received',
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#3730a3;padding:24px;text-align:center">
            <h1 style="color:#fff;margin:0">Application Received</h1>
            <p style="color:#c7d2fe;margin:4px 0 0">Mudita – An Alliance for Giving</p>
          </div>
          <div style="padding:24px;background:#f9fafb">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Thank you for applying for the Mudita Scholarship program!</p>
            <p>We have received your application and our team is reviewing it carefully. We typically respond within 2-3 weeks.</p>
            <div style="background:#f0f9ff;padding:16px;border-radius:8px;margin:16px 0;border-left:4px solid #3730a3">
              <p style="margin:0;font-size:13px;color:#1e40af">
                <strong>Application ID:</strong> ${application._id.toString().slice(-8).toUpperCase()}
              </p>
              <p style="margin:8px 0 0;font-size:13px;color:#1e40af">
                <strong>Email:</strong> ${email}
              </p>
            </div>
            <p style="color:#6b7280;font-size:13px">
              If you have any questions, please reach out to us at <a href="mailto:scholarships@muditaalliance.org">scholarships@muditaalliance.org</a>
            </p>
            <p style="margin-top:16px;color:#6b7280;font-size:12px;border-top:1px solid #e5e7eb;padding-top:16px">
              Best wishes,<br/>
              Mudita – An Alliance for Giving
            </p>
          </div>
        </div>`,
      });
    } catch (e) {
      console.log('Confirmation email failed (non-fatal):', e.message);
    }

    // Send notification to admin
    try {
      await sendEmail({
        to: process.env.EMAIL_USER,
        subject: `New Scholarship Application - ${name}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2>New Scholarship Application</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr style="background:#f0f9ff">
              <td style="padding:8px;border:1px solid #ddd"><strong>Name</strong></td>
              <td style="padding:8px;border:1px solid #ddd">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px;border:1px solid #ddd"><strong>Email</strong></td>
              <td style="padding:8px;border:1px solid #ddd">${email}</td>
            </tr>
            <tr style="background:#f0f9ff">
              <td style="padding:8px;border:1px solid #ddd"><strong>Phone</strong></td>
              <td style="padding:8px;border:1px solid #ddd">${phone || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding:8px;border:1px solid #ddd"><strong>College</strong></td>
              <td style="padding:8px;border:1px solid #ddd">${college || 'N/A'}</td>
            </tr>
            <tr style="background:#f0f9ff">
              <td style="padding:8px;border:1px solid #ddd"><strong>Year</strong></td>
              <td style="padding:8px;border:1px solid #ddd">${year || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding:8px;border:1px solid #ddd"><strong>Field</strong></td>
              <td style="padding:8px;border:1px solid #ddd">${field || 'N/A'}</td>
            </tr>
            <tr style="background:#f0f9ff">
              <td style="padding:8px;border:1px solid #ddd"><strong>CGPA</strong></td>
              <td style="padding:8px;border:1px solid #ddd">${cgpa || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding:8px;border:1px solid #ddd"><strong>Why Deserving</strong></td>
              <td style="padding:8px;border:1px solid #ddd">${whyDeserving}</td>
            </tr>
          </table>
        </div>`,
      });
    } catch (e) {
      console.log('Admin notification failed (non-fatal):', e.message);
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      applicationId: application._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/scholarship-applications - Get all applications (admin only)
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await ScholarshipApplication.find().sort({ appliedAt: -1 });
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/scholarship-applications/:id - Get single application
exports.getApplication = async (req, res) => {
  try {
    const application = await ScholarshipApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json({ success: true, application });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/scholarship-applications/:id/status - Update application status (admin only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await ScholarshipApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, application });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
