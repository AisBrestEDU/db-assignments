const ObjectId = require('mongodb').ObjectID;

/********************************************************************************************
 *                                                                                          *
 * The goal of the task is to get basic knowledge of mongodb optimization approaches
 * Before implementing the task, please read what mongodb documentation say us about that:
 * https://docs.mongodb.com/manual/core/aggregation-pipeline-optimization/
 *
 * You will find a dump for the task in dumps/awesomedb_mongodb/awesomedb.zip
 * To restore the dump unzip it and execute mongorestore
 ********************************************************************************************/

/**
 * The function is to add indexes to optimize your queries.
 * Test timeout is increased to 60sec for the function.
 * */
async function before(db) {
    await db.collection('opportunities').createIndex({'initiativeId': 1});
}

/**
 *  Query bellow could return correct response but this one is extremely slow and need a lot of resources.
 *  At the task you don't really need to involve in the logic of the query but you need to optimize it
 *  to get the result in less than 6 seconds. (The best solution is 1-1.5 seconds)
 *
 *  HINTS which should allow you to execute the query. In priority order:
 *   1. $unwind is really big pain here - after the first $unwind all indexes will be lost.
 *   2. $unwind does "deep clone" for each new object. That requires big amount of RAM and CPU.
 *      To avoid it use $project to specify fields which you really need:
 *                      {$project: {"field1.subField1": 1, "field1.subField2": 1 }}
 *      https://docs.mongodb.com/manual/reference/operator/aggregation/project/.
 *   3. Use indexes.
 *   4. Use Compound indexes https://docs.mongodb.com/manual/core/index-compound/.
 *   5. You can move or duplicate $match sections before and after projections/unwinds to get better performance.
 *   6. You can modify $lookup to get better performance with pipelines.
 *      https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#specify-multiple-join-conditions-with-lookup
 *   7. On the step when you use $lookup in the query you already don't have any indexes from `opportunities` collection,
 *      BUT $lookup still can use indexes from `clientCriteria`.
 *   8. That's possible to rewrite a few last steps to merge a few pipeline steps in one.
 */
async function task_3_1(db) {
    

    const result = await db.collection('opportunities').aggregate([
        {
            $match: {
              initiativeId: new ObjectId('58af4da0b310d92314627290'),
              contacts: {$elemMatch: {datePublished: {$ne: null}}},
              'contacts.questions.category_id': {$in: [105, 147]},
              'contacts.shortListedVendors': {$elemMatch: {is_selected: true, $or: [{name: 'ADP'}, {value: 50}]}},
            }
          },
          {
            $project: {
              'contacts.id': 1,
              'contacts.questions.category_id': 1,
              'contacts.questions.answers.primary_answer_value': 1,
              'contacts.questions.answers.loopInstances': 1,
              'contacts.questions.answers.criteria_value': 1,
              'contacts.questions.criteria_value': 1,
              'contacts.questions.id': 1,
              'contacts.questions.answers.primary_answer_text': 1,
              'contacts.win_vendor.value': 1,
            },
          },
          {$unwind: '$contacts'},
          {$unwind: '$contacts.questions'},
          {
            $match: {
              'contacts.questions.category_id': {$in: [105, 147]}, 
              $nor: [{
                  'contacts.questions.category_id': 105,
                  'contacts.questions.answers': {
                    $elemMatch: {primary_answer_value: {$gte: 9000},
                      loopInstances: {$elemMatch: {is_selected: true,
                          $or: [{loop_instance: 50},
                            {loop_text: 'ADP'},
                          ]
                        }
                      }
                    }
                  }
                }
              ]
            }
          },
        {$unwind: '$contacts.questions.answers'},
        {
            $match: {
              'contacts.questions.answers.primary_answer_value': {$lt: 9000}},
        },
        {$unwind: '$contacts.questions.answers.loopInstances'},
        {
            $match: {
              $or: [
                {
                  'contacts.questions.answers.loopInstances.loop_instance': 50,
                },
                {
                  'contacts.questions.answers.loopInstances.loop_text': 'ADP',
                },
                {
                  clientWinner: false,
                  'contacts.questions.category_id': 147,
                  $or: [
                    {
                      'contacts.win_vendor.value':50,
                    },
                    {
                      'contacts.win_vendor.name': 'ADP',
                    }
                  ]
                }
              ]
            }
        },
        {
            $project: {
              'contacts.id': 1,
              'contacts.questions.criteria_value': 1,
              'criteria_value': {$ifNull: [
                  '$contacts.questions.criteria_value',
                  '$contacts.questions.answers.criteria_value',
                ]},
              'contacts.questions.id': 1,
              'contacts.questions.answers': 1,
              'contacts.questions.category_id': 1,
            }
        },
        {
            $lookup:{
                from: 'clientCriteria',
                let: { criteria: '$criteria_value' },
                pipeline: [
                    {
                        $match: {
                            'versions.initiativeId': ObjectId('58af4da0b310d92314627290')
                        }
                    },
                    {
                        $project: {
                                value: 1,
                                label: 1,
                                definition: 1,
                                'versions.definition': 1,
                        }
                    },
                    {
                        $match: {
                            $expr: { $eq: ['$value', '$$criteria'] }
                        }
                    },
                ],
                    as: 'criteria'
                }
            }, 
    {
        $group: {
            _id: '$contacts.questions.answers.primary_answer_value',
            answer_value: {
                '$first': '$contacts.questions.answers.primary_answer_value'
            },
            answer_text: {
                '$first': '$contacts.questions.answers.primary_answer_text'
            },
            answers: {
                '$push': {
                    'c': '$contacts.id',
                    'question_category': '$contacts.questions.category_id',
                    'question_id': '$contacts.questions.id',
                    'ins': '$contacts.questions.answers.loopInstances.loop_instance',
                    'answer_value':'$contacts.questions.answers.primary_answer_value',
                    'selected': '$contacts.questions.answers.loopInstances.is_selected',
                    'value': '$criteria_value',
                    'text': { $arrayElemAt: ['$criteria.label', 0] },
                    'definition': {
                        '$ifNull': [
                            { $arrayElemAt: [{ $arrayElemAt: ['$criteria.versions.definition', 0] }, 0] },
                            { $arrayElemAt: ['$criteria.definition', 0] }
                        ]
                    }
                }
            },
            'count': {'$sum': 1}
        }
    },
          {$unwind: '$answers'},
          {$sort: {
              answer_text: 1,
              'answers.question_id': 1,
              'answers.answer_value': 1,
            }
          }
    ], {allowDiskUse:true}).toArray();
    return result;
}



module.exports = {
    before: before,
    task_3_1: task_3_1
};
