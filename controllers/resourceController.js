const Resource = require(`../models/Resource`);

const addResource = async (req, res, next) => {
    const resourceType = req.body.resourceType;
    const quantity = req.body.quantity

    // Check if the resourceType already exists in a case-sensitive manner
    const existingResource = await Resource.findOne({
        resourceType: { $regex: new RegExp(`^${resourceType}$`, 'i') }
    });

    if (existingResource) {
        return res.status(400).json({ error: "Resource type already exists." });
    }
   
    const newResource = new Resource({
        resourceType,
        quantity
       
    })
    newResource.save().then(()=>{
        res.json("Resource added")

    }).catch((err)=>{
        console.log(err);

    })
};

const getResources = async (req, res, next) => {
    Resource.find().then((resources)=>{
        res.json(resources)

    }).catch((err)=>{
        console.log(err)

    })
};

const updateResource = async (req, res, next) => {
    let resourceId = req.params.id;
    const {resourceType, quantity} = req.body;

    // Check if the resourceType already exists in a case-sensitive manner
    const existingResource = await Resource.findOne({
        resourceType: { $regex: new RegExp(`^${resourceType}$`, 'i') }
    });

    // If the resource type already exists and it's not the same resource being updated
    if (existingResource && existingResource._id.toString() !== resourceId) {
        return res.status(400).json({ error: "Resource type already exists." });
    }

    const updateResource = {
        resourceType,
        quantity
    }

    await Resource.findByIdAndUpdate(resourceId, updateResource)
    .then(() =>{
        res.status(200).send({status: "Resource updated"})

    }).catch((err) =>{
        console.log(err);
        res.status(500).send({status: "Error with updating data", error: err.message});

    })
};

const deleteResource = async (req, res, next) => {
    let resourceId = req.params.id;

    await Resource.findByIdAndDelete(resourceId)
    .then(() =>{
        res.status(200).send({status: "Resource removed"});

    }).catch((err) =>{
        console.log(err.message);
        res.status(500).send({status: "Error with delete user", error: err.message});

    })
};

const getResource = async (req, res, next) => {
    let resourceId = req.params.id;
    const resource = await Resource.findById(resourceId)
    .then((resource) => {
        res.status(200).send({status: "Resource fetched", resource});
    }).catch((err) =>{
        console.log(err.message);
        res.status(500).send({status: "Error with get resource", error: err.message});
    })
};

module.exports = {
    addResource,
    getResources,
    updateResource,
    deleteResource,
    getResource
};
