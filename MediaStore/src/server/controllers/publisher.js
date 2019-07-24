class PublisherController {
  constructor(mediaModel) {
    this.model = mediaModel;
  }

  // Aggretation request
  get(name, done) {
    this.model.aggregate([
      {
        $match: {
          Publisher: name
        }
      }, {
        $group: {
          _id:'$Publisher',
          Publisher: { "$first": '$Publisher' },
          publications: {
            $push: {
              id: '$_id',
              title: '$Title',
              year: "$YEAR"
            }
          }
        }
      }, 
      // Sort in descending order
      {
        $sort: {
          'publication.year': -1
        }
      }
    ]).exec(done);
  }

}



module.exports = PublisherController;