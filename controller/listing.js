const listing = require("../models/listing.js");

module.exports.index = async(req,res) => {
   const AllListing =  await listing.find({});
    res.render("listings/index.ejs",{AllListing});
    };

module.exports.rendernewform = (req,res) =>{
    
    res.render("listings/new.ejs")
};

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listings = await listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author"
        },
    })
    .populate("owner");
    if(!listings){
        req.flash("error", "Listing not registered!");
        return res.redirect("/listing");
        
    }
    res.render("listings/show.ejs", { listings });
    console.log(listings);
};

module.exports.createListing = async(req,res,next) =>{
   let url = req.file.path;
   let filename = req.file.filename;
   const newlisting = new listing(req.body.listing);
   newlisting.owner = req.user._id;
   newlisting.image = {url,filename};
   await newlisting.save();
   req.flash("success", "New listing Created");
   res.redirect("/listing")
     
   };

   module.exports.editListing = async(req,res) =>{
        let {id} = req.params;
       const listings = await listing.findById(id);

       if(!listings){
           req.flash("error", "Listing not registered!");
           return res.redirect("/listing");
       }
       let originalImageUrl = listings.image.url;
       originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
       res.render("listings/edit.ejs", { listings,originalImageUrl });
   };

   module.exports.updateListing = async(req,res) =>{
       let { id } = req.params;
       let listings = await listing.findByIdAndUpdate(id, { ...req.body.listing});
       if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listings.image = {url,filename};
        await listings.save();

       }
       req.flash("success", "Listing updated!");
       res.redirect(`/listing/${id}`);
   
   };
   module.exports.deleteListing = async(req,res) =>{
   
       let{ id } = req.params;
       const deleted = await listing.findByIdAndDelete(id);
       console.log(deleted);
       req.flash("success", "Listing deleted!");
       res.redirect("/listing");
   };