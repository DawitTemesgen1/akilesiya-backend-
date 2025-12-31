const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all dynamic content for the homepage
// @route   GET /api/homepage
// @access  Private (Requires valid token)
const getHomepageContent = async (req, res) => {
    // req.tenantId is attached by our 'protect' middleware
    const { tenantId } = req;

    try {
        // Fetch all pieces of data in parallel for efficiency
        const [siteContent, newsAndEvents, serviceTimes] = await Promise.all([
            prisma.siteContent.findMany({
                where: { tenantId: tenantId },
            }),
            prisma.newsAndEvent.findMany({
                where: { tenantId: tenantId },
                orderBy: { createdAt: 'desc' },
                take: 5, // Get the 5 most recent news items
            }),
            prisma.serviceTime.findMany({
                where: { tenantId: tenantId },
                orderBy: { id: 'asc' }, // Or a custom sort_order field
            }),
        ]);

        // Convert the siteContent array into a more useful key-value object
        const siteContentMap = siteContent.reduce((acc, item) => {
            acc[item.contentKey] = item.contentValue;
            return acc;
        }, {});

        res.status(200).json({
            siteContent: siteContentMap,
            newsAndEvents,
            serviceTimes,
        });

    } catch (error) {
        console.error("Error fetching homepage content:", error);
        res.status(500).json({ message: "Server error fetching homepage content." });
    }
};

module.exports = {
    getHomepageContent,
};