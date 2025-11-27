const Service = require('../models/Service');
const Booking = require('../models/Booking');

exports.createService = async (req, res) => {
  try {
    const service = new Service({ ...req.body, provider: req.user.userId });
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getServices = async (req, res) => {
  try {
    const { category, priceMin, priceMax, rating, location, sort } = req.query;
    let query = { isActive: true };
    if (category) query.category = category;
    if (location) query.serviceableLocations = location;
    if (priceMin || priceMax) query.price = {};
    if (priceMin) query.price.$gte = Number(priceMin);
    if (priceMax) query.price.$lte = Number(priceMax);
    // TODO: Add rating filter
    // Sorting: default newest first by createdAt; allow override via sort query (e.g., 'createdAt:asc'|'createdAt:desc')
    const sortOpt = (() => {
      if (!sort) return { createdAt: -1 };
      const [field, dir] = String(sort).split(':');
      if (field === 'createdAt') return { createdAt: dir === 'asc' ? 1 : -1 };
      return { createdAt: -1 };
    })();

    const services = await Service.find(query)
      .populate('provider', 'name profilePhoto location')
      .sort(sortOpt);
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('provider', 'name profilePhoto bio location');
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate({ _id: req.params.id, provider: req.user.userId }, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found or unauthorized' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ _id: req.params.id, provider: req.user.userId });
    if (!service) return res.status(404).json({ message: 'Service not found or unauthorized' });
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
