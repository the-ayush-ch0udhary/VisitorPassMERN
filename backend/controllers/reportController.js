const { Parser } = require('json2csv');
const CheckLog = require('../models/CheckLog');
const Visitor = require('../models/Visitor');

// Export visitor logs as CSV
exports.exportLogsCSV = async (req, res) => {
    try {
        let filter = {};

        // Applying organization filtering
        if (req.user.organizationId) {
            const visitors = await Visitor.find({
                organizationId: req.user.organizationId
            }).select('_id');

            filter.visitorId = {
                $in: visitors.map(visitor => visitor._id)
            };
        }

        const logs = await CheckLog.find(filter)
            .populate('visitorId')
            .populate({
                path: 'passId',
                populate: {
                    path: 'appointmentId',
                    populate: {
                        path: 'hostId',
                        select: 'name email'
                    }
                }
            });

        const reportData = logs.map(log => ({
            PassID: log.passId?._id || '',
            VisitorName: log.visitorId?.name || '',
            HostName: log.passId?.appointmentId?.hostId?.name || '',
            CheckInTime: log.checkInTime || '',
            CheckOutTime: log.checkOutTime || '',
            Status: log.checkOutTime
                ? 'Checked Out'
                : 'Checked In'
        }));

        const parser = new Parser();

        const csv = parser.parse(reportData);

        res.header('Content-Type', 'text/csv');
        res.attachment('visitor_report.csv');

        return res.send(csv);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};