module.exports = {
    'facebookAuth': {
        'clientID': '657408101116489', // your App ID
        'clientSecret': '30c40229f2c8ef598981422a354068fa', // your App Secret
        'callbackURL': 'http://www.navega.gratis:8085/login-fb/auth/facebook/callback'
    },

    'twitterAuth': {
        'consumerKey': 'your-consumer-key-here',
        'consumerSecret': 'your-client-secret-here',
        'callbackURL': 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth': {
        'clientID': 'your-secret-clientID-here',
        'clientSecret': 'your-client-secret-here',
        'callbackURL': 'http://localhost:8080/auth/google/callback'
    }
};
