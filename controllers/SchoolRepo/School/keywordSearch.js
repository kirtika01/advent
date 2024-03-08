const School = require("../../../models/SchoolRepo/School");

exports.keywordSearch = async (req, res) => {
    try {

        let query = req.query.text;
        let docs;

        console.log(query)

        if (!query) {
            docs = await School.find();
        } else {

            docs = await School.find(
                { $text: { $search: query } },
                { score: { $meta: "textScore" } }
            )
                .sort({ score: { $meta: 'textScore' } })

        }

        if (docs.length === 0) {
            return res.status(200).json({
                status: false,
                message: `No Results found for "${query}"`
            })
        }

        else {
            res.status(200).json({
                status: true,
                schools: docs
            })
        }

    } catch (err) {
        console.log(err)

        return res.status(500).json({
            status: false,
            message: err.toString()

        })
    }
}