const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// مهم جداً: دا السطر البخلي الموقع يظهر
app.use(express.static('public'));
app.use(express.json());

let bookings = [];

// API لحساب السعر
app.post('/api/calculate', (req, res) => {
    const { packageType, selectedAddons } = req.body;
    const prices = {
        packages: { economic: 1200000, medium: 3000000, vip: 6000000 },
        addons: { kosha: 400000, photo: 350000, buffet: 800000, zaffa: 250000, makeup: 200000 }
    };

    let total = prices.packages[packageType] || 0;
    let details = [`باقة ${packageType}`];

    selectedAddons.forEach(addon => {
        total += prices.addons[addon] || 0;
        details.push(`إضافة ${addon}`);
    });

    res.json({ total, deposit: total * 0.5, details });
});

// API للحجز
app.post('/api/book', (req, res) => {
    const booking = req.body;
    if (bookings.some(b => b.date === booking.date)) {
        return res.status(400).send('التاريخ محجوز');
    }
    bookings.push(booking);
    res.status(200).send('تم الحجز بنجاح');
});

// API للتواريخ المحجوزة
app.get('/api/booked-dates', (req, res) => {
    res.json(bookings.map(b => b.date));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
