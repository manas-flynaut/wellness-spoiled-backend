const Content = require("../models/contentModel")
const Shop = require("../models/shopModel")
const Page = require("../models/pageModel")
const Category = require("../models/categoryModel")
const Audio = require("../models/audioModel")
const { loggerUtil } = require("../utils/logger")
const { normalize } = require('path')
const { OK, WRONG_ENTITY, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, INTERNAL_SERVER_ERROR } = require("../utils/statusCode")
const { uploadFile }  = require("../utils/upload");

const getShopById = async (req, res) => {
    try {
        const id = req.params.shopId
        let shop = await Shop.findOne({ _id: id })
        if (!shop) {
            res.status(OK).json({
                status:OK,
                message: 'Shop Not Found!',
                data: {}
            })
        }
        res.status(OK).json({
            status:OK,
            message: 'Shop Fetched Successfully!',
            data: shop
        })
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Get User By Id Function is Executed!')
    }
}

const getPageById = async (req, res) => {
    try {
        const id = req.params.pageId
        let page = await Page.findOne({ _id: id })
        if (!page) {
            res.status(OK).json({
                status:OK,
                message: 'Shop Not Found!',
                data: {}
            })
        }
        res.status(OK).json({
            status:OK,
            message: 'Page Fetched Successfully!',
            data: page
        })
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Get User By Id Function is Executed!')
    }
}

const content = async (req, res) => {
    try {
        if (req.files) {
            req.files.media ? req.body.link =  req.files.media[0].path : '';
        }
        const { name, designation, email, website, description, content } = req.body

        const newContent = new Content({
            name: name,
            designation: designation, 
            email: email, 
            website: website, 
            description: description, 
            content: content,
            image : req.files.media[0].path
        });
        newContent.save().then(content => res.status(OK).json({
            message: "Content Added Successfully.",
            data: content
        }))
        .catch(err => res.status(BAD_REQUEST).json({ message: err.message }));
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Get All Roles Function is Executed')
    }
}

const updateContent = async (req, res) => {
    try {
        const id = req.params.contentId
        let contentData = await Content.findOne({ _id: id })
        if (req.files) {
            req.files.media ? req.body.link =  req.files.media[0].path : '';
        }
        let imageUrl = await uploadFile(req.files.media[0].path,"Content")
        const { name, designation, email, website, description, content } = req.body
        if (!contentData) {
            console.log("insert")
            const newContent = new Content({
                name: name,
                designation: designation, 
                email: email, 
                website: website, 
                description: description, 
                content: content,
                image : req.files.media[0].path
            });
            newContent.save().then(shop => res.status(OK).json({
                status:OK,
                message: "Content Added Successfully.",
                data: shop
            }))
            .catch(err => res.status(BAD_REQUEST).json({ message: err.message }));
        } else {
            // console.log("update")
            Content.findOneAndUpdate({ "_id": id }, { "$set": { 
                name: name,
                designation: designation, 
                email: email, 
                website: website, 
                description: description, 
                content: content,
                image : imageUrl
            }}).exec(function(err, content){
                if(err) {
                    console.log(err);
                    res.status(NOT_FOUND).json({
                        status:NOT_FOUND,
                        error: err
                    })
                } else {
                    res.status(OK).json({
                        status:OK,
                        message: 'Shop Updated Successfully!'
                    })
                }
                });
        }
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Update shop info Function is Executed!')
    }
}

const getAllList = async (req, res) => {
    try {
        Content
            .find({}, { })
            .sort({ createdAt: -1 })
            .exec((err, content) => {
                if (err || !content) {
                    return res.status(SC.NOT_FOUND).json({
                        error: 'No content were found in a DB!'
                    })
                }
                res.status(OK).json({
                    message: 'content Fetched Successfully!',
                    data: content
                })
            })
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Get All content Function is Executed')
    }
}

const updateShop = async (req, res) => {
    try {
        const id = req.params.shopId
        let shop = await Shop.findOne({ _id: id })
        const { url, type, playstoreLink, appstoreLink, phone } = req.body
        if (!shop) {
            console.log("insert")
            const newShop = new Shop({
                url: url,
                type: type, 
                playstoreLink: playstoreLink, 
                appstoreLink: appstoreLink, 
                phone: phone
            });
            newShop.save().then(shop => res.status(OK).json({
                status:OK,
                message: "Shop Added Successfully.",
                data: shop
            }))
            .catch(err => res.status(BAD_REQUEST).json({ message: err.message }));
        } else {
            console.log("update")
            Shop.findOneAndUpdate({ "_id": id }, { "$set": { 
                url: req.body.url,
                type:  req.body.type,
                playstoreLink: req.body.playstoreLink,
                appstoreLink:  req.body.appstoreLink,
                phone:  req.body.phone
            }}).exec(function(err, shop){
                if(err) {
                    console.log(err);
                    res.status(NOT_FOUND).json({
                        status:NOT_FOUND,
                        error: err
                    })
                } else {
                    res.status(OK).json({
                        status:OK,
                        message: 'Shop Updated Successfully!'
                    })
                }
                });
        }
        // Shop.findOneAndUpdate({ "_id": id }, {  url: url?url:shop.url,
        //     type: type?type:shop.type, 
        //     playstoreLink: playstoreLink?playstoreLink:shop.playstoreLink, 
        //     appstoreLink: appstoreLink?appstoreLink:shop.appstoreLink, 
        //     phone: phone?phone:shop.phone }, { new: true })
        // .then(updatedUser => res.status(OK).json({
        //     message: "Shop updated Successfully.",
        //     data: updatedUser
        // }))
        // .catch(err => res.status(BAD_REQUEST).json({ message: err.message }));  
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Update shop info Function is Executed!')
    }
}

