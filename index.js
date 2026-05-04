const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// مهم: بيخدم كل الملفات من مجلد public
app.use(express.static('public'));

// تخزين الحجوزات
let bookings = [];

app.post('/api/calculate', (req, res) => {
    const { packageType, selectedAddons } = req.body;
    const prices = { economic: 1200000, medium: 3000000, vip: 6000000 };
    const addonsPrices = { kosha: 400000, photo: 350000, buffet: 800000, zaffa: 250000, makeup: 200000 };
    const names = { economic: 'الباقة الفضية', medium: 'الباقة الذهبية', vip: 'الباقة الماسية', kosha: 'كوشة ورد طبيعي', photo: 'تصوير + درون', buffet: 'بوفيه ملكي', zaffa: 'زفة + DJ', makeup: 'جناح العروس الملكي' };

    let total = prices[packageType] || 0;
    let details = [names[packageType]];
    selectedAddons.forEach(addon => {
        total += addonsPrices[addon] || 0;
        details.push(names[addon]);
    });
    res.json({ total, deposit: total * 0.5, details });
});

app.post('/api/book', (req, res) => {
    const { date, name, phone, packageType, selectedAddons, total, deposit } = req.body;
    if (bookings.find(b => b.date === date)) return res.status(400).send('التاريخ محجوز');
    bookings.push({ date, name, phone, packageType, selectedAddons, total, deposit });
    res.send('تم الحجز بنجاح');
});

app.get('/api/booked-dates', (req, res) => {
    res.json(bookings.map(b => b.date));
});

// دا السطر السحري: أي طلب يرجع index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running`));
