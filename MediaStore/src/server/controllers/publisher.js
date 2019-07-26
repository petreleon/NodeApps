class PublisherController {
  constructor(mediaModel) {
    this.model = mediaModel;
  }

  // Aggretation request
  getPublishers(done){
      this.model.aggregate([
        {
          $match: {
            Publisher: { "$ne": "" }
          }
        },
        {
          $group: {
            _id: '$Publisher',
            Publisher: { "$first": '$Publisher' },
            minPublicationYear: { "$min": "$YEAR" },
            maxPublicationYear: { "$max": "$YEAR" },
            count: { $sum: 1 }
          }
        },
        {
          $sort: {
            //count: -1,
            maxPublicationYear: -1
          }
        }
      ]).limit(50).exec(done);
    
  }

  getPublisherByName(name, done) {
    if (name) {
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
        }, {
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
          }
        }
      ]).exec(done); 
    }
    
  }

}



module.exports = PublisherController;