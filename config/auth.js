module.exports = {
    
        'facebookAuth' : {
            'clientID'      : '708228956040399', // your App ID
            'clientSecret'  : 'c07f07855d5fdbb599715a33c9415310', // your App Secret
            'callbackURL'   : 'http://localhost:3000/auth/facebook/callback',
            'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
            'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
        },

        'googleAuth' : {
            'clientID'      : '168846870967-5ful6jcpkqqcb68vp1kdipm9qaduaphc.apps.googleusercontent.com',
            'clientSecret'  : 'OtvZCbmhC1qO0LTNOft3Q9Hr',
            'callbackURL'   : 'http://localhost:3000/auth/google/callback'
        }
    };