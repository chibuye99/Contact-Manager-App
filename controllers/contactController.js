const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel')
//Get contacts 
//@route GET /api/contacts
//@private access
const getContacts = asyncHandler(async(request,response)=>{
    const contacts = await Contact.find({user_id:request.user.id})
    response.status(200).json(contacts);
})
//Get contact 
//@route GET /api/contacts/:id
//@private access
const getContact = asyncHandler(async(request,response)=>{
    const contact = await Contact.findById(request.params.id)
    if(!contact){
        response.status(404);
        throw new Error("contact not found");
    }
    response.status(200).json(contact);
})
//Create contact 
//@route POST /api/contacts
//@private access
const createContact = asyncHandler( async(request,response)=>{
    const {name,email,phone}= request.body;
    if(!name || !email || !phone){
        response.status(400);
        throw new Error("All fields are mandatory");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id:request.user.id
    })
    response.status(200).json(contact);
})
//Update contact 
//@route PUT /api/contacts/:id
//@private access
const updateContact = asyncHandler(async(request,response)=>{
    const contact = await Contact.findById(request.params.id)
    if(!contact){
        response.status(404);
        throw new Error("contact not found");
    }
    if(contact.user_id.toString() !== request.user.id){
        response.status(403);
        throw new Error("User doesn't have permission to update other users")
    }
    const updatedContact = await Contact.findByIdUpdate(
        request.params.id,
        request.body,
        {new:true}
    )
    response.status(200).json(updatedContact);

})
//Delete contact 
//@route DELETE /api/contacts/:id
//@private access
const deleteContact = asyncHandler(async(request,response)=>{
    const contact = await Contact.findById(request.params.id)
    if(!contact){
        response.status(404);
        throw new Error("contact not found");
    }
    if(contact.user_id.toString() !== request.user.id){
        response.status(403);
        throw new Error("User dont have permission to uodate other users")
    }
    await Contact.deleteOne({_id:request.params.id});
    response.status(contact);
})

module.exports = {
    getContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact
};