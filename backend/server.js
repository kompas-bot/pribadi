const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Path untuk file data berdasarkan struktur baru
const dataPath = path.join(__dirname, 'data', 'portfolio.json');
const contactsPath = path.join(__dirname, 'data', 'contacts.json');

// Endpoint untuk mengambil data proyek
app.get('/api/projects', (req, res) => {
    try {
        if (!fs.existsSync(dataPath)) {
            return res.status(404).json({ 
                error: 'Data file not found',
                path: dataPath
            });
        }
        
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        res.json(data.projects || []);
    } catch (error) {
        console.error('Error reading portfolio data:', error);
        res.status(500).json({ 
            error: 'Failed to load projects',
            details: error.message 
        });
    }
});

// Endpoint untuk mengambil data skills
app.get('/api/skills', (req, res) => {
    try {
        if (!fs.existsSync(dataPath)) {
            return res.status(404).json({ 
                error: 'Data file not found',
                path: dataPath
            });
        }
        
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        res.json(data.skills || []);
    } catch (error) {
        console.error('Error reading skills data:', error);
        res.status(500).json({ 
            error: 'Failed to load skills',
            details: error.message 
        });
    }
});

// Endpoint untuk form kontak
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Validasi input
        if (!name || !email || !message) {
            return res.status(400).json({ 
                error: 'All fields are required'
            });
        }
        
        // Validasi email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        
        // Buat objek kontak baru
        const newContact = { 
            id: Date.now(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim(),
            timestamp: new Date().toISOString(),
            ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress
        };
        
        // Baca kontak yang sudah ada
        let contacts = [];
        if (fs.existsSync(contactsPath)) {
            contacts = JSON.parse(fs.readFileSync(contactsPath, 'utf8'));
        }
        
        // Tambahkan kontak baru
        contacts.unshift(newContact);
        
        // Simpan ke file
        fs.writeFileSync(contactsPath, JSON.stringify(contacts, null, 2));
        
        console.log(`📧 New contact from: ${name} (${email})`);
        
        res.json({ 
            success: true, 
            message: 'Thank you! Your message has been sent successfully.' 
        });
        
    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({ 
            error: 'Failed to send message. Please try again.' 
        });
    }
});

// Endpoint untuk mengecek kesehatan server
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        files: {
            portfolio: fs.existsSync(dataPath),
            contacts: fs.existsSync(contactsPath)
        }
    });
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════╗
    ║    🚀 Amrosi Portfolio Backend       ║
    ║    🔗 http://localhost:${PORT}             ║
    ╚══════════════════════════════════════╝
    
    📂 Data path: ${dataPath}
    📂 Contacts: ${contactsPath}
    
    📋 Available endpoints:
       → GET  http://localhost:${PORT}/api/projects
       → GET  http://localhost:${PORT}/api/skills
       → POST http://localhost:${PORT}/api/contact
       → GET  http://localhost:${PORT}/api/health
    `);
});