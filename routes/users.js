const express = require('express')
const router = express.Router()
const User = require('../models/users')
const swaggerAnnotations = require('../swagger-annotations');

module.exports = router

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */

router.get('/users', async(req,res) => {
    // res.send('hello world')
    try{
        const users = await User.find()

        const modifiedUsers = users.map(user => ({
            id: user._id,
            firstName: user.firstName,
            email: user.email,
          }));
        res.json({
            message : "Users retrieved",
            success : true,
            users : modifiedUsers
        })
    }
    catch(err)
    {
        res.status(500).json({message:err.message})
    }
})



/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a user by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */

router.get('/user/:id',async (req,res) => {
try{
const id = req.params.id
const user = await User.findById(id);
if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const modifiedUser = {
    id: user._id,
    firstName: user.firstName,
    email: user.email,
  };
res.send({
    success:true,
    user:modifiedUser
})
}catch(err)
{
    res.status(500).json({ error: error.message });
}

})

/**
 * @swagger
 * /update/{id}:
 *   put:
 *     summary: Update user by ID
 *     description: Update a user's email and firstName by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *       - in: body
 *         name: user
 *         description: User object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: The updated email address of the user
 *             firstName:
 *               type: string
 *               description: The updated first name of the user
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.put('/update/:id',async (req,res) => {
    // res.send(req.params.id)

    try {

        const id  = req.params.id;

        const  email  = req.body.email;
        const  firstName  = req.body.firstName;
    
        const user = await User.findByIdAndUpdate(
          id,
         { email ,firstName },
          { new: true }
        );
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        res.json({
            message : 'User updated', success : true
            });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }

})

/**
 * @swagger
 * /add:
 *   post:
 *     summary: Add a new user
 *     description: Add a new user with the specified firstName and email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the user
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *     responses:
 *       201:
 *         description: User added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.post('/add', async(req,res) =>{

    const user = new User({
        firstName:req.body.firstName,
        email:req.body.email
    })
    try{
        const newUser = await user.save()
        // res.status(201).json(newUser)
        res.status(201).json({message:"User added",success:true})
    }catch(err)
    {
        res.status(400).json({message:err.message})
    }
})