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
      },
      // Sort in descending order
      {
        $sort: {
          'YEAR': -1
        }
      },{
      $group: {
        _id: '$Publisher',
        Publisher: { "$first": '$Publisher' },
        publications: {
          $push: {
            id: '$_id',
            title: '$Title',
            year: "$YEAR"
          }
        }
      }}
    ]).exec(done);
  }

}



module.exports = PublisherController;