const updatePrivacy = async (req, res) => {
    try {
        const id = req.params.pageId
        let page = await Page.findOne({ _id: id })
        const { content } = req.body
        if (!page) {
            const newPage = new Page({
                content: content,
                pageType: "Privacy"
            });
            newPage.save().then(page => res.status(OK).json({
                status:OK,
                message: "Data Added Successfully.",
                data: page
            }))
            .catch(err => res.status(BAD_REQUEST).json({ message: err.message }));
        } else {
            Page.findOneAndUpdate({ "_id": id }, { "$set": { content:content}}).exec(function(err, page){
                if(err) {
                    console.log(err);
                    res.status(NOT_FOUND).json({
                        status:NOT_FOUND,
                        error: err
                    })
                } else {
                    res.status(OK).json({
                        status:OK,
                        message: 'Page Updated Successfully!'
                    })
                }
            });
        } 
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Update shop info Function is Executed!')
    }
}

const updateTerms = async (req, res) => {
    try {
        const id = req.params.pageId
        let page = await Page.findOne({ _id: id })
        const { content } = req.body
        if (!page) {
            const newPage = new Page({
                content: content,
                pageType: "Terms"
            });
            newPage.save().then(page => res.status(OK).json({
                status:OK,
                message: "Data Added Successfully.",
                data: page
            }))
            .catch(err => res.status(BAD_REQUEST).json({ message: err.message }));
        } else {
            Page.findOneAndUpdate({ "_id": id }, { "$set": { content:content}}).exec(function(err, page){
                if(err) {
                    console.log(err);
                    res.status(NOT_FOUND).json({
                        status:NOT_FOUND,
                        error: err
                    })
                } else {
                    res.status(OK).json({
                        status:OK,
                        message: 'Page Updated Successfully!'
                    })
                }
            });
        } 
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Update shop info Function is Executed!')
    }
}

const addCategory = async (req, res) => {
    try {
        if (req.files) {
            req.files.media ? req.body.link =  req.files.media[0].path : '';
        }
        const { title } = req.body

        const newContent = new Category({
            title: title,
            image: normalize(req.files.media[0].path)
        });
        newContent.save().then(content => res.status(OK).json({
            message: "Category Added Successfully.",
            data: content
        }))
        .catch(err => res.status(BAD_REQUEST).json({ message: err.message }));
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Add Category Function is Executed')
    }
}

const uploadAudio = async (req, res) => {
    try {
        if (req.files) {
            req.files.media ? req.body.link =  req.files.media[0].path : '';
        }
        const { category } = req.body

        const newAudio = new Audio({
            category: category,
            audio : req.files.media[0].path
        });
        newAudio.save().then(audio => res.status(OK).json({
            message: "Audio Uploaded Successfully.",
            data: audio
        }))
        .catch(err => res.status(BAD_REQUEST).json({ message: err.message }));
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Upload Audio Function is Executed')
    }
}

const getAllCategories = async (req, res) => {
    try {
        Category
            .find({}, { })
            .sort({ createdAt: -1 })
            .exec((err, category) => {
                if (err || !category) {
                    return res.status(SC.NOT_FOUND).json({
                        error: 'No category were found in a DB!'
                    })
                }
                res.status(OK).json({
                    message: 'category Fetched Successfully!',
                    data: category
                })
            })
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Get All content Function is Executed')
    }
}

const getAllAudio = async (req, res) => {
    try {
        Audio
            .find({}, { })
            .sort({ createdAt: -1 }).populate('category', 'title')
            .exec((err, audio) => {
                if (err || !content) {
                    return res.status(SC.NOT_FOUND).json({
                        error: 'No audio were found in a DB!'
                    })
                }
                res.status(OK).json({
                    message: 'Audio Fetched Successfully!',
                    data: audio
                })
            })
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Get All content Function is Executed')
    }
}

module.exports = { content, getAllList, updateShop, getShopById, updatePrivacy, updateTerms, getPageById, addCategory,
    getAllCategories,
    uploadAudio,
    getAllAudio,
    updateContent }