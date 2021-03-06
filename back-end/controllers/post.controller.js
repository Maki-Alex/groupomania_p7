const { User, Post, Likes } = require('../models');
const fs = require('fs');
const likes = require('../models/likes');

//create a post
exports.createPost = async (req, res) => {
    const { userId, body } = req.body;
    const imagePosts = req.file;

    try {
        const user = await User.findOne({
            where: { id: userId }
        });

        if (imagePosts) {
            let upload = `http://localhost:5000/images/posts/${imagePosts.filename}`;

            await Post.create({ body, imageUrl: upload, userId: user.id });
            return res.status(201).json({ message: "post created with image" });
        } else {
            await Post.create({ body, userId: user.id });

            return res.status(201).json({ message: "post created without image" });
        }

    } catch (err) {
        return res.status(400).json(err)
    }
}

//get all posts
exports.getAllPosts = async (req, res) => {
    try {
        const post = await Post.findAll({
            include: ['user','likes','comment']
        });

        return res.status(200).json(post);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'something went wrong!' })
    }
}

// delete one post
exports.deletePost = async (req, res) => {
    const uuid = req.params.uuid;
    const { userId } = req.body;

    try {

        
        const user = await User.findOne({
            where: { id: userId }
        });
        
        const post = await Post.findOne({
            where: {
                uuid
            },
            include: ['user']
        });
        if (user.uuid == post.user.uuid) {


            if (post.imageUrl === null) {
                await Post.destroy({
                    where: {
                        uuid
                    }
                });
                return res.status(200).json({ message: 'post has been deleted' })
            } else {
                const filename = post.imageUrl.split('/posts/')[1];

                fs.unlink(`images/posts/${filename}`, async () => {

                    await Post.destroy({
                        where: {
                            uuid
                        }
                    });
                });
                return res.status(200).json({ message: 'post has been deleted' })
            }


        } else if (user.isAdmin == true) {

            if (post.imageUrl === null) {
                await Post.destroy({
                    where: {
                        uuid
                    }
                });
                return res.status(200).json({ message: 'post has been deleted by admin' })
            } else {
                const filename = post.imageUrl.split('/posts/')[1];

                fs.unlink(`images/posts/${filename}`, async () => {

                    await Post.destroy({
                        where: {
                            uuid
                        }
                    });
                });
                return res.status(200).json({ message: 'post has been deleted by admin' })
            }

        } else {

            return res.status(401).json({ message: "you don't have permission to delete !" })

        }


    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'something went wrong!' })
    }
}