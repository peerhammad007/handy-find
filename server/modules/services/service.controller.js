const Service = require("./service.model");

exports.createService = async (req, res) => {
  try {
    if (req.user.role !== "provider") {
      return res
        .status(403)
        .json({ message: "Only providers can create services" });
    }

    const { title, description, price, priceType, category } = req.body;
    if (!title || !description || price == null || !priceType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const service = new Service({ ...req.body, provider: req.user.userId });
    await service.save();
    await service.populate("provider", "name profilePhoto location");
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getServices = async (req, res) => {
  try {
    const {
      category,
      priceMin,
      priceMax,
      rating,
      location,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    const query = { isActive: true };
    if (category) query.category = category;
    if (location) query.serviceableLocations = location;

    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    if (rating) {
      query.avgRating = { $gte: Number(rating) };
    }

    const sortOpt = (() => {
      if (!sort) return { createdAt: -1 };
      const [field, dir] = String(sort).split(":");
      const allowed = ["createdAt", "price", "avgRating"];
      if (allowed.includes(field)) {
        return { [field]: dir === "asc" ? 1 : -1 };
      }
      return { createdAt: -1 };
    })();

    const skip = (Number(page) - 1) * Number(limit);

    const [services, total] = await Promise.all([
      Service.find(query)
        .populate("provider", "name profilePhoto location")
        .sort(sortOpt)
        .skip(skip)
        .limit(Number(limit)),
      Service.countDocuments(query),
    ]);

    res.json({
      services,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "provider",
      "name profilePhoto bio location phone",
    );
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { provider, ...updates } = req.body;

    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, provider: req.user.userId },
      updates,
      { new: true, runValidators: true },
    );
    if (!service)
      return res
        .status(404)
        .json({ message: "Service not found or unauthorized" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, provider: req.user.userId },
      { isActive: false },
      { new: true },
    );
    if (!service)
      return res
        .status(404)
        .json({ message: "Service not found or unauthorized" });
    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
