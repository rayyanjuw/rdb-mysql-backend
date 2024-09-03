const IntellectualProperty = require('../Models/IntellectualProperty');

const createIP = async (req, res) => {
    try {
        const {
            title, OwnerIp, address, fieldofinvention,
            backgroundofinvention, descriptionofinvention,
            refrences,inventivesteps
        } = req.body;
        const userId = req.user.id;

        const newIP = await IntellectualProperty.create({
            title,
            OwnerIp,
            address,
            fieldofinvention,
            backgroundofinvention,
            descriptionofinvention,
            refrences,
            inventivesteps,
            userId,
        })

        res.status(201).json(newIP);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create intellectual property'});
    }
}

const getallIp = async( req, res) => {
    try {
       const userId = req.user.id;
       
       const ips = await IntellectualProperty.findAll({
        where: { userId },
       });

       res.status(200).json(ips)

    } catch (error) {
       res.status(500).json({ error: 'Failed to retrive intellectual properties'}) 
    }
}

const getIPById = async (req, res) => {
    try{
        const { id } = req.params;
        const userId = req.user.id;

        console.log("userid:", userId)

        const ip = await IntellectualProperty.findOne({
            where: { id, userId},
        })

        console.log('ip:', ip)

        if(!ip) 
        {
            return res.status(404).json({ error: 'Intellectual Property not Found'});
        }

        res.status(200).json(ip);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrive intellectual property'})
    }
}

const updateIP = async (req, res) => {
    try {
        const {id} = req.params;
        const {
            title, OwnerIp, address, fieldofinvention,
            backgroundofinvention, descriptionofinvention,
            refrences,inventivesteps
        } = req.body;

        const userId = req.user.id;

        const ip = await IntellectualProperty.findOne({
            where: {
                id, userId
            },
        });

        if (!ip) {
            return res.status(404).json({ error: "Intellectual Property not Found"})
        }

        ip.title = title || ip.title;
        ip.OwnerIp = OwnerIp || ip.OwnerIp;
        ip.address = address || ip.address;
        ip.fieldofinvention = fieldofinvention || ip.fieldofinvention;
        ip.backgroundofinvention = backgroundofinvention || ip.backgroundofinvention;
        ip.descriptionofinvention = descriptionofinvention || ip.descriptionofinvention;
        ip.refrences = refrences || ip.refrences;
        ip.inventivesteps = inventivesteps || ip.inventivesteps;

        await ip.save();

        res.status(200).json(ip);
    } catch (error) {
        res.status(500).json({ error: "Failed to update intellectual property"});
    }
}



const deleteIP = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user.id;

        const ip = await IntellectualProperty.findOne({
            where: { id, userId },
        });

        if(!ip) {
            return res.status(404).json({ error: "Intellectual property not found"})
        }

        await ip.destroy();

        res.status(200).json({ message: "Intellectual property deleted successfully"})
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete intellectual property'})
    }
}


module.exports = {createIP, getallIp, getIPById, updateIP, deleteIP}