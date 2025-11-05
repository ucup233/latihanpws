const express = require('express');
const app = express();
const port = process.env.PORT || 5200;
const db = require('./models');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create
app.post('/komik', async (req, res) => {
  const { judul, penulis, deskripsi } = req.body;
  
  if (!judul || !penulis || !deskripsi) {
    return res.status(400).json({ error: 'Fields judul, penulis, dan deskripsi wajib diisi' });
  }

  try {
    const komik = await db.Komik.create({ judul, penulis, deskripsi });
    res.status(201).json(komik);
  } catch (error) {
    console.error('POST /komik error:', error);
    res.status(500).json({ error: 'Gagal menambahkan komik', details: error.message });
  }
});

// Read all
app.get('/komik', async (req, res) => {
  try {
    const komiks = await db.Komik.findAll();
    res.status(200).json(komiks);
  } catch (error) {
    console.error('GET /komik error:', error);
    res.status(500).json({ error: 'Gagal mengambil data komik' });
  }
});

// Update
app.put('/komik/:id', async (req, res) => {
  const komikId = req.params.id;
  const { judul, penulis, deskripsi } = req.body;

  try {
    const komik = await db.Komik.findByPk(komikId);
    if (!komik) return res.status(404).json({ error: 'Komik tidak ditemukan' });

    await komik.update({ judul, penulis, deskripsi });
    res.status(200).json(komik);
  } catch (error) {
    console.error(`PUT /komik/${komikId} error:`, error);
    res.status(500).json({ error: 'Gagal memperbarui data komik' });
  }
});

// Delete
app.delete('/komik/:id', async (req, res) => {
  const komikId = req.params.id;
  try {
    const komik = await db.Komik.findByPk(komikId);
    if (!komik) return res.status(404).json({ error: 'Komik tidak ditemukan' });

    await komik.destroy();
    res.status(200).json({ message: 'Komik berhasil dihapus' });
  } catch (error) {
    console.error(`DELETE /komik/${komikId} error:`, error);
    res.status(500).json({ error: 'Gagal menghapus data komik' });
  }
});

// Initialize DB and start server
db.sequelize
  .authenticate()
  .then(() => db.sequelize.sync())
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('DB connection or sync error:', err);
    process.exit(1);
  });
