const Branch = require("../../../models/HRMgmt/Branch");

exports.getListOfBranch = async (req, res) => {

    try {
        let query = {};

        if (req.query.HRAssociateEmpId) {
            query['HRAssociateEmpId'] = req.query.HRAssociateEmpId
        }


        let branchs;
        if (query.length == 0) {
            branchs = await Branch.aggregate([{},
              {
                $lookup: {
                  from: 'employees', 
                  localField: 'branchAdmin',
                  foreignField: '_id',
                  as: 'branchAdmin'
                }
              },
              {
                $lookup: {
                  from: 'employees',
                  localField: 'HRAssociate',
                  foreignField: '_id',
                  as: 'HRAssociate'
                }
              },
              {
                $lookup: {
                  from: 'finteams',
                  localField: 'finTeam',
                  foreignField: '_id',
                  as: 'finTeam'
                }
              },
              {
                $lookup: {
                  from: 'employees',
                  localField: 'financeAdmin',
                  foreignField: '_id',
                  as: 'financeAdmin'
                }
              }
            ]);

        } else {

            branchs = await Branch.aggregate([
                { $match: query },
                {
                    $lookup: {
                      from: 'employees', 
                      localField: 'branchAdmin',
                      foreignField: '_id',
                      as: 'branchAdmin'
                    }
                  },
                  {
                    $lookup: {
                      from: 'employees',
                      localField: 'HRAssociate',
                      foreignField: '_id',
                      as: 'HRAssociate'
                    }
                  },
                  {
                    $lookup: {
                      from: 'finteams',
                      localField: 'finTeam',
                      foreignField: '_id',
                      as: 'finTeam'
                    }
                  },
                  {
                    $lookup: {
                      from: 'employees',
                      localField: 'financeAdmin',
                      foreignField: '_id',
                      as: 'financeAdmin'
                    }
                  }
            ]);
        }


        if (branchs.length > 0) {
            res.status(200).json({
                status: true,
                count: branchs.length,
                List: branchs
            })
        }
        else {
            res.status(200).json({
                status: false,
                message: "No Branch found"
            })

        }

    } catch (err) {

        console.log(err)
        res.status(500).json({
            status: false,
            message: err.toString()
        })

    }

}

