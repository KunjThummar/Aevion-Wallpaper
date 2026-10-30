import { getDB, saveDB } from '../services/storage.js';

export const getAdPlacements = async (req, res) => {
  try {
    const db = getDB();
    res.json({
      success: true,
      data: db.ads || [],
      publisherId: db.settings?.adSensePublisherId || 'ca-pub-XXXXXXXXXXXXXXXX'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch ad placements' });
  }
};

export const updateAdPlacement = async (req, res) => {
  try {
    const { slotId } = req.params;
    const db = getDB();
    const index = (db.ads || []).findIndex(a => a.slotId === slotId);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Ad slot not found' });
    }

    db.ads[index] = {
      ...db.ads[index],
      ...req.body
    };

    saveDB(db);
    res.json({ success: true, message: 'Ad placement updated', data: db.ads[index] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update ad placement' });
  }
};
