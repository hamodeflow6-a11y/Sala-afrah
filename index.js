const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// بيانات مؤقتة - بعدين نربطها قاعدة بيانات
let bookings = [];
let bookedDates = ['2026-05-10', '2026-05-15', '2026-06-01'];

const packages = {
    economic: { name: 'الباقة الاقتصادية', price: 1200000, desc: 'الصالة + كراسي + صوت أساسي' },
    medium: { name: 'الباقة المتوسطة', price: 3000000, desc: 'كوشة + إضاءة + بوفيه + ضيافة' },
    vip: { name: 'باقة VIP', price: 6000000, desc: 'ديكور كامل + تصوير + زفة + عشاء فاخر' }
};

const addons = {
    kosha: { name: 'كوشة وورد طبيعي', price: 400000 },
    photo: { name: 'تصوير فوتو + فيديو + درون', price: 350000 },
    buffet: { name: 'بوفيه مفتوح 100 شخص', price: 800000 },
    zaffa: { name: 'زفة + DJ', price: 250000 },
    makeup: { name: 'غرفة عروس VIP', price: 200000 }
};

// API: يجيب الأيام المحجوزة
app.get('/api/booked-dates', (req, res) => {
    res.json(bookedDates);
});

// API: يحسب الفاتورة تلقائي
app.post('/api/calculate', (req, res) => {
    const { packageType, selectedAddons } = req.body;
    if (!packages[packageType]) return res.status(400).json({ error: 'اختار باقة' });

    let total = packages[packageType].price;
    let details = [packages[packageType].name + ' - ' + packages[packageType].desc];

    selectedAddons.forEach(addon => {
        if (addons[addon]) {
            total += addons[addon].price;
            details.push(addons[addon].name);
        }
    });

    const deposit = total * 0.5;
    res.json({ total, deposit, details });
});

// API: يستقبل الحجز الجديد
app.post('/api/book', (req, res) => {
    const { date, name, phone, packageType, selectedAddons, total, deposit } = req.body;

    if (!date ||!name ||!phone ||!packageType) {
        return res.status(400).send('املا كل البيانات المطلوبة');
    }

    if (bookedDates.includes(date)) {
        return res.status(400).send('اليوم دا محجوز للأسف، اختار تاريخ تاني');
    }

    const newBooking = {
        id: Date.now(),
        date, name, phone, packageType,
        selectedAddons, total, deposit,
        status: 'بانتظار العربون',
        createdAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    bookedDates.push(date);

    console.log('حجز جديد:', newBooking);
    res.status(201).json({ message: 'تم استلام الحجز بنجاح', bookingId: newBooking.id });
});

// API: لوحة التحكم - تشوف كل الحجوزات
app.get('/api/admin/bookings', (req, res) => {
    res.json(bookings);
});

// صفحة رئيسية
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`نظام الصالة شغال على البورت ${PORT}`));
