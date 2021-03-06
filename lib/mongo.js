const config = require('config-lite')
const Mongolass = require('mongolass')
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')

let mongolass = new Mongolass()
mongolass.connect(config.mongodb)  


mongolass.plugin('addCreatedAt', {
  afterFind: function (results) {
    results.forEach(function (item) {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
    });
    return results;
  },
  afterFindOne: function (result) {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
    }
    return result;
  }
});


exports.User = mongolass.model('User', {
  name: {type: 'string'},
  password: {type: 'string'},
  avatar: {type: 'string'},
  gender: {type: 'string', enum: ['m', 'f', 'x']},
  bio: {type: 'string'}
})


exports.Post = mongolass.model('Post', {
  author: {type: Mongolass.Types.ObjectId},
  title: {type: 'string'},
  content: {type: 'string'},
  name: {type: 'string'},
  avatar: {type: 'string'},
  gender: {type: 'string', enum: ['m', 'f', 'x']},
  bio: {type: 'string'},
  pv: {type: 'number'}
})

exports.Comment = mongolass.model('Comment', {
  author: {type: Mongolass.Types.ObjectId},
  content: {type: 'string'},
  postId: {type: Mongolass.Types.ObjectId}
})

exports.User.index({name: 1}, {unique: true}).exec();  //根据用户名找到用户
exports.Post.index({author: 1, _id: -1}).exec();  //按照创建时间酱醋查看用户文章列表
exports.Post.index({postId: 1, _id: 1}).exec()    //通过文章id获取该文章下所有留言，按留言创建时间升序
exports.Post.index({author: 1, _id:1}).exec()  
