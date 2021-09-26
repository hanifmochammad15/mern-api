const {validationResult} = require ('express-validator');
const path = require('path');
const fs = require('fs'); //filesystem
const BlogPost = require('../models/blog');

exports.createBlogPost = (req , res , next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        // console.log('err :' ,errors);
        // res.status(400).json({
        //     message : 'Request Error',
        //     data : null,
        // });
        const err = new Error('Invalid Value tidak sesuai');
        err.errStatus = 400;
        err.data = errors.array();
        throw err; //lempar error 
    }

    if(!req.file){
        const err = new Error('Image Harus di Upload');
        err.errorStatus = 422;
        throw err;
    }

    const title = req.body.title;
    const body = req.body.body;
    const image = req.file.path;

    const Posting = new BlogPost({
        title: title,
        body : body,
        image : image,
        author : {
            uid : 1,
            name : "hanif"
        }
    });

    Posting.save()
    .then( result => {
        res.status(201).json({
            message : "Create Blog Post Success",
            data : result
        });
    })
    .catch(err => {
        console.log('err: ',err);
        next(err); //mengirim error ke middleware(indexjs)
    });


    // const result = {
    //     message : "Create Blog Post Success",
    //     data : {
    //         post_id : 1,
    //         title : title,
    //         image : "imagefile.png",
    //         body : body,
    //         created_at : "12/06/2021",
    //         author : {
    //             uid : 1,
    //             name : "Testing"
    //         }
    //     }
    // }
    //res.status(201).json(result);
    //next();
}

exports.getAllBlogPost = (req , res , next) => {
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 5;
    let totaItems;

    BlogPost.find()
    .countDocuments()
    .then(count => {
        totaItems = count;
        return BlogPost.find() //klau di return bisa multiple then
        .skip((parseInt(currentPage) - 1) * parseInt(perPage))
        .limit(parseInt(perPage));
    })
    .then(result =>{
        res.status(200).json({
            message: 'Data Blog Post Berhasil dipanggil',
            data : result,
            total_data : totaItems,
            perPage : parseInt(perPage),
            currentPage : parseInt(currentPage),
        })
    })
    .catch( err => {
        next(err);
    });

    // BlogPost.find()
    // .then(result => {
    //     res.status(200).json({
    //         message: 'Data Blog Post Berhasil dipanggil',
    //         data : result
    //     })
    // })
    // .catch(err => {
    //     next(err); //mengirim error ke middleware(indexjs)
    // });
}

exports.getBlogPostById = (req , res , next) => {
    
    const postId = req.params.postId;
    console.log(postId);
    BlogPost.findById(postId)
    .then(result => {
        if(!result){
            const err = new Error ('Blog Post tidak ditemukan');
            err.errorStatus = 404;
            throw err;
        }
        res.status(200).json({
            message: 'Data Blog Post Berhasil dipanggil',
            data : result
        })
        
    })
    .catch(err => {
        next(err); //mengirim error ke middleware(indexjs)
    });
}

exports.updateBlogPost = (req , res , next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const err = new Error('Invalid Value tidak sesuai');
        err.errStatus = 400;
        err.data = errors.array();
        throw err; //lempar error 
    }

    if(!req.file){
        const err = new Error('Image Harus di Upload');
        err.errorStatus = 422;
        throw err;
    }

    const title = req.body.title;
    const body = req.body.body;
    const image = req.file.path;
    const postId = req.params.postId;

    BlogPost.findById(postId)
    .then(post => {
        if(!post){
            const err = new Error ('Blog Post tidak ditemukan');
            err.errorStatus = 404;
            throw err;
        }
        post.title = title;
        post.body = body;
        post.image = image;

        return post.save();
    })
    .then(result => {
        res.status(200).json({
            message: 'Update Sukses',
            data : result
        })
    })
    .catch(err => {
        console.log('err: ',err);
        next(err); //mengirim error ke middleware(indexjs)
    });

}

exports.deleteBlogPost = (req , res , next) => {
    
    const postId = req.params.postId;
    console.log(postId);
    BlogPost.findById(postId)
    .then(post => {
        if(!post){
            const err = new Error ('Blog Post tidak ditemukan');
            err.errorStatus = 404;
            throw err;
        }
        removeImage (post.image);
        return  BlogPost.findByIdAndRemove(postId);
    })
    .then(result => {
        res.status(200).json({
            message: 'Hapus Blog Post Sukses',
            data : result
        })
    })
    .catch(err => {
        next(err); //mengirim error ke middleware(indexjs)
    });

    const removeImage = (filePath) => {
        //console.log('filePath', filePath);
        //console.log('dir name', __dirname);
        filePath = path.join(__dirname,'../../',filePath);
        //console.log('filePath', filePath);
        fs.unlink(filePath , err => {console.log(err)});

    }
}