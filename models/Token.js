const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Reference to the user who owns this token
  
  token: { 
    type: String, 
    required: true 
  }, // The refresh token itself
  
  expiresAt: { 
    type: Date, 
    required: true 
  } // Expiration date of the token, usually 7 days or more
});

// Export the Token model
module.exports = mongoose.model('Token', tokenSchema);
