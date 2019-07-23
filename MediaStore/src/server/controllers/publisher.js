class PublisherController {
  constructor(mediaModel) {
    this.model = mediaModel;
  }

  // Aggretation request
  get (name, done) {
    this.model.aggregate([
      {
        $match: {
          Publisher: name
        }
      }, {
        $group: {
          _id: '$_id',
          Publisher: { "$first": '$Publisher' },
          publications: {
            $push:  {
              id: '$_id',
              title: '$Title'
            }
          },
          minYear: {$min: '$PublicationYear'},
          maxYear: {$max: '$PublicationYear'}
        }
      },
    ]).exec(done);
  }

}



module.exports = PublisherController